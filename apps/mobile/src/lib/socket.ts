import { io, Socket } from 'socket.io-client';

class SocketService {
  public socket: Socket | null = null;
  private url = 'http://192.168.1.100:4000/ws'; // Adjust for dev env (localhost won't work on physical device, use IP)

  connect(token?: string) {
    if (this.socket?.connected) return;

    this.socket = io(this.url, {
      auth: token ? { token } : undefined,
      transports: ['websocket'],
    });

    this.socket.on('connect', () => {
      console.log('Mobile Socket Connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Mobile Socket Disconnected');
    });
  }

  joinEncounter(encounterId: string) {
    this.socket?.emit('room:join_encounter', { encounterId });
  }

  leaveEncounter(encounterId: string) {
    this.socket?.emit('room:leave_encounter', { encounterId });
  }

  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = new SocketService();
