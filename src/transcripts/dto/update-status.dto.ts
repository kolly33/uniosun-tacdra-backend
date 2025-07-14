import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ApplicationStatus } from '../../applications/entities/application.entity';

export class UpdateApplicationStatusDto {
  @ApiProperty({
    enum: ApplicationStatus,
    description: 'New status for the application',
    example: ApplicationStatus.REGISTRAR_REVIEW,
  })
  @IsEnum(ApplicationStatus)
  status: ApplicationStatus;

  @ApiPropertyOptional({
    description: 'Notes or comments about the status change',
    example: 'Application approved and forwarded to Deputy Registrar',
  })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({
    description: 'Reason for rejection (if status is rejected)',
    example: 'Incomplete documentation - missing transcript request form',
  })
  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
