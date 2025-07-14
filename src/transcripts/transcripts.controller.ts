import { Controller, Get, Post, Body, Put, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { TranscriptsService } from './transcripts.service';
import { CreateTranscriptApplicationDto } from './dto/create-transcript.dto';
import { UpdateApplicationStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '../users/entities/user.entity';

@ApiTags('transcripts')
@Controller('api/transcripts')
export class TranscriptsController {
  constructor(private readonly transcriptsService: TranscriptsService) {}

  @Post('apply')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Submit a new transcript application',
    description: 'Complete transcript application submission including document validation and payment initialization'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Transcript application created successfully',
    schema: {
      example: {
        message: 'Transcript application submitted successfully',
        application: {
          id: 'uuid-here',
          attn: 'TACDRA25010123456',
          type: 'transcript',
          transcriptType: 'student_copy',
          deliveryMethod: 'email',
          status: 'payment_pending',
          amount: 3000,
          createdAt: '2025-01-07T10:00:00.000Z',
          deliveryDetails: {
            recipientEmail: 'student@example.com',
            recipientName: 'John Doe',
            address: 'Lagos, Nigeria'
          },
          documents: [
            {
              id: 'doc-uuid-1',
              filename: 'passport_photo.jpg',
              uploadedAt: '2025-01-07T09:30:00.000Z'
            }
          ]
        },
        paymentInfo: {
          amount: 3000,
          currency: 'NGN',
          paymentReference: 'TACDRA-PAY-123456',
          paymentUrl: 'https://remita.net/pay/...'
        },
        nextStep: 'Complete payment to finalize your application',
        estimatedProcessingDays: 5
      }
    }
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid application data or missing required documents',
    schema: {
      example: {
        message: 'Validation failed',
        errors: [
          'Required documents not uploaded',
          'Invalid delivery details for courier method'
        ]
      }
    }
  })
  apply(@Body() createTranscriptDto: CreateTranscriptApplicationDto, @Request() req) {
    return this.transcriptsService.apply(createTranscriptDto, req.user.id);
  }

  @Post('upload-documents')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Upload required documents for transcript application',
    description: 'Upload supporting documents like passport photo, previous certificates, etc.'
  })
  @ApiResponse({
    status: 201,
    description: 'Documents uploaded successfully',
    schema: {
      example: {
        message: 'Documents uploaded successfully',
        documents: [
          {
            id: 'doc-uuid-1',
            filename: 'passport_photo.jpg',
            originalName: 'my_passport.jpg',
            mimeType: 'image/jpeg',
            size: 2048576,
            uploadedAt: '2025-01-07T09:30:00.000Z'
          },
          {
            id: 'doc-uuid-2',
            filename: 'birth_certificate.pdf',
            originalName: 'birth_cert.pdf',
            mimeType: 'application/pdf',
            size: 1024768,
            uploadedAt: '2025-01-07T09:31:00.000Z'
          }
        ],
        nextStep: 'Proceed to complete your transcript application'
      }
    }
  })
  uploadDocuments(@Request() req, @Body() uploadData: any) {
    return this.transcriptsService.uploadDocuments(uploadData, req.user.id);
  }

  @Post(':id/payment/initialize')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Initialize payment for transcript application',
    description: 'Generate payment link and reference for the transcript application'
  })
  @ApiResponse({
    status: 200,
    description: 'Payment initialized successfully',
    schema: {
      example: {
        message: 'Payment initialized successfully',
        paymentInfo: {
          applicationId: 'app-uuid-here',
          attn: 'TACDRA25010123456',
          amount: 3000,
          currency: 'NGN',
          paymentReference: 'TACDRA-PAY-123456',
          paymentUrl: 'https://remita.net/pay/TACDRA-PAY-123456',
          expiresAt: '2025-01-07T22:00:00.000Z'
        },
        instructions: [
          'Click the payment link to complete payment',
          'Payment must be completed within 24 hours',
          'Keep your payment reference for tracking'
        ]
      }
    }
  })
  initializePayment(@Param('id') id: string, @Request() req) {
    return this.transcriptsService.initializePayment(id, req.user.id);
  }

  @Post(':id/payment/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Verify payment status for transcript application',
    description: 'Check if payment has been completed and update application status'
  })
  @ApiResponse({
    status: 200,
    description: 'Payment verification completed',
    schema: {
      example: {
        message: 'Payment verified successfully',
        paymentStatus: 'successful',
        application: {
          id: 'app-uuid-here',
          attn: 'TACDRA25010123456',
          status: 'processing',
          isPaid: true,
          paidAt: '2025-01-07T10:15:00.000Z'
        },
        nextSteps: [
          'Your application is now being processed',
          'You will receive email updates on progress',
          'Track your application using ATTN: TACDRA25010123456'
        ]
      }
    }
  })
  verifyPayment(@Param('id') id: string, @Request() req) {
    return this.transcriptsService.verifyPayment(id, req.user.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List all transcript applications for the user' })
  @ApiResponse({
    status: 200,
    description: 'List of user transcript applications',
    schema: {
      example: [{
        id: 'uuid-here',
        attn: 'TACDRA25010123456',
        transcriptType: 'student_copy',
        deliveryMethod: 'email',
        status: 'payment_pending',
        amount: 3000,
        isPaid: false,
        institutionName: null,
        createdAt: '2025-01-07T10:00:00.000Z',
        updatedAt: '2025-01-07T10:00:00.000Z'
      }]
    }
  })
  findAll(@Request() req) {
    return this.transcriptsService.findByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get details/status of a specific application' })
  @ApiResponse({
    status: 200,
    description: 'Detailed transcript application information',
    schema: {
      example: {
        id: 'uuid-here',
        attn: 'TACDRA25010123456',
        transcriptType: 'official_copy',
        deliveryMethod: 'courier',
        status: 'processing',
        amount: 7500,
        isPaid: true,
        purpose: 'Postgraduate application',
        institutionName: 'University of Lagos',
        institutionEmail: 'admissions@unilag.edu.ng',
        institutionAddress: 'Akoka, Lagos State',
        trackingReference: 'UNILAG-PG-2024-001',
        createdAt: '2025-01-07T10:00:00.000Z',
        payments: [],
        documents: []
      }
    }
  })
  findOne(@Param('id') id: string) {
    return this.transcriptsService.findOne(id);
  }

  @Put(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel an application (if allowed)' })
  @ApiResponse({
    status: 200,
    description: 'Application cancelled successfully',
    schema: {
      example: {
        message: 'Transcript application cancelled successfully',
        status: 'rejected'
      }
    }
  })
  cancel(@Param('id') id: string, @Request() req) {
    return this.transcriptsService.cancel(id, req.user.id);
  }

  @Get('track/:attnNumber')
  @ApiOperation({ summary: 'Track application by ATTN number' })
  @ApiResponse({
    status: 200,
    description: 'Application tracking information',
    schema: {
      example: {
        attn: 'TACDRA25010123456',
        transcriptType: 'official_copy',
        deliveryMethod: 'courier',
        status: 'exams_records_processing',
        statusDescription: 'Being processed by Exams & Records Unit',
        isPaid: true,
        amount: 7500,
        institutionName: 'University of Lagos',
        createdAt: '2025-01-07T10:00:00.000Z',
        updatedAt: '2025-01-07T12:00:00.000Z',
        estimatedCompletion: '2025-01-14'
      }
    }
  })
  track(@Param('attnNumber') attnNumber: string) {
    return this.transcriptsService.trackByATTN(attnNumber);
  }

  // Admin endpoints
  @Get('admin/review')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.REGISTRAR, UserRole.DEPUTY_REGISTRAR, UserRole.EXAMS_RECORDS, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get transcript applications for review (Admin only)' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: 200,
    description: 'List of applications for review',
    schema: {
      example: {
        applications: [{
          id: 'uuid-here',
          attn: 'TACDRA25010123456',
          transcriptType: 'official_copy',
          deliveryMethod: 'courier',
          status: 'processing',
          amount: 7500,
          institutionName: 'University of Lagos',
          purpose: 'Postgraduate application',
          createdAt: '2025-01-07T10:00:00.000Z',
          student: {
            matriculationNumber: 'CSC/2020/100',
            firstName: 'John',
            lastName: 'Doe',
            email: 'john.doe@student.uniosun.edu.ng',
            department: 'Computer Science',
            graduationYear: 2024
          }
        }],
        pagination: {
          current: 1,
          total: 3,
          count: 10,
          totalRecords: 25
        }
      }
    }
  })
  getApplicationsForReview(
    @Request() req,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.transcriptsService.getApplicationsForReview(req.user.role, page, limit);
  }

  @Put('admin/:id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.REGISTRAR, UserRole.DEPUTY_REGISTRAR, UserRole.EXAMS_RECORDS, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update application status (Admin only)' })
  @ApiResponse({
    status: 200,
    description: 'Application status updated successfully',
    schema: {
      example: {
        message: 'Application status updated to registrar_review',
        application: {
          id: 'uuid-here',
          attn: 'TACDRA25010123456',
          status: 'registrar_review',
          updatedAt: '2025-01-08T03:00:00.000Z'
        },
        nextStep: 'Application is under review by the Registrar'
      }
    }
  })
  updateStatus(
    @Param('id') id: string,
    @Body() updateDto: UpdateApplicationStatusDto,
    @Request() req,
  ) {
    return this.transcriptsService.updateApplicationStatus(id, updateDto, req.user.id, req.user.role);
  }

  @Put('admin/:id/forward')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.REGISTRAR, UserRole.DEPUTY_REGISTRAR)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Forward application to next department (Registrar/Deputy Registrar only)' })
  @ApiResponse({
    status: 200,
    description: 'Application forwarded successfully',
    schema: {
      example: {
        message: 'Application forwarded to Deputy Registrar (Academic Affairs)',
        newStatus: 'deputy_registrar_review',
        nextDepartment: 'Deputy Registrar (Academic Affairs)'
      }
    }
  })
  forwardApplication(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.transcriptsService.forwardApplication(id, req.user.id, req.user.role);
  }

  @Put('admin/:id/ready')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.EXAMS_RECORDS, UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark transcript as ready (Exams & Records only)' })
  @ApiResponse({
    status: 200,
    description: 'Transcript marked as ready',
    schema: {
      example: {
        message: 'Transcript marked as ready',
        status: 'available_for_pickup',
        deliveryInfo: {
          method: 'On-Campus Pickup',
          location: 'Registry Office, UNIOSUN',
          note: 'Student will be notified when ready for collection'
        }
      }
    }
  })
  markAsReady(
    @Param('id') id: string,
    @Request() req,
  ) {
    return this.transcriptsService.markAsReady(id, req.user.id, req.user.role);
  }
}
