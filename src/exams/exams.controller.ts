import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ExamsService } from './exams.service';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AssignSeatingDto, BulkAssignSeatingDto } from './dto/assign-seating.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Exams')
@Controller('exams')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExamsController {
  constructor(private readonly examsService: ExamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new exam (Admin only)' })
  @ApiResponse({ status: 201, description: 'Exam created successfully' })
  create(@Body() createExamDto: CreateExamDto) {
    return this.examsService.create(createExamDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all exams (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exams retrieved successfully' })
  findAll() {
    return this.examsService.findAll();
  }

  @Get('upcoming')
  @ApiOperation({ summary: 'Get upcoming exams (Admin only)' })
  @ApiResponse({ status: 200, description: 'Upcoming exams retrieved successfully' })
  getUpcomingExams() {
    return this.examsService.getUpcomingExams();
  }

  @Get('class/:classID')
  @ApiOperation({ summary: 'Get exams by class ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exams retrieved successfully' })
  getExamsByClass(@Param('classID') classID: string) {
    return this.examsService.getExamsByClass(classID);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get exam by ID (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exam retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update exam details (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exam updated successfully' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateExamDto: UpdateExamDto) {
    return this.examsService.update(id, updateExamDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete exam (Admin only)' })
  @ApiResponse({ status: 200, description: 'Exam deleted successfully' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.remove(id);
  }

  @Post(':id/seating')
  @ApiOperation({ summary: 'Assign student to seat for exam (Admin only)' })
  @ApiResponse({ status: 201, description: 'Seating assigned successfully' })
  @ApiResponse({ status: 404, description: 'Exam or student not found' })
  @ApiResponse({ status: 409, description: 'Student already assigned or seat taken' })
  assignSeating(
    @Param('id', ParseIntPipe) id: number,
    @Body() assignSeatingDto: AssignSeatingDto,
  ) {
    return this.examsService.assignSeating(id, assignSeatingDto);
  }

  @Post(':id/seating/bulk')
  @ApiOperation({ summary: 'Bulk assign students to seats for exam (Admin only)' })
  @ApiResponse({ status: 201, description: 'Bulk seating assigned successfully' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  bulkAssignSeating(
    @Param('id', ParseIntPipe) id: number,
    @Body() bulkAssignDto: BulkAssignSeatingDto,
  ) {
    return this.examsService.bulkAssignSeating(id, bulkAssignDto);
  }

  @Get(':id/seating')
  @ApiOperation({ summary: 'Get seating arrangement for exam (Admin only)' })
  @ApiResponse({ status: 200, description: 'Seating arrangement retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Exam not found' })
  getSeatingArrangement(@Param('id', ParseIntPipe) id: number) {
    return this.examsService.getSeatingArrangement(id);
  }

  @Delete(':id/seating/:regNo')
  @ApiOperation({ summary: 'Remove seating assignment for student (Admin only)' })
  @ApiResponse({ status: 200, description: 'Seating assignment removed successfully' })
  @ApiResponse({ status: 404, description: 'Seating assignment not found' })
  removeSeatingAssignment(
    @Param('id', ParseIntPipe) id: number,
    @Param('regNo') regNo: string,
  ) {
    return this.examsService.removeSeatingAssignment(id, regNo);
  }
}
