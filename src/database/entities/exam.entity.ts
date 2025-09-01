import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Classroom } from './classroom.entity';
import { ExamSeating } from './exam-seating.entity';

@Entity('exams')
export class Exam {
  @PrimaryGeneratedColumn()
  examID: number;

  @Column({ type: 'varchar', length: 100 })
  exam_name: string;

  @Column({ type: 'varchar', length: 100 })
  subject: string;

  @Column({ type: 'varchar', length: 50 })
  classID: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'int' })
  duration: number; // Duration in minutes

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Classroom, classroom => classroom.exams)
  @JoinColumn({ name: 'classID' })
  classroom: Classroom;

  @OneToMany(() => ExamSeating, examSeating => examSeating.exam)
  examSeatings: ExamSeating[];
}
