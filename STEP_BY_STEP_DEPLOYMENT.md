# 🚀 STEP-BY-STEP RENDER DEPLOYMENT

## 📋 **What You Need:**
- [x] GitHub repository: https://github.com/kolly33/uniosun-tacdra-backend ✅
- [x] Code pushed to GitHub ✅
- [x] JWT Secret generated ✅
- [ ] Render account
- [ ] Production Remita credentials

---

## 🎯 **STEP 1: Create Render Account (2 minutes)**

1. **Go to**: [render.com](https://render.com)
2. **Click**: "Get Started" or "Sign Up"
3. **Choose**: "Sign up with GitHub" (easiest)
4. **Authorize**: Render to access your GitHub repositories
5. **Verify**: Your email address

---

## 🗄️ **STEP 2: Create Database (3 minutes)**

1. **In Render Dashboard**: Click **"New"** → **"PostgreSQL"**
2. **Fill in details**:
   ```
   Name: uniosun-tacdra-db
   Database Name: uniosun_tacdra
   User: tacdra_user
   Region: Oregon
   Plan: Free (for testing) OR Starter ($7/month for production)
   ```
3. **Click**: "Create Database"
4. **Wait**: For database to be created (1-2 minutes)
5. **IMPORTANT**: Copy the **"Internal Database URL"** 
   - It looks like: `postgresql://tacdra_user:password@hostname:5432/uniosun_tacdra`
   - **Save this** - you'll need it in Step 4!

---

## 🌐 **STEP 3: Create Web Service (2 minutes)**

1. **In Render Dashboard**: Click **"New"** → **"Web Service"**
2. **Connect Repository**: 
   - Choose "Build and deploy from a Git repository"
   - Select: `kolly33/uniosun-tacdra-backend`
   - Click "Connect"
3. **Configure Service**:
   ```
   Name: uniosun-tacdra-backend
   Region: Oregon (same as database)
   Branch: main
   Runtime: Node
   Build Command: chmod +x render-build.sh && ./render-build.sh
   Start Command: npm run start:prod
   Plan: Free (testing) OR Starter ($7/month for production)
   ```
4. **Advanced Settings**:
   - Health Check Path: `/health`
   - Auto-Deploy: Yes

---

## ⚙️ **STEP 4: Set Environment Variables (5 minutes)**

**Before deploying**, click **"Environment"** tab and add these variables:

### 🔒 **Security (Required)**
```
NODE_ENV = production
JWT_SECRET = jQHqO53r3vM3/Fbfys1hxIZjw8R+CaGDCCaGDI92LFKP68DbidWLc8JChDdZ/2JS
JWT_EXPIRES_IN = 24h
```

### 🗄️ **Database (Required)**
```
DATABASE_URL = [paste the Internal Database URL from Step 2]
```

### 🌍 **Application URLs (Required)**
```
FRONTEND_URL = https://uniosuntacdvs.vercel.app
```

### 📁 **File Upload (Optional)**
```
MAX_FILE_SIZE = 10485760
UPLOAD_PATH = ./uploads
```

### 💳 **Payment (For Production - Add Later)**
```
REMITA_MERCHANT_ID = [your production merchant ID]
REMITA_SERVICE_TYPE_ID = [your production service type]
REMITA_API_KEY = [your production API key]
REMITA_BASE_URL = https://login.remita.net
```

---

## 🚀 **STEP 5: Deploy! (3-5 minutes)**

1. **Click**: "Create Web Service"
2. **Wait**: For deployment to complete (3-5 minutes)
3. **Monitor**: Build logs for any errors
4. **Success**: You'll see "Live" status with a green dot

---

## ✅ **STEP 6: Test Your Deployment (2 minutes)**

Your API will be live at: `https://uniosun-tacdra-backend.onrender.com`

**Test these URLs**:
1. **Health Check**: https://uniosun-tacdra-backend.onrender.com/health
2. **API Docs**: https://uniosun-tacdra-backend.onrender.com/api/docs
3. **Root**: https://uniosun-tacdra-backend.onrender.com

**Or run our test script**:
```bash
./test-deployment.sh
```

---

## 🎉 **STEP 7: Success!**

If all tests pass, your API is live! 

### **Your Live URLs:**
- **API Base**: `https://uniosun-tacdra-backend.onrender.com`
- **Documentation**: `https://uniosun-tacdra-backend.onrender.com/api/docs`
- **Health Check**: `https://uniosun-tacdra-backend.onrender.com/health`

### **Next Steps:**
1. **Update Frontend**: Use your new API URL
2. **Test Integration**: Verify frontend can connect
3. **Production Setup**: Add real Remita credentials
4. **Custom Domain**: (Optional) Set up your own domain

---

## 🆘 **If Something Goes Wrong:**

### **Build Fails?**
- Check "Events" tab in Render dashboard
- Look for specific error messages
- Verify all environment variables are set

### **App Won't Start?**
- Check "Logs" tab for runtime errors
- Verify DATABASE_URL is correct
- Test health endpoint first

### **Database Connection Error?**
- Ensure database is in "Available" status
- Check DATABASE_URL format
- Verify both services are in same region

---

## 📞 **Need Help?**
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **GitHub Issues**: Create issue in your repository
- **Test Script**: Run `./test-deployment.sh` after deployment

---

**🎯 Total Time: ~15 minutes for complete deployment!**
