import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const OnboardingScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to FlavrMap</Text>
      <Text style={styles.subtitle}>Your personal meal planning assistant</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
}); 