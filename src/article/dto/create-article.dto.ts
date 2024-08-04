import { Column } from 'typeorm';
import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateArticleDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Title',
    example: 'Title',
  })
  title: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    type: String,
    description: 'Content',
    example: 'This is a content',
  })
  content: string;

  @IsOptional()
  @ApiProperty({
    type: 'file',
    format: 'binary',
    description: 'Photo',
    required: false,
  })
  photo: string;
}
