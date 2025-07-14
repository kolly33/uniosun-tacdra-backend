# UNIOSUN TACDRA API - Postman Collection Guide

## 📋 Overview

This comprehensive Postman collection provides complete testing coverage for the UNIOSUN Transcript Application, Certificate & Document Reissuance and Authentication (TACDRA) backend API.

## 🚀 Quick Start

### 1. Import Files
- Import `UNIOSUN-TACDRA-CURRENT.postman_collection.json` into Postman
- Import `UNIOSUN-TACDRA-Environment.postman_environment.json` as environment
- Set the environment as active in Postman

### 2. Server Setup
Make sure your NestJS server is running:
```bash
cd /path/to/verifycert
npm run start:dev
```
Server should be running on: `http://localhost:3002`

### 3. Database Setup
Ensure XAMPP MySQL is running on port 3307 with the `uniosun_tacdra` database.

## 📁 Collection Structure

### 🏥 System Health
- **Health Check**: Basic API connectivity test
- **API Documentation**: Access Swagger docs

### 🔐 Dual Authentication
- **Student Login**: Authenticate with matriculation number + password
- **Staff Login**: Authenticate with email + password (Admin/Registrar)
- **Signup**: Create new user account (Student/Alumni)
- **Get User Profile**: Retrieve user profile information
- **Update User Profile**: Modify user information

### � Document Management
- **Upload Documents**: Upload required documents for transcript application
- **Get All Documents**: List user's documents
- **Get Document by ID**: View specific document
- **Download Document**: Download document files

### 📋 Transcript Applications
- **Apply for Transcript**: Submit transcript request with document upload support
- **Get My Applications**: List user's transcript applications
- **Get Application Details**: View specific application details
- **Track by ATTN**: Public tracking using ATTN number
- **Cancel Application**: Cancel pending application

### 💳 Payment Processing
- **Initialize Payment**: Start payment process for transcript application
- **Verify Payment**: Check payment status and update application
- **Payment Integration**: Full Remita gateway integration

### 🧪 Test Remita Integration
- **Remita Status Check**: Check service connectivity
- **Test Initialize Payment (Mock)**: Mock payment testing
- **Test Verify Payment (Mock)**: Mock verification testing
- **Test Webhook (Mock)**: Mock webhook testing

### 👨‍💼 Admin Management
- **Get Applications for Review**: View all applications needing review (Admin only)
- **Update Application Status**: Change application status with comments
- **Forward Application**: Forward to next department in workflow
- **Mark as Ready**: Mark transcript ready for pickup/dispatch

## 🔄 Testing Workflow

### Student/Alumni Flow
1. **Student Login** → Get access token using matriculation number
2. **Upload Documents** → Upload required documents (passport photo, etc.)
3. **Apply for Transcript** → Submit transcript application with delivery details
4. **Initialize Payment** → Get payment URL and RRR for Remita
5. **Verify Payment** → Confirm payment and update application status
6. **Track Application** → Monitor progress using ATTN number

### Staff/Admin Flow
1. **Staff Login** → Authenticate using institutional email
2. **Review Applications** → View pending applications for review
3. **Update Status** → Process applications and add comments
4. **Forward Application** → Send to next department in workflow
5. **Mark Ready** → Complete processing and notify student

### Document Upload Flow
1. **Upload Documents** → Upload required files with base64 encoding
2. **Apply for Transcript** → Reference uploaded documents in application
3. **Admin Review** → Staff can view uploaded documents during review

### Remita Testing Flow
1. **Test Remita Status** → Check connectivity
2. **Test Initialize Payment (Mock)** → Get mock RRR
3. **Test Verify Payment (Mock)** → Verify mock payment
4. **Test Webhook (Mock)** → Process mock webhook

## 🔧 Environment Variables

The collection uses these automatically managed variables:

| Variable | Description | Auto-Set By |
|----------|-------------|-------------|
| `base_url` | API base URL | Environment |
| `access_token` | JWT authentication token | Login/Register |
| `user_id` | Current user ID | Login/Register |
| `application_id` | Current application ID | Create Application |
| `document_id` | Current document ID | Upload Document |
| `attn` | Application tracking number | Create Application |
| `rrr` | Remita payment reference | Initialize Payment |
| `qr_code` | Document QR code | Generate QR Code |

## 📊 Test Scripts

Each request includes test scripts that:
- ✅ Validate response status codes
- ⏱️ Check response times (< 5 seconds)
- 📝 Log important information
- 🔄 Auto-save IDs to variables
- 🎯 Provide specific test feedback

## 🎯 Frontend Integration Testing

### React/Next.js Integration Points
The collection tests all endpoints that the frontend uses:

```javascript
// Example API calls from frontend
const apiUrl = 'http://localhost:3001';

// Authentication
POST /auth/signup
POST /auth/login
POST /auth/logout
POST /auth/forgot-password
POST /auth/reset-password
GET /auth/user
PUT /auth/user

// Users
GET /api/users/me
PUT /api/users/me
GET /api/users
GET /api/users/:id
PUT /api/users/:id/role
DELETE /api/users/:id

// Transcripts
POST /api/transcripts/apply
GET /api/transcripts
GET /api/transcripts/:id
PUT /api/transcripts/:id/cancel
GET /api/transcripts/track/:attnNumber

// Verification
POST /api/verification/certificate
POST /api/verification/document
GET /api/verification/status/:id
GET /api/verification/history
```

### CORS Testing
The collection verifies CORS headers for:
- `http://localhost:3000` (Local development)
- `https://uniosuntacdvs.vercel.app` (Production frontend)

## 🔒 Security Testing

### Authentication Tests
- ✅ Protected endpoints require valid JWT
- ✅ Invalid tokens return 401 Unauthorized
- ✅ Token expiration handling
- ✅ Role-based access control

### Input Validation Tests
- ✅ Required field validation
- ✅ Email format validation
- ✅ Password strength requirements
- ✅ File upload restrictions

## 🚨 Error Handling

The collection tests error scenarios:
- `400` Bad Request (Invalid input)
- `401` Unauthorized (Missing/invalid token)
- `403` Forbidden (Insufficient permissions)
- `404` Not Found (Resource doesn't exist)
- `422` Unprocessable Entity (Validation errors)
- `500` Internal Server Error (Server issues)

## 📈 Performance Testing

Global test scripts monitor:
- Response times (should be < 5 seconds)
- Server availability
- Database connectivity
- File upload performance

## 🔧 Troubleshooting

### Common Issues

1. **Server Not Running**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:3001
   ```
   Solution: Start the NestJS server with `npm run start:dev`

2. **Database Connection Failed**
   ```
   Error: connect ECONNREFUSED 127.0.0.1:3307
   ```
   Solution: Start XAMPP MySQL on port 3307

3. **Authentication Failed**
   ```
   401 Unauthorized
   ```
   Solution: Run "Signup" or "Login" request first to get access token

4. **File Upload Failed**
   ```
   400 Bad Request: File size too large
   ```
   Solution: Use files smaller than 10MB

### Environment Switching

For **Production Testing**:
1. Change `base_url` to `https://api.uniosuntacdra.edu.ng`
2. Update environment variables
3. Use real Remita credentials
4. Test with production database

For **Local Development**:
1. Keep `base_url` as `http://localhost:3001`
2. Use mock Remita endpoints
3. Test with local MySQL database

## 📝 Testing Checklist

### Pre-Deployment Testing
- [ ] All authentication endpoints work (signup, login, logout, etc.)
- [ ] Transcript application creation and tracking work
- [ ] User management endpoints work
- [ ] File upload and download work
- [ ] Payment initialization works
- [ ] Document verification endpoints work
- [ ] Mock Remita integration works
- [ ] Error handling works correctly
- [ ] CORS headers are correct

### Production Readiness
- [ ] Real Remita credentials configured
- [ ] Production database connected
- [ ] SSL certificates valid
- [ ] Security headers present
- [ ] Performance benchmarks met

## 🎉 Success Criteria

A successful test run should show:
- ✅ All health checks pass
- ✅ User signup and login work
- ✅ Transcript application creation generates ATTN
- ✅ Payment initialization generates RRR  
- ✅ Document upload creates QR codes
- ✅ Verification endpoints work
- ✅ Mock Remita integration functional

## 🔗 Related Resources

- **API Documentation**: http://localhost:3001/api/docs
- **Frontend Repository**: https://uniosuntacdvs.vercel.app/
- **Database Schema**: See `DATABASE_SETUP.md`
- **Environment Setup**: See `.env.example`

---

**Happy Testing! 🚀**

For issues or questions, contact the UNIOSUN TACDRA development team.
