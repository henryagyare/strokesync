import { Controller, Get, Post, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { NihssService } from './nihss.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('NIHSS')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('nihss')
export class NihssController {
  constructor(private readonly nihssService: NihssService) {}

  @Post()
  @ApiOperation({ summary: 'Create NIHSS assessment' })
  create(@Body() dto: any, @Req() req: any) {
    return this.nihssService.create({ ...dto, assessedById: req.user.id });
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get NIHSS history for an encounter' })
  findByEncounter(@Param('encounterId') encounterId: string) {
    return this.nihssService.findByEncounter(encounterId);
  }

  @Get('tpa-dose/:weightKg')
  @ApiOperation({ summary: 'Calculate tPA dose for patient weight (pure domain)' })
  getTPADose(@Param('weightKg') weightKg: string) {
    return this.nihssService.getTPADose(parseFloat(weightKg));
  }

  @Get('tpa-window')
  @ApiOperation({ summary: 'Check tPA eligibility window' })
  getTPAWindow(@Query('onsetTime') onsetTime: string) {
    return this.nihssService.getTPAWindow(new Date(onsetTime));
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get NIHSS assessment by ID' })
  findById(@Param('id') id: string) {
    return this.nihssService.findById(id);
  }
}
