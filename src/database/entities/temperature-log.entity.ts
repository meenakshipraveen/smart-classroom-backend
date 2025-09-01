import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Classroom } from './classroom.entity';
import { Sensor } from './sensor.entity';

@Entity('temperature_logs')
export class TemperatureLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50 })
  classID: string;

  @Column({ type: 'varchar', length: 50 })
  sensorID: string;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  temperature: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column({ type: 'boolean', default: false })
  cooling_triggered: boolean;

  @CreateDateColumn()
  created_at: Date;

  // Relationships
  @ManyToOne(() => Classroom, classroom => classroom.temperatureLogs)
  @JoinColumn({ name: 'classID' })
  classroom: Classroom;

  @ManyToOne(() => Sensor, sensor => sensor.temperatureLogs)
  @JoinColumn({ name: 'sensorID' })
  sensor: Sensor;
}
