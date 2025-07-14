import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Application } from '../../applications/entities/application.entity';
import { Verification } from '../../verification/entities/verification.entity';

export enum DocumentType {
  TRANSCRIPT = 'transcript',
  CERTIFICATE = 'certificate',
  DIPLOMA = 'diploma',
  ACADEMIC_RECORD = 'academic_record',
  OTHER = 'other',
}

export enum DocumentStatus {
  DRAFT = 'draft',
  GENERATED = 'generated',
  VERIFIED = 'verified',
  DELIVERED = 'delivered',
}

@Entity('documents')
export class Document {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  documentNumber: string;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type: DocumentType;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.DRAFT,
  })
  status: DocumentStatus;

  @Column()
  fileName: string;

  @Column()
  filePath: string;

  @Column()
  mimeType: string;

  @Column()
  fileSize: number;

  @Column({ nullable: true })
  qrCode: string;

  @Column('text', { nullable: true })
  metadata: string; // JSON string for additional data

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Application, (application) => application.documents, {
    nullable: true,
  })
  @JoinColumn({ name: 'applicationId' })
  application: Application;

  @Column({ nullable: true })
  applicationId: string;

  @OneToMany(() => Verification, (verification) => verification.document)
  verifications: Verification[];
}
