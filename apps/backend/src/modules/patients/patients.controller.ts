import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PatientsService } from './patients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PatientStatus, Gender } from '@strokesync/shared';

class CreatePatientDto {
  firstName!: string;
  lastName!: string;
  dateOfBirth!: string;
  gender!: Gender;
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  chiefComplaint?: string;
  symptomOnsetTime?: string;
  lastKnownWellTime?: string;
}

@ApiTags('Patients')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('patients')
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) { }

  @Post()
  @ApiOperation({ summary: 'Create a new patient' })
  create(@Body() dto: CreatePatientDto) {
    return this.patientsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all patients' })
  findAll(@Query('status') status?: PatientStatus, @Query('search') search?: string) {
    return this.patientsService.findAll({ status, search });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get patient by ID with full details' })
  findById(@Param('id') id: string) {
    return this.patientsService.findById(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update patient status' })
  updateStatus(@Param('id') id: string, @Body('status') status: PatientStatus) {
    return this.patientsService.updateStatus(id, status);
  }
}
