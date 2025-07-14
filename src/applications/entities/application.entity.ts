import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { Document } from '../../documents/entities/document.entity';

export enum ApplicationType {
  TRANSCRIPT = 'transcript',
  CERTIFICATE_COPY = 'certificate_copy',
  DOCUMENT_VERIFICATION = 'document_verification',
}

export enum TranscriptType {
  STUDENT_COPY = 'student_copy',
  OFFICIAL_COPY = 'official_copy',
}

export enum TranscriptDeliveryMethod {
  EMAIL = 'email',
  PICKUP = 'pickup',
  COURIER = 'courier',
}

export enum ApplicationStatus {
  PENDING = 'pending',
  PAYMENT_PENDING = 'payment_pending',
  PROCESSING = 'processing',
  REGISTRAR_REVIEW = 'registrar_review',
  DEPUTY_REGISTRAR_REVIEW = 'deputy_registrar_review',
  EXAMS_RECORDS_PROCESSING = 'exams_records_processing',
  READY = 'ready',
  DISPATCHED = 'dispatched',
  AVAILABLE_FOR_PICKUP = 'available_for_pickup',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
}

@Entity('applications')
export class Application {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  attn: string; // Application Tracking Ticket Number

  @BeforeInsert()
  generateATTN() {
    if (!this.attn) {
      // Generate ATTN: TACDRA + Year + Month + Random 6 digits
      const now = new Date();
      const year = now.getFullYear().toString().slice(-2);
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const random = Math.floor(100000 + Math.random() * 900000);
      this.attn = `TACDRA${year}${month}${random}`;
    }
  }

  @Column({
    type: 'enum',
    enum: ApplicationType,
  })
  type: ApplicationType;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({
    type: 'enum',
    enum: TranscriptDeliveryMethod,
  })
  deliveryMethod: TranscriptDeliveryMethod;

  // Transcript specific fields
  @Column({
    type: 'enum',
    enum: TranscriptType,
    nullable: true,
  })
  transcriptType: TranscriptType;

  @Column({ nullable: true })
  recipientEmail: string;

  @Column({ nullable: true })
  institutionName: string;

  @Column({ nullable: true })
  institutionEmail: string;

  @Column('text', { nullable: true })
  institutionAddress: string;

  @Column({ nullable: true })
  trackingReference: string;

  @Column('text', { nullable: true })
  purpose: string;

  @Column('text', { nullable: true })
  recipientName: string;

  @Column('text', { nullable: true })
  recipientAddress: string;

  @Column('text', { nullable: true })
  notes: string;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column({ default: false })
  isPaid: boolean;

  @Column({ nullable: true })
  paidAt: Date;

  @Column({ nullable: true })
  processingDays: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.applications)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @OneToMany(() => Payment, (payment) => payment.application)
  payments: Payment[];

  @OneToMany(() => Document, (document) => document.application)
  documents: Document[];
}
