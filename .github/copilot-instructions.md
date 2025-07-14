<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# UNIOSUN TACDRA Backend Development Instructions

This is a NestJS backend API project for UNIOSUN's Transcript Application, Certificate & Document Reissuance and Authentication (TACDRA) system.

## Project Context

This backend serves the UNIOSUN TACDRA web application (https://uniosuntacdvs.vercel.app/) which provides:
- Student/Alumni authentication with matriculation number verification
- Transcript application processing with payment integration
- Document verification through QR codes, manual entry, and file uploads
- Real-time application tracking with ATTN (Application Tracking Ticket Number)
- Remita payment gateway integration

## Technical Stack Guidelines

- **Framework**: NestJS with TypeScript
- **Database**: MySQL with TypeORM for ORM
- **Authentication**: JWT tokens with Passport.js strategies
- **File Upload**: Multer for file handling
- **Validation**: class-validator and class-transformer
- **Documentation**: Swagger/OpenAPI for API documentation

## Code Style & Patterns

- Use TypeScript strict mode and proper typing
- Follow NestJS best practices with modules, controllers, services, and entities
- Implement proper error handling with custom exceptions
- Use DTOs for request/response validation
- Apply proper security measures (password hashing, JWT validation)
- Implement role-based access control where needed

## Database Design

- Use TypeORM entities with proper relationships
- Implement soft deletes where appropriate
- Use UUIDs for primary keys
- Maintain audit trails with created/updated timestamps
- Follow proper foreign key relationships

## Key Features to Implement

1. **Authentication System**
   - JWT-based authentication
   - Matriculation number verification
   - Role-based access (Student, Alumni, Admin)

2. **Application Management**
   - Transcript applications with ATTN generation
   - Status tracking and updates
   - Payment integration workflows

3. **Document Handling**
   - File upload and storage
   - QR code generation for verification
   - Document metadata management

4. **Verification System**
   - QR code scanning verification
   - Manual document verification
   - Verification audit trails

5. **Payment Processing**
   - Remita gateway integration
   - Transaction tracking
   - Payment status updates

## Environment Configuration

Ensure proper environment variable usage for:
- Database connections
- JWT secrets
- Payment gateway credentials
- File upload paths
- CORS settings

## Security Considerations

- Hash passwords with bcryptjs
- Validate all inputs with class-validator
- Implement proper CORS policies
- Use environment variables for sensitive data
- Apply rate limiting where appropriate
- Validate file uploads for security

## API Design

- Follow RESTful conventions
- Use proper HTTP status codes
- Implement consistent error response formats
- Provide comprehensive Swagger documentation
- Use versioning for API endpoints when needed

When generating code, prioritize security, scalability, and maintainability while following NestJS conventions and TypeScript best practices.
