import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole, UserStatus } from '@strokesync/shared';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiOperation({ summary: 'List all users' })
  findAll(@Query('role') role?: UserRole, @Query('status') status?: UserStatus) {
    return this.usersService.findAll({ role, status });
  }

  @Get('neurologists/available')
  @ApiOperation({ summary: 'Get available neurologists for consultation' })
  getAvailableNeurologists() {
    return this.usersService.getAvailableNeurologists();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  findById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }
}
