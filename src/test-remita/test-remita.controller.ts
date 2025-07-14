import { Controller, Post, Body, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RemitaService } from '../payment/remita.service';
import { MockRemitaService } from '../payment/mock-remita.service';
import { 
  InitializeRemitaPaymentDto, 
  VerifyRemitaPaymentDto 
} from '../payment/dto/remita-payment.dto';

@ApiTags('test-remita')
@Controller('test-remita')
export class TestRemitaController {
  constructor(
    private readonly remitaService: RemitaService,
    private readonly mockRemitaService: MockRemitaService,
  ) {}

  @Get('status')
  @ApiOperation({ summary: 'Check Remita service status' })
  @ApiResponse({ status: 200, description: 'Service status retrieved' })
  getStatus() {
    return {
      status: 'Remita service is running',
      timestamp: new Date().toISOString(),
      service: 'UNIOSUN TACDRA Remita Integration'
    };
  }

  @Post('initialize')
  @ApiOperation({ summary: 'Test Remita payment initialization (Real API)' })
  @ApiResponse({ status: 201, description: 'Payment initialized successfully' })
  async testInitialize(@Body() dto: InitializeRemitaPaymentDto) {
    try {
      const result = await this.remitaService.initializePayment(dto);
      return {
        success: true,
        data: result,
        paymentUrl: this.remitaService.getPaymentUrl(result.RRR),
        mode: 'real',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        mode: 'real',
      };
    }
  }

  @Post('initialize-mock')
  @ApiOperation({ summary: 'Test Remita payment initialization (Mock Mode)' })
  @ApiResponse({ status: 201, description: 'Payment initialized successfully with mock' })
  async testInitializeMock(@Body() dto: InitializeRemitaPaymentDto) {
    try {
      const result = await this.mockRemitaService.initializePayment(dto);
      return {
        success: true,
        data: result,
        paymentUrl: this.mockRemitaService.getPaymentUrl(result.RRR),
        mode: 'mock',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        mode: 'mock',
      };
    }
  }

  @Post('verify')
  @ApiOperation({ summary: 'Test Remita payment verification (Real API)' })
  @ApiResponse({ status: 200, description: 'Payment verification completed' })
  async testVerify(@Body() dto: VerifyRemitaPaymentDto) {
    try {
      const result = await this.remitaService.verifyPayment(dto);
      return {
        success: true,
        data: result,
        mode: 'real',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        mode: 'real',
      };
    }
  }

  @Post('verify-mock')
  @ApiOperation({ summary: 'Test Remita payment verification (Mock Mode)' })
  @ApiResponse({ status: 200, description: 'Payment verification completed with mock' })
  async testVerifyMock(@Body() dto: VerifyRemitaPaymentDto) {
    try {
      const result = await this.mockRemitaService.verifyPayment(dto);
      return {
        success: true,
        data: result,
        mode: 'mock',
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        mode: 'mock',
      };
    }
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Test Remita webhook processing (Real API)' })
  @ApiResponse({ status: 200, description: 'Webhook processed' })
  async testWebhook(@Body() payload: any) {
    try {
      const result = await this.remitaService.processWebhook(payload);
      return { ...result, mode: 'real' };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        mode: 'real',
      };
    }
  }

  @Post('webhook-mock')
  @ApiOperation({ summary: 'Test Remita webhook processing (Mock Mode)' })
  @ApiResponse({ status: 200, description: 'Webhook processed with mock' })
  async testWebhookMock(@Body() payload: any) {
    try {
      const result = await this.mockRemitaService.processWebhook(payload);
      return { ...result, mode: 'mock' };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        mode: 'mock',
      };
    }
  }
}
