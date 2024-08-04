import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { Volunteer } from './entities/volunteer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPaginatedDto } from '../shared/pagination/get-paginated.dto';

@Injectable()
export class VolunteerService {
  constructor(
    @InjectRepository(Volunteer)
    private volunteerRepository: Repository<Volunteer>,
  ) {}

  async create(createVolunteerDto: CreateVolunteerDto) {
    const volunteer = this.volunteerRepository.create(createVolunteerDto);
    return await this.volunteerRepository.save(volunteer);
  }

  async findAll(getPaginatedDto?: GetPaginatedDto) {
    let { page, nbPerPage } = getPaginatedDto ?? {};
    if (!page && !nbPerPage) {
      return await this.volunteerRepository.find();
    }
    page = page ?? 1;
    nbPerPage = nbPerPage ?? 10;
    return await this.volunteerRepository.find({
      take: nbPerPage,
      skip: (page - 1) * nbPerPage,
    });
  }

  async findOne(id: number) {
    const volunteer = await this.volunteerRepository.findOneBy({ id });
    if (!volunteer) {
      throw new NotFoundException('Volunteer not found');
    }
    return volunteer;
  }

  async update(id: number, updateVolunteerDto: UpdateVolunteerDto) {
    const volunteer = await this.volunteerRepository.preload({
      ...updateVolunteerDto,
      id: id,
    });
    if (!volunteer) {
      throw new NotFoundException('Volunteer not found');
    }
    return await this.volunteerRepository.save(volunteer);
  }

  async remove(id: number) {
    const volunteer = await this.findOne(id);
    if (!volunteer) {
      throw new NotFoundException('Volunteer not found');
    }
    return await this.volunteerRepository.softDelete(id);
  }

  async restore(id: number) {
    const volunteer = await this.volunteerRepository.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!volunteer) {
      throw new NotFoundException('Volunteer not found');
    }
    if (!volunteer.deletedAt) {
      throw new NotFoundException('Volunteer is not deleted');
    }
    return await this.volunteerRepository.restore(id);
  }
}