import { Module } from '@nestjs/common';
import { NihssService } from './nihss.service';
import { NihssController } from './nihss.controller';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [SocketModule],
  controllers: [NihssController],
  providers: [NihssService],
  exports: [NihssService],
})
export class NihssModule {}
