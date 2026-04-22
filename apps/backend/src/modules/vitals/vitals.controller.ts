import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VitalsService } from './vitals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Vitals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('vitals')
export class VitalsController {
  constructor(private readonly vitalsService: VitalsService) {}

  @Post()
  @ApiOperation({ summary: 'Record new vital signs' })
  create(@Body() dto: any, @Req() req: any) {
    return this.vitalsService.create({ ...dto, recordedById: req.user.id });
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get all vitals for an encounter' })
  findByEncounter(@Param('encounterId') encounterId: string) {
    return this.vitalsService.findByEncounter(encounterId);
  }

  @Get('patient/:patientId')
  @ApiOperation({ summary: 'Get vital history for a patient' })
  findByPatient(@Param('patientId') patientId: string) {
    return this.vitalsService.findByPatient(patientId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get vital sign by ID' })
  findById(@Param('id') id: string) {
    return this.vitalsService.findById(id);
  }
}
