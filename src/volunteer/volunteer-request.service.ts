import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateVolunteerDto } from './dto/create-volunteer.dto';
import { UpdateVolunteerDto } from './dto/update-volunteer.dto';
import { Volunteer } from './entities/volunteer.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GetPaginatedDto } from '../shared/pagination/get-paginated.dto';
import { VolunteerRequest } from './entities/volunteer-request.entity';
import { CreateVolunteerRequestDto } from './dto/create-volunteer-request.dto';

@Injectable()
export class VolunteerRequestService {
  constructor(
    @InjectRepository(VolunteerRequest)
    private volunteerRequestRepository: Repository<VolunteerRequest>,
    @InjectRepository(Volunteer)
    private volunteerRepository: Repository<Volunteer>,
  ) {}

  async create(createVolunteerRequestDto: CreateVolunteerRequestDto) {
    const volunteerRequest = this.volunteerRequestRepository.create(
      createVolunteerRequestDto,
    );
    return await this.volunteerRequestRepository.save(volunteerRequest);
  }

  async findAll() {
    return await this.volunteerRequestRepository.find();
  }

  async findOne(id: number) {
    const volunteerRequest = await this.volunteerRequestRepository.findOneBy({
      id,
    });
    if (!volunteerRequest) {
      throw new NotFoundException('Volunteer Request not found');
    }
    return volunteerRequest;
  }

  async acceptRequest(id: number) {
    const volunteerRequest = await this.findOne(id);
    if (!volunteerRequest) {
      throw new NotFoundException('Volunteer Request not found');
    }
    delete volunteerRequest.id;
    const volunteer = this.volunteerRepository.create(volunteerRequest);
    await this.volunteerRepository.save(volunteer);
    await this.volunteerRequestRepository.softDelete(id);
    return volunteer;
  }

  async remove(id: number) {
    const volunteerRequest = await this.findOne(id);
    if (!volunteerRequest) {
      throw new NotFoundException('Volunteer Request not found');
    }
    return await this.volunteerRequestRepository.softDelete(id);
  }

  async restore(id: number) {
    const volunteerRequest = await this.findOne(id);
    if (!volunteerRequest) {
      throw new NotFoundException('Volunteer Request not found');
    }
    if (!volunteerRequest.deletedAt) {
      throw new NotFoundException('Volunteer Request not deleted');
    }
    return await this.volunteerRequestRepository.restore(id);
  }
}