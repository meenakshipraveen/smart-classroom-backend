import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Student } from '../database/entities/student.entity';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';

@Injectable()
export class StudentsService {
  constructor(
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async create(createStudentDto: CreateStudentDto): Promise<Student> {
    // Check if student with regNo already exists
    const existingStudent = await this.studentRepository.findOne({
      where: { regNo: createStudentDto.regNo },
    });

    if (existingStudent) {
      throw new ConflictException('Student with this registration number already exists');
    }

    // Check if barcode already exists
    const existingBarcode = await this.studentRepository.findOne({
      where: { barcode: createStudentDto.barcode },
    });

    if (existingBarcode) {
      throw new ConflictException('Student with this barcode already exists');
    }

    const student = this.studentRepository.create(createStudentDto);
    return await this.studentRepository.save(student);
  }

  async findAll(): Promise<Student[]> {
    return await this.studentRepository.find({
      relations: ['classroom'],
    });
  }

  async findOne(regNo: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { regNo },
      relations: ['classroom', 'attendances'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async findByBarcode(barcode: string): Promise<Student> {
    const student = await this.studentRepository.findOne({
      where: { barcode },
      relations: ['classroom'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    return student;
  }

  async update(regNo: string, updateStudentDto: UpdateStudentDto): Promise<Student> {
    const student = await this.findOne(regNo);

    // If updating barcode, check if it already exists
    if (updateStudentDto.barcode && updateStudentDto.barcode !== student.barcode) {
      const existingBarcode = await this.studentRepository.findOne({
        where: { barcode: updateStudentDto.barcode },
      });

      if (existingBarcode) {
        throw new ConflictException('Student with this barcode already exists');
      }
    }

    Object.assign(student, updateStudentDto);
    return await this.studentRepository.save(student);
  }

  async remove(regNo: string): Promise<void> {
    const student = await this.findOne(regNo);
    await this.studentRepository.remove(student);
  }

  async findByClassId(classID: string): Promise<Student[]> {
    return await this.studentRepository.find({
      where: { classID },
      relations: ['classroom'],
    });
  }
}
