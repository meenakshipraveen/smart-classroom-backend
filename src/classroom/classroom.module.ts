import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Classroom } from '../database/entities/classroom.entity';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Classroom])],
  providers: [ClassroomService],
  controllers: [ClassroomController],
})
export class ClassroomModule {}