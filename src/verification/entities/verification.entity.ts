import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Document } from '../../documents/entities/document.entity';
import { User } from '../../users/entities/user.entity';

export enum VerificationStatus {
  PENDING = 'pending',
  VERIFIED = 'verified',
  INVALID = 'invalid',
  EXPIRED = 'expired',
}

export enum VerificationMethod {
  QR_CODE = 'qr_code',
  MANUAL = 'manual',
  DOCUMENT_UPLOAD = 'document_upload',
}

@Entity('verifications')
export class Verification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  verificationId: string;

  @Column({
    type: 'enum',
    enum: VerificationMethod,
  })
  method: VerificationMethod;

  @Column({
    type: 'enum',
    enum: VerificationStatus,
    default: VerificationStatus.PENDING,
  })
  status: VerificationStatus;

  @Column({ nullable: true })
  requestedBy: string; // Name or organization requesting verification

  @Column({ nullable: true })
  requestedByEmail: string;

  @Column('text', { nullable: true })
  verificationDetails: string; // JSON string for additional verification data

  @Column('text', { nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  verifiedAt: Date;

  @ManyToOne(() => Document, (document) => document.verifications)
  @JoinColumn({ name: 'documentId' })
  document: Document;

  @Column({ nullable: true })
  documentId: string;

  @ManyToOne(() => User, (user) => user.verifications, { nullable: true })
  @JoinColumn({ name: 'verifiedById' })
  verifiedBy: User;

  @Column({ nullable: true })
  verifiedById: string;
}
