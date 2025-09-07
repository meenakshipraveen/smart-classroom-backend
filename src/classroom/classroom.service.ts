import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classroom } from '../database/entities/classroom.entity';
import { GetAllClassroomsDto } from './dto/getclassroom.dto';

@Injectable()
export class ClassroomService {
  constructor(
    @InjectRepository(Classroom)
    private readonly classroomRepository: Repository<Classroom>,
  ) {}

  async getAllClassIDs(): Promise<GetAllClassroomsDto[]> {
    const classrooms = await this.classroomRepository.find({ select: ['classID'] });
    return classrooms.map(c => ({ id: c.classID }));
  }
}