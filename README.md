# Smart Classroom IoT Backend API

A comprehensive NestJS backend API for managing Smart Classroom IoT systems with student management, attendance tracking, exam management, and sensor integration.

## 🚀 Features

### 🔐 Authentication & Authorization
- JWT-based authentication for admins
- Barcode-based authentication for students (no password required)
- Role-based access control

### 👥 Student Management
- CRUD operations for student records
- Registration number and barcode management
- Class assignment and tracking

### 📊 Attendance System
- Barcode scanning for automatic attendance
- Arrival and departure time logging
- Real-time attendance statistics
- Historical attendance reports

### 📝 Exam Management
- Create and manage exams
- Automatic seating arrangements
- Bulk seating assignments
- Exam scheduling and tracking

### 🌡️ Temperature Monitoring
- IoT sensor integration
- Real-time temperature logging
- Automatic cooling system control
- Temperature history and analytics
- Manual cooling system override

## 🏗️ Database Schema

The system implements the following database schemas as requested:

- **R1**: `sensors` (classID, sensorID)
- **R2**: `classrooms` (classID, floor, roomNo)
- **R3**: `students` (Name, RegNo, classID)
- **R4**: `temperature_logs` (classID, temp, TimeStamp)
- **R5**: `exam_seatings` (classID, RegNo, SeatNo, timestamp)

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL/PostgreSQL database
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd smart-classroom-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=your_username
   DB_PASSWORD=your_password
   DB_DATABASE=smart_classroom

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=24h

   # Server Configuration
   PORT=3000
   ```

4. **Database Setup**
   - Create a MySQL/PostgreSQL database named `smart_classroom`
   - The application will automatically create tables on first run

5. **Build the application**
   ```bash
   npm run build
   ```

## 🚀 Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run start:prod
```

The API will be available at `http://localhost:3000`

## 📚 API Documentation

Once the server is running, you can access the interactive API documentation at:
- **Swagger UI**: `http://localhost:3000/api/docs`

## 🔑 Default Credentials

After running the seeding script, you can use these default credentials:

- **Admin Login**:
  - Username: `admin`
  - Password: `admin123`

## 📖 API Endpoints

### Authentication
- `POST /auth/login` - Admin login

### Students (Admin only)
- `GET /students` - Get all students
- `POST /students` - Create new student
- `GET /students/:regNo` - Get student by registration number
- `PATCH /students/:regNo` - Update student
- `DELETE /students/:regNo` - Delete student
- `GET /students/class/:classID` - Get students by class

### Attendance
- `POST /attendance/scan` - Scan barcode for attendance (No JWT required)
- `GET /attendance/today/:classID` - Get today's attendance
- `GET /attendance/student/:regNo` - Get student attendance history
- `GET /attendance/stats/:classID` - Get attendance statistics

### Exams (Admin only)
- `GET /exams` - Get all exams
- `POST /exams` - Create new exam
- `GET /exams/:id` - Get exam by ID
- `PATCH /exams/:id` - Update exam
- `DELETE /exams/:id` - Delete exam
- `POST /exams/:id/seating` - Assign seating
- `GET /exams/:id/seating` - Get seating arrangement

### Sensors
- `POST /sensors/temperature` - Record temperature (No JWT required)
- `POST /sensors/cooling/control` - Manual cooling control (Admin only)
- `GET /sensors/temperature/current/:classID` - Get current temperature
- `GET /sensors/temperature/history/:classID` - Get temperature history
- `GET /sensors/cooling/status/:classID` - Get cooling status

## 🧪 Testing the API

### 1. Admin Authentication
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 2. Student Barcode Scan
```bash
curl -X POST http://localhost:3000/attendance/scan \
  -H "Content-Type: application/json" \
  -d '{"barcode": "BC001"}'
```

### 3. Temperature Recording
```bash
curl -X POST http://localhost:3000/sensors/temperature \
  -H "Content-Type: application/json" \
  -d '{"sensorID": "TEMP001", "classID": "CS101", "temp": 26.5}'
```

## 🏗️ Project Structure

```
src/
├── auth/                 # Authentication module
├── students/             # Student management
├── attendance/           # Attendance tracking
├── exams/               # Exam management
├── sensors/             # Temperature sensors
├── database/            # Database configuration & entities
│   ├── entities/        # TypeORM entities
│   └── seeds/          # Database seeding
└── main.ts             # Application entry point
```

## 🔧 Key Features Implementation

### Barcode Scanning Flow
1. Student scans ID card barcode
2. System extracts registration number
3. First scan of day → logs arrival
4. Second scan → logs departure
5. Automatic attendance calculation

### Temperature Control
1. IoT sensors send temperature data
2. If temp > threshold → auto-enable cooling
3. Admins can manually override cooling
4. All actions logged with timestamps

### Exam Seating
1. Create exam with details
2. Assign students to specific seats
3. Generate seating arrangements
4. Track exam attendance

## 🛡️ Security Features

- JWT token authentication for admins
- Password hashing with bcrypt
- Input validation with class-validator
- CORS enabled for cross-origin requests
- SQL injection protection with TypeORM

## 🚀 Deployment

### Using PM2 (Recommended)
```bash
npm install -g pm2
npm run build
pm2 start dist/main.js --name smart-classroom-api
```

### Using Docker
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation at `/api/docs`
- Review the code examples above

---

**Built with ❤️ using NestJS, TypeORM, and modern IoT integration patterns**
