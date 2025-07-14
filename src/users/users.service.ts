import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from './entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(userData: Partial<User>): Promise<User> {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      select: ['id', 'matriculationNumber', 'firstName', 'lastName', 'email', 'role', 'isVerified', 'createdAt'],
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'matriculationNumber', 'firstName', 'lastName', 'email', 'phoneNumber', 'role', 'graduationYear', 'degree', 'department', 'faculty', 'isVerified', 'createdAt'],
    });
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByMatriculationNumber(matriculationNumber: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { matriculationNumber } });
  }

  async update(id: string, updateData: Partial<User>): Promise<User> {
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    await this.usersRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async verifyUser(id: string): Promise<User> {
    await this.usersRepository.update(id, { isVerified: true });
    return this.findOne(id);
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    return bcrypt.compare(password, user.password);
  }

  async updateRole(id: string, role: string): Promise<User> {
    await this.usersRepository.update(id, { role: role as UserRole });
    return this.findOne(id);
  }
}
