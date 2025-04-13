# Active Context - Meal Planning System

## Current Focus
- Implementing comprehensive meal planning functionality with budget management
- Supporting diverse international cuisines with local currency (Rand)
- Enhanced time period selection including monthly planning
- Data persistence for budgets and meal plans

## Recent Changes
1. Extended planning periods to include:
   - Today
   - Tomorrow
   - This Week
   - This Month

2. Budget Management Updates:
   - Added support for monthly budgets
   - Implemented budget persistence using AsyncStorage
   - Enhanced budget modal UI/UX
   - Added remaining budget calculations
   - Currency display in Rand (R)
   - Automatic budget loading on app start

3. Meal Planning Features:
   - Time-aware meal suggestions
   - International cuisine options including:
     - South African traditional dishes
     - Mediterranean cuisine
     - Asian cuisine (Japanese, Thai)
     - European dishes (Italian, British)
     - Indian cuisine
   - Cuisine filtering system
   - Dietary preference indicators
   - Budget-constrained meal selection
   - Visual indicators for meal planning progress
   - Persistent meal selections across app restarts

## Next Steps
1. Add meal suggestions based on remaining budget
2. Enhance meal variety for monthly planning
3. Add more dietary preferences and restrictions
4. Implement meal plan sharing functionality
5. Add data export/import functionality

## Active Decisions
1. Using bottom sheet modals for better mobile UX
2. Maintaining separate budgets for different time periods
3. Using cuisine tags for easy filtering
4. Showing dietary preference indicators
5. Using AsyncStorage for data persistence

## Current Considerations
1. Need to optimize performance for monthly meal plans
2. Consider adding more cuisine categories
3. Add nutritional information for meals
4. Implement data backup/restore functionality
5. Add data migration strategy for future updates 