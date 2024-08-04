import { Injectable } from '@nestjs/common';
import { CreatePartnerDto } from './dto/create-partner.dto';
import { UpdatePartnerDto } from './dto/update-partner.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Partner } from './entities/partner.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PartnerService {
  constructor(
    // Inject the partner repository
    @InjectRepository(Partner)
    private partnerRepository: Repository<Partner>,
  ) {}
  async create(createPartnerDto: CreatePartnerDto) {
    // Create a new partner
    const partner = this.partnerRepository.create(createPartnerDto);
    // Save the partner to the database
    return this.partnerRepository.save(partner);
  }

  async findAll() {
    // Find all partners
    return await this.partnerRepository.find();
  }

  async findOne(id: number) {
    return await this.partnerRepository.findOneBy({ id });
  }

  async update(id: number, updatePartnerDto: UpdatePartnerDto) {
    return await this.partnerRepository.update(id, updatePartnerDto);
  }

  async removeSoft(id: number) {
    return await this.partnerRepository.softDelete(id);
  }

  async restore(id: number) {
    return await this.partnerRepository.restore(id);
  }
}
