import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Sensor } from '../database/entities/sensor.entity';
import { TemperatureLog } from '../database/entities/temperature-log.entity';
import { Classroom } from '../database/entities/classroom.entity';
import { TemperatureReadingDto, CoolingControlDto } from './dto/temperature-reading.dto';

@Injectable()
export class SensorsService {
  private readonly TEMPERATURE_THRESHOLD = 25; // Default threshold in Celsius

  constructor(
    @InjectRepository(Sensor)
    private sensorRepository: Repository<Sensor>,
    @InjectRepository(TemperatureLog)
    private temperatureLogRepository: Repository<TemperatureLog>,
    @InjectRepository(Classroom)
    private classroomRepository: Repository<Classroom>,
  ) {}

  async recordTemperature(temperatureReadingDto: TemperatureReadingDto): Promise<TemperatureLog> {
    // Check if sensor exists
    const sensor = await this.sensorRepository.findOne({
      where: { sensorID: temperatureReadingDto.sensorID },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    // Check if classroom exists
    const classroom = await this.classroomRepository.findOne({
      where: { classID: temperatureReadingDto.classID },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    // Create temperature log entry
    const temperatureLog = this.temperatureLogRepository.create({
      classID: temperatureReadingDto.classID,
      sensorID: temperatureReadingDto.sensorID,
      temperature: temperatureReadingDto.temp,
      timestamp: new Date(),
      cooling_triggered: temperatureReadingDto.temp > this.TEMPERATURE_THRESHOLD,
    });

    const savedLog = await this.temperatureLogRepository.save(temperatureLog);

    // Check if temperature exceeds threshold and auto-control cooling
    if (temperatureReadingDto.temp > this.TEMPERATURE_THRESHOLD) {
      await this.autoControlCooling(temperatureReadingDto.classID, true);
    }

    return savedLog;
  }

  async autoControlCooling(classID: string, coolingOn: boolean): Promise<void> {
    const classroom = await this.classroomRepository.findOne({
      where: { classID },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    // Update cooling status
    classroom.cooling_on = coolingOn;
    await this.classroomRepository.save(classroom);

    console.log(`Auto-controlled cooling for classroom ${classID}: ${coolingOn ? 'ON' : 'OFF'}`);
  }

  async manualCoolingControl(coolingControlDto: CoolingControlDto): Promise<Classroom> {
    const classroom = await this.classroomRepository.findOne({
      where: { classID: coolingControlDto.classID },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    classroom.cooling_on = coolingControlDto.cooling_on;
    return await this.classroomRepository.save(classroom);
  }

  async getCurrentTemperature(classID: string): Promise<TemperatureLog | null> {
    return await this.temperatureLogRepository.findOne({
      where: { classID },
      order: { timestamp: 'DESC' },
    });
  }

  async getTemperatureHistory(classID: string, startDate?: string, endDate?: string): Promise<TemperatureLog[]> {
    let whereCondition: any = { classID };

    if (startDate && endDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      whereCondition.timestamp = Between(start, end);
    }

    return await this.temperatureLogRepository.find({
      where: whereCondition,
      order: { timestamp: 'DESC' },
      take: 100, // Limit to last 100 readings
    });
  }

  async getTodayTemperatureStats(classID: string): Promise<any> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const readings = await this.temperatureLogRepository.find({
      where: {
        classID,
        timestamp: Between(today, tomorrow),
      },
      order: { timestamp: 'ASC' },
    });

    if (readings.length === 0) {
      return {
        classID,
        date: today.toISOString().split('T')[0],
        readingsCount: 0,
        averageTemp: null,
        minTemp: null,
        maxTemp: null,
        readings: [],
      };
    }

    const temperatures = readings.map(r => r.temperature);
    const averageTemp = temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length;
    const minTemp = Math.min(...temperatures);
    const maxTemp = Math.max(...temperatures);

    return {
      classID,
      date: today.toISOString().split('T')[0],
      readingsCount: readings.length,
      averageTemp: Math.round(averageTemp * 100) / 100,
      minTemp,
      maxTemp,
      readings: readings.slice(-10), // Last 10 readings
    };
  }

  async getCoolingStatus(classID: string): Promise<{ classID: string; cooling_on: boolean }> {
    const classroom = await this.classroomRepository.findOne({
      where: { classID },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    return {
      classID: classroom.classID,
      cooling_on: classroom.cooling_on,
    };
  }

  async getAllSensors(): Promise<Sensor[]> {
    return await this.sensorRepository.find({
      relations: ['classroom'],
    });
  }

  async getSensorsByClass(classID: string): Promise<Sensor[]> {
    return await this.sensorRepository.find({
      where: { classID },
      relations: ['classroom'],
    });
  }

  async createSensor(sensorData: { sensorID: string; classID: string }): Promise<Sensor> {
    // Check if classroom exists
    const classroom = await this.classroomRepository.findOne({
      where: { classID: sensorData.classID },
    });

    if (!classroom) {
      throw new NotFoundException('Classroom not found');
    }

    const sensor = this.sensorRepository.create(sensorData);
    return await this.sensorRepository.save(sensor);
  }

  async removeSensor(sensorID: string): Promise<void> {
    const sensor = await this.sensorRepository.findOne({
      where: { sensorID },
    });

    if (!sensor) {
      throw new NotFoundException('Sensor not found');
    }

    await this.sensorRepository.remove(sensor);
  }
}
