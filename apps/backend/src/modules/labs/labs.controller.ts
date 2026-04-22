import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LabsService } from './labs.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Labs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('labs')
export class LabsController {
  constructor(private readonly labsService: LabsService) {}

  @Post()
  @ApiOperation({ summary: 'Order a new lab test' })
  create(@Body() dto: any, @Req() req: any) {
    return this.labsService.create({ ...dto, orderedById: req.user.id });
  }

  @Patch(':id/results')
  @ApiOperation({ summary: 'Update lab results' })
  updateResults(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    return this.labsService.updateResults(id, { ...dto, userId: req.user.id });
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get all labs for an encounter' })
  findByEncounter(@Param('encounterId') encounterId: string) {
    return this.labsService.findByEncounter(encounterId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get lab result by ID' })
  findById(@Param('id') id: string) {
    return this.labsService.findById(id);
  }
}
