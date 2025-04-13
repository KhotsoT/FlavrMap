const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const webpack = require('webpack');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync({
    ...env,
    babel: {
      dangerouslyAddModifiedCategoryProperty: true
    }
  }, argv);

  // Configure module resolution
  config.resolve = {
    ...config.resolve,
    fallback: {
      ...config.resolve?.fallback,
      process: require.resolve('process/browser'),
    },
    alias: {
      ...config.resolve?.alias,
      'react-native$': 'react-native-web',
      'react-native/Libraries/Image/AssetRegistry': 'react-native-web/dist/modules/AssetRegistry',
      // Mock native modules that aren't available in web
      'expo-modules-core': path.resolve(__dirname, './src/mocks/expo-modules-core.ts'),
    },
    extensions: ['.web.tsx', '.web.ts', '.tsx', '.ts', '.web.jsx', '.web.js', '.jsx', '.js'],
  };

  // Add module rules for handling assets
  config.module.rules.push({
    test: /\.(gif|jpe?g|png|svg)$/,
    use: {
      loader: 'url-loader',
      options: {
        name: '[name].[ext]',
        esModule: false,
      },
    },
  });

  // Remove existing DefinePlugin instances
  config.plugins = config.plugins.filter(plugin => 
    !(plugin instanceof webpack.DefinePlugin)
  );

  // Create environment variables object
  const envVariables = {
    'process.env': {
      NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      EXPO_PUBLIC_FIREBASE_API_KEY: JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_API_KEY),
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN),
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID),
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET),
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID),
      EXPO_PUBLIC_FIREBASE_APP_ID: JSON.stringify(process.env.EXPO_PUBLIC_FIREBASE_APP_ID),
      EXPO_PUBLIC_SPOONACULAR_API_KEY: JSON.stringify(process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY),
      FIREBASE_API_KEY: JSON.stringify(process.env.FIREBASE_API_KEY),
      FIREBASE_AUTH_DOMAIN: JSON.stringify(process.env.FIREBASE_AUTH_DOMAIN),
      FIREBASE_PROJECT_ID: JSON.stringify(process.env.FIREBASE_PROJECT_ID),
      FIREBASE_STORAGE_BUCKET: JSON.stringify(process.env.FIREBASE_STORAGE_BUCKET),
      FIREBASE_MESSAGING_SENDER_ID: JSON.stringify(process.env.FIREBASE_MESSAGING_SENDER_ID),
      FIREBASE_APP_ID: JSON.stringify(process.env.FIREBASE_APP_ID)
    }
  };

  // Add our plugins with proper configuration
  config.plugins.push(
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
    new webpack.DefinePlugin({
      ...envVariables,
      '__DEV__': process.env.NODE_ENV !== 'production',
      // Properly define Constants for web environment
      'global.Constants': JSON.stringify({
        executionEnvironment: 'storeClient',
        manifest: {
          extra: {
            firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
            firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
            firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
            firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
            firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
            firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
            spoonacularApiKey: process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY
          }
        }
      }),
      'Constants': JSON.stringify({
        executionEnvironment: 'storeClient',
        manifest: {
          extra: {
            firebaseApiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
            firebaseAuthDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
            firebaseProjectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
            firebaseStorageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
            firebaseMessagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
            firebaseAppId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
            spoonacularApiKey: process.env.EXPO_PUBLIC_SPOONACULAR_API_KEY
          }
        }
      })
    })
  );

  return config;
}; 