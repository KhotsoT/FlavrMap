// Root Stack Navigation Types
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: { screen: 'SignIn' | 'SignUp' };
  Main: undefined;
};

// Auth Stack Navigation Types
export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
};

// Main Tab Navigation Types
export type MainTabParamList = {
  Home: undefined;
  Recipes: undefined;
  GroceryCart: undefined;
  StoreFinder: undefined;
}; 