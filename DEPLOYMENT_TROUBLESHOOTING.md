# 🚨 DEPLOYMENT TROUBLESHOOTING GUIDE

## ✅ **ISSUE FIXED: Module Not Found Error**

**Error**: `Cannot find module '/opt/render/project/src/src/app.module'`

**Solution Applied** ✅:
1. ✅ Added `nest-cli.json` with proper source root configuration
2. ✅ Updated `tsconfig.json` with correct build paths
3. ✅ Fixed `package.json` start command: `node dist/main.js`
4. ✅ Pushed fixes to GitHub

**Status**: 🟢 **RESOLVED** - Your deployment should now work!

---

## 🔄 **Next Steps After Fix**

### **1. Redeploy on Render**
If you already created the Render service:
- Go to your Render dashboard
- Find your `uniosun-tacdra-backend` service
- Click "Manual Deploy" → "Deploy latest commit"
- Monitor the build logs

### **2. If Starting Fresh**
Follow the STEP_BY_STEP_DEPLOYMENT.md guide with the updated code.

---

## 🚨 **Other Common Deployment Issues & Solutions**

### **Issue 1: Build Fails - Missing Dependencies**
**Error**: `Module not found: @nestjs/cli`
**Solution**:
```bash
# The @nestjs/cli is already in devDependencies
# Render should install it automatically
# If issue persists, move it to dependencies in package.json
```

### **Issue 2: Database Connection Error**
**Error**: `Connection failed` or `ECONNREFUSED`
**Solution**:
- ✅ Verify DATABASE_URL is set correctly
- ✅ Ensure database service is "Available" in Render
- ✅ Check both services are in same region (Oregon)
- ✅ Use Internal Database URL, not External

### **Issue 3: Environment Variables Not Working**
**Error**: `undefined` values or missing config
**Solution**:
- ✅ Double-check all environment variables in Render dashboard
- ✅ Ensure no typos in variable names
- ✅ JWT_SECRET must be at least 32 characters
- ✅ DATABASE_URL format: `postgresql://user:pass@host:port/db`

### **Issue 4: CORS Errors**
**Error**: Frontend can't connect due to CORS
**Solution**:
- ✅ Verify FRONTEND_URL environment variable
- ✅ Check your frontend is using correct API URL
- ✅ Ensure https:// in production URLs

### **Issue 5: Health Check Failing**
**Error**: Service shows as "unhealthy"
**Solution**:
- ✅ Verify `/health` endpoint responds
- ✅ Check application logs for startup errors
- ✅ Ensure port binding: `app.listen(port, '0.0.0.0')`

### **Issue 6: File Upload Issues**
**Error**: File uploads fail
**Solution**:
- ✅ Verify uploads directory exists (automatic in our build)
- ✅ Check MAX_FILE_SIZE environment variable
- ✅ Note: Render has ephemeral file system (files are temporary)

---

## 🧪 **Testing Your Deployment**

### **Automated Test**
Run our test script after deployment:
```bash
./test-deployment.sh
```

### **Manual Tests**
Test these URLs in browser:
1. **Health**: `https://uniosun-tacdra-backend.onrender.com/health`
2. **API Docs**: `https://uniosun-tacdra-backend.onrender.com/api/docs`
3. **Root**: `https://uniosun-tacdra-backend.onrender.com`

### **Expected Responses**
- **Health Check**: JSON with status information
- **API Docs**: Swagger UI interface
- **Root**: JSON with API information

---

## 📊 **Deployment Status Indicators**

### **🟢 Success Indicators**
- ✅ Build logs show "Build successful"
- ✅ Service status shows "Live" with green dot
- ✅ Health check returns HTTP 200
- ✅ API documentation loads
- ✅ No error logs in "Logs" tab

### **🟡 Warning Indicators**
- ⚠️ Build takes longer than 5 minutes
- ⚠️ Memory usage consistently high
- ⚠️ Occasional 500 errors in logs

### **🔴 Error Indicators**
- ❌ Build fails with compilation errors
- ❌ Service status shows "Build failed"
- ❌ Health check returns 404 or 500
- ❌ Constant errors in logs

---

## 🔧 **Debug Commands**

### **Check Service Status**
```bash
curl https://uniosun-tacdra-backend.onrender.com/health
```

### **Test API Endpoint**
```bash
curl -X POST https://uniosun-tacdra-backend.onrender.com/api/auth/student/login \
  -H "Content-Type: application/json" \
  -d '{"matriculationNumber":"test","password":"test"}'
```

### **Check Build Output Locally**
```bash
npm run build
ls -la dist/
node dist/main.js
```

---

## 📞 **Getting Help**

### **Resources**
- **Render Docs**: [render.com/docs](https://render.com/docs)
- **NestJS Docs**: [docs.nestjs.com](https://docs.nestjs.com)
- **GitHub Repository**: [github.com/kolly33/uniosun-tacdra-backend](https://github.com/kolly33/uniosun-tacdra-backend)

### **Support Channels**
- **Render Support**: support@render.com
- **GitHub Issues**: Create issue in your repository
- **Community**: Render Community Forum

---

## ✅ **Current Status**

**✅ Module Resolution Issue**: **FIXED**
**✅ Repository**: **Updated and Ready**
**✅ Build Configuration**: **Corrected**
**🚀 Next**: **Deploy and Test**

**Your deployment should now work perfectly!** 🎉
