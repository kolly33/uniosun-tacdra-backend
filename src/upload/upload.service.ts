import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {}

  async saveFile(file: Express.Multer.File, folder: string = 'documents'): Promise<string> {
    const uploadPath = this.configService.get('UPLOAD_PATH', './uploads');
    const fullPath = path.join(uploadPath, folder);
    
    // Ensure directory exists
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
    }

    const fileName = `${Date.now()}_${file.originalname}`;
    const filePath = path.join(fullPath, fileName);
    
    fs.writeFileSync(filePath, file.buffer);
    
    return path.join(folder, fileName);
  }

  async deleteFile(filePath: string): Promise<void> {
    const uploadPath = this.configService.get('UPLOAD_PATH', './uploads');
    const fullPath = path.join(uploadPath, filePath);
    
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  }
}
