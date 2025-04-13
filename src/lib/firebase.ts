import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Constants from 'expo-constants';

// Helper to safely access config
const getConfigValue = (key: string): string => {
  // For web environment, access process.env directly
  if (typeof window !== 'undefined') {
    const envKey = `EXPO_PUBLIC_${key}`;
    return process.env[envKey] || '';
  }

  // For native environment, use Constants.expoConfig
  try {
    const constValue = Constants?.expoConfig?.extra?.[key];
    if (constValue) return constValue;
  } catch (error) {
    console.warn(`Error accessing Constants for ${key}:`, error);
  }

  return '';
};

// Get Firebase config
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase config
const validateConfig = (config: typeof firebaseConfig) => {
  const requiredFields = ['apiKey', 'authDomain', 'projectId', 'appId'];
  const missingFields = requiredFields.filter(field => !config[field as keyof typeof config]);
  
  if (missingFields.length > 0) {
    console.error('Firebase config:', config);
    throw new Error(`Missing required Firebase configuration fields: ${missingFields.join(', ')}`);
  }
};

// Initialize Firebase with validation
let app;
try {
  validateConfig(firebaseConfig);
  console.log('Firebase config validation passed');
  app = initializeApp(firebaseConfig);
} catch (error) {
  console.error('Firebase initialization failed:', error);
  // Provide a dummy app for web development if config is missing
  if (process.env.NODE_ENV === 'development') {
    console.warn('Using dummy Firebase config for development');
    app = initializeApp({
      apiKey: 'dummy-api-key',
      authDomain: 'dummy-auth-domain',
      projectId: 'dummy-project-id',
      storageBucket: 'dummy-storage-bucket',
      messagingSenderId: 'dummy-sender-id',
      appId: 'dummy-app-id'
    });
  } else {
    throw error;
  }
}

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Add auth state change listener for debugging
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? `User: ${user.email}` : 'No user');
});

export default app; 