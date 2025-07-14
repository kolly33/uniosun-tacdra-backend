import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { Application } from '../applications/entities/application.entity';
import { Document } from '../documents/entities/document.entity';
import { Verification } from '../verification/entities/verification.entity';
import { Payment } from '../payment/entities/payment.entity';

export const getDatabaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  const isProduction = configService.get('NODE_ENV') === 'production';
  
  return {
    type: 'mysql',
    host: configService.get('DB_HOST', 'localhost'),
    port: configService.get('DB_PORT', 3306),
    username: configService.get('DB_USERNAME', 'root'),
    password: configService.get('DB_PASSWORD', ''),
    database: configService.get('DB_NAME', 'uniosun_tacdra'),
    entities: [User, Application, Document, Verification, Payment],
    
    // Production settings
    synchronize: !isProduction, // Never true in production
    logging: isProduction ? ['error'] : true,
    
    // Connection pool settings for production
    extra: isProduction ? {
      connectionLimit: 10,
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true,
    } : {},
    
    // Retry configuration
    retryAttempts: 3,
    retryDelay: 3000,
    autoLoadEntities: true,
    
    // SSL for production databases
    ssl: isProduction ? { 
      rejectUnauthorized: false 
    } : false,
    
    // Query optimization
    maxQueryExecutionTime: 1000, // Log slow queries
    
    // Migration settings
    migrationsRun: isProduction,
    migrations: ['dist/migrations/*.js'],
  };
};
