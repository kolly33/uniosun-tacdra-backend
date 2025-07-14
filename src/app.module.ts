import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Import database configuration
import { getDatabaseConfig } from './config/database.config';

// Import controllers
import { AppController } from './app.controller';

// Import modules
import { UploadModule } from './upload/upload.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ApplicationsModule } from './applications/applications.module';
import { TranscriptsModule } from './transcripts/transcripts.module';
import { DocumentsModule } from './documents/documents.module';
import { VerificationModule } from './verification/verification.module';
import { PaymentModule } from './payment/payment.module';
import { TestRemitaModule } from './test-remita/test-remita.module';

@Module({
  imports: [
    // Configuration module
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Static file serving
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),

    // Production-ready database configuration
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: getDatabaseConfig,
      inject: [ConfigService],
    }),

    // Feature modules
    AuthModule,
    UsersModule,
    ApplicationsModule,
    TranscriptsModule,
    DocumentsModule,
    VerificationModule,
    PaymentModule,
    TestRemitaModule,
    UploadModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
