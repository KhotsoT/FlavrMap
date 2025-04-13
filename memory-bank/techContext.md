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
- **React Native Screens**: 4.4.0
- **React Native Safe Area Context**: 4.12.0
- **React Native Gesture Handler**: 2.20.2

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
6. **babel.config.js**: Babel configuration

## Development Workflow
1. **Setup**
   ```bash
   npm install
   expo start
   ```

2. **Development**
   - Run on iOS: `expo start --ios`
   - Run on Android: `expo start --android`
   - Web support: Currently not available in Expo 52 (requires downgrade to Expo 48 for web support)

3. **Testing**
   - Unit tests: `npm test`
   - E2E tests: `npm run e2e`

4. **Building**
   - iOS: `expo build:ios`
   - Android: `expo build:android`
   - Web: Not supported in current version

## Known Limitations
1. **Web Platform Support**
   - Expo 52 does not yet have stable web support
   - Web development requires downgrading to Expo 48
   - Current focus is on mobile platforms (iOS/Android)

## Dependencies
### Production
- expo
- react-native
- react-navigation
- firebase
- zustand
- nativewind
- react-native-gesture-handler

### Development
- typescript
- @types/react
- @babel/core
- postcss
- autoprefixer 