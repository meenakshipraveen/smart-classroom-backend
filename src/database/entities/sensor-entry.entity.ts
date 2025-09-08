import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('sensor_entries')
export class SensorEntry {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'timestamptz' })
  timestamp: Date;

  @CreateDateColumn()
  created_at: Date;
}