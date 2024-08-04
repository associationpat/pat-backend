import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangePasswordDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'ines123' })
  oldPassword: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'ines123' })
  newPassword: string;
}
