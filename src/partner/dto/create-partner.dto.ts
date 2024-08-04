import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePartnerDto {
  @IsNotEmpty()
  @ApiProperty({ example: 'Partner Name' })
  name: string;

  @IsNotEmpty()
  @ApiProperty({ type: 'string', format: 'binary', required: true })
  photo: string;
}
