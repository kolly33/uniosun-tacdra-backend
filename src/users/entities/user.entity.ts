import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Application } from '../../applications/entities/application.entity';
import { Verification } from '../../verification/entities/verification.entity';

export enum UserRole {
  STUDENT = 'student',
  ALUMNI = 'alumni',
  ADMIN = 'admin',
  REGISTRAR = 'registrar',
  DEPUTY_REGISTRAR = 'deputy_registrar',
  EXAMS_RECORDS = 'exams_records',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  matriculationNumber: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  phoneNumber: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.STUDENT,
  })
  role: UserRole;

  @Column({ nullable: true })
  graduationYear: number;

  @Column({ nullable: true })
  degree: string;

  @Column({ nullable: true })
  department: string;

  @Column({ nullable: true })
  faculty: string;

  @Column({ default: false })
  isVerified: boolean;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Application, (application) => application.user)
  applications: Application[];

  @OneToMany(() => Verification, (verification) => verification.verifiedBy)
  verifications: Verification[];
}
