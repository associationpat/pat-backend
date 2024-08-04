import {Column, PrimaryGeneratedColumn} from "typeorm";
import {IsDate, IsEmpty, IsNotEmpty, IsOptional, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";
import {Type} from "class-transformer";

export class CreateActionDto {

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'action title'})
    title: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'action description'})
    description: string;

    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'action address'})
    address: string;

    @IsNotEmpty()
    @Type(() => Date)
    @ApiProperty({example: new Date()})
    startDate: Date;

    @IsNotEmpty()
    @Type(() => Date)
    @ApiProperty({example: new Date()})
    endDate: Date;


    @IsOptional()
    @ApiProperty({
        type: 'string',
        format: 'binary',
        description: 'Photo of the action',
        required: false,
    })
    photo: string;
    
    
}
