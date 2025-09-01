import { IsString, IsNotEmpty, IsDateString, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateExamDto {
  @ApiProperty({ description: 'Exam name' })
  @IsString()
  @IsNotEmpty()
  exam_name: string;

  @ApiProperty({ description: 'Subject name' })
  @IsString()
  @IsNotEmpty()
  subject: string;

  @ApiProperty({ description: 'Exam date' })
  @IsDateString()
  exam_date: string;

  @ApiProperty({ description: 'Exam duration in minutes' })
  @IsNumber()
  duration: number;

  @ApiProperty({ description: 'Classroom ID', required: false })
  @IsOptional()
  @IsString()
  classID?: string;

  @ApiProperty({ description: 'Additional exam details', required: false })
  @IsOptional()
  @IsString()
  description?: string;
}
