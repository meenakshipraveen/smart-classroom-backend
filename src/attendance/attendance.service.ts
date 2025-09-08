import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Attendance } from '../database/entities/attendance.entity';
import { Student } from '../database/entities/student.entity';
import { BarcodeScanDto } from './dto/barcode-scan.dto';

@Injectable()
export class AttendanceService {
  constructor(
    @InjectRepository(Attendance)
    private attendanceRepository: Repository<Attendance>,
    @InjectRepository(Student)
    private studentRepository: Repository<Student>,
  ) {}

  async scanBarcode(barcodeScanDto: BarcodeScanDto) {
    // Find student by barcode
    const student = await this.studentRepository.findOne({
      where: { barcode: barcodeScanDto.barcode },
      relations: ['classroom'],
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // // Check if there's already an attendance record for today
    // const existingAttendance = await this.attendanceRepository.findOne({
    //   where: {
    //     regNo: student.regNo,
    //     date: Between(today, tomorrow),
    //   },
    // });

    const now = new Date();

    // if (!existingAttendance) {
      // First scan of the day - log arrival
      const attendance = this.attendanceRepository.create({
        regNo: student.regNo,
        classID: student.classID,
        arrival_time: now,
        date: today,
       });

      await this.attendanceRepository.save(attendance);

      return {
        message: 'Arrival logged successfully',
        student: {
          regNo: student.regNo,
          name: student.name,
          classID: student.classID,
        },
        action: 'arrival',
        time: now,
      };
    // } else if (existingAttendance.arrival_time && !existingAttendance.departure_time) {
    //   // Already arrived, log departure
    //   existingAttendance.departure_time = now;
    //   await this.attendanceRepository.save(existingAttendance);

    //   return {
    //     message: 'Departure logged successfully',
    //     student: {
    //       regNo: student.regNo,
    //       name: student.name,
    //       classID: student.classID,
    //     },
    //     action: 'departure',
    //     time: now,
    //   };
    // } else {
      // Already completed attendance for today
    //   return {
    //     message: 'Attendance already completed for today',
    //     student: {
    //       regNo: student.regNo,
    //       name: student.name,
    //       classID: student.classID,
    //     },
    //     action: 'completed',
    //     arrival_time: existingAttendance.arrival_time,
    //     departure_time: existingAttendance.departure_time,
    //   };
    // }
  }

  async getTodayAttendance(classID: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return await this.attendanceRepository.find({
      where: {
        classID,
        date: Between(today, tomorrow),
      },
      relations: ['student'],
      order: { arrival_time: 'ASC' },
    });
  }

  async getStudentAttendanceHistory(regNo: string) {
    return await this.attendanceRepository.find({
      where: { regNo },
      relations: ['student', 'classroom'],
      order: { date: 'DESC' },
    });
  }

  async getAttendanceByDate(date: string, classID: string) {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    return await this.attendanceRepository.find({
      where: {
        classID,
        date: Between(targetDate, nextDay),
      },
      relations: ['student'],
      order: { arrival_time: 'ASC' },
    });
  }

  async getAttendanceStats(classID: string, startDate?: string, endDate?: string) {
    let whereCondition: any = { classID };

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      whereCondition.date = Between(start, end);
    }

    const attendances = await this.attendanceRepository.find({
      where: whereCondition,
      relations: ['student'],
    });

    const totalStudents = await this.studentRepository.count({
      where: { classID },
    });

    const presentStudents = new Set(attendances.map(a => a.regNo)).size;
    const attendanceRate = totalStudents > 0 ? (presentStudents / totalStudents) * 100 : 0;

    return {
      totalStudents,
      presentStudents,
      absentStudents: totalStudents - presentStudents,
      attendanceRate: Math.round(attendanceRate * 100) / 100,
      attendances,
    };
  }
}
