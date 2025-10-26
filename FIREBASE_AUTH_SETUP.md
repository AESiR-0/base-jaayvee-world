# Firebase Authentication Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Firebase Configuration (Required)
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890

# API Configuration (Required)
NEXT_PUBLIC_API_BASE_URL=https://talaash.thejaayveeworld.com/api
```

## Getting Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Click on the gear icon → Project Settings
4. Scroll down to "Your apps" section
5. Click "Add app" → Web app (</>) if you haven't already
6. Copy the configuration values from the Firebase config object

## Troubleshooting

### Invalid API Key Error
If you get `auth/invalid-api-key` error:
- ✅ Check that your API key starts with `AIza`
- ✅ Ensure the API key is complete (not truncated)
- ✅ Verify the API key is from the correct Firebase project
- ✅ Make sure Authentication is enabled in Firebase Console

### Missing Environment Variables
The app will show clear error messages for missing variables:
- Check console for specific missing variables
- Ensure all `NEXT_PUBLIC_` variables are set
- Restart your development server after changing `.env.local`

## Testing the Authentication

### 1. Merchant Login
```
http://localhost:3000/ease?role=merchant&merchantId=MERCHANT_ID
```

### 2. User/Influencer Login
```
http://localhost:3000/ease?role=user&merchantId=MERCHANT_ID
```

### 3. Agent Portal
```
http://localhost:3000/ease?role=agent&merchantId=QR_CODE
```

## Features Implemented

✅ **Firebase Phone Authentication** - Complete OTP flow with reCAPTCHA
✅ **Email Authentication** - Mock implementation ready for real service
✅ **Error Handling** - Comprehensive error messages and recovery
✅ **Loading States** - Proper loading indicators and disabled states
✅ **Responsive Design** - Works on all screen sizes
✅ **Security** - reCAPTCHA protection and token-based auth

## Notes

- All environment variables are required for the app to function
- Firebase configuration is mandatory for authentication
- API base URL is required for data operations
- Components are wrapped with Suspense for better performance
