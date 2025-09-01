import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Exam } from './exam.entity';
import { Student } from './student.entity';
import { Classroom } from './classroom.entity';

@Entity('exam_seatings')
export class ExamSeating {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  examID: number;

  @Column({ type: 'varchar', length: 50 })
  regNo: string;

  @Column({ type: 'varchar', length: 50 })
  classID: string;

  @Column({ type: 'varchar', length: 20 })
  seatNo: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @ManyToOne(() => Exam, exam => exam.examSeatings)
  @JoinColumn({ name: 'examID' })
  exam: Exam;

  @ManyToOne(() => Student, student => student.examSeatings)
  @JoinColumn({ name: 'regNo' })
  student: Student;

  @ManyToOne(() => Classroom)
  @JoinColumn({ name: 'classID' })
  classroom: Classroom;
}
