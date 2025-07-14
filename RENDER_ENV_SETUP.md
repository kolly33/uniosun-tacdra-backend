# 🔐 RENDER ENVIRONMENT VARIABLES SETUP

## Required Environment Variables for Render Deployment

Copy these variables into your Render service Environment settings:

### 🔒 Security & Authentication
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-long
JWT_EXPIRES_IN=24h

### 🗄️ Database Configuration
# Note: You'll get these from your Render PostgreSQL database
DATABASE_HOST=<your-render-database-host>
DATABASE_PORT=5432
DATABASE_USERNAME=<your-database-username>
DATABASE_PASSWORD=<your-database-password>
DATABASE_NAME=uniosun_tacdra

# Alternative: Use DATABASE_URL (Render provides this automatically)
# DATABASE_URL=postgresql://user:password@host:port/database

### 💳 Payment Gateway (Remita Production)
REMITA_MERCHANT_ID=<your-production-merchant-id>
REMITA_SERVICE_TYPE_ID=<your-production-service-type>
REMITA_API_KEY=<your-production-api-key>
REMITA_BASE_URL=https://login.remita.net

### 🌍 Application URLs
FRONTEND_URL=https://uniosuntacdvs.vercel.app
# APP_URL will be automatically set by Render

### 📁 File Upload Settings
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

---

## 🚀 Step-by-Step Render Setup:

### 1. Database Setup (First!)
1. In Render Dashboard, click "New" → "PostgreSQL"
2. Configure:
   - Name: uniosun-tacdra-db
   - Database: uniosun_tacdra
   - User: tacdra_user
   - Region: Same as web service
   - Plan: Free or Starter
3. Copy the "Internal Database URL" for later

### 2. Web Service Setup
1. Click "New" → "Web Service" 
2. Connect GitHub: https://github.com/kolly33/uniosun-tacdra-backend
3. Configure as shown above
4. Set all environment variables
5. Deploy!

### 3. After Deployment
Your API will be available at:
- Main URL: https://uniosun-tacdra-backend.onrender.com
- Health Check: https://uniosun-tacdra-backend.onrender.com/health
- API Docs: https://uniosun-tacdra-backend.onrender.com/api/docs

---

## 🔧 Environment Variable Instructions:

### JWT_SECRET
Generate a secure random string (minimum 32 characters):
```bash
# Example (don't use this exact one):
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

### Database Variables
Use the connection details from your Render PostgreSQL database.

### Remita Credentials
Contact Remita support for production credentials:
- Website: https://remita.net
- Support: support@remita.net

### Frontend URL
Update this if your frontend is deployed elsewhere:
```bash
FRONTEND_URL=https://your-frontend-domain.com
```

---

## ✅ Deployment Checklist:

- [ ] GitHub repository connected
- [ ] Render PostgreSQL database created
- [ ] All environment variables set
- [ ] Build command configured
- [ ] Start command configured
- [ ] Health check path set to /health
- [ ] Deployment successful
- [ ] API endpoints responding
- [ ] Frontend can connect to API

---

## 🆘 Troubleshooting:

### Build Fails?
- Check build logs in Render dashboard
- Verify render-build.sh has execute permissions
- Ensure all dependencies are in package.json

### Database Connection Error?
- Verify DATABASE_URL format
- Check database is running and accessible
- Ensure credentials are correct

### 500 Errors?
- Check application logs in Render
- Verify all environment variables are set
- Test /health endpoint first

---

**🎯 Your UNIOSUN TACDRA Backend will be live at:**
`https://uniosun-tacdra-backend.onrender.com`
