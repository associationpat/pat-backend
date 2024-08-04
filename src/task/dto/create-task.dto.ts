import {IsDate, IsNotEmpty, IsString} from "class-validator";
import {Transform} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class CreateTaskDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example:'task title'})
    title: string;

    @IsNotEmpty()
    @IsDate()
    @Transform(({ value }) => new Date(value), { toClassOnly: true })
    @ApiProperty({example:new Date(),type:Date})
    deadline: Date;
}
