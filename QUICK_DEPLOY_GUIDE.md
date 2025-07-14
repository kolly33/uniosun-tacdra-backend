# 🚀 Quick Deploy to Render - UNIOSUN TACDRA

## ⚡ 5-Minute Deployment Guide

### 1. Prerequisites ✅
- [ ] GitHub repository with your code
- [ ] Render account ([render.com](https://render.com))
- [ ] Remita production credentials

### 2. Database Setup (2 minutes) 🗄️
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click **"New"** → **"PostgreSQL"**
3. Configure:
   ```
   Name: uniosun-tacdra-db
   Database: uniosun_tacdra
   User: tacdra_user
   Region: Oregon
   Plan: Free (or Starter $7/month)
   ```
4. **Copy the Internal Database URL** (you'll need this!)

### 3. Web Service Setup (3 minutes) 🌐
1. Click **"New"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure:
   ```
   Name: uniosun-tacdra-api
   Region: Oregon
   Branch: main
   Runtime: Node
   Build Command: chmod +x render-build.sh && ./render-build.sh
   Start Command: npm run start:prod
   Plan: Free (or Starter $7/month)
   ```

### 4. Environment Variables ⚙️
Add these in the **Environment** section:

#### Required Variables:
```bash
NODE_ENV=production
JWT_SECRET=your-secure-jwt-secret-here-min-32-chars
DATABASE_URL=postgresql://tacdra_user:password@hostname:5432/uniosun_tacdra
FRONTEND_URL=https://uniosuntacdvs.vercel.app
REMITA_MERCHANT_ID=your-production-merchant-id
REMITA_SERVICE_TYPE_ID=your-production-service-type
REMITA_API_KEY=your-production-api-key
REMITA_BASE_URL=https://login.remita.net
```

#### Optional Variables:
```bash
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
JWT_EXPIRES_IN=24h
```

### 5. Deploy! 🚀
1. Click **"Create Web Service"**
2. Wait for deployment (3-5 minutes)
3. Your API will be live at: `https://your-app-name.onrender.com`

### 6. Test Deployment ✅
1. Visit: `https://your-app-name.onrender.com/health`
2. Check API docs: `https://your-app-name.onrender.com/api/docs`
3. Test authentication endpoints

---

## 🔗 Important URLs After Deployment

- **API Base**: `https://your-app-name.onrender.com`
- **Health Check**: `https://your-app-name.onrender.com/health`
- **API Documentation**: `https://your-app-name.onrender.com/api/docs`
- **Student Login**: `POST https://your-app-name.onrender.com/api/auth/student/login`
- **Staff Login**: `POST https://your-app-name.onrender.com/api/auth/staff/login`

## ⚠️ Important Notes

### Free Tier Limitations:
- Sleeps after 15 minutes of inactivity
- Cold start takes 10-15 seconds
- 512MB RAM limit
- Database expires after 90 days

### For Production Use:
- Upgrade to **Starter Plan** ($7/month per service)
- No sleep, faster performance
- Persistent database

## 🆘 Troubleshooting

### Build Failed?
- Check `render-build.sh` has execute permissions
- Verify all dependencies in `package.json`
- Check build logs in Render dashboard

### Database Connection Error?
- Verify `DATABASE_URL` format
- Check database is running
- Ensure correct credentials

### CORS Errors?
- Add your domain to CORS origins in `main.ts`
- Check `FRONTEND_URL` environment variable

### 500 Errors?
- Check logs in Render dashboard
- Verify all environment variables
- Test health endpoint first

## 📞 Support

- **Render Docs**: [render.com/docs](https://render.com/docs)
- **GitHub Issues**: Create issue in your repository
- **Health Check**: Always check `/health` endpoint first

---

**🎉 Your UNIOSUN TACDRA API is now live on Render!**

Update your frontend to use the new API URL and you're ready to go! 🚀
