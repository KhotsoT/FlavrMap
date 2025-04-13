import React from 'react';
import { View, Text } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigation from './src/lib/RootNavigation';
import { AuthProvider } from './src/lib/AuthContext';

// Error boundary component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View 
          style={{ 
            flex: 1, 
            justifyContent: 'center', 
            alignItems: 'center',
            pointerEvents: 'auto'
          }}
        >
          <Text>Something went wrong.</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Root App component
function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <SafeAreaProvider>
          <RootNavigation />
        </SafeAreaProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
