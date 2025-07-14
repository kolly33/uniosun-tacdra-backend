import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  getHealth() {
    return {
      status: 'OK',
      message: 'UNIOSUN TACDRA Backend API is running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      endpoints: {
        health: 'GET /',
        documentation: 'GET /api/docs',
        upload: 'POST /upload/document',
      },
    };
  }

  @Get('status')
  @ApiOperation({ summary: 'Detailed status check' })
  getStatus() {
    return {
      api: 'running',
      database: 'not_configured',
      upload_directory: 'available',
      environment: process.env.NODE_ENV || 'development',
      features: [
        'File Upload',
        'API Documentation',
        'CORS Enabled',
        'Input Validation',
      ],
    };
  }
}
