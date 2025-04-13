import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import OnboardingScreen from '../screens/OnboardingScreen';
import type { RootStackParamList, AuthStackParamList, MainTabParamList } from './navigation.types';

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Placeholder screen component
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 20, marginBottom: 20 }}>{name}</Text>
    <Text>Coming Soon!</Text>
  </View>
);

// Auth Screens
const SignInScreen = () => <PlaceholderScreen name="Sign In" />;
const SignUpScreen = () => <PlaceholderScreen name="Sign Up" />;

// Main Tab Screens
const HomeScreen = () => <PlaceholderScreen name="Home" />;
const RecipesScreen = () => <PlaceholderScreen name="Recipes" />;
const GroceryCartScreen = () => <PlaceholderScreen name="Grocery Cart" />;
const StoreFinderScreen = () => <PlaceholderScreen name="Store Finder" />;

// Auth Navigator
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: true }}>
      <AuthStack.Screen 
        name="SignIn" 
        component={SignInScreen}
        options={{ title: 'Sign In' }}
      />
      <AuthStack.Screen 
        name="SignUp" 
        component={SignUpScreen}
        options={{ title: 'Sign Up' }}
      />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <MainTab.Navigator screenOptions={{ headerShown: true }}>
      <MainTab.Screen name="Home" component={HomeScreen} />
      <MainTab.Screen name="Recipes" component={RecipesScreen} />
      <MainTab.Screen name="GroceryCart" component={GroceryCartScreen} />
      <MainTab.Screen name="StoreFinder" component={StoreFinderScreen} />
    </MainTab.Navigator>
  );
};

// Root Navigation
function RootNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Onboarding"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Auth" component={AuthNavigator} />
        <Stack.Screen name="Main" component={MainNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigation; 