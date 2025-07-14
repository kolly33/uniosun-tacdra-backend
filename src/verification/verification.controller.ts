import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { VerificationService } from './verification.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('verification')
@Controller('verification')
export class VerificationController {
  constructor(private readonly verificationService: VerificationService) {}

  @Get('qr/:qrCode')
  @ApiOperation({ summary: 'QR code verification' })
  qrVerification(@Param('qrCode') qrCode: string) {
    return this.verificationService.qrVerification(qrCode);
  }

  @Post('manual')
  @ApiOperation({ summary: 'Manual verification using student details' })
  manualVerification(@Body() manualData: any) {
    return this.verificationService.manualVerification(manualData);
  }

  @Post('certificate')
  @ApiOperation({ summary: 'Submit certificate for verification' })
  verifyCertificate(@Body() certificateData: any) {
    return this.verificationService.verifyCertificate(certificateData);
  }

  @Post('document')
  @ApiOperation({ summary: 'Submit other documents for verification' })
  verifyDocument(@Body() documentData: any) {
    return this.verificationService.verifyDocument(documentData);
  }

  @Post('upload')
  @ApiOperation({ summary: 'File upload verification' })
  uploadVerification(@Body() uploadData: any) {
    return this.verificationService.uploadVerification(uploadData);
  }

  @Get('status/:id')
  @ApiOperation({ summary: 'Get verification status/result' })
  getStatus(@Param('id') id: string) {
    return this.verificationService.getStatus(id);
  }

  @Get('history')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all verifications for the user' })
  getHistory(@Request() req) {
    return this.verificationService.getHistory(req.user.id);
  }
}
