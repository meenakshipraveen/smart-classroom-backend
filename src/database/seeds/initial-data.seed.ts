import { DataSource } from 'typeorm';
import * as bcrypt from 'bcryptjs';

export async function seedInitialData(dataSource: DataSource) {
  console.log('🌱 Starting database seeding...');

  try {
    // Create default admin user
    const adminRepository = dataSource.getRepository('Admin');
    const existingAdmin = await adminRepository.findOne({ where: { username: 'admin' } });
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await adminRepository.save({
        username: 'admin',
        password: hashedPassword,
        email: 'admin@smartclassroom.com',
        full_name: 'System Administrator',
        is_active: true,
      });
      console.log('✅ Default admin user created (username: admin, password: admin123)');
    }

    // Create sample classrooms
    const classroomRepository = dataSource.getRepository('Classroom');
    const sampleClassrooms = [
      { classID: 'CS101', floor: 1, roomNo: 'A101', cooling_on: false },
      { classID: 'CS102', floor: 1, roomNo: 'A102', cooling_on: false },
      { classID: 'CS201', floor: 2, roomNo: 'B201', cooling_on: false },
    ];

    for (const classroom of sampleClassrooms) {
      const existing = await classroomRepository.findOne({ where: { classID: classroom.classID } });
      if (!existing) {
        await classroomRepository.save(classroom);
        console.log(`✅ Created classroom: ${classroom.classID}`);
      }
    }

    // Create sample sensors
    const sensorRepository = dataSource.getRepository('Sensor');
    const sampleSensors = [
      { sensorID: 'TEMP001', classID: 'CS101' },
      { sensorID: 'TEMP002', classID: 'CS102' },
      { sensorID: 'TEMP003', classID: 'CS201' },
    ];

    for (const sensor of sampleSensors) {
      const existing = await sensorRepository.findOne({ where: { sensorID: sensor.sensorID } });
      if (!existing) {
        await sensorRepository.save(sensor);
        console.log(`✅ Created sensor: ${sensor.sensorID}`);
      }
    }

    // Create sample students
    const studentRepository = dataSource.getRepository('Student');
    const sampleStudents = [
      { regNo: 'STU001', name: 'John Doe', classID: 'CS101', barcode: 'BC001' },
      { regNo: 'STU002', name: 'Jane Smith', classID: 'CS101', barcode: 'BC002' },
      { regNo: 'STU003', name: 'Bob Johnson', classID: 'CS102', barcode: 'BC003' },
      { regNo: 'STU004', name: 'Alice Brown', classID: 'CS102', barcode: 'BC004' },
      { regNo: 'STU005', name: 'Charlie Wilson', classID: 'CS201', barcode: 'BC005' },
    ];

    for (const student of sampleStudents) {
      const existing = await studentRepository.findOne({ where: { regNo: student.regNo } });
      if (!existing) {
        await studentRepository.save(student);
        console.log(`✅ Created student: ${student.name} (${student.regNo})`);
      }
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('\n📋 Summary:');
    console.log('- Default admin: username=admin, password=admin123');
    console.log('- Sample classrooms: CS101, CS102, CS201');
    console.log('- Sample sensors: TEMP001, TEMP002, TEMP003');
    console.log('- Sample students: 5 students across different classes');
    console.log('\n🚀 You can now start the server and test the API endpoints!');

  } catch (error) {
    console.error('❌ Error during database seeding:', error);
    throw error;
  }
}
