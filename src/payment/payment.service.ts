import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import { CreatePaymentDto, PaymentStatus, PaymentMethod } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto): Promise<Payment> {
    const payment = this.paymentRepository.create(createPaymentDto);
    return this.paymentRepository.save(payment);
  }

  async findAll(): Promise<Payment[]> {
    return this.paymentRepository.find({
      relations: ['application'],
    });
  }

  async findOne(id: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: ['application'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto): Promise<Payment> {
    const payment = await this.findOne(id);
    Object.assign(payment, updatePaymentDto);
    return this.paymentRepository.save(payment);
  }

  async remove(id: string): Promise<void> {
    const payment = await this.findOne(id);
    await this.paymentRepository.softDelete(id);
  }

  async updateByReference(paymentReference: string, updateData: Partial<Payment>): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentReference },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with reference ${paymentReference} not found`);
    }

    Object.assign(payment, updateData);
    return this.paymentRepository.save(payment);
  }

  async findByReference(paymentReference: string): Promise<Payment> {
    const payment = await this.paymentRepository.findOne({
      where: { paymentReference },
      relations: ['application'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with reference ${paymentReference} not found`);
    }

    return payment;
  }

  async initiatePayment(applicationId: string, amount: number): Promise<any> {
    // This would integrate with Remita payment gateway
    const transactionId = `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const paymentDto: CreatePaymentDto = {
      applicationId,
      amount,
      method: PaymentMethod.REMITA,
      paymentReference: transactionId,
      transactionId: transactionId,
      status: PaymentStatus.PENDING,
    };

    const payment = await this.create(paymentDto);

    return {
      paymentUrl: `https://remitademo.net/remita/ecomm/finalize.reg?transactionId=${transactionId}`,
      transactionId,
      payment,
    };
  }
}
