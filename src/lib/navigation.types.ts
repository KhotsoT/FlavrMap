import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Root Stack Navigation Types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  Onboarding: undefined;
};

// Auth Stack Navigation Types
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

// Main Tab Navigation Types
export type MainTabParamList = {
  Home: undefined;
  Recipes: undefined;
  GroceryCart: undefined;
  StoreFinder: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;
export type AuthStackNavigationProp = NativeStackNavigationProp<AuthStackParamList>; 