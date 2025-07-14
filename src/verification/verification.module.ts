import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerificationService } from './verification.service';
import { VerificationController } from './verification.controller';
import { Verification } from './entities/verification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Verification])],
  controllers: [VerificationController],
  providers: [VerificationService],
  exports: [VerificationService],
})
export class VerificationModule {}
