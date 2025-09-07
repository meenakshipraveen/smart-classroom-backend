import { ApiProperty } from '@nestjs/swagger';

export class GetAllClassroomsDto {
  @ApiProperty({ description: 'Classroom ID', example: 'C1' })
  id: string;
}