# FlavrMap System Patterns

## Architecture Overview
FlavrMap follows a modern React Native architecture with:
- Expo as the development platform
- TypeScript for type safety
- Firebase for backend services
- Zustand for state management
- React Navigation for routing

## Key Technical Decisions

### 1. Navigation Structure
```mermaid
graph TD
    A[Root Stack] --> B[Onboarding]
    A --> C[Auth Stack]
    A --> D[Main Tabs]
    C --> E[Sign In]
    C --> F[Sign Up]
    D --> G[Home]
    D --> H[Recipes]
    D --> I[Grocery Cart]
    D --> J[Store Finder]
```

### 2. State Management
- **Zustand Stores**
  - Auth Store: User authentication state
  - Meal Store: Weekly meal plans
  - Recipe Store: Available recipes
  - Cart Store: Shopping cart state
  - Store Store: Store information and prices

### 3. Data Flow
```mermaid
graph LR
    A[Firebase Auth] --> B[User Data]
    C[Firestore] --> D[Meal Plans]
    C --> E[Recipes]
    C --> F[Store Data]
    G[Local Storage] --> H[User Preferences]
```

### 4. Component Structure
- **Screens**: Top-level navigation components
- **Components**: Reusable UI elements
- **Hooks**: Custom hooks for data fetching and state management
- **Utils**: Helper functions and constants

### 5. Firebase Integration
- Authentication: Email/Password, Google Sign-In
- Firestore: User data, meal plans, recipes, store data
- Storage: Recipe images, user avatars

### 6. API Design
- RESTful endpoints for external services
- GraphQL for complex data queries
- WebSocket for real-time updates

### 7. Error Handling
- Global error boundary
- Toast notifications for user feedback
- Error logging to Firebase
- Offline support with local storage

### 8. Testing Strategy
- Unit tests for utilities and hooks
- Component tests for UI elements
- Integration tests for navigation flows
- E2E tests for critical user journeys 