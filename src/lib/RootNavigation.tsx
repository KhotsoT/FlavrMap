import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import OnboardingScreen from '../screens/OnboardingScreen';
import { SignInScreen, SignUpScreen, ForgotPasswordScreen } from '../screens/auth';
import type { RootStackParamList, AuthStackParamList, MainTabParamList } from './navigation.types';
import { useAuthStore } from '../store/authStore';

// Create navigators
const Stack = createNativeStackNavigator<RootStackParamList>();
const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

// Loading screen component
const LoadingScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#3B82F6" />
  </View>
);

// Placeholder screen component
const PlaceholderScreen = ({ name }: { name: string }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ fontSize: 20, marginBottom: 20 }}>{name}</Text>
    <Text>Coming Soon!</Text>
  </View>
);

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
      <AuthStack.Screen 
        name="ForgotPassword" 
        component={ForgotPasswordScreen}
        options={{ title: 'Reset Password' }}
      />
    </AuthStack.Navigator>
  );
};

// Main Tab Navigator
const MainNavigator = () => {
  return (
    <MainTab.Navigator 
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Recipes':
              iconName = focused ? 'book-open' : 'book-open-outline';
              break;
            case 'GroceryCart':
              iconName = focused ? 'cart' : 'cart-outline';
              break;
            case 'StoreFinder':
              iconName = focused ? 'store' : 'store-outline';
              break;
            default:
              iconName = 'help';
          }

          return (
            <MaterialCommunityIcons
              name={iconName as keyof typeof MaterialCommunityIcons.glyphMap}
              size={size}
              color={color}
            />
          );
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <MainTab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          title: 'Home'
        }}
      />
      <MainTab.Screen 
        name="Recipes" 
        component={RecipesScreen}
        options={{
          title: 'Recipes'
        }}
      />
      <MainTab.Screen 
        name="GroceryCart" 
        component={GroceryCartScreen}
        options={{
          title: 'Grocery Cart'
        }}
      />
      <MainTab.Screen 
        name="StoreFinder" 
        component={StoreFinderScreen}
        options={{
          title: 'Store Finder'
        }}
      />
    </MainTab.Navigator>
  );
};

// Root Navigation
function RootNavigation() {
  const { user, initialized } = useAuthStore();

  if (!initialized) {
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ headerShown: false }}
      >
        {user ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <>
            <Stack.Screen name="Onboarding" component={OnboardingScreen} />
            <Stack.Screen name="Auth" component={AuthNavigator} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default RootNavigation; 