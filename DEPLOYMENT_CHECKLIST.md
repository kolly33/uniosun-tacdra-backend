# 🚀 RENDER DEPLOYMENT CHECKLIST - UNIOSUN TACDRA

## ✅ Pre-Deployment Checklist

### 📋 **Phase 1: Account Setup**
- [ ] Create Render account at [render.com](https://render.com)
- [ ] Connect GitHub account to Render
- [ ] Verify email address

### 📋 **Phase 2: Database Setup (Do This First!)**
1. **Create PostgreSQL Database**:
   - [ ] Go to Render Dashboard
   - [ ] Click "New" → "PostgreSQL"
   - [ ] Configure:
     ```
     Name: uniosun-tacdra-db
     Database Name: uniosun_tacdra
     User: tacdra_user
     Region: Oregon (US-West)
     Plan: Free (testing) or Starter ($7/month)
     ```
   - [ ] Click "Create Database"
   - [ ] **IMPORTANT**: Copy the "Internal Database URL" (you'll need this!)

2. **Save Database Connection Details**:
   ```
   Internal Database URL: postgresql://tacdra_user:password@hostname:5432/uniosun_tacdra
   External Database URL: (for external connections)
   Host: dpg-xxxxx-a.oregon-postgres.render.com
   Port: 5432
   Database: uniosun_tacdra
   Username: tacdra_user
   Password: [generated password]
   ```

### 📋 **Phase 3: Web Service Setup**
1. **Create Web Service**:
   - [ ] Click "New" → "Web Service"
   - [ ] Connect GitHub repository: `kolly33/uniosun-tacdra-backend`
   - [ ] Configure service:
     ```
     Name: uniosun-tacdra-backend
     Region: Oregon (same as database)
     Branch: main
     Runtime: Node
     Build Command: chmod +x render-build.sh && ./render-build.sh
     Start Command: npm run start:prod
     Plan: Free (testing) or Starter ($7/month)
     ```

2. **Advanced Settings**:
   - [ ] Health Check Path: `/health`
   - [ ] Auto-Deploy: Yes (deploys on git push)

### 📋 **Phase 4: Environment Variables**
Set these in Render Dashboard → Environment:

#### 🔒 **Security Variables**
```bash
NODE_ENV=production
JWT_SECRET=your-super-secure-jwt-secret-minimum-32-characters-long
JWT_EXPIRES_IN=24h
```

#### 🗄️ **Database Variables**
```bash
# Use the Internal Database URL from Step 2
DATABASE_URL=postgresql://tacdra_user:password@hostname:5432/uniosun_tacdra

# OR set individual variables:
DATABASE_HOST=your-db-host-from-render
DATABASE_PORT=5432
DATABASE_USERNAME=tacdra_user
DATABASE_PASSWORD=your-db-password
DATABASE_NAME=uniosun_tacdra
```

#### 💳 **Payment Variables (Remita)**
```bash
REMITA_MERCHANT_ID=your-production-merchant-id
REMITA_SERVICE_TYPE_ID=your-production-service-type
REMITA_API_KEY=your-production-api-key
REMITA_BASE_URL=https://login.remita.net
```

#### 🌍 **Application URLs**
```bash
FRONTEND_URL=https://uniosuntacdvs.vercel.app
# APP_URL is auto-set by Render
```

#### 📁 **File Upload Settings**
```bash
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 📋 **Phase 5: Deploy & Test**
- [ ] Click "Create Web Service" to start deployment
- [ ] Monitor build logs for any errors
- [ ] Wait for deployment to complete (3-5 minutes)
- [ ] Test deployment:
  - [ ] Visit: `https://your-app-name.onrender.com/health`
  - [ ] Check API docs: `https://your-app-name.onrender.com/api/docs`
  - [ ] Test authentication endpoints

### 📋 **Phase 6: Post-Deployment**
- [ ] Update frontend to use new API URL
- [ ] Test end-to-end functionality
- [ ] Monitor logs and performance
- [ ] Set up domain (optional)

---

## 🔗 **Important URLs After Deployment**

Once deployed, your URLs will be:
- **Main API**: `https://uniosun-tacdra-backend.onrender.com`
- **Health Check**: `https://uniosun-tacdra-backend.onrender.com/health`
- **API Documentation**: `https://uniosun-tacdra-backend.onrender.com/api/docs`
- **Render Dashboard**: [dashboard.render.com](https://dashboard.render.com)

---

## 🆘 **Troubleshooting Guide**

### Build Fails?
1. Check build logs in Render dashboard
2. Verify `render-build.sh` permissions
3. Ensure all dependencies are in `package.json`

### Database Connection Error?
1. Verify `DATABASE_URL` format
2. Check database is running in Render
3. Ensure both services are in same region

### App Won't Start?
1. Check application logs
2. Verify all environment variables
3. Test `/health` endpoint first

### CORS Errors?
1. Check `FRONTEND_URL` environment variable
2. Verify CORS settings in `main.ts`
3. Ensure frontend uses correct API URL

---

## 📞 **Support Resources**

- **Render Documentation**: [render.com/docs](https://render.com/docs)
- **Render Community**: [community.render.com](https://community.render.com)
- **GitHub Repository**: [github.com/kolly33/uniosun-tacdra-backend](https://github.com/kolly33/uniosun-tacdra-backend)

---

**🎯 Follow this checklist step by step for successful deployment!**
