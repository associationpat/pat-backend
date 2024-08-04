import {BadRequestException, Injectable, NotFoundException} from '@nestjs/common';
import { CreateActionDto } from './dto/create-action.dto';
import { UpdateActionDto } from './dto/update-action.dto';
import {Action} from "./entities/action.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {GetPaginatedDto} from "../shared/pagination/get-paginated.dto";
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ActionService {
  constructor(
      @InjectRepository(Action)
        private actionRepository: Repository<Action>
  ){}

  async create(createActionDto: CreateActionDto, user: User) {
    if(createActionDto.startDate > createActionDto.endDate){
        throw new BadRequestException('Start date must be before end date');
    }
    const action = this.actionRepository.create(createActionDto);
    action.user = user;
    return await this.actionRepository.save(action);
  }

  async findAll(getPaginatedDto:GetPaginatedDto) {
    let {page, nbPerPage} = getPaginatedDto;
    if((!page && !nbPerPage) || page<1 ){
      return await this.actionRepository.find(
        {relations: ['user']}
      );
    }
    page = page || 1;
    nbPerPage = nbPerPage || 10;
    return await this.actionRepository.find({
      take: nbPerPage,
      skip: (page - 1) * nbPerPage,
      relations: ['user']
    });
  }

  async findOne(id: number) {
    const action = await this.actionRepository.findOne({where: { id }, relations: ['user']});
    if(!action){
      throw new NotFoundException(`Action with id ${id} not found`);
    }
    return action;
  }

  async update(id: number, updateActionDto: UpdateActionDto) {
    if(updateActionDto.startDate && updateActionDto.endDate && updateActionDto.startDate > updateActionDto.endDate){
        throw new BadRequestException('Start date must be before end date');
    }

    const action = await this.actionRepository.preload({
        id: id,
        ...updateActionDto
        });

    if(!action){
        throw new Error(`Action with id ${id} not found`);
    }
    return await this.actionRepository.save(action);

  }

  async remove(id: number) {
    const action = await this.findOne(id);
    if(!action){
      throw new Error(`Action with id ${id} not found`);
    }
    return await this.actionRepository.softDelete(id);
  }

  async restore(id: number) {
    const action = await this.actionRepository.findOne({where: {id}, withDeleted: true});
    if (!action) {
      throw new NotFoundException(`Action with id ${id} not found`);
    }
    if (!action.deletedAt) {
      throw new NotFoundException(`Action with id ${id} is not deleted`);
    }
    return await this.actionRepository.restore(id);
  }
}
