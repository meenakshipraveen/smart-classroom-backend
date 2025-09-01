import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Student } from './student.entity';
import { Classroom } from './classroom.entity';

@Entity('attendances')
export class Attendance {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  regNo: string;

  @Column({ type: 'varchar', length: 50 })
  classID: string;

  @Column({ type: 'timestamp', nullable: true })
  arrival_time: Date;

  @Column({ type: 'timestamp', nullable: true })
  departure_time: Date;

  @Column({ type: 'date' })
  date: Date;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @ManyToOne(() => Student, student => student.attendances)
  @JoinColumn({ name: 'regNo' })
  student: Student;

  @ManyToOne(() => Classroom, classroom => classroom.attendances)
  @JoinColumn({ name: 'classID' })
  classroom: Classroom;
}
