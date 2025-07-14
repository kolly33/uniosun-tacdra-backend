import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Put,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto, AdminRegisterDto, StudentLoginDto, StaffLoginDto } from './dto/auth.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user (student, admin, etc.)' })
  @ApiBody({ type: RegisterDto })
  async signup(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('admin/signup')
  @ApiOperation({ summary: 'Register a new admin user (registrar, deputy_registrar, exams_records)' })
  @ApiBody({ type: AdminRegisterDto })
  async adminSignup(@Body() adminRegisterDto: AdminRegisterDto) {
    return this.authService.registerAdmin(adminRegisterDto);
  }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  @ApiOperation({ summary: 'User login (deprecated - use student/login or staff/login)' })
  @ApiBody({ type: LoginDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('student/login')
  @ApiOperation({ summary: 'Student login with matriculation number' })
  @ApiBody({ type: StudentLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Student login successful',
    schema: {
      example: {
        access_token: 'jwt-token-here',
        user: {
          id: 'uuid-here',
          email: 'student@student.uniosun.edu.ng',
          firstName: 'John',
          lastName: 'Doe',
          matriculationNumber: 'CSC/2020/001',
          role: 'student',
          isVerified: true
        }
      }
    }
  })
  async studentLogin(@Body() studentLoginDto: StudentLoginDto) {
    return this.authService.studentLogin(studentLoginDto.matriculationNumber, studentLoginDto.password);
  }

  @Post('staff/login')
  @ApiOperation({ summary: 'Staff login with email address' })
  @ApiBody({ type: StaffLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Staff login successful',
    schema: {
      example: {
        access_token: 'jwt-token-here',
        user: {
          id: 'uuid-here',
          email: 'registrar@uniosun.edu.ng',
          firstName: 'Jane',
          lastName: 'Smith',
          matriculationNumber: 'STAFF/2025/ABC123',
          role: 'registrar',
          isVerified: true
        }
      }
    }
  })
  async staffLogin(@Body() staffLoginDto: StaffLoginDto) {
    return this.authService.staffLogin(staffLoginDto.email, staffLoginDto.password);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'User logout' })
  async logout(@Request() req) {
    return this.authService.logout(req.user);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Body() body: { email: string }) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password' })
  async resetPassword(@Body() body: { token: string; password: string }) {
    return this.authService.resetPassword(body.token, body.password);
  }

  @Get('verify-matriculation/:matriculationNumber')
  @ApiOperation({ summary: 'Verify if matriculation number exists in the system' })
  @ApiParam({ name: 'matriculationNumber', description: 'Matriculation number to verify', example: 'CSC/2020/100' })
  @ApiResponse({ status: 200, description: 'Matriculation number verification result' })
  async verifyMatriculationNumber(@Param('matriculationNumber') matriculationNumber: string) {
    return this.authService.verifyMatriculationNumber(matriculationNumber);
  }

  @Get('user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current user profile/info' })
  async getUser(@Request() req) {
    return req.user;
  }

  @Put('user')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user profile' })
  async updateUser(@Request() req, @Body() updateData: any) {
    return this.authService.updateProfile(req.user.id, updateData);
  }
}
