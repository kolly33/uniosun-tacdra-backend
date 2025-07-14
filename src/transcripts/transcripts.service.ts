import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Application, ApplicationType, ApplicationStatus, TranscriptType, TranscriptDeliveryMethod } from '../applications/entities/application.entity';
import { CreateTranscriptApplicationDto } from './dto/create-transcript.dto';
import { UpdateApplicationStatusDto } from './dto/update-status.dto';
import { UserRole } from '../users/entities/user.entity';

@Injectable()
export class TranscriptsService {
  constructor(
    @InjectRepository(Application)
    private applicationRepository: Repository<Application>,
  ) {}

  async apply(createTranscriptDto: CreateTranscriptApplicationDto, userId: string) {
    // Validate transcript type and delivery method combination
    this.validateTranscriptApplication(createTranscriptDto);

    // Calculate amount based on transcript type and delivery method
    const amount = this.calculateTranscriptAmount(createTranscriptDto.transcriptType, createTranscriptDto.deliveryMethod);

    // Create application
    const application = this.applicationRepository.create({
      // Ensure 'type' exists in Application entity, otherwise remove this line
      type: ApplicationType.TRANSCRIPT as any,
      transcriptType: createTranscriptDto.transcriptType,
      // Cast deliveryMethod to the correct type if necessary
      deliveryMethod: createTranscriptDto.deliveryMethod as any,
      purpose: createTranscriptDto.purpose,
      notes: createTranscriptDto.notes,
      amount,
      userId,
      status: ApplicationStatus.PAYMENT_PENDING,
      // Set delivery-specific fields
      recipientEmail: createTranscriptDto.recipientEmail,
      institutionName: createTranscriptDto.institutionName,
      institutionEmail: createTranscriptDto.institutionEmail,
      institutionAddress: createTranscriptDto.institutionAddress,
      trackingReference: createTranscriptDto.trackingReference,
      // Set recipient details for general use
      recipientName: createTranscriptDto.institutionName || 'Self',
      recipientAddress: createTranscriptDto.institutionAddress,
    });

    const savedApplication = await this.applicationRepository.save(application);

    // If save returns an array, get the first element
    const app = Array.isArray(savedApplication) ? savedApplication[0] : savedApplication;

    return {
      message: 'Transcript application submitted successfully',
      application: {
        id: app.id,
        attn: app.attn,
        type: app.type,
        transcriptType: app.transcriptType,
        deliveryMethod: app.deliveryMethod,
        status: app.status,
        amount: app.amount,
        createdAt: app.createdAt,
      },
      nextStep: 'Proceed to payment to complete your application',
    };
  }

  async findByUser(userId: string) {
    const applications = await this.applicationRepository.find({
      where: { 
        userId,
        type: ApplicationType.TRANSCRIPT,
      },
      order: { createdAt: 'DESC' },
    });

    return applications.map(app => ({
      id: app.id,
      attn: app.attn,
      transcriptType: app.transcriptType,
      deliveryMethod: app.deliveryMethod,
      status: app.status,
      amount: app.amount,
      isPaid: app.isPaid,
      institutionName: app.institutionName,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    }));
  }

  async findOne(id: string) {
    const application = await this.applicationRepository.findOne({
      where: { id, type: ApplicationType.TRANSCRIPT },
      relations: ['payments', 'documents'],
    });

    if (!application) {
      throw new NotFoundException('Transcript application not found');
    }

    return {
      id: application.id,
      attn: application.attn,
      transcriptType: application.transcriptType,
      deliveryMethod: application.deliveryMethod,
      status: application.status,
      amount: application.amount,
      isPaid: application.isPaid,
      purpose: application.purpose,
      notes: application.notes,
      recipientEmail: application.recipientEmail,
      institutionName: application.institutionName,
      institutionEmail: application.institutionEmail,
      institutionAddress: application.institutionAddress,
      trackingReference: application.trackingReference,
      processingDays: application.processingDays,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      payments: application.payments,
      documents: application.documents,
    };
  }

  async cancel(id: string, userId: string) {
    const application = await this.applicationRepository.findOne({
      where: { id, userId, type: ApplicationType.TRANSCRIPT },
    });

    if (!application) {
      throw new NotFoundException('Transcript application not found');
    }

    // Only allow cancellation if not yet processed
    if (application.status === ApplicationStatus.PROCESSING || 
        application.status === ApplicationStatus.REGISTRAR_REVIEW ||
        application.status === ApplicationStatus.DEPUTY_REGISTRAR_REVIEW ||
        application.status === ApplicationStatus.EXAMS_RECORDS_PROCESSING ||
        application.status === ApplicationStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel application that is already being processed');
    }

    application.status = ApplicationStatus.REJECTED;
    await this.applicationRepository.save(application);

    return { 
      message: 'Transcript application cancelled successfully',
      status: application.status,
    };
  }

  async trackByATTN(attnNumber: string) {
    const application = await this.applicationRepository.findOne({
      where: { attn: attnNumber, type: ApplicationType.TRANSCRIPT },
    });

    if (!application) {
      throw new NotFoundException('Application not found with the provided ATTN number');
    }

    return {
      attn: application.attn,
      transcriptType: application.transcriptType,
      deliveryMethod: application.deliveryMethod,
      status: application.status,
      statusDescription: this.getStatusDescription(application.status),
      isPaid: application.isPaid,
      amount: application.amount,
      institutionName: application.institutionName,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      estimatedCompletion: this.calculateEstimatedCompletion(application),
    };
  }

  private validateTranscriptApplication(dto: CreateTranscriptApplicationDto) {
    const { transcriptType, deliveryMethod } = dto;

    // Validate delivery method combinations
    if (transcriptType === TranscriptType.STUDENT_COPY) {
      if (![TranscriptDeliveryMethod.EMAIL, TranscriptDeliveryMethod.PICKUP].includes(deliveryMethod)) {
        throw new BadRequestException('Student copy can only be delivered via Email or On-Campus Pickup');
      }
    }

    if (transcriptType === TranscriptType.OFFICIAL_COPY) {
      if (![TranscriptDeliveryMethod.EMAIL, TranscriptDeliveryMethod.COURIER].includes(deliveryMethod)) {
        throw new BadRequestException('Official copy can only be delivered via Email or Courier');
      }
    }

    // Validate required fields based on transcript type and delivery method
    if (transcriptType === TranscriptType.STUDENT_COPY && deliveryMethod === TranscriptDeliveryMethod.EMAIL) {
      if (!dto.recipientEmail) {
        throw new BadRequestException('Recipient email is required for student copy email delivery');
      }
    }

    if (transcriptType === TranscriptType.OFFICIAL_COPY) {
      if (!dto.institutionName || !dto.institutionEmail) {
        throw new BadRequestException('Institution name and email are required for official copy');
      }
      
      if (deliveryMethod === TranscriptDeliveryMethod.COURIER && !dto.institutionAddress) {
        throw new BadRequestException('Institution address is required for courier delivery');
      }
    }
  }

  private calculateTranscriptAmount(transcriptType: TranscriptType, deliveryMethod: TranscriptDeliveryMethod): number {
    // Base pricing structure
    const basePrices = {
      [TranscriptType.STUDENT_COPY]: {
        [TranscriptDeliveryMethod.EMAIL]: 3000,
        [TranscriptDeliveryMethod.PICKUP]: 3500,
      },
      [TranscriptType.OFFICIAL_COPY]: {
        [TranscriptDeliveryMethod.EMAIL]: 5000,
        [TranscriptDeliveryMethod.COURIER]: 7500,
      },
    };

    return basePrices[transcriptType][deliveryMethod] || 5000;
  }

  private getStatusDescription(status: ApplicationStatus): string {
    const descriptions = {
      [ApplicationStatus.PENDING]: 'Application submitted and pending review',
      [ApplicationStatus.PAYMENT_PENDING]: 'Waiting for payment confirmation',
      [ApplicationStatus.PROCESSING]: 'Payment confirmed, application in processing queue',
      [ApplicationStatus.REGISTRAR_REVIEW]: 'Under review by the Registrar',
      [ApplicationStatus.DEPUTY_REGISTRAR_REVIEW]: 'Under review by Deputy Registrar (Academic Affairs)',
      [ApplicationStatus.EXAMS_RECORDS_PROCESSING]: 'Being processed by Exams & Records Unit',
      [ApplicationStatus.READY]: 'Transcript is ready',
      [ApplicationStatus.DISPATCHED]: 'Transcript has been dispatched',
      [ApplicationStatus.AVAILABLE_FOR_PICKUP]: 'Transcript is available for pickup',
      [ApplicationStatus.COMPLETED]: 'Application completed successfully',
      [ApplicationStatus.REJECTED]: 'Application has been rejected',
    };

    return descriptions[status] || 'Status unknown';
  }

  private calculateEstimatedCompletion(application: Application): string {
    const processingDays = application.processingDays || this.getDefaultProcessingDays(application.transcriptType);
    const estimatedDate = new Date(application.createdAt);
    estimatedDate.setDate(estimatedDate.getDate() + processingDays);
    
    return estimatedDate.toISOString().split('T')[0]; // Return YYYY-MM-DD format
  }

  private getDefaultProcessingDays(transcriptType: TranscriptType): number {
    return transcriptType === TranscriptType.STUDENT_COPY ? 5 : 7; // Student copy: 5 days, Official copy: 7 days
  }

  // Admin workflow methods
  async getApplicationsForReview(userRole: UserRole, page: number = 1, limit: number = 10) {
    let statusFilter: ApplicationStatus[] = [];
    
    switch (userRole) {
      case UserRole.REGISTRAR:
        statusFilter = [ApplicationStatus.PROCESSING];
        break;
      case UserRole.DEPUTY_REGISTRAR:
        statusFilter = [ApplicationStatus.REGISTRAR_REVIEW];
        break;
      case UserRole.EXAMS_RECORDS:
        statusFilter = [ApplicationStatus.DEPUTY_REGISTRAR_REVIEW];
        break;
      case UserRole.ADMIN:
        statusFilter = [
          ApplicationStatus.PROCESSING,
          ApplicationStatus.REGISTRAR_REVIEW,
          ApplicationStatus.DEPUTY_REGISTRAR_REVIEW,
          ApplicationStatus.EXAMS_RECORDS_PROCESSING,
        ];
        break;
      default:
        throw new ForbiddenException('Insufficient permissions to view applications');
    }

    const [applications, total] = await this.applicationRepository.findAndCount({
      where: { 
        type: ApplicationType.TRANSCRIPT,
        status: statusFilter.length === 1 ? statusFilter[0] : undefined,
        isPaid: true, // Only show paid applications
      },
      relations: ['user'],
      order: { createdAt: 'ASC' }, // Oldest first for processing queue
      skip: (page - 1) * limit,
      take: limit,
    });

    // If multiple statuses, filter them manually
    const filteredApplications = statusFilter.length > 1 
      ? applications.filter(app => statusFilter.includes(app.status))
      : applications;

    return {
      applications: filteredApplications.map(app => ({
        id: app.id,
        attn: app.attn,
        transcriptType: app.transcriptType,
        deliveryMethod: app.deliveryMethod,
        status: app.status,
        amount: app.amount,
        institutionName: app.institutionName,
        purpose: app.purpose,
        createdAt: app.createdAt,
        student: {
          id: app.user.id,
          matriculationNumber: app.user.matriculationNumber,
          firstName: app.user.firstName,
          lastName: app.user.lastName,
          email: app.user.email,
          department: app.user.department,
          graduationYear: app.user.graduationYear,
        },
      })),
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: filteredApplications.length,
        totalRecords: total,
      },
    };
  }

  async updateApplicationStatus(
    applicationId: string,
    updateDto: UpdateApplicationStatusDto,
    adminUserId: string,
    adminRole: UserRole,
  ) {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId, type: ApplicationType.TRANSCRIPT },
      relations: ['user'],
    });

    if (!application) {
      throw new NotFoundException('Transcript application not found');
    }

    // Validate workflow permissions
    this.validateStatusTransition(application.status, updateDto.status, adminRole);

    // Update application
    application.status = updateDto.status;
    if (updateDto.notes) {
      application.notes = application.notes 
        ? `${application.notes}\n\n[${new Date().toISOString()}] ${updateDto.notes}`
        : updateDto.notes;
    }

    // Set processing days based on new status
    if (updateDto.status === ApplicationStatus.EXAMS_RECORDS_PROCESSING) {
      application.processingDays = this.getDefaultProcessingDays(application.transcriptType);
    }

    const savedApplication = await this.applicationRepository.save(application);

    return {
      message: `Application status updated to ${updateDto.status}`,
      application: {
        id: savedApplication.id,
        attn: savedApplication.attn,
        status: savedApplication.status,
        updatedAt: savedApplication.updatedAt,
      },
      nextStep: this.getNextStepForStatus(updateDto.status),
    };
  }

  async forwardApplication(applicationId: string, adminUserId: string, adminRole: UserRole) {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId, type: ApplicationType.TRANSCRIPT },
    });

    if (!application) {
      throw new NotFoundException('Transcript application not found');
    }

    let newStatus: ApplicationStatus;
    let nextDepartment: string;

    switch (adminRole) {
      case UserRole.REGISTRAR:
        if (application.status !== ApplicationStatus.PROCESSING) {
          throw new BadRequestException('Application must be in processing status to forward from Registrar');
        }
        newStatus = ApplicationStatus.DEPUTY_REGISTRAR_REVIEW;
        nextDepartment = 'Deputy Registrar (Academic Affairs)';
        break;
      
      case UserRole.DEPUTY_REGISTRAR:
        if (application.status !== ApplicationStatus.REGISTRAR_REVIEW) {
          throw new BadRequestException('Application must be approved by Registrar first');
        }
        newStatus = ApplicationStatus.EXAMS_RECORDS_PROCESSING;
        nextDepartment = 'Exams & Records Unit';
        break;
      
      default:
        throw new ForbiddenException('Only Registrar and Deputy Registrar can forward applications');
    }

    application.status = newStatus;
    application.notes = application.notes 
      ? `${application.notes}\n\n[${new Date().toISOString()}] Forwarded to ${nextDepartment}`
      : `Forwarded to ${nextDepartment}`;

    await this.applicationRepository.save(application);

    return {
      message: `Application forwarded to ${nextDepartment}`,
      newStatus,
      nextDepartment,
    };
  }

  async markAsReady(applicationId: string, adminUserId: string, adminRole: UserRole) {
    if (adminRole !== UserRole.EXAMS_RECORDS && adminRole !== UserRole.ADMIN) {
      throw new ForbiddenException('Only Exams & Records staff can mark applications as ready');
    }

    const application = await this.applicationRepository.findOne({
      where: { id: applicationId, type: ApplicationType.TRANSCRIPT },
      relations: ['user'],
    });

    if (!application) {
      throw new NotFoundException('Transcript application not found');
    }

    if (application.status !== ApplicationStatus.EXAMS_RECORDS_PROCESSING) {
      throw new BadRequestException('Application must be in Exams & Records processing to mark as ready');
    }

    // Determine final status based on delivery method
    let finalStatus: ApplicationStatus;
    if (application.deliveryMethod === TranscriptDeliveryMethod.PICKUP) {
      finalStatus = ApplicationStatus.AVAILABLE_FOR_PICKUP;
    } else if (application.deliveryMethod === TranscriptDeliveryMethod.COURIER) {
      finalStatus = ApplicationStatus.DISPATCHED;
    } else {
      finalStatus = ApplicationStatus.COMPLETED;
    }

    application.status = finalStatus;
    application.notes = application.notes 
      ? `${application.notes}\n\n[${new Date().toISOString()}] Transcript processed and ready`
      : 'Transcript processed and ready';

    await this.applicationRepository.save(application);

    return {
      message: 'Transcript marked as ready',
      status: finalStatus,
      deliveryInfo: this.getDeliveryInfo(application),
    };
  }

  private validateStatusTransition(currentStatus: ApplicationStatus, newStatus: ApplicationStatus, adminRole: UserRole) {
    const allowedTransitions = {
      [UserRole.REGISTRAR]: {
        [ApplicationStatus.PROCESSING]: [ApplicationStatus.REGISTRAR_REVIEW, ApplicationStatus.REJECTED],
      },
      [UserRole.DEPUTY_REGISTRAR]: {
        [ApplicationStatus.REGISTRAR_REVIEW]: [ApplicationStatus.DEPUTY_REGISTRAR_REVIEW, ApplicationStatus.REJECTED],
      },
      [UserRole.EXAMS_RECORDS]: {
        [ApplicationStatus.DEPUTY_REGISTRAR_REVIEW]: [ApplicationStatus.EXAMS_RECORDS_PROCESSING],
        [ApplicationStatus.EXAMS_RECORDS_PROCESSING]: [
          ApplicationStatus.READY,
          ApplicationStatus.AVAILABLE_FOR_PICKUP,
          ApplicationStatus.DISPATCHED,
          ApplicationStatus.COMPLETED,
        ],
      },
      [UserRole.ADMIN]: {
        // Admin can transition between any statuses
        [ApplicationStatus.PROCESSING]: [ApplicationStatus.REGISTRAR_REVIEW, ApplicationStatus.REJECTED],
        [ApplicationStatus.REGISTRAR_REVIEW]: [ApplicationStatus.DEPUTY_REGISTRAR_REVIEW, ApplicationStatus.REJECTED],
        [ApplicationStatus.DEPUTY_REGISTRAR_REVIEW]: [ApplicationStatus.EXAMS_RECORDS_PROCESSING, ApplicationStatus.REJECTED],
        [ApplicationStatus.EXAMS_RECORDS_PROCESSING]: [
          ApplicationStatus.READY,
          ApplicationStatus.AVAILABLE_FOR_PICKUP,
          ApplicationStatus.DISPATCHED,
          ApplicationStatus.COMPLETED,
        ],
      },
    };

    const roleTransitions = allowedTransitions[adminRole];
    if (!roleTransitions || !roleTransitions[currentStatus] || !roleTransitions[currentStatus].includes(newStatus)) {
      throw new ForbiddenException(
        `${adminRole} cannot transition application from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  private getNextStepForStatus(status: ApplicationStatus): string {
    const nextSteps = {
      [ApplicationStatus.REGISTRAR_REVIEW]: 'Application is under review by the Registrar',
      [ApplicationStatus.DEPUTY_REGISTRAR_REVIEW]: 'Application forwarded to Deputy Registrar (Academic Affairs)',
      [ApplicationStatus.EXAMS_RECORDS_PROCESSING]: 'Application is being processed by Exams & Records Unit',
      [ApplicationStatus.READY]: 'Transcript is ready',
      [ApplicationStatus.AVAILABLE_FOR_PICKUP]: 'Transcript is available for pickup at the Registry',
      [ApplicationStatus.DISPATCHED]: 'Transcript has been dispatched via courier',
      [ApplicationStatus.COMPLETED]: 'Application completed successfully',
      [ApplicationStatus.REJECTED]: 'Application has been rejected',
    };

    return nextSteps[status] || 'Status updated';
  }

  private getDeliveryInfo(application: Application) {
    switch (application.deliveryMethod) {
      case TranscriptDeliveryMethod.EMAIL:
        return {
          method: 'Email',
          recipient: application.recipientEmail || application.institutionEmail,
          note: 'Transcript will be sent electronically',
        };
      case TranscriptDeliveryMethod.PICKUP:
        return {
          method: 'On-Campus Pickup',
          location: 'Registry Office, UNIOSUN',
          note: 'Student will be notified when ready for collection',
        };
      case TranscriptDeliveryMethod.COURIER:
        return {
          method: 'Courier Delivery',
          address: application.institutionAddress,
          note: 'Tracking number will be provided once dispatched',
        };
      default:
        return null;
    }
  }

  // Document Upload Integration
  async uploadDocuments(uploadData: any, userId: string) {
    // In a real implementation, this would handle file uploads
    // For now, return mock response
    const documents = [
      {
        id: `doc-${Date.now()}-1`,
        filename: 'passport_photo.jpg',
        originalName: uploadData.files?.[0]?.originalName || 'passport_photo.jpg',
        mimeType: 'image/jpeg',
        size: 2048576,
        uploadedAt: new Date().toISOString(),
      },
      {
        id: `doc-${Date.now()}-2`,
        filename: 'birth_certificate.pdf',
        originalName: uploadData.files?.[1]?.originalName || 'birth_certificate.pdf',
        mimeType: 'application/pdf',
        size: 1024768,
        uploadedAt: new Date().toISOString(),
      },
    ];

    return {
      message: 'Documents uploaded successfully',
      documents,
      nextStep: 'Proceed to complete your transcript application',
    };
  }

  // Payment Processing Integration
  async initializePayment(applicationId: string, userId: string) {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId, userId, type: ApplicationType.TRANSCRIPT },
    });

    if (!application) {
      throw new NotFoundException('Transcript application not found');
    }

    if (application.status !== ApplicationStatus.PAYMENT_PENDING) {
      throw new BadRequestException('Payment has already been processed for this application');
    }

    // Generate payment reference
    const paymentReference = `TACDRA-PAY-${Date.now()}`;
    const paymentUrl = `https://remita.net/pay/${paymentReference}`;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

    return {
      message: 'Payment initialized successfully',
      paymentInfo: {
        applicationId: application.id,
        attn: application.attn,
        amount: application.amount,
        currency: 'NGN',
        paymentReference,
        paymentUrl,
        expiresAt: expiresAt.toISOString(),
      },
      instructions: [
        'Click the payment link to complete payment',
        'Payment must be completed within 24 hours',
        'Keep your payment reference for tracking',
      ],
    };
  }

  async verifyPayment(applicationId: string, userId: string) {
    const application = await this.applicationRepository.findOne({
      where: { id: applicationId, userId, type: ApplicationType.TRANSCRIPT },
    });

    if (!application) {
      throw new NotFoundException('Transcript application not found');
    }

    // In a real implementation, this would verify with the payment gateway
    // For demo purposes, we'll simulate successful payment
    if (!application.isPaid) {
      application.isPaid = true;
      application.paidAt = new Date();
      application.status = ApplicationStatus.PROCESSING;
      await this.applicationRepository.save(application);
    }

    return {
      message: 'Payment verified successfully',
      paymentStatus: 'successful',
      application: {
        id: application.id,
        attn: application.attn,
        status: application.status,
        isPaid: application.isPaid,
        paidAt: application.paidAt,
      },
      nextSteps: [
        'Your application is now being processed',
        'You will receive email updates on progress',
        `Track your application using ATTN: ${application.attn}`,
      ],
    };
  }

  // Email Notification System (placeholder)
  private async sendEmailNotification(application: Application, type: 'confirmation' | 'status_update' | 'ready') {
    // In a real implementation, this would integrate with an email service
    const emailTemplates = {
      confirmation: {
        subject: `Transcript Application Confirmation - ${application.attn}`,
        body: `Your transcript application has been received and is being processed. ATTN: ${application.attn}`,
      },
      status_update: {
        subject: `Transcript Application Update - ${application.attn}`,
        body: `Your transcript application status has been updated to: ${application.status}`,
      },
      ready: {
        subject: `Transcript Ready - ${application.attn}`,
        body: `Your transcript is ready for ${application.deliveryMethod}. ATTN: ${application.attn}`,
      },
    };

    console.log(`[EMAIL] To: ${application.recipientEmail || 'student@uniosun.edu.ng'}`);
    console.log(`[EMAIL] Subject: ${emailTemplates[type].subject}`);
    console.log(`[EMAIL] Body: ${emailTemplates[type].body}`);
    
    return { sent: true, type, attn: application.attn };
  }
}
