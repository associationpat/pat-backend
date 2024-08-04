import {Injectable, NotFoundException} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Task} from "./entities/task.entity";
import {Repository} from "typeorm";

@Injectable()
export class TaskService {
  constructor(
      @InjectRepository(Task)
      private taskRepository: Repository<Task>
  ) {}

  async create(createTaskDto: CreateTaskDto) {
    const newTask = this.taskRepository.create(createTaskDto);
    return await this.taskRepository.save(newTask);
  }

  async findAll() {
    return await this.taskRepository.find();
  }

  async findOne(id: number) {
    const task = await this.taskRepository.findOneBy({id})
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return task;
  }

  async update(id: number, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskRepository.preload(
        {
          id: id,
          ...updateTaskDto
        });

      if(!task){
          throw new NotFoundException(`Task with ID ${id} not found`)
      }
      return await this.taskRepository.save(task);

  }

  async remove(id: number) {
    const task = await this.findOne(id)
    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`)
    }
    return await this.taskRepository.softDelete(id)
  }

  async restore(id: number) {
    const task = await this.taskRepository.findOne({ where: { id }, withDeleted: true });
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found`);
    }
     if(!task.deletedAt){
         throw new NotFoundException(`Task with ID ${id} not deleted`)
     }
     return await this.taskRepository.restore(id);
  }
}
