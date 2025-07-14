import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application } from './entities/application.entity';

@Injectable()
export class ApplicationsService {
  constructor(
    @InjectRepository(Application)
    private applicationsRepository: Repository<Application>,
  ) {}

  async create(applicationData: Partial<Application>): Promise<Application> {
    const application = this.applicationsRepository.create(applicationData);
    return this.applicationsRepository.save(application);
  }

  async findAll(): Promise<Application[]> {
    return this.applicationsRepository.find({
      relations: ['user'],
    });
  }

  async findOne(id: string): Promise<Application> {
    return this.applicationsRepository.findOne({
      where: { id },
      relations: ['user', 'payments', 'documents'],
    });
  }

  async findByUser(userId: string): Promise<Application[]> {
    return this.applicationsRepository.find({
      where: { userId },
      relations: ['payments', 'documents'],
    });
  }

  async update(id: string, updateData: Partial<Application>): Promise<Application> {
    await this.applicationsRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.applicationsRepository.delete(id);
  }
}
