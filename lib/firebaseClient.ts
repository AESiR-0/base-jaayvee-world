import { initializeApp, getApps } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, signOut } from 'firebase/auth'
import { getStorage } from 'firebase/storage'

// Validate Firebase configuration
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key)

if (missingVars.length > 0) {
  console.error('❌ Missing Firebase environment variables:', missingVars)
  throw new Error(`Missing Firebase environment variables: ${missingVars.join(', ')}`)
}

// Validate API key format
if (!requiredEnvVars.apiKey?.startsWith('AIza')) {
  console.error('❌ Invalid Firebase API key format. API key should start with "AIza"')
  throw new Error('Invalid Firebase API key format')
}

const config = {
  apiKey: requiredEnvVars.apiKey!,
  authDomain: requiredEnvVars.authDomain!,
  projectId: requiredEnvVars.projectId!,
  storageBucket: requiredEnvVars.storageBucket!,
  messagingSenderId: requiredEnvVars.messagingSenderId!,
  appId: requiredEnvVars.appId!,
}

console.log('✅ Firebase configuration loaded successfully')
console.log('🔑 Project ID:', config.projectId)
console.log('🌐 Auth Domain:', config.authDomain)

export const app = getApps().length ? getApps()[0] : initializeApp(config)
export const auth = getAuth(app)
export const storage = getStorage(app)

// Export Firebase functions
export { signInWithPhoneNumber, PhoneAuthProvider, signInWithCredential, signOut }

export const createRecaptchaVerifier = (elementId: string) => {
  return new RecaptchaVerifier(auth, elementId, {
    size: 'normal',
    callback: (response: any) => {
      console.log('reCAPTCHA solved');
    },
    'expired-callback': () => {
      console.log('reCAPTCHA expired');
    }
  });
};

export const clearRecaptchaVerifier = (elementId: string) => {
  const element = document.getElementById(elementId);
  if (element) {
    element.innerHTML = '';
  }
};

// Verify OTP and authenticate user
export const verifyOTP = async (verificationId: string, otp: string): Promise<{ success: boolean; user?: any; error?: string }> => {
  try {
    console.log('🔍 Verifying OTP:', otp);
    console.log('🔑 Verification ID:', verificationId);
    
    // Validate OTP format
    if (!otp || otp.length < 4 || otp.length > 8) {
      console.log('❌ Invalid OTP format');
      return {
        success: false,
        error: 'Invalid OTP format. Please enter the 6-digit code sent to your phone.'
      };
    }
    
    console.log('🔐 Creating credential...');
    const credential = PhoneAuthProvider.credential(verificationId, otp);
    console.log('✅ Credential created');
    
    console.log('🔑 Signing in with credential...');
    const result = await signInWithCredential(auth, credential);
    console.log('✅ Authentication successful!', result.user.uid);
    
    return {
      success: true,
      user: result.user
    };
  } catch (error: any) {
    console.error('❌ Verify OTP error:', error);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/invalid-verification-code') {
      return {
        success: false,
        error: 'Invalid OTP. Please check the code and try again.'
      };
    } else if (error.code === 'auth/code-expired') {
      return {
        success: false,
        error: 'OTP has expired. Please request a new code.'
      };
    } else if (error.code === 'auth/invalid-verification-id') {
      return {
        success: false,
        error: 'Verification session expired. Please start the process again.'
      };
    } else if (error.code === 'auth/network-request-failed') {
      return {
        success: false,
        error: 'Network error. Please check your internet connection and try again.'
      };
    } else if (error.code === 'auth/too-many-requests') {
      return {
        success: false,
        error: 'Too many failed attempts. Please wait before trying again.'
      };
    }
    
    return {
      success: false,
      error: error.message || 'Invalid OTP. Please try again.'
    };
  }
};
