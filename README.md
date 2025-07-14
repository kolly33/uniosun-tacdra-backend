# 🎓 UNIOSUN TACDRA Backend API

**Transcript Application, Certificate & Document Reissuance and Authentication System**

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

A comprehensive NestJS backend API for UNIOSUN's Transcript Application, Certificate & Document Reissuance and Authentication (TACDRA) system.

## 🌐 Live Demo

- **Production API**: `https://your-app-name.onrender.com`
- **API Documentation**: `https://your-app-name.onrender.com/api/docs`
- **Frontend**: [UNIOSUN TACDRA Web App](https://uniosuntacdvs.vercel.app)

## ✨ Features

### 🔐 Authentication & Authorization
- **Dual Authentication System**: Students (matriculation number) and Staff (email)
- **JWT-based Security**: Secure token-based authentication with role-based access control
- **Password Security**: bcrypt hashing with salt rounds

### 📋 Application Management
- **Transcript Applications**: Complete application workflow with ATTN tracking
- **Document Upload**: Secure file upload with validation
- **Real-time Tracking**: Application status updates with notifications

### 💳 Payment Integration
- **Remita Gateway**: Production payment processing
- **Transaction Security**: Complete payment audit trails
- **Multiple Methods**: Card, Bank Transfer, USSD support

### 🔍 Verification System
- **QR Code Generation**: Automatic QR codes for document authenticity
- **Multi-verification**: QR scan, manual entry, and upload-based verification
- **Blockchain-ready**: Tamper-proof verification system

### 📚 API Documentation
- **Swagger/OpenAPI**: Interactive API documentation and testing

## 🛠️ Technology Stack

- **Framework**: NestJS 11.x with TypeScript
- **Database**: MySQL with TypeORM
- **Authentication**: JWT with Passport.js
- **File Upload**: Multer with secure file handling
- **Documentation**: Swagger/OpenAPI 3.0
- **Validation**: class-validator and class-transformer
- **Payment Gateway**: Remita Integration
- **Deployment**: Render with Docker support

## 🚀 Quick Start & Deployment

### 📦 Deploy to Render (Recommended)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

**One-click deployment to Render:**
1. Fork this repository to your GitHub account
2. Create account at [render.com](https://render.com)
3. Follow our [RENDER_DEPLOYMENT_GUIDE.md](./RENDER_DEPLOYMENT_GUIDE.md)
4. For quick setup: [QUICK_DEPLOY_GUIDE.md](./QUICK_DEPLOY_GUIDE.md)

### 🔧 Local Development

**Prerequisites:** Node.js ≥ 16.0.0, MySQL ≥ 8.0, Git

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/uniosun-tacdra-backend.git
   cd uniosun-tacdra-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your local configuration
   ```

4. **Database setup**
   ```bash
   mysql -u root -p
   CREATE DATABASE uniosun_tacdra;
   ```

5. **Start development server**
   ```bash
   npm run start:dev
   ```

6. **Access the application**
   - API: http://localhost:3000
   - Documentation: http://localhost:3000/api/docs

### 🌍 Production Environment Variables

```bash
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-min-32-chars
DATABASE_URL=mysql://user:password@host:port/database

# Remita Payment Gateway
REMITA_MERCHANT_ID=your-production-merchant-id
REMITA_SERVICE_TYPE_ID=your-service-type
REMITA_API_KEY=your-api-key
REMITA_BASE_URL=https://login.remita.net

# Application URLs
FRONTEND_URL=https://uniosuntacdvs.vercel.app
APP_URL=https://your-app-name.onrender.com
```

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Debug Mode
```bash
npm run start:debug
```

The API will be available at `http://localhost:3001`

## API Documentation

Once the application is running, you can access the interactive API documentation at:
```
http://localhost:3001/api/docs
```

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/verify-matriculation/:matriculationNumber` - Verify matriculation number
- `GET /auth/profile` - Get user profile

### Users
- `GET /users/profile` - Get current user profile
- `GET /users` - Get all users (admin only)
- `GET /users/:id` - Get user by ID
- `PATCH /users/:id` - Update user
- `POST /users/:id/verify` - Verify user account

### Applications
- `POST /applications` - Create new application
- `GET /applications` - Get user applications
- `GET /applications/:id` - Get application by ID
- `PATCH /applications/:id` - Update application

### Documents
- `POST /documents` - Create document
- `GET /documents` - Get all documents
- `GET /documents/:id` - Get document by ID

### Verification
- `POST /verification/verify/:documentId` - Verify document
- `GET /verification` - Get all verifications
- `GET /verification/:id` - Get verification by ID

### Payment
- `POST /payment/initiate` - Initiate payment
- `GET /payment` - Get all payments
- `GET /payment/:id` - Get payment by ID

### File Upload
- `POST /upload/document` - Upload document file
- `POST /upload/qr-code` - Upload QR code image

## Database Schema

The application uses the following main entities:

- **User** - Student/Alumni information with authentication
- **Application** - Transcript/Certificate applications with ATTN tracking
- **Document** - Generated documents with QR codes
- **Verification** - Document verification records
- **Payment** - Payment transactions with Remita integration

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## File Uploads

Uploaded files are stored in the `uploads` directory with the following structure:
```
uploads/
├── documents/
└── qr-codes/
```

## Demo Data

For testing purposes, you can use the demo matriculation number:
- **Matriculation Number**: `CSC/2020/001`

## Error Handling

The API returns appropriate HTTP status codes and error messages:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Input validation and sanitization
- File upload validation
- CORS configuration
- Environment variable configuration

## Payment Integration

The system integrates with Remita Payment Gateway for:
- Transcript application fees (₦25,000)
- Certificate copies (₦1,000 - ₦25,000)
- Courier delivery (₦3,000)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the UNIOSUN TACDRA development team.

---

**UNIOSUN TACDRA Backend API** - Empowering digital document management for UNIOSUN students and alumni.
