import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ClassroomService } from './classroom.service';
import { GetAllClassroomsDto } from './dto/getclassroom.dto';

@ApiTags('Classrooms')
@Controller('classrooms')
export class ClassroomController {
  constructor(private readonly classroomService: ClassroomService) {}

  @Get('ids')
  @ApiOperation({ summary: 'Get all classroom IDs' })
  @ApiResponse({ status: 200, type: [GetAllClassroomsDto], description: 'List of classroom IDs' })
  async getAllClassIDs(): Promise<GetAllClassroomsDto[]> {
    return await this.classroomService.getAllClassIDs();
  }
}