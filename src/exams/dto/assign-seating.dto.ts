import { IsString, IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignSeatingDto {
  @ApiProperty({ description: 'Student registration number' })
  @IsString()
  @IsNotEmpty()
  regNo: string;

  @ApiProperty({ description: 'Seat number' })
  @IsString()
  @IsNotEmpty()
  seatNo: string;
}

export class BulkAssignSeatingDto {
  @ApiProperty({ description: 'Array of seating assignments', type: [AssignSeatingDto] })
  assignments: AssignSeatingDto[];
}
