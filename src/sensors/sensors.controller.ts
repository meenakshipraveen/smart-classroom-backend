import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { SensorsService } from './sensors.service';
import { TemperatureReadingDto, CoolingControlDto } from './dto/temperature-reading.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Sensors')
@Controller('sensors')
export class SensorsController {
  constructor(private readonly sensorsService: SensorsService) {}

  @Post('temperature')
  @ApiOperation({ summary: 'Record temperature reading (No JWT required - for IoT sensors)' })
  @ApiResponse({ status: 201, description: 'Temperature recorded successfully' })
  @ApiResponse({ status: 404, description: 'Sensor or classroom not found' })
  recordTemperature(@Body() temperatureReadingDto: TemperatureReadingDto) {
    return this.sensorsService.recordTemperature(temperatureReadingDto);
  }

  @Post('cooling/control')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Manual cooling system control (Admin only)' })
  @ApiResponse({ status: 200, description: 'Cooling system controlled successfully' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  manualCoolingControl(@Body() coolingControlDto: CoolingControlDto) {
    return this.sensorsService.manualCoolingControl(coolingControlDto);
  }

  @Get('temperature/current/:classID')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current temperature for classroom (Admin only)' })
  @ApiResponse({ status: 200, description: 'Current temperature retrieved successfully' })
  getCurrentTemperature(@Param('classID') classID: string) {
    return this.sensorsService.getCurrentTemperature(classID);
  }

  @Get('temperature/history/:classID')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get temperature history for classroom (Admin only)' })
  @ApiResponse({ status: 200, description: 'Temperature history retrieved successfully' })
  getTemperatureHistory(
    @Param('classID') classID: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.sensorsService.getTemperatureHistory(classID, startDate, endDate);
  }

  @Get('temperature/stats/:classID')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get today\'s temperature statistics for classroom (Admin only)' })
  @ApiResponse({ status: 200, description: 'Temperature statistics retrieved successfully' })
  getTodayTemperatureStats(@Param('classID') classID: string) {
    return this.sensorsService.getTodayTemperatureStats(classID);
  }

  @Get('cooling/status/:classID')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get cooling system status for classroom (Admin only)' })
  @ApiResponse({ status: 200, description: 'Cooling status retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  getCoolingStatus(@Param('classID') classID: string) {
    return this.sensorsService.getCoolingStatus(classID);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sensors (Admin only)' })
  @ApiResponse({ status: 200, description: 'Sensors retrieved successfully' })
  getAllSensors() {
    return this.sensorsService.getAllSensors();
  }

  @Get('class/:classID')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get sensors by classroom (Admin only)' })
  @ApiResponse({ status: 200, description: 'Sensors retrieved successfully' })
  getSensorsByClass(@Param('classID') classID: string) {
    return this.sensorsService.getSensorsByClass(classID);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new sensor (Admin only)' })
  @ApiResponse({ status: 201, description: 'Sensor created successfully' })
  @ApiResponse({ status: 404, description: 'Classroom not found' })
  createSensor(@Body() sensorData: { sensorID: string; classID: string }) {
    return this.sensorsService.createSensor(sensorData);
  }

  @Delete(':sensorID')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove sensor (Admin only)' })
  @ApiResponse({ status: 200, description: 'Sensor removed successfully' })
  @ApiResponse({ status: 404, description: 'Sensor not found' })
  removeSensor(@Param('sensorID') sensorID: string) {
    return this.sensorsService.removeSensor(sensorID);
  }
}
