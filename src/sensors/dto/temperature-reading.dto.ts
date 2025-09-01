import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TemperatureReadingDto {
  @ApiProperty({ description: 'Sensor ID' })
  @IsString()
  @IsNotEmpty()
  sensorID: string;

  @ApiProperty({ description: 'Classroom ID' })
  @IsString()
  @IsNotEmpty()
  classID: string;

  @ApiProperty({ description: 'Temperature reading in Celsius' })
  @IsNumber()
  temp: number;

  @ApiProperty({ description: 'Additional sensor data', required: false })
  @IsOptional()
  @IsString()
  additionalData?: string;
}

export class CoolingControlDto {
  @ApiProperty({ description: 'Classroom ID' })
  @IsString()
  @IsNotEmpty()
  classID: string;

  @ApiProperty({ description: 'Cooling system state (true = on, false = off)' })
  cooling_on: boolean;
}
