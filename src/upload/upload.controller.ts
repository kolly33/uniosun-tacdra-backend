import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { UploadService } from './upload.service';

@ApiTags('upload')
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('document')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a document file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadDocument(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const filePath = await this.uploadService.saveFile(file, 'documents');
    
    return {
      message: 'File uploaded successfully',
      fileName: file.originalname,
      filePath,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  @Post('qr-code')
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({ summary: 'Upload a QR code image for verification' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadQRCode(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    if (!file.mimetype.startsWith('image/')) {
      throw new BadRequestException('Only image files are allowed for QR codes');
    }

    const filePath = await this.uploadService.saveFile(file, 'qr-codes');
    
    return {
      message: 'QR code uploaded successfully',
      fileName: file.originalname,
      filePath,
      size: file.size,
      mimeType: file.mimetype,
    };
  }
}
