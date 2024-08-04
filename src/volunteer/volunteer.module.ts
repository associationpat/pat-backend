import { Module } from '@nestjs/common';
import { VolunteerService } from './volunteer.service';
import { VolunteerController } from './volunteer.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Volunteer } from './entities/volunteer.entity';
import { VolunteerRequest } from './entities/volunteer-request.entity';
import { VolunteerRequestService } from './volunteer-request.service';
import { VolunteerRequestController } from './volunteer-request.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Volunteer, VolunteerRequest])],
  controllers: [VolunteerRequestController, VolunteerController],
  providers: [VolunteerRequestService, VolunteerService],
})
export class VolunteerModule {}
