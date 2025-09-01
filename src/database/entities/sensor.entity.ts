import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Classroom } from './classroom.entity';
import { TemperatureLog } from './temperature-log.entity';

@Entity('sensors')
export class Sensor {
  @PrimaryColumn({ type: 'varchar', length: 50 })
  sensorID: string;

  @Column({ type: 'varchar', length: 50 })
  classID: string;

  @Column({ type: 'varchar', length: 50, default: 'temperature' })
  sensor_type: string;

  @Column({ type: 'boolean', default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  // Relationships
  @ManyToOne(() => Classroom, classroom => classroom.sensors)
  @JoinColumn({ name: 'classID' })
  classroom: Classroom;

  @OneToMany(() => TemperatureLog, temperatureLog => temperatureLog.sensor)
  temperatureLogs: TemperatureLog[];
}
