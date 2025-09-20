# AgriProxy API Integration Guide

## ✅ Backend APIs Integrated

The AgriProxyApp has been successfully integrated with the backend authentication APIs.

### 🔧 Backend Configuration

**Backend URL:** `http://localhost:3001`
**Database:** MongoDB (agriproxy)
**Authentication:** JWT tokens (7 days validity)

### 📱 Frontend Integration

#### 1. API Service Layer
- **File:** `src/services/authApi.ts`
- **Purpose:** Handles all authentication API calls
- **Features:**
  - Automatic token management
  - Request/response interceptors
  - Error handling
  - AsyncStorage integration

#### 2. Authentication Context
- **File:** `src/context/AuthContext.tsx`
- **Updated:** Real API integration replacing mock data
- **Features:**
  - Real user authentication
  - Token persistence
  - Automatic login state management

#### 3. Configuration
- **File:** `src/config/api.ts`
- **Purpose:** Centralized API configuration
- **Features:**
  - Environment-based URLs
  - Endpoint management
  - Request configuration

### 🔗 Available APIs

#### Authentication Endpoints

1. **POST** `/api/auth/signup`
   ```typescript
   // Request
   {
     "name": "User Name",
     "email": "user@example.com",
     "password": "Password123",
     "phone": "+919876543210",
     "location": "City, State"
   }

   // Response
   {
     "success": true,
     "message": "User registered successfully",
     "token": "jwt_token_here",
     "data": {
       "user": { /* user object */ }
     }
   }
   ```

2. **POST** `/api/auth/login`
   ```typescript
   // Request
   {
     "email": "user@example.com",
     "password": "Password123"
   }

   // Response
   {
     "success": true,
     "message": "Login successful",
     "token": "jwt_token_here",
     "data": {
       "user": { /* user object */ }
     }
   }
   ```

3. **GET** `/api/auth/profile`
   ```typescript
   // Headers: Authorization: Bearer <token>

   // Response
   {
     "success": true,
     "message": "Profile retrieved successfully",
     "data": {
       "user": { /* user object */ }
     }
   }
   ```

4. **PUT** `/api/auth/profile`
   ```typescript
   // Headers: Authorization: Bearer <token>
   // Request
   {
     "name": "Updated Name",
     "phone": "+919876543210",
     "location": "Updated Location"
   }
   ```

5. **POST** `/api/auth/logout`
   ```typescript
   // Clears server session and local storage
   ```

### 📦 User Data Structure

```typescript
interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  profileCompleted: boolean;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
}
```

### 🔐 Security Features

- **Password Hashing:** bcryptjs with salt rounds
- **JWT Authentication:** Secure token-based auth
- **Input Validation:** Server-side validation for all inputs
- **Error Handling:** Comprehensive error responses
- **CORS Protection:** Cross-origin request security
- **Token Expiry:** Automatic token validation

### 🚀 How to Use

#### 1. Start Backend Server
```bash
cd agriproxy-backend
npm run dev
# Server runs on http://localhost:3001
```

#### 2. Start Frontend App
```bash
cd AgriProxyApp
npm start
# or
expo start
```

#### 3. Test Authentication
- Open app in simulator/device
- Try signup with new user
- Test login with existing user
- Profile data should persist

### 🧪 Testing

#### Successful Tests Completed:
✅ User registration with real data
✅ User login with credentials
✅ Profile data retrieval
✅ Profile updates
✅ Input validation
✅ Error handling
✅ Token persistence
✅ Multiple users support

#### Test Users Created:
1. **Bhupesh Kumar Singh**
   - Email: bhupeshfarmer@gmail.com
   - Location: Ludhiana, Punjab, India

2. **Rajesh Sharma**
   - Email: rajeshfarmer@gmail.com
   - Location: Amritsar, Punjab

### 🔄 Token Management

- **Storage:** AsyncStorage with keys 'auth_token' and 'user'
- **Expiry:** 7 days from login/signup
- **Auto-refresh:** Token validated on app start
- **Security:** Automatic cleanup on 401 errors

### 🚧 Next Steps

The authentication system is ready. You can now:

1. **Add More APIs:**
   - Crop management
   - Market prices
   - Weather data
   - Image uploads

2. **Enhance Features:**
   - Password reset
   - Email verification
   - Profile pictures
   - Push notifications

3. **Production Setup:**
   - Update production API URL in config
   - Add environment variables
   - SSL certificates
   - Database optimization

### 📱 Frontend Files Modified

```
src/
├── services/
│   └── authApi.ts (NEW)
├── config/
│   └── api.ts (NEW)
├── context/
│   └── AuthContext.tsx (UPDATED)
├── screens/Auth/
│   ├── LoginScreen.tsx (UPDATED)
│   └── SignupScreen.tsx (UPDATED)
└── API_INTEGRATION.md (NEW)
```

### 🗄️ Backend Files Created

```
agriproxy-backend/
├── src/
│   ├── models/
│   │   └── User.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   ├── routes/
│   │   └── auth.js
│   ├── utils/
│   │   └── jwt.js
│   ├── config/
│   │   └── database.js
│   └── app.js (UPDATED)
├── server.js
├── .env
└── package.json
```

---

**✅ Integration Complete!** Your AgriProxyApp is now connected to a real backend with full authentication functionality.