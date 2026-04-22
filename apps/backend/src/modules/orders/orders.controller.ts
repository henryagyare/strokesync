import { Controller, Get, Post, Patch, Param, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/auth.decorators';

@ApiTags('Treatment Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('NEUROLOGIST')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create treatment order (Neurologist only)' })
  create(@Body() dto: any, @Req() req: any) {
    return this.ordersService.create({ ...dto, orderedById: req.user.id });
  }

  @Post('tpa')
  @Roles('NEUROLOGIST')
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: 'Create tPA order with auto-calculated dosing (Neurologist only)' })
  createTPAOrder(@Body() dto: any, @Req() req: any) {
    return this.ordersService.createTPAOrder({ ...dto, orderedById: req.user.id });
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update order status (execute/complete/cancel)' })
  updateStatus(@Param('id') id: string, @Body() dto: any, @Req() req: any) {
    return this.ordersService.updateStatus(id, { ...dto, userId: req.user.id });
  }

  @Get('encounter/:encounterId')
  @ApiOperation({ summary: 'Get all orders for an encounter' })
  findByEncounter(@Param('encounterId') encounterId: string) {
    return this.ordersService.findByEncounter(encounterId);
  }

  @Get('consultation/:consultationId')
  @ApiOperation({ summary: 'Get orders for a consultation' })
  findByConsultation(@Param('consultationId') consultationId: string) {
    return this.ordersService.findByConsultation(consultationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findById(@Param('id') id: string) {
    return this.ordersService.findById(id);
  }
}
