import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, ValidateIf } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TranscriptType, TranscriptDeliveryMethod } from '../../applications/entities/application.entity';

export class CreateTranscriptApplicationDto {
  @ApiProperty({
    enum: TranscriptType,
    description: 'Type of transcript to apply for',
    example: TranscriptType.STUDENT_COPY,
  })
  @IsEnum(TranscriptType)
  @IsNotEmpty()
  transcriptType: TranscriptType;

  @ApiProperty({
    enum: TranscriptDeliveryMethod,
    description: 'Delivery method for the transcript',
    example: TranscriptDeliveryMethod.EMAIL,
  })
  @IsEnum(TranscriptDeliveryMethod)
  @IsNotEmpty()
  deliveryMethod: TranscriptDeliveryMethod;

  @ApiPropertyOptional({
    description: 'Purpose of the transcript application',
    example: 'Postgraduate application to University of Lagos',
  })
  @IsOptional()
  @IsString()
  purpose?: string;

  @ApiPropertyOptional({
    description: 'Additional notes or special instructions',
    example: 'Urgent processing needed for admission deadline',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  // Student Copy - Email delivery fields
  @ApiPropertyOptional({
    description: 'Recipient email address (required for student copy email delivery)',
    example: 'john.doe@student.uniosun.edu.ng',
  })
  @ValidateIf(o => o.transcriptType === TranscriptType.STUDENT_COPY && o.deliveryMethod === TranscriptDeliveryMethod.EMAIL)
  @IsEmail()
  @IsNotEmpty()
  recipientEmail?: string;

  // Official Copy fields
  @ApiPropertyOptional({
    description: 'Institution name (required for official copy)',
    example: 'University of Lagos',
  })
  @ValidateIf(o => o.transcriptType === TranscriptType.OFFICIAL_COPY)
  @IsString()
  @IsNotEmpty()
  institutionName?: string;

  @ApiPropertyOptional({
    description: 'Institution email address (required for official copy)',
    example: 'admissions@unilag.edu.ng',
  })
  @ValidateIf(o => o.transcriptType === TranscriptType.OFFICIAL_COPY)
  @IsEmail()
  @IsNotEmpty()
  institutionEmail?: string;

  @ApiPropertyOptional({
    description: 'Institution address (required for courier delivery of official copy)',
    example: 'University of Lagos, Akoka, Lagos State, Nigeria',
  })
  @ValidateIf(o => o.transcriptType === TranscriptType.OFFICIAL_COPY && o.deliveryMethod === TranscriptDeliveryMethod.COURIER)
  @IsString()
  @IsNotEmpty()
  institutionAddress?: string;

  @ApiPropertyOptional({
    description: 'Tracking ID or reference number from the institution',
    example: 'UNILAG-PG-2024-001',
  })
  @ValidateIf(o => o.transcriptType === TranscriptType.OFFICIAL_COPY)
  @IsOptional()
  @IsString()
  trackingReference?: string;

  // Document Upload Support
  @ApiPropertyOptional({
    description: 'Array of uploaded document IDs (required supporting documents)',
    example: ['doc-uuid-1', 'doc-uuid-2'],
    type: [String],
  })
  @IsOptional()
  @IsString({ each: true })
  documentIds?: string[];

  // Courier Delivery Details
  @ApiPropertyOptional({
    description: 'Recipient name for courier delivery',
    example: 'John Doe',
  })
  @ValidateIf(o => o.deliveryMethod === TranscriptDeliveryMethod.COURIER)
  @IsString()
  @IsNotEmpty()
  recipientName?: string;

  @ApiPropertyOptional({
    description: 'Full delivery address for courier service',
    example: '123 Main Street, Victoria Island, Lagos State, Nigeria',
  })
  @ValidateIf(o => o.deliveryMethod === TranscriptDeliveryMethod.COURIER)
  @IsString()
  @IsNotEmpty()
  recipientAddress?: string;

  @ApiPropertyOptional({
    description: 'Contact phone number for courier delivery',
    example: '+2348012345678',
  })
  @ValidateIf(o => o.deliveryMethod === TranscriptDeliveryMethod.COURIER)
  @IsString()
  @IsNotEmpty()
  recipientPhone?: string;
}
