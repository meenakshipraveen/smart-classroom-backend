import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentDto {
  @ApiProperty({ description: 'Student registration number' })
  @IsString()
  @IsNotEmpty()
  regNo: string;

  @ApiProperty({ description: 'Student name' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ description: 'Classroom ID' })
  @IsString()
  @IsNotEmpty()
  classID: string;

  @ApiProperty({ description: 'Student barcode' })
  @IsString()
  @IsNotEmpty()
  barcode: string;
}
