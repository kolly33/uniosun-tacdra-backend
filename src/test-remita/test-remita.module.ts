import { Module } from '@nestjs/common';
import { TestRemitaController } from './test-remita.controller';
import { PaymentModule } from '../payment/payment.module';
import { MockRemitaService } from '../payment/mock-remita.service';

@Module({
  imports: [PaymentModule],
  controllers: [TestRemitaController],
  providers: [MockRemitaService],
})
export class TestRemitaModule {}
