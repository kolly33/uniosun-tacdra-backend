import { IsNotEmpty, IsNumber, IsString, IsEmail, IsOptional } from 'class-validator';

export class InitializeRemitaPaymentDto {
  @IsNotEmpty()
  @IsString()
  applicationId: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsString()
  payerName: string;

  @IsNotEmpty()
  @IsEmail()
  payerEmail: string;

  @IsNotEmpty()
  @IsString()
  payerPhone: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class RemitaWebhookDto {
  @IsNotEmpty()
  @IsString()
  rrr: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  paymentDate?: string;

  @IsOptional()
  @IsString()
  channel?: string;
}

export class VerifyRemitaPaymentDto {
  @IsNotEmpty()
  @IsString()
  rrr: string;
}

export interface RemitaInitializeResponse {
  statuscode: string;
  status: string;
  RRR: string;
  amount: string;
  orderRef: string;
}

export interface RemitaVerificationResponse {
  status: string;
  message: string;
  amount: string;
  RRR: string;
  transactiontime: string;
  paymentDate: string;
  channel: string;
}
