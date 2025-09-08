import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDatabaseConfig } from './database/database.config';
import { AuthModule } from './auth/auth.module';
import { StudentsModule } from './students/students.module';
import { AttendanceModule } from './attendance/attendance.module';
import { ExamsModule } from './exams/exams.module';
import { SensorsModule } from './sensors/sensors.module';
import { ClassroomModule } from './classroom/classroom.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),
    AuthModule,
    StudentsModule,
    AttendanceModule,
    ExamsModule,
    SensorsModule,
    ClassroomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
