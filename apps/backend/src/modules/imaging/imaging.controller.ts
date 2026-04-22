import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ImagingService } from './imaging.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Imaging')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('imaging')
export class ImagingController {
  constructor(private readonly imagingService: ImagingService) {}

  @Post()
  @ApiOperation({ summary: 'Order imaging study' })
  create(@Body() dto: any, @Req() req: any) { return this.imagingService.create({ ...dto, orderedById: req.user.id }); }

  @Patch(':id/report')
  @ApiOperation({ summary: 'Update imaging report/findings' })
  updateReport(@Param('id') id: string, @Body() dto: any, @Req() req: any) { return this.imagingService.updateReport(id, { ...dto, userId: req.user.id }); }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get imaging studies for encounter' })
  findByEncounter(@Param('encounterId') encounterId: string) { return this.imagingService.findByEncounter(encounterId); }

  @Get(':id')
  @ApiOperation({ summary: 'Get imaging study by ID' })
  findById(@Param('id') id: string) { return this.imagingService.findById(id); }
}
