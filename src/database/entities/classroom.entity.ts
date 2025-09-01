import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Sensor } from './sensor.entity';
import { Student } from './student.entity';
import { Attendance } from './attendance.entity';
import { TemperatureLog } from './temperature-log.entity';
import { Exam } from './exam.entity';

@Entity('classrooms')
export class Classroom {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  classID: string;

  @Column({ type: 'int' })
  floor: number;

  @Column({ type: 'varchar', length: 50 })
  roomNo: string;

  @Column({ type: 'boolean', default: false })
  cooling_on: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 25.0 })
  temperature_threshold: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @OneToMany(() => Sensor, sensor => sensor.classroom)
  sensors: Sensor[];

  @OneToMany(() => Student, student => student.classroom)
  students: Student[];

  @OneToMany(() => Attendance, attendance => attendance.classroom)
  attendances: Attendance[];

  @OneToMany(() => TemperatureLog, temperatureLog => temperatureLog.classroom)
  temperatureLogs: TemperatureLog[];

  @OneToMany(() => Exam, exam => exam.classroom)
  exams: Exam[];
}
