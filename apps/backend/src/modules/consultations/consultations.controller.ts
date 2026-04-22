import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth.decorators';

@ApiTags('Consultations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post('request')
  @Roles('TECHNICIAN')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Request a neurologist consultation (Technician)' })
  request(@Body() dto: any, @Req() req: any) {
    return this.consultationsService.requestConsultation({ ...dto, technicianId: req.user.id });
  }

  @Patch(':id/accept')
  @Roles('NEUROLOGIST')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Accept consultation (Neurologist)' })
  accept(@Param('id') id: string, @Req() req: any) {
    return this.consultationsService.accept(id, req.user.id);
  }

  @Patch(':id/start')
  @Roles('NEUROLOGIST')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Start consultation (Neurologist)' })
  start(@Param('id') id: string, @Req() req: any) {
    return this.consultationsService.start(id, req.user.id);
  }

  @Patch(':id/complete')
  @Roles('NEUROLOGIST')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Complete consultation with diagnosis (Neurologist)' })
  complete(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    return this.consultationsService.complete(id, { ...dto, neurologistId: req.user.id });
  }

  @Post(':id/messages')
  @ApiOperation({ summary: 'Send message in consultation' })
  sendMessage(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    return this.consultationsService.sendMessage(id, { ...dto, senderId: req.user.id });
  }

  @Get(':id/messages')
  @ApiOperation({ summary: 'Get consultation messages' })
  getMessages(@Param('id') id: string) {
    return this.consultationsService.getMessages(id);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get consultations for encounter' })
  findByEncounter(@Param('encounterId') encounterId: string) {
    return this.consultationsService.findByEncounter(encounterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get consultation by ID' })
  findById(@Param('id') id: string) {
    return this.consultationsService.findById(id);
  }
}
