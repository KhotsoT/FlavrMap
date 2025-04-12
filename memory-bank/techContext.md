# FlavrMap Technical Context

## Development Environment
- **OS**: Windows 10
- **Node.js**: Latest LTS version
- **Package Manager**: npm
- **IDE**: Cursor

## Core Technologies
### Frontend
- **Expo**: 52.0.43
- **React Native**: 0.76.9
- **React**: 18.3.1
- **TypeScript**: 5.3.3
- **NativeWind**: 2.0.11
- **TailwindCSS**: 3.4.1

### Navigation
- **React Navigation**: 6.1.9
- **React Navigation Native Stack**: 6.9.17
- **React Navigation Bottom Tabs**: 6.5.11
- **React Native Screens**: 3.29.0
- **React Native Safe Area Context**: 4.8.2

### State Management
- **Zustand**: 4.5.0

### Backend
- **Firebase**: 10.8.0
  - Authentication
  - Firestore
  - Storage

## Development Tools
- **Babel**: 7.25.2
- **PostCSS**: 8.4.35
- **Autoprefixer**: 10.4.17

## Project Structure
```
flavrmap/
├── src/
│   ├── screens/         # Screen components
│   ├── components/      # Reusable UI components
│   ├── store/          # Zustand stores
│   ├── lib/            # Utilities and helpers
│   └── constants/      # App constants
├── assets/             # Static assets
├── memory-bank/        # Project documentation
└── config/             # Configuration files
```

## Configuration Files
1. **package.json**: Dependencies and scripts
2. **tsconfig.json**: TypeScript configuration
3. **tailwind.config.js**: TailwindCSS configuration
4. **postcss.config.js**: PostCSS configuration
5. **app.json**: Expo configuration

## Development Workflow
1. **Setup**
   ```bash
   npm install
   expo start
   ```

2. **Development**
   - Run on iOS: `expo start --ios`
   - Run on Android: `expo start --android`
   - Run on Web: `expo start --web`

3. **Testing**
   - Unit tests: `npm test`
   - E2E tests: `npm run e2e`

4. **Building**
   - iOS: `expo build:ios`
   - Android: `expo build:android`
   - Web: `expo build:web`

## Dependencies
### Production
- exppo
- react-native
- react-navigation
- firebase
- zustand
- nativewind

### Development
- typescript
- @types/react
- @babel/core
- postcss
- autoprefixer 