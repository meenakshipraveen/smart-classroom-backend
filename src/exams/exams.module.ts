import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExamsService } from './exams.service';
import { ExamsController } from './exams.controller';
import { Exam } from '../database/entities/exam.entity';
import { ExamSeating } from '../database/entities/exam-seating.entity';
import { Student } from '../database/entities/student.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Exam, ExamSeating, Student])],
  controllers: [ExamsController],
  providers: [ExamsService],
  exports: [ExamsService],
})
export class ExamsModule {}
