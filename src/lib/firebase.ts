import { initializeApp, getApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';
import Constants from 'expo-constants';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: Constants.expoConfig?.extra?.firebaseApiKey,
  authDomain: Constants.expoConfig?.extra?.firebaseAuthDomain,
  projectId: Constants.expoConfig?.extra?.firebaseProjectId,
  storageBucket: Constants.expoConfig?.extra?.firebaseStorageBucket,
  messagingSenderId: Constants.expoConfig?.extra?.firebaseMessagingSenderId,
  appId: Constants.expoConfig?.extra?.firebaseAppId
};

// Debug Firebase configuration
console.log('Firebase Config:', {
  apiKey: firebaseConfig.apiKey ? 'exists' : 'missing',
  authDomain: firebaseConfig.authDomain ? 'exists' : 'missing',
  projectId: firebaseConfig.projectId ? 'exists' : 'missing',
  storageBucket: firebaseConfig.storageBucket ? 'exists' : 'missing',
  messagingSenderId: firebaseConfig.messagingSenderId ? 'exists' : 'missing',
  appId: firebaseConfig.appId ? 'exists' : 'missing'
});

// Initialize Firebase
let app;
try {
  app = getApp();
  console.log('Retrieved existing Firebase app');
} catch (error) {
  app = initializeApp(firebaseConfig);
  console.log('Initialized new Firebase app');
}

// Initialize Auth
const auth = getAuth(app);

// Enable persistence
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Firebase Auth persistence enabled');
  })
  .catch((error) => {
    console.error('Error enabling auth persistence:', error);
  });

// Add auth state change listener for debugging
auth.onAuthStateChanged((user) => {
  console.log('Auth state changed:', user ? `User: ${user.email}` : 'No user');
});

export { auth };
export default app; 