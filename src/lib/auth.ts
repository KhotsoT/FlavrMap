import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User,
  UserCredential
} from 'firebase/auth';
import { auth } from './firebase';

export type AuthError = {
  code: string;
  message: string;
};

export async function signUp(email: string, password: string): Promise<UserCredential> {
  try {
    return await createUserWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw formatAuthError(error);
  }
}

export async function signIn(email: string, password: string): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw formatAuthError(error);
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw formatAuthError(error);
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    throw formatAuthError(error);
  }
}

export function getCurrentUser(): User | null {
  return auth.currentUser;
}

function formatAuthError(error: any): AuthError {
  console.error('Auth Error:', error);
  
  if (error.code === 'auth/email-already-in-use') {
    return {
      code: error.code,
      message: 'This email is already registered. Please sign in or use a different email.'
    };
  }
  
  if (error.code === 'auth/invalid-email') {
    return {
      code: error.code,
      message: 'Please enter a valid email address.'
    };
  }
  
  if (error.code === 'auth/weak-password') {
    return {
      code: error.code,
      message: 'Password should be at least 6 characters long.'
    };
  }
  
  if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
    return {
      code: error.code,
      message: 'Invalid email or password.'
    };
  }

  return {
    code: 'auth/unknown',
    message: 'An unexpected error occurred. Please try again.'
  };
} 