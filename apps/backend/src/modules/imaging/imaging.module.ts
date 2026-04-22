import { Module } from '@nestjs/common';
import { ImagingService } from './imaging.service';
import { ImagingController } from './imaging.controller';
import { SocketModule } from '../socket/socket.module';

@Module({
  imports: [SocketModule],
  controllers: [ImagingController],
  providers: [ImagingService],
  exports: [ImagingService],
})
export class ImagingModule {}
