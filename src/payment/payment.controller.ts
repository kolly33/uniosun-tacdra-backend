import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { RemitaService } from './remita.service';
import {
  InitializeRemitaPaymentDto,
  RemitaWebhookDto,
  VerifyRemitaPaymentDto,
} from './dto/remita-payment.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaymentMethod, PaymentStatus } from './entities/payment.entity';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly remitaService: RemitaService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a payment record' })
  @ApiResponse({ status: 201, description: 'Payment created successfully.' })
  create(@Body() createPaymentDto: CreatePaymentDto) {
    return this.paymentService.create(createPaymentDto);
  }

  @Post('remita/initialize')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initialize payment with Remita' })
  @ApiResponse({ status: 201, description: 'Payment initialized successfully.' })
  async initializeRemitaPayment(@Body() dto: InitializeRemitaPaymentDto) {
    try {
      const result = await this.remitaService.initializePayment(dto);

      // Create payment record in database
      const paymentDto: CreatePaymentDto = {
        applicationId: dto.applicationId,
        amount: dto.amount,
        method: PaymentMethod.REMITA,
        paymentReference: result.RRR,
        transactionId: result.orderRef,
        status: PaymentStatus.PENDING,
      };

      await this.paymentService.create(paymentDto);

      return {
        ...result,
        paymentUrl: this.remitaService.getPaymentUrl(result.RRR),
      };
    } catch (error) {
      throw new BadRequestException('Remita Payment Initialization Failed');
    }
  }

  @Post('remita/verify')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Remita payment status' })
  @ApiResponse({ status: 200, description: 'Payment verification completed.' })
  async verifyRemitaPayment(@Body() dto: VerifyRemitaPaymentDto) {
    const result = await this.remitaService.verifyPayment(dto);

    await this.paymentService.updateByReference(dto.rrr, {
      status: this.getPaymentStatus(result.status),
      paidAt: result.paymentDate ? new Date(result.paymentDate) : null,
    });

    return result;
  }

  @Post('remita/webhook')
  @ApiOperation({ summary: 'Handle Remita webhook notifications' })
  @ApiResponse({ status: 200, description: 'Webhook processed successfully.' })
  async handleRemitaWebhook(@Body() dto: RemitaWebhookDto) {
    const result = await this.remitaService.processWebhook(dto);

    if (result.success && dto.rrr) {
      await this.paymentService.updateByReference(dto.rrr, {
        status: this.getPaymentStatus(dto.status),
        paidAt: dto.paymentDate ? new Date(dto.paymentDate) : new Date(),
      });
    }

    return result;
  }

  @Post('initiate')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Initiate payment for application (legacy)' })
  @ApiResponse({ status: 201, description: 'Payment initiated successfully.' })
  initiatePayment(@Body() initiatePaymentDto: { applicationId: string; amount: number }) {
    return this.paymentService.initiatePayment(
      initiatePaymentDto.applicationId,
      initiatePaymentDto.amount,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all payments' })
  @ApiResponse({ status: 200, description: 'Payments retrieved successfully.' })
  findAll() {
    return this.paymentService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiResponse({ status: 200, description: 'Payment retrieved successfully.' })
  findOne(@Param('id') id: string) {
    return this.paymentService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update payment' })
  @ApiResponse({ status: 200, description: 'Payment updated successfully.' })
  update(@Param('id') id: string, @Body() updatePaymentDto: UpdatePaymentDto) {
    return this.paymentService.update(id, updatePaymentDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete payment' })
  @ApiResponse({ status: 200, description: 'Payment deleted successfully.' })
  remove(@Param('id') id: string) {
    return this.paymentService.remove(id);
  }

  /**
   * Utility method to determine payment status
   */
  private getPaymentStatus(status: string): PaymentStatus {
    return status?.toLowerCase() === 'success' || status === '01'
      ? PaymentStatus.SUCCESS
      : PaymentStatus.FAILED;
  }
}
