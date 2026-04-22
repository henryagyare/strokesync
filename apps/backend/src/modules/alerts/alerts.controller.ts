import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AlertsService } from './alerts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Alerts')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('alerts')
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a clinical alert' })
  create(@Body() dto: any, @Req() req: any) {
    return this.alertsService.create({ ...dto, senderId: req.user.id });
  }

  /**
   * ─── TRANSMIT & ALERT ────────────────────────────────────
   * One-tap endpoint: transmit patient data + alert neurologist.
   * Used by technicians from the mobile app after completing intake.
   */
  @Post('transmit')
  @ApiOperation({ summary: '🚨 Transmit & Alert — Send patient data to neurologist (one-tap)' })
  transmitAndAlert(@Body() dto: any, @Req() req: any) {
    return this.alertsService.transmitAndAlert({
      ...dto,
      technicianId: req.user.id,
    });
  }

  @Patch(':id/acknowledge')
  @ApiOperation({ summary: 'Acknowledge an alert' })
  acknowledge(@Param('id') id: string, @Req() req: any) {
    return this.alertsService.acknowledge(id, req.user.id);
  }

  @Patch(':id/resolve')
  @ApiOperation({ summary: 'Resolve an alert' })
  resolve(@Param('id') id: string, @Req() req: any) {
    return this.alertsService.resolve(id, req.user.id);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get my alerts' })
  findMyAlerts(@Req() req: any, @Query('status') status?: string) {
    return this.alertsService.findForUser(req.user.id, status);
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get alerts for an encounter' })
  findByEncounter(@Param('encounterId') encounterId: string) {
    return this.alertsService.findByEncounter(encounterId);
  }
}
