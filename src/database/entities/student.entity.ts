import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Classroom } from './classroom.entity';
import { Attendance } from './attendance.entity';
import { ExamSeating } from './exam-seating.entity';

@Entity('students')
export class Student {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  regNo: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 50 })
  classID: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  barcode: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Classroom, classroom => classroom.students)
  @JoinColumn({ name: 'classID' })
  classroom: Classroom;

  @OneToMany(() => Attendance, attendance => attendance.student)
  attendances: Attendance[];

  @OneToMany(() => ExamSeating, examSeating => examSeating.student)
  examSeatings: ExamSeating[];
}
