import { IsNotEmpty, IsString, IsNumber, IsEnum, IsOptional, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentStatus {
  PENDING = 'pending',
  SUCCESS = 'success',
  FAILED = 'failed',
  REFUNDED = 'refunded',
}

export enum PaymentMethod {
  REMITA = 'remita',
  BANK_TRANSFER = 'bank_transfer',
  CARD = 'card',
}

export class CreatePaymentDto {
  @ApiProperty({ description: 'Application ID' })
  @IsNotEmpty()
  @IsString()
  applicationId: string;

  @ApiProperty({ description: 'Payment amount', example: 5000 })
  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @ApiProperty({ 
    description: 'Payment method', 
    enum: PaymentMethod,
    example: PaymentMethod.REMITA 
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiProperty({ description: 'Payment reference/transaction ID', required: false })
  @IsOptional()
  @IsString()
  paymentReference?: string;

  @ApiProperty({ description: 'Transaction ID', required: false })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiProperty({ 
    description: 'Payment status', 
    enum: PaymentStatus,
    example: PaymentStatus.PENDING,
    required: false 
  })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({ description: 'Payment date', required: false })
  @IsOptional()
  @IsDateString()
  paidAt?: Date;
}
