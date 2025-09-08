import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SensorEntryDto {
  @ApiProperty({ description: 'Timestamp when a person enters the classroom', example: '2025-09-08T10:30:00.000Z' })
  @IsDateString()
  timestamp: string;
}