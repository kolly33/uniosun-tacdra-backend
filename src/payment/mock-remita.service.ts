import { Injectable, Logger } from '@nestjs/common';
import { 
  InitializeRemitaPaymentDto, 
  RemitaInitializeResponse, 
  RemitaVerificationResponse,
  VerifyRemitaPaymentDto 
} from './dto/remita-payment.dto';

@Injectable()
export class MockRemitaService {
  private readonly logger = new Logger('MockRemitaService');

  private generateOrderRef(): string {
    return `UNIOSUN_${Date.now()}_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
  }

  private generateRRR(): string {
    // Generate a 12-digit RRR (Remita Retrieval Reference)
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  }

  async initializePayment(dto: InitializeRemitaPaymentDto): Promise<RemitaInitializeResponse> {
    this.logger.log(`[MOCK] Initializing payment for amount: ₦${dto.amount}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const orderRef = this.generateOrderRef();
    const rrr = this.generateRRR();
    
    // Mock successful response (Remita status code 025 means success)
    const response: RemitaInitializeResponse = {
      statuscode: '025',
      status: 'success',
      RRR: rrr,
      amount: dto.amount.toString(),
      orderRef,
    };
    
    this.logger.log(`[MOCK] Payment initialized successfully. RRR: ${rrr}, Order: ${orderRef}`);
    return response;
  }

  async verifyPayment(dto: VerifyRemitaPaymentDto): Promise<RemitaVerificationResponse> {
    this.logger.log(`[MOCK] Verifying payment for RRR: ${dto.rrr}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulate different payment statuses
    const statuses = ['01', '02', '00']; // 01=successful, 02=pending, 00=failed
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    
    const response: RemitaVerificationResponse = {
      status: randomStatus,
      message: this.getStatusMessage(randomStatus),
      amount: '15000',
      RRR: dto.rrr,
      transactiontime: new Date().toISOString(),
      paymentDate: randomStatus === '01' ? new Date().toISOString() : undefined,
      channel: randomStatus === '01' ? 'BANK_BRANCH' : undefined,
    };
    
    this.logger.log(`[MOCK] Payment verification completed. Status: ${randomStatus} (${response.message})`);
    return response;
  }

  private getStatusMessage(status: string): string {
    switch (status) {
      case '01':
        return 'Transaction Successful';
      case '02':
        return 'Transaction Pending';
      case '00':
        return 'Transaction Failed';
      default:
        return 'Unknown Status';
    }
  }

  getPaymentUrl(rrr: string): string {
    // Mock payment URL for demo purposes
    return `https://remitademo.net/remita/ecomm/finalize.reg?RRR=${rrr}&mockMode=true`;
  }

  validateWebhookSignature(payload: any, signature: string): boolean {
    // For mock purposes, always return true
    this.logger.log(`[MOCK] Validating webhook signature - Always valid in mock mode`);
    return true;
  }

  async processWebhook(payload: any): Promise<{ success: boolean; message: string }> {
    this.logger.log(`[MOCK] Processing webhook: ${JSON.stringify(payload)}`);
    
    // Mock successful webhook processing
    return {
      success: true,
      message: 'Mock webhook processed successfully',
    };
  }
}
