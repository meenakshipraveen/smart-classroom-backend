import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Admin } from '../database/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
    private jwtService: JwtService,
  ) {}

  async validateAdmin(username: string, password: string): Promise<any> {
    const admin = await this.adminRepository.findOne({
      where: { username, is_active: true },
    });

    if (admin && (await bcrypt.compare(password, admin.password))) {
      const { password, ...result } = admin;
      return result;
    }
    return null;
  }

  async login(username: string, password: string) {
    const admin = await this.validateAdmin(username, password);
    if (!admin) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = { username: admin.username, sub: admin.id };
    return {
      access_token: this.jwtService.sign(payload),
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        full_name: admin.full_name,
      },
    };
  }

  async createAdmin(username: string, password: string, email?: string, fullName?: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const admin = this.adminRepository.create({
      username,
      password: hashedPassword,
      email,
      full_name: fullName,
    });

    return await this.adminRepository.save(admin);
  }

  async findAdminById(id: number): Promise<Admin | null> {
    return await this.adminRepository.findOne({
      where: { id, is_active: true },
    });
  }
}
