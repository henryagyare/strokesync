import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
    credentials: true,
  },
  namespace: '/ws',
})
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(SocketGateway.name);
  private connectedUsers = new Map<string, string>(); // socketId -> userId

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.connectedUsers.delete(client.id);
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('authenticate')
  handleAuthenticate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { userId: string },
  ) {
    this.connectedUsers.set(client.id, data.userId);
    client.join(`user:${data.userId}`);
    this.logger.log(`User ${data.userId} authenticated on socket ${client.id}`);
    return { event: 'authenticated', data: { success: true } };
  }

  @SubscribeMessage('room:join_encounter')
  handleJoinEncounter(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { encounterId: string },
  ) {
    client.join(`encounter:${data.encounterId}`);
    this.logger.log(`Socket ${client.id} joined encounter room: ${data.encounterId}`);
  }

  @SubscribeMessage('room:leave_encounter')
  handleLeaveEncounter(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { encounterId: string },
  ) {
    client.leave(`encounter:${data.encounterId}`);
  }

  // ─── Emit Helpers ──────────────────────────────────────

  /** Emit to all users in an encounter room */
  emitToEncounter(encounterId: string, event: string, data: unknown) {
    this.server.to(`encounter:${encounterId}`).emit(event, data);
  }

  /** Emit to a specific user */
  emitToUser(userId: string, event: string, data: unknown) {
    this.server.to(`user:${userId}`).emit(event, data);
  }

  /** Emit to all connected clients */
  emitToAll(event: string, data: unknown) {
    this.server.emit(event, data);
  }
}
