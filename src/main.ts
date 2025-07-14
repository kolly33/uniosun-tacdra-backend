import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Enable CORS for frontend integration
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'http://localhost:3001', 
      'https://uniosuntacdvs.vercel.app',
      'https://*.vercel.app', // Allow all Vercel preview deployments
      'https://*.render.com', // Allow Render deployments
      process.env.FRONTEND_URL, // Dynamic frontend URL
    ].filter(Boolean), // Remove undefined values
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
  });

  // Global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger documentation setup
  const config = new DocumentBuilder()
    .setTitle('UNIOSUN TACDRA API')
    .setDescription('API for Transcript Application, Certificate & Document Reissuance and Authentication')
    .setVersion('1.0')
    .addBearerAuth()
    .addServer(process.env.APP_URL || 'http://localhost:3000', 'Production')
    .addServer('http://localhost:3000', 'Development')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  // Use PORT environment variable for deployment platforms
  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0'); // Listen on all interfaces for containerized deployment
  
  console.log(`🚀 UNIOSUN TACDRA API is running on: ${process.env.APP_URL || `http://localhost:${port}`}`);
  console.log(`📚 API Documentation: ${process.env.APP_URL || `http://localhost:${port}`}/api/docs`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
}

bootstrap();
