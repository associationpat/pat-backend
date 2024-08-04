import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateTaskDto } from './create-task.dto';
import {IsDate, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {Transform} from "class-transformer";

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
    @IsOptional()
    @ApiProperty({example:false,type:Boolean})
    starred: boolean;

    @IsOptional()
    @ApiProperty({example:false,type:Boolean})
    done: boolean;
}
