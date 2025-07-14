import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';

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

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  transactionId: string;

  @Column({ nullable: true })
  remitaTransactionId: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.PENDING,
  })
  status: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMethod,
    default: PaymentMethod.REMITA,
  })
  method: PaymentMethod;

  @Column('text', { nullable: true })
  paymentReference: string;

  @Column('text', { nullable: true })
  paymentGatewayResponse: string; // JSON string

  @Column({ nullable: true })
  paidAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Application, (application) => application.payments)
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @Column()
  applicationId: string;
}
