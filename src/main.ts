import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors();

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Smart Classroom IoT API')
    .setDescription('Backend API for Smart Classroom IoT project with student management, attendance tracking, exam management, and sensor integration')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Authentication', 'Admin authentication endpoints')
    .addTag('Students', 'Student management endpoints (Admin only)')
    .addTag('Attendance', 'Attendance tracking endpoints')
    .addTag('Exams', 'Exam and seating management endpoints (Admin only)')
    .addTag('Sensors', 'Temperature sensor and cooling system endpoints')
    .build();

  const document = SwaggerModule.createDocument(app as any, config);
  SwaggerModule.setup('api/docs', app as any, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Smart Classroom IoT API is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation available at: http://localhost:${port}/api/docs`);
}
bootstrap();
