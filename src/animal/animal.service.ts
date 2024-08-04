import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAnimalDto } from './dto/create-animal.dto';
import { UpdateAnimalDto } from './dto/update-animal.dto';
import { Animal } from './entities/animal.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { UserRoleEnum } from '../Enums/user-role.enum';
import { GenderEnum } from '../Enums/gender.enum';

@Injectable()
export class AnimalService {
  constructor(
    @InjectRepository(Animal)
    private animalRepository: Repository<Animal>,
  ) {}
  async create(createAnimalDto: CreateAnimalDto, currentUser: User) {
    if (
      currentUser.role === UserRoleEnum.ADMIN ||
      currentUser.role === UserRoleEnum.SUPER_ADMIN
    ) {
      const newAnimal = this.animalRepository.create(createAnimalDto);
      return await this.animalRepository.save(newAnimal);
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async findAll() {
    return await this.animalRepository.find();
  }

  async findOne(id: number) {
    return await this.animalRepository.findOneBy({ id });
  }

  async update(
    id: number,
    updateAnimalDto: UpdateAnimalDto,
    currentUser: User,
  ) {
    if (
      currentUser.role === UserRoleEnum.ADMIN ||
      currentUser.role === UserRoleEnum.SUPER_ADMIN
    ) {
      const animal = await this.findOne(id);
      if (animal) {
        return await this.animalRepository.save({
          ...animal,
          ...updateAnimalDto,
        });
      } else {
        throw new NotFoundException('Animal not found');
      }
    }
    throw new UnauthorizedException('Unauthorized');
  }

  async remove(id: number, currentUser: User) {
    if (
      currentUser.role === UserRoleEnum.ADMIN ||
      currentUser.role === UserRoleEnum.SUPER_ADMIN
    ) {
      return await this.animalRepository.softDelete(id);
    }
    throw new UnauthorizedException('Unauthorized');
  }
  async restore(id: number, currentUser: User) {
    if (
      currentUser.role === UserRoleEnum.ADMIN ||
      currentUser.role === UserRoleEnum.SUPER_ADMIN
    ) {
      return await this.animalRepository.restore(id);
    }
    throw new UnauthorizedException('Unauthorized');
  }
  getGenders() {
    return Object.values(GenderEnum);
  }

  async getBreed() {
    const result = await this.animalRepository
      .createQueryBuilder('animal')
      .select('LOWER(animal.breed)', 'breed')
      .distinct(true)
      .getRawMany();

    return result.map((item) => item.breed);
  }

  async getSpecies() {
    const result = await this.animalRepository
      .createQueryBuilder('animal')
      .select('LOWER(animal.species)', 'species')
      .distinct(true)
      .getRawMany();
    return result.map((item) => item.species);
  }

  async getStatus() {
    const result = await this.animalRepository
      .createQueryBuilder('animal')
      .select('LOWER(animal.status)', 'status')
      .distinct(true)
      .getRawMany();
    return result.map((item) => item.status);
  }
}
