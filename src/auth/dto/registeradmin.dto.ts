import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterAdminDto {
  @ApiProperty({ description: 'Admin username' })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({ description: 'Admin password' })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({ description: 'Admin email', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ description: 'Admin full name', required: false })
  @IsString()
  @IsOptional()
  fullName?: string;
}