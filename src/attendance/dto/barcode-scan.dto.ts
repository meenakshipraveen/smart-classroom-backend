import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class BarcodeScanDto {
  @ApiProperty({ description: 'Student barcode from ID card' })
  @IsString()
  @IsNotEmpty()
  barcode: string;
}
