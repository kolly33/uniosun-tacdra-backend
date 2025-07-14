import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { User, UserRole } from '../users/entities/user.entity';
import { LoginDto, RegisterDto, AdminRegisterDto, StudentLoginDto, StaffLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string): Promise<any> {
    // This method is kept for compatibility with existing local strategy
    // First try to find by matriculation number (for students)
    let user = await this.usersService.findByMatriculationNumber(identifier);
    
    // If not found, try to find by email (for admin users)
    if (!user) {
      user = await this.usersService.findByEmail(identifier);
    }

    if (user && await this.usersService.validatePassword(user, password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async validateStudent(matriculationNumber: string, password: string): Promise<any> {
    const user = await this.usersService.findByMatriculationNumber(matriculationNumber);
    
    if (user && user.role === UserRole.STUDENT && await this.usersService.validatePassword(user, password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async validateStaff(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    
    // Check if user is staff (not student)
    if (user && user.role !== UserRole.STUDENT && await this.usersService.validatePassword(user, password)) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        matriculationNumber: user.matriculationNumber,
        role: user.role,
        isVerified: user.isVerified,
      },
    };
  }

  async studentLogin(matriculationNumber: string, password: string) {
    const user = await this.validateStudent(matriculationNumber, password);
    if (!user) {
      throw new UnauthorizedException('Invalid matriculation number or password');
    }
    return this.login(user);
  }

  async staffLogin(email: string, password: string) {
    const user = await this.validateStaff(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return this.login(user);
  }

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; access_token: string }> {
    // Check if user already exists
    const existingUserByEmail = await this.usersService.findByEmail(registerDto.email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already registered');
    }

    const existingUserByMatriculation = await this.usersService.findByMatriculationNumber(
      registerDto.matriculationNumber,
    );
    if (existingUserByMatriculation) {
      throw new ConflictException('Matriculation number already registered');
    }

    // Validate matriculation number format (basic validation)
    if (!this.isValidMatriculationNumber(registerDto.matriculationNumber)) {
      throw new BadRequestException('Invalid matriculation number format');
    }

    // Create user
    const userData = {
      ...registerDto,
      role: UserRole.STUDENT,
      isVerified: false,
    };

    const user = await this.usersService.create(userData);

    // Generate token
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        matriculationNumber: user.matriculationNumber,
        role: user.role,
        isVerified: user.isVerified,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async registerAdmin(adminRegisterDto: AdminRegisterDto): Promise<{ user: Partial<User>; access_token: string }> {
    // Check if user already exists
    const existingUserByEmail = await this.usersService.findByEmail(adminRegisterDto.email);
    if (existingUserByEmail) {
      throw new ConflictException('Email already registered');
    }

    // Validate admin role
    const validRoles = ['admin', 'registrar', 'deputy_registrar', 'exams_records'];
    if (!validRoles.includes(adminRegisterDto.role)) {
      throw new BadRequestException('Invalid admin role');
    }

    // Map role strings to enum values
    const roleMapping = {
      'admin': UserRole.ADMIN,
      'registrar': UserRole.REGISTRAR,
      'deputy_registrar': UserRole.DEPUTY_REGISTRAR,
      'exams_records': UserRole.EXAMS_RECORDS,
    };

    // Create admin user (no matriculation number required)
    const userData = {
      ...adminRegisterDto,
      role: roleMapping[adminRegisterDto.role],
      matriculationNumber: `STAFF/${new Date().getFullYear()}/${Math.random().toString(36).substr(2, 6).toUpperCase()}`, // Generate staff ID
      isVerified: true, // Admin users are auto-verified
    };

    const user = await this.usersService.create(userData);

    // Generate token
    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        matriculationNumber: user.matriculationNumber,
        role: user.role,
        isVerified: user.isVerified,
      },
      access_token: this.jwtService.sign(payload),
    };
  }

  async logout(user: any): Promise<{ message: string }> {
    // In a real implementation, you might want to blacklist the token
    // For now, just return success message
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    // Check if user exists
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('User with this email does not exist');
    }

    // In a real implementation, you would:
    // 1. Generate a password reset token
    // 2. Send email with reset link
    // 3. Store token in database with expiration
    
    return { message: 'Password reset link sent to your email' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    // In a real implementation, you would:
    // 1. Validate the reset token
    // 2. Check if token hasn't expired
    // 3. Find user by token
    // 4. Update user's password
    
    return { message: 'Password reset successfully' };
  }

  async updateProfile(userId: string, updateData: any): Promise<Partial<User>> {
    const updatedUser = await this.usersService.update(userId, updateData);
    
    return {
      id: updatedUser.id,
      email: updatedUser.email,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      matriculationNumber: updatedUser.matriculationNumber,
      role: updatedUser.role,
      isVerified: updatedUser.isVerified,
    };
  }

  async verifyMatriculationNumber(matriculationNumber: string): Promise<{ isValid: boolean; exists?: boolean; message?: string; user?: any; details?: any }> {
    try {
      // Check if matriculation number format is valid
      if (!this.isValidMatriculationNumber(matriculationNumber)) {
        return {
          isValid: false,
          message: 'Invalid matriculation number format. Expected format: XXX/YYYY/ZZZ (e.g., CSC/2020/100)',
        };
      }

      // Check if user exists with this matriculation number
      try {
        const user = await this.usersService.findByMatriculationNumber(matriculationNumber);
        
        if (user) {
          return {
            isValid: true,
            exists: true,
            message: 'Matriculation number is valid and exists in the system',
            user: {
              firstName: user.firstName,
              lastName: user.lastName,
              department: user.department,
              faculty: user.faculty,
              role: user.role,
            },
          };
        }
      } catch (error) {
        // User not found, but format is valid
      }

      // Format is valid but user doesn't exist - provide mock demo data
      return {
        isValid: true,
        exists: false,
        message: 'Matriculation number format is valid',
        details: {
          firstName: 'Demo',
          lastName: 'Student',
          department: 'Computer Science',
          faculty: 'Physical Sciences',
          graduationYear: 2024,
          degree: 'Bachelor of Science',
        },
      };
    } catch (error) {
      return {
        isValid: false,
        message: 'Error verifying matriculation number',
      };
    }
  }

  private isValidMatriculationNumber(matriculationNumber: string): boolean {
    // Basic validation for UNIOSUN matriculation number format
    // Format examples: CSC/2020/001, ENG/2019/123, etc.
    const pattern = /^[A-Z]{3}\/\d{4}\/\d{3}$/;
    return pattern.test(matriculationNumber) || matriculationNumber === 'CSC/2020/001'; // Demo number
  }
}
