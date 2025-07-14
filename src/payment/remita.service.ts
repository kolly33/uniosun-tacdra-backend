import { Injectable, Logger, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import * as crypto from 'crypto';
import { 
  InitializeRemitaPaymentDto, 
  RemitaInitializeResponse, 
  RemitaVerificationResponse,
  VerifyRemitaPaymentDto 
} from './dto/remita-payment.dto';

@Injectable()
export class RemitaService {
  private readonly logger = new Logger(RemitaService.name);
  private readonly baseUrl: string;
  private readonly merchantId: string;
  private readonly apiKey: string;
  private readonly serviceTypeId: string;
  private readonly defaultDescription = 'UNIOSUN TACDRA Payment';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    // Initialize Remita configuration
    this.baseUrl = this.configService.get<string>('REMITA_BASE_URL') || 'https://remitademo.net';
    this.merchantId = this.configService.get<string>('REMITA_MERCHANT_ID');
    this.apiKey = this.configService.get<string>('REMITA_API_KEY');
    this.serviceTypeId = this.configService.get<string>('REMITA_SERVICE_TYPE_ID');

    // Validate configuration and log for debugging
    if (!this.merchantId || !this.apiKey || !this.serviceTypeId) {
      this.logger.error('Remita configuration missing:', {
        merchantId: !!this.merchantId,
        apiKey: !!this.apiKey,
        serviceTypeId: !!this.serviceTypeId,
        baseUrl: this.baseUrl
      });
      throw new Error('Remita credentials are missing or incomplete in environment configuration');
    }

    this.logger.log('Remita service initialized:', {
      baseUrl: this.baseUrl,
      merchantId: this.merchantId,
      serviceTypeId: this.serviceTypeId
    });
  }

  private generateHash(data: string): string {
    return crypto.createHash('sha512').update(data).digest('hex');
  }

  private generateOrderRef(): string {
    return `UNIOSUN_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  async initializePayment(dto: InitializeRemitaPaymentDto): Promise<RemitaInitializeResponse> {
    try {
      const orderRef = this.generateOrderRef();
      const payload = {
        serviceTypeId: this.serviceTypeId,
        amount: dto.amount,
        orderId: orderRef,
        payerName: dto.payerName,
        payerEmail: dto.payerEmail,
        payerPhone: dto.payerPhone,
        description: dto.description || `${this.defaultDescription} for Application ${dto.applicationId}`,
      };

      const hash = this.generateHash(`${this.merchantId}${this.serviceTypeId}${orderRef}${dto.amount}${this.apiKey}`);
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `remitaConsumerKey=${this.merchantId},remitaConsumerToken=${hash}`,
      };

      this.logger.log(`Initializing Remita payment for order: ${orderRef}`);
      this.logger.log(`Using endpoint: ${this.baseUrl}/remita/ecomm/${this.merchantId}/init.reg`);
      this.logger.log(`Payload:`, payload);
      this.logger.log(`Headers:`, headers);

      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/remita/ecomm/${this.merchantId}/init.reg`,
          payload,
          { headers }
        )
      );

      if (response.data.statuscode === '025') {
        this.logger.log(`Remita payment initialized successfully. RRR: ${response.data.RRR}`);
        return {
          statuscode: response.data.statuscode,
          status: response.data.status,
          RRR: response.data.RRR,
          amount: response.data.amount,
          orderRef,
        };
      } else {
        this.logger.error(`Remita initialization failed: ${response.data.status}`);
        throw new BadRequestException(`Payment initialization failed: ${response.data.status}`);
      }

    } catch (error) {
      this.logger.error(`Error initializing Remita payment: ${error.message}`);
      if (error instanceof BadRequestException) throw error;
      throw new InternalServerErrorException('Failed to initialize payment');
    }
  }

  async verifyPayment(dto: VerifyRemitaPaymentDto): Promise<RemitaVerificationResponse> {
    try {
      const hash = this.generateHash(`${dto.rrr}${this.apiKey}${this.merchantId}`);
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `remitaConsumerKey=${this.merchantId},remitaConsumerToken=${hash}`,
      };

      this.logger.log(`Verifying Remita payment for RRR: ${dto.rrr}`);

      const response: AxiosResponse<any> = await firstValueFrom(
        this.httpService.get(
          `${this.baseUrl}/remita/ecomm/${this.merchantId}/${dto.rrr}/${hash}/status.reg`,
          { headers }
        )
      );

      this.logger.log(`Remita verification response: ${JSON.stringify(response.data)}`);

      return {
        status: response.data.status,
        message: response.data.message || 'Payment verification completed',
        amount: response.data.amount,
        RRR: response.data.RRR || dto.rrr,
        transactiontime: response.data.transactiontime,
        paymentDate: response.data.paymentDate,
        channel: response.data.channel,
      };

    } catch (error) {
      this.logger.error(`Error verifying Remita payment: ${error.message}`);
      throw new InternalServerErrorException('Failed to verify payment');
    }
  }

  getPaymentUrl(rrr: string): string {
    const hash = this.generateHash(`${this.merchantId}${rrr}${this.apiKey}`);
    return `${this.baseUrl}/remita/ecomm/finalize.reg?merchantId=${this.merchantId}&RRR=${rrr}&hash=${hash}`;
  }

  // NOTE: This signature validation is hypothetical — confirm from Remita before use!
  validateWebhookSignature(payload: any, signature: string): boolean {
    try {
      const expectedSignature = this.generateHash(JSON.stringify(payload) + this.apiKey);
      return expectedSignature === signature;
    } catch (error) {
      this.logger.error(`Error validating webhook signature: ${error.message}`);
      return false;
    }
  }

  async processWebhook(payload: any): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log(`Processing Remita webhook: ${JSON.stringify(payload)}`);

      if (!payload.rrr || !payload.status) {
        throw new BadRequestException('Invalid webhook payload');
      }

      return {
        success: true,
        message: 'Webhook processed successfully',
      };

    } catch (error) {
      this.logger.error(`Error processing Remita webhook: ${error.message}`);
      return {
        success: false,
        message: error.message,
      };
    }
  }
}
