import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AttendanceService } from './attendance.service';
import { BarcodeScanDto } from './dto/barcode-scan.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Attendance')
@Controller('attendance')
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('scan')
  @ApiOperation({ summary: 'Scan student barcode for attendance (No JWT required)' })
  @ApiResponse({ status: 200, description: 'Attendance logged successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  scanBarcode(@Body() barcodeScanDto: BarcodeScanDto) {
    console.log('Scanning barcode:', barcodeScanDto.barcode);
    return this.attendanceService.scanBarcode(barcodeScanDto);
  }

  @Get('today/:classID')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get today\'s attendance for a class (Admin only)' })
  @ApiResponse({ status: 200, description: 'Attendance retrieved successfully' })
  getTodayAttendance(@Param('classID') classID: string) {
    return this.attendanceService.getTodayAttendance(classID);
  }

  @Get('student/:regNo')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get student attendance history (Admin only)' })
  @ApiResponse({ status: 200, description: 'Attendance history retrieved successfully' })
  getStudentHistory(@Param('regNo') regNo: string) {
    return this.attendanceService.getStudentAttendanceHistory(regNo);
  }

  @Get('date/:date/:classID')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get attendance for specific date and class (Admin only)' })
  @ApiResponse({ status: 200, description: 'Attendance retrieved successfully' })
  getAttendanceByDate(
    @Param('date') date: string,
    @Param('classID') classID: string,
  ) {
    return this.attendanceService.getAttendanceByDate(date, classID);
  }

  @Get('stats/:classID')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get attendance statistics for a class (Admin only)' })
  @ApiResponse({ status: 200, description: 'Statistics retrieved successfully' })
  getAttendanceStats(
    @Param('classID') classID: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.attendanceService.getAttendanceStats(classID, startDate, endDate);
  }
}
