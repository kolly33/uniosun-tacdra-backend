import { IsEmail, IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'jane.smith@uniosun.edu.ng',
    description: 'Email address for login'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description: 'User password'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class StudentLoginDto {
  @ApiProperty({ 
    description: 'Student matriculation number',
    example: 'CSC/2020/001'
  })
  @IsString()
  @IsNotEmpty()
  matriculationNumber: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Account password'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class StaffLoginDto {
  @ApiProperty({ 
    description: 'Staff email address',
    example: 'registrar@uniosun.edu.ng'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'AdminPass123!',
    description: 'Account password'
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDto {
  @ApiProperty({
    example: 'CSC/2020/100',
    description: 'Student matriculation number in format XXX/YYYY/NNN'
  })
  @IsString()
  @IsNotEmpty()
  matriculationNumber: string;

  @ApiProperty({
    example: 'John',
    description: 'Student first name'
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'Student last name'
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'john.doe.100@student.uniosun.edu.ng',
    description: 'Valid university email address'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'Password123!',
    description: 'Password with minimum 8 characters'
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '+2348123456789',
    description: 'Nigerian phone number with country code'
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ 
    example: 2024,
    description: 'Year of graduation',
    required: false 
  })
  @IsOptional()
  @IsNumber()
  graduationYear?: number;

  @ApiProperty({ 
    example: 'B.Sc Computer Science',
    description: 'Full degree name',
    required: false 
  })
  @IsOptional()
  @IsString()
  degree?: string;

  @ApiProperty({ 
    example: 'Computer Science',
    description: 'Department name',
    required: false 
  })
  @IsOptional()
  @IsString()
  department?: string;

  @ApiProperty({ 
    example: 'Computing and Information Technology',
    description: 'Faculty name',
    required: false 
  })
  @IsOptional()
  @IsString()
  faculty?: string;
}

export class AdminRegisterDto {
  @ApiProperty({
    example: 'Jane',
    description: 'Staff first name'
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    example: 'Smith',
    description: 'Staff last name'
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    example: 'deputy.registrar@uniosun.edu.ng',
    description: 'Staff email address'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'AdminSecure123!',
    description: 'Strong password for admin account'
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    example: '+2348087654321',
    description: 'Staff phone number'
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({ 
    enum: ['admin', 'registrar', 'deputy_registrar', 'exams_records'],
    example: 'deputy_registrar',
    description: 'Admin role for the user'
  })
  @IsString()
  @IsNotEmpty()
  role: string;

  @ApiProperty({ 
    example: 'Academic Affairs',
    description: 'Department or unit (optional)',
    required: false 
  })
  @IsOptional()
  @IsString()
  department?: string;
}
