import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EncountersService } from './encounters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EncounterPriority, EncounterStatus } from '@strokesync/shared';

@ApiTags('Encounters')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('encounters')
export class EncountersController {
  constructor(private readonly encountersService: EncountersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new encounter' })
  create(@Body() dto: { patientId: string; priority?: EncounterPriority; msuUnitId?: string; msuLocation?: string; notes?: string }, @Req() req: { user: { id: string } }) {
    return this.encountersService.create({ ...dto, technicianId: req.user.id });
  }

  @Get()
  @ApiOperation({ summary: 'List encounters' })
  findAll(@Query('status') status?: EncounterStatus, @Query('technicianId') technicianId?: string, @Query('neurologistId') neurologistId?: string) {
    return this.encountersService.findAll({ status, technicianId, neurologistId });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get encounter by ID with full clinical data' })
  findById(@Param('id') id: string) {
    return this.encountersService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update encounter' })
  update(@Param('id') id: string, @Body() dto: { status?: EncounterStatus; neurologistId?: string; priority?: EncounterPriority; notes?: string }) {
    return this.encountersService.update(id, dto);
  }

  @Patch(':id/assign')
  @ApiOperation({ summary: 'Assign neurologist to encounter' })
  assignNeurologist(@Param('id') id: string, @Body('neurologistId') neurologistId: string) {
    return this.encountersService.assignNeurologist(id, neurologistId);
  }
}
