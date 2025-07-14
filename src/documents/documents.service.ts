import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async create(documentData: Partial<Document>): Promise<Document> {
    const document = this.documentsRepository.create(documentData);
    return this.documentsRepository.save(document);
  }

  async findAll(): Promise<Document[]> {
    return this.documentsRepository.find();
  }

  async findOne(id: string): Promise<Document> {
    return this.documentsRepository.findOne({
      where: { id },
      relations: ['application', 'verifications'],
    });
  }
}
