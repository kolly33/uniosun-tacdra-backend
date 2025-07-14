import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Verification, VerificationMethod, VerificationStatus } from './entities/verification.entity';

@Injectable()
export class VerificationService {
  constructor(
    @InjectRepository(Verification)
    private verificationRepository: Repository<Verification>,
  ) {}

  private generateVerificationId(): string {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8);
    return `VER-${timestamp}-${random}`.toUpperCase();
  }

  async create(verificationData: Partial<Verification>): Promise<Verification> {
    const verification = this.verificationRepository.create({
      verificationId: this.generateVerificationId(),
      status: VerificationStatus.PENDING,
      ...verificationData,
    });
    return this.verificationRepository.save(verification);
  }

  async findAll(): Promise<Verification[]> {
    return this.verificationRepository.find();
  }

  async findOne(id: string): Promise<Verification> {
    return this.verificationRepository.findOne({
      where: { id },
      relations: ['document', 'verifiedBy'],
    });
  }

  async qrVerification(qrCode: string): Promise<any> {
    // Find document by QR code
    const document = await this.verificationRepository.manager
      .getRepository('Document')
      .findOne({ where: { qrCode } });
    
    if (!document) {
      return { verified: false, message: 'Invalid QR code' };
    }
    
    return { 
      verified: true, 
      document,
      message: 'Document verified successfully' 
    };
  }

  async manualVerification(manualData: any): Promise<Verification> {
    const verificationDetails = JSON.stringify({
      matriculationNumber: manualData.matriculationNumber,
      documentType: manualData.documentType,
      graduationYear: manualData.graduationYear,
      degreeClass: manualData.degreeClass,
    });

    return this.create({
      method: VerificationMethod.MANUAL,
      requestedBy: manualData.matriculationNumber,
      verificationDetails,
      notes: `Manual verification request for ${manualData.documentType}`,
    });
  }

  async verifyDocument(documentData: any): Promise<Verification> {
    return this.create({
      method: VerificationMethod.MANUAL,
      requestedBy: documentData.requestedBy,
      verificationDetails: JSON.stringify(documentData),
      notes: 'General document verification request',
    });
  }

  async uploadVerification(uploadData: any): Promise<Verification> {
    const verificationDetails = JSON.stringify({
      matriculationNumber: uploadData.matriculationNumber,
      uploadedFileName: uploadData.fileName || 'document',
    });

    return this.create({
      method: VerificationMethod.DOCUMENT_UPLOAD,
      requestedBy: uploadData.matriculationNumber,
      verificationDetails,
      notes: 'Document upload verification request',
    });
  }

  async verifyCertificate(certificateData: any): Promise<Verification> {
    return this.create({
      method: VerificationMethod.MANUAL,
      requestedBy: certificateData.requestedBy,
      verificationDetails: JSON.stringify(certificateData),
      notes: 'Certificate verification request',
    });
  }

  async getStatus(id: string): Promise<Verification> {
    return this.findOne(id);
  }

  async getHistory(userId: string): Promise<Verification[]> {
    return this.verificationRepository.find({
      where: { requestedBy: userId },
      order: { createdAt: 'DESC' },
    });
  }
}
