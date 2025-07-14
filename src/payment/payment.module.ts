import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { RemitaService } from './remita.service';
import { Payment } from './entities/payment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Payment]),
    HttpModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, RemitaService],
  exports: [PaymentService, RemitaService],
})
export class PaymentModule {}
