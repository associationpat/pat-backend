import {ApiProperty, PartialType} from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';
import {IsNotEmpty, IsNumber, IsOptional, IsString, Min} from "class-validator";
import {Type} from "class-transformer";

export class UpdateProductDto  extends PartialType(CreateProductDto){}
