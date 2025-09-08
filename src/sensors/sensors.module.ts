import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SensorsService } from './sensors.service';
import { SensorEntry } from '../database/entities/sensor-entry.entity';
import { SensorsController } from './sensors.controller';
import { Sensor } from '../database/entities/sensor.entity';
import { TemperatureLog } from '../database/entities/temperature-log.entity';
import { Classroom } from '../database/entities/classroom.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Sensor, SensorEntry, TemperatureLog, Classroom])],
  controllers: [SensorsController],
  providers: [SensorsService],
  exports: [SensorsService],
})
export class SensorsModule {}
