# 🚀 Deployment Guide - YouApp

## 📋 Langkah-langkah Deployment

### 1. **Environment Variables Setup**

#### Untuk Development (Local):
Buat file `.env.local` di root project:
\`\`\`bash
NEXT_PUBLIC_API_BASE_URL=http://techtest.youapp.ai
\`\`\`

#### Untuk Production (Vercel/Netlify):
Tambahkan environment variable di dashboard hosting:
- **Key**: `NEXT_PUBLIC_API_BASE_URL`
- **Value**: `http://techtest.youapp.ai`

### 2. **Vercel Deployment**

#### Step 1: Push ke GitHub
\`\`\`bash
git add .
git commit -m "Add YouApp with API integration"
git push origin main
\`\`\`

#### Step 2: Deploy ke Vercel
1. Login ke [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import dari GitHub repository
4. Tambahkan Environment Variables:
   - `NEXT_PUBLIC_API_BASE_URL` = `http://techtest.youapp.ai`
5. Click "Deploy"

#### Step 3: Verify Deployment
- Check console logs untuk API connection
- Test register dan login functionality

### 3. **Netlify Deployment**

#### Step 1: Build Settings
\`\`\`bash
# Build command
npm run build

# Publish directory
.next
\`\`\`

#### Step 2: Environment Variables
Di Netlify dashboard:
1. Site settings → Environment variables
2. Add: `NEXT_PUBLIC_API_BASE_URL` = `http://techtest.youapp.ai`

### 4. **Troubleshooting Common Issues**

#### Issue 1: "Internal Server Error"
**Cause**: API Base URL tidak terkonfigurasi
**Solution**:
\`\`\`bash
# Check environment variable
echo $NEXT_PUBLIC_API_BASE_URL

# Add to .env.local
NEXT_PUBLIC_API_BASE_URL=http://techtest.youapp.ai
\`\`\`

#### Issue 2: "Unable to connect to API server"
**Cause**: Network/CORS issues
**Solution**:
1. Check API server status
2. Verify CORS headers
3. Check firewall settings

#### Issue 3: "User not found" saat register
**Cause**: API endpoint tidak merespons dengan benar
**Solution**:
1. Test API endpoint langsung
2. Check request payload format
3. Verify API documentation

### 5. **API Testing**

#### Test API Connection:
\`\`\`bash
curl -X GET http://techtest.youapp.ai/api/test
\`\`\`

#### Test Register Endpoint:
\`\`\`bash
curl -X POST http://techtest.youapp.ai/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "TestPass1!"
  }'
\`\`\`

#### Test Login Endpoint:
\`\`\`bash
curl -X POST http://techtest.youapp.ai/api/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass1!"
  }'
\`\`\`

### 6. **Database Persistence**

#### API Data Storage:
- **Register**: Data disimpan di database API server
- **Login**: Validasi terhadap data yang tersimpan
- **Profile**: Data profil tersimpan dengan access token

#### Local Storage:
- `access_token`: JWT token untuk authentication
- Otomatis dihapus saat logout

### 7. **Production Checklist**

#### Before Deployment:
- [ ] Environment variables configured
- [ ] API endpoints tested
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Responsive design verified

#### After Deployment:
- [ ] Test register flow
- [ ] Test login flow
- [ ] Test profile creation
- [ ] Check console for errors
- [ ] Verify data persistence

### 8. **Monitoring & Debugging**

#### Console Logs:
\`\`\`javascript
// Check API configuration
console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE_URL)

// Monitor API calls
console.log("Register API call:", payload)
console.log("API response:", response)
\`\`\`

#### Network Tab:
- Check request/response headers
- Verify payload format
- Monitor response status codes

### 9. **Security Considerations**

#### Environment Variables:
- Never commit `.env.local` to git
- Use `NEXT_PUBLIC_` prefix for client-side variables
- Secure API endpoints with proper authentication

#### Token Management:
- Store JWT tokens securely
- Implement token refresh logic
- Clear tokens on logout

### 10. **Performance Optimization**

#### API Calls:
- Implement request caching
- Add loading states
- Handle network errors gracefully

#### User Experience:
- Show loading spinners
- Provide clear error messages
- Implement retry mechanisms

---

## 🔧 Quick Fix Commands

### Reset Local Storage:
\`\`\`javascript
localStorage.clear()
\`\`\`

### Check API Status:
\`\`\`javascript
fetch('http://techtest.youapp.ai/api/test')
  .then(r => console.log('API Status:', r.status))
\`\`\`

### Debug Environment:
\`\`\`javascript
console.log('Environment:', {
  NODE_ENV: process.env.NODE_ENV,
  API_URL: process.env.NEXT_PUBLIC_API_BASE_URL
})
\`\`\`

## 📞 Support

Jika masih mengalami masalah:
1. Check console logs untuk error details
2. Verify environment variables
3. Test API endpoints langsung
4. Check network connectivity
