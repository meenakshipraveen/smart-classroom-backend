import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Students')
@Controller('students')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student (Admin only)' })
  @ApiResponse({ status: 201, description: 'Student created successfully' })
  @ApiResponse({ status: 409, description: 'Student already exists' })
  create(@Body() createStudentDto: CreateStudentDto) {
    return this.studentsService.create(createStudentDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all students (Admin only)' })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  findAll() {
    return this.studentsService.findAll();
  }

  @Get(':regNo')
  @ApiOperation({ summary: 'Get student by registration number (Admin only)' })
  @ApiResponse({ status: 200, description: 'Student retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  findOne(@Param('regNo') regNo: string) {
    return this.studentsService.findOne(regNo);
  }

  @Patch(':regNo')
  @ApiOperation({ summary: 'Update student details (Admin only)' })
  @ApiResponse({ status: 200, description: 'Student updated successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  update(@Param('regNo') regNo: string, @Body() updateStudentDto: UpdateStudentDto) {
    return this.studentsService.update(regNo, updateStudentDto);
  }

  @Delete(':regNo')
  @ApiOperation({ summary: 'Delete student (Admin only)' })
  @ApiResponse({ status: 200, description: 'Student deleted successfully' })
  @ApiResponse({ status: 404, description: 'Student not found' })
  remove(@Param('regNo') regNo: string) {
    return this.studentsService.remove(regNo);
  }

  @Get('class/:classID')
  @ApiOperation({ summary: 'Get students by class ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Students retrieved successfully' })
  findByClass(@Param('classID') classID: string) {
    return this.studentsService.findByClassId(classID);
  }
}
