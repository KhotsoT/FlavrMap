import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import OnboardingScreen from '../screens/OnboardingScreen';
import { SignInScreen } from '../screens/auth/SignInScreen';
import { SignUpScreen } from '../screens/auth/SignUpScreen';
import { ForgotPasswordScreen } from '../screens/auth/ForgotPasswordScreen';
import type { RootStackParamList, AuthStackParamList, MainTabParamList } from './navigation.types';

const RootStack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

const PlaceholderScreen = ({ route }: { route: any }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>Placeholder for {route.name} Screen</Text>
  </View>
);

const AuthNavigator = () => (
  <AuthStack.Navigator screenOptions={{ headerShown: false }}>
    <AuthStack.Screen name="SignIn" component={SignInScreen} />
    <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    <AuthStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
  </AuthStack.Navigator>
);

const MainNavigator = () => (
  <MainTab.Navigator>
    <MainTab.Screen name="Home" component={PlaceholderScreen} />
    <MainTab.Screen name="Profile" component={PlaceholderScreen} />
    <MainTab.Screen name="Settings" component={PlaceholderScreen} />
  </MainTab.Navigator>
);

export const Navigation = () => {
  return (
    <NavigationContainer>
      <RootStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Onboarding"
      >
        <RootStack.Screen name="Onboarding" component={OnboardingScreen} />
        <RootStack.Screen name="Auth" component={AuthNavigator} />
        <RootStack.Screen name="Main" component={MainNavigator} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
};