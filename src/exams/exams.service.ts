import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Exam } from '../database/entities/exam.entity';
import { ExamSeating } from '../database/entities/exam-seating.entity';
import { Student } from '../database/entities/student.entity';
import { CreateExamDto } from './dto/create-exam.dto';
import { UpdateExamDto } from './dto/update-exam.dto';
import { AssignSeatingDto, BulkAssignSeatingDto } from './dto/assign-seating.dto';

@Injectable()
export class ExamsService {
  constructor(
    @InjectRepository(Exam)
    private examRepository: Repository<Exam>,
    @InjectRepository(ExamSeating)
    private examSeatingRepository: Repository<ExamSeating>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(createExamDto: CreateExamDto): Promise<Exam> {
    const exam = this.examRepository.create({
      ...createExamDto,
      date: new Date(createExamDto.exam_date),
    });
    return await this.examRepository.save(exam);
  }

  async findAll(): Promise<Exam[]> {
    return await this.examRepository.find({
      relations: ['examSeatings', 'examSeatings.student'],
      order: { date: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Exam> {
    const exam = await this.examRepository.findOne({
      where: { examID: id },
      relations: ['examSeatings', 'examSeatings.student'],
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    return exam;
  }

  async update(id: number, updateExamDto: UpdateExamDto): Promise<Exam> {
    const exam = await this.findOne(id);
    
    const updateData: any = { ...updateExamDto };
    if (updateExamDto.exam_date) {
      updateData.date = new Date(updateExamDto.exam_date);
      delete updateData.exam_date;
    }

    Object.assign(exam, updateData);
    return await this.examRepository.save(exam);
  }

  async remove(id: number): Promise<void> {
    const exam = await this.findOne(id);
    
    // Remove all seating assignments for this exam first
    await this.examSeatingRepository.delete({ examID: id });
    
    await this.examRepository.remove(exam);
  }

  async assignSeating(examId: number, assignSeatingDto: AssignSeatingDto): Promise<ExamSeating> {
    const exam = await this.findOne(examId);
    
    // Check if student exists
    const student = await this.studentRepository.findOne({
      where: { regNo: assignSeatingDto.regNo },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Check if student is already assigned to this exam
    const existingAssignment = await this.examSeatingRepository.findOne({
      where: { examID: examId, regNo: assignSeatingDto.regNo },
    });

    if (existingAssignment) {
      throw new ConflictException('Student is already assigned to this exam');
    }

    // Check if seat is already taken
    const existingSeat = await this.examSeatingRepository.findOne({
      where: { examID: examId, seatNo: assignSeatingDto.seatNo.toString() },
    });

    if (existingSeat) {
      throw new ConflictException('Seat is already assigned');
    }

    const seating = this.examSeatingRepository.create({
      examID: examId,
      regNo: assignSeatingDto.regNo,
      seatNo: assignSeatingDto.seatNo.toString(),
      classID: student.classID,
      timestamp: new Date(),
    });

    return await this.examSeatingRepository.save(seating);
  }

  async bulkAssignSeating(examId: number, bulkAssignDto: BulkAssignSeatingDto): Promise<ExamSeating[]> {
    const exam = await this.findOne(examId);
    const results: ExamSeating[] = [];

    for (const assignment of bulkAssignDto.assignments) {
      try {
        const seating = await this.assignSeating(examId, assignment);
        results.push(seating);
      } catch (error) {
        // Continue with other assignments even if one fails
        console.error(`Failed to assign seat for ${assignment.regNo}:`, error.message);
      }
    }

    return results;
  }

  async getSeatingArrangement(examId: number): Promise<ExamSeating[]> {
    const exam = await this.findOne(examId);
    
    return await this.examSeatingRepository.find({
      where: { examID: examId },
      relations: ['student', 'exam'],
      order: { seatNo: 'ASC' },
    });
  }

  async removeSeatingAssignment(examId: number, regNo: string): Promise<void> {
    const seating = await this.examSeatingRepository.findOne({
      where: { examID: examId, regNo },
    });

    if (!seating) {
      throw new NotFoundException('Seating assignment not found');
    }

    await this.examSeatingRepository.remove(seating);
  }

  async getUpcomingExams(): Promise<Exam[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return await this.examRepository
      .createQueryBuilder('exam')
      .where('exam.date >= :today', { today })
      .leftJoinAndSelect('exam.examSeatings', 'examSeatings')
      .orderBy('exam.date', 'ASC')
      .getMany();
  }

  async getExamsByClass(classID: string): Promise<Exam[]> {
    return await this.examRepository
      .createQueryBuilder('exam')
      .leftJoinAndSelect('exam.examSeatings', 'seating')
      .leftJoinAndSelect('seating.student', 'student')
      .where('seating.classID = :classID', { classID })
      .orderBy('exam.date', 'DESC')
      .getMany();
  }
}
