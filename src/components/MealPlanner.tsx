import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BudgetModal from './BudgetModal';
import MealPlanningModal, { MealOption } from './MealPlanningModal';

export type MealTime = 'breakfast' | 'lunch' | 'dinner';
export type PlanningPeriod = 'today' | 'tomorrow' | 'week' | 'month';

interface BudgetState {
  today: number;
  tomorrow: number;
  week: number;
  month: number;
}

interface SelectedMeal {
  meal: MealOption;
  mealType: MealTime;
  day: number;
}

interface SelectedMeals {
  today: SelectedMeal[];
  tomorrow: SelectedMeal[];
  week: SelectedMeal[];
  month: SelectedMeal[];
}

interface StepIndicatorProps {
  step: number;
  title: string;
  completed?: boolean;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ step, title, completed }) => (
  <View style={styles.stepContainer}>
    <View style={[styles.stepCircle, completed && styles.completedStep]}>
      {completed ? (
        <MaterialIcons name="check" size={16} color="#fff" />
      ) : (
        <Text style={styles.stepCircleNumber}>{step}</Text>
      )}
    </View>
    <Text style={styles.stepTitle}>{title}</Text>
  </View>
);

const MealPlanner: React.FC = () => {
  const [currentMeal, setCurrentMeal] = useState<MealTime>('breakfast');
  const [planningPeriod, setPlanningPeriod] = useState<PlanningPeriod>('today');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [budgetModalVisible, setBudgetModalVisible] = useState(false);
  const [mealPlanningModalVisible, setMealPlanningModalVisible] = useState(false);
  const [budgets, setBudgets] = useState<BudgetState>({
    today: 0,
    tomorrow: 0,
    week: 0,
    month: 0,
  });
  const [selectedMeals, setSelectedMeals] = useState<SelectedMeals>({
    today: [],
    tomorrow: [],
    week: [],
    month: [],
  });

  // Get the current hour in 24-hour format
  const getCurrentHour = () => {
    return new Date().getHours();
  };

  // Predict the next meal based on current time
  const predictNextMeal = (): MealTime => {
    const hour = getCurrentHour();
    if (hour < 10) return 'breakfast';
    if (hour < 15) return 'lunch';
    return 'dinner';
  };

  // Get remaining meals for today based on current time
  const getRemainingMeals = (): MealTime[] => {
    const hour = getCurrentHour();
    if (hour < 10) return ['breakfast', 'lunch', 'dinner'];
    if (hour < 15) return ['lunch', 'dinner'];
    if (hour < 21) return ['dinner'];
    return [];
  };

  // Update current meal based on time when selecting 'today'
  useEffect(() => {
    if (planningPeriod === 'today') {
      const nextMeal = predictNextMeal();
      setCurrentMeal(nextMeal);
    }
  }, [planningPeriod]);

  const getMealIcon = (mealType: MealTime) => {
    switch (mealType) {
      case 'breakfast':
        return 'free-breakfast'; // Coffee cup icon
      case 'lunch':
        return 'restaurant'; // Restaurant icon
      case 'dinner':
        return 'dinner-dining'; // Dinner plate icon
      default:
        return 'restaurant';
    }
  };

  const formatBudget = (amount: number) => {
    return `R${amount.toFixed(2)}`;
  };

  const getMealTimeRange = (mealType: MealTime) => {
    switch (mealType) {
      case 'breakfast':
        return '6:00 - 10:00';
      case 'lunch':
        return '12:00 - 15:00';
      case 'dinner':
        return '18:00 - 21:00';
      default:
        return '';
    }
  };

  const getCurrentBudget = () => budgets[planningPeriod];

  const saveBudget = (amount: number) => {
    setBudgets(prev => ({
      ...prev,
      [planningPeriod]: amount,
    }));
    setBudgetModalVisible(false);
  };

  const getDaysInPeriod = () => {
    switch (planningPeriod) {
      case 'today':
      case 'tomorrow':
        return 1;
      case 'week':
        return 7;
      case 'month':
        return new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
      default:
        return 1;
    }
  };

  const getDayLabel = (day: number) => {
    if (planningPeriod === 'today') return 'Today';
    if (planningPeriod === 'tomorrow') return 'Tomorrow';
    
    const date = new Date();
    if (planningPeriod === 'week') {
      date.setDate(date.getDate() + day - 1);
      return date.toLocaleDateString('en-ZA', { weekday: 'short', month: 'short', day: 'numeric' });
    } else {
      date.setDate(date.getDate() + day - 1);
      return date.toLocaleDateString('en-ZA', { weekday: 'short', month: 'short', day: 'numeric' });
    }
  };

  const getSelectedMealForTypeAndDay = (mealType: MealTime, day: number) => {
    return selectedMeals[planningPeriod].find(
      meal => meal.mealType === mealType && meal.day === day
    );
  };

  const handleMealSelect = (meal: MealOption) => {
    setSelectedMeals(prev => ({
      ...prev,
      [planningPeriod]: [
        ...prev[planningPeriod].filter(m => !(m.mealType === currentMeal && m.day === selectedDay)),
        { meal, mealType: currentMeal, day: selectedDay },
      ],
    }));
    setMealPlanningModalVisible(false);
  };

  const getRemainingBudget = () => {
    const currentBudget = getCurrentBudget();
    const spentAmount = selectedMeals[planningPeriod].reduce(
      (total, { meal }) => total + meal.price,
      0
    );
    return currentBudget - spentAmount;
  };

  const hasBudget = getCurrentBudget() > 0;
  const hasMealSelected = getSelectedMealForTypeAndDay(currentMeal, selectedDay) !== undefined;

  const getCuisineIcon = (cuisine: string): keyof typeof MaterialCommunityIcons.glyphMap => {
    switch (cuisine.toLowerCase()) {
      case 'african':
        return 'food-variant' as keyof typeof MaterialCommunityIcons.glyphMap;
      case 'american':
        return 'food-hot-dog' as keyof typeof MaterialCommunityIcons.glyphMap;
      case 'asian':
        return 'food-taco' as keyof typeof MaterialCommunityIcons.glyphMap;
      case 'european':
        return 'food-croissant' as keyof typeof MaterialCommunityIcons.glyphMap;
      case 'indian':
        return 'food-curry' as keyof typeof MaterialCommunityIcons.glyphMap;
      case 'mexican':
        return 'food-taco' as keyof typeof MaterialCommunityIcons.glyphMap;
      case 'middle eastern':
        return 'food-fork-drink' as keyof typeof MaterialCommunityIcons.glyphMap;
      case 'south american':
        return 'food-steak' as keyof typeof MaterialCommunityIcons.glyphMap;
      default:
        return 'food' as keyof typeof MaterialCommunityIcons.glyphMap;
    }
  };

  const renderRecipeDetails = () => {
    const selectedMeal = getSelectedMealForTypeAndDay(currentMeal, selectedDay);
    if (!selectedMeal) return null;

    return (
      <View style={styles.recipeDetailsContainer}>
        <View style={styles.recipeHeader}>
          <View style={styles.recipeTitleRow}>
            <Text style={styles.recipeName}>{selectedMeal.meal.name}</Text>
            {selectedMeal.meal.isTraditional && (
              <MaterialIcons name="star" size={16} color="#FFB800" style={styles.traditionalIcon} />
            )}
          </View>
          
          <View style={styles.recipeMetaInfo}>
            <View style={styles.cuisineTag}>
              <MaterialCommunityIcons
                name={getCuisineIcon(selectedMeal.meal.cuisine)}
                size={16}
                color="#64748B"
              />
              <Text style={styles.cuisineText}>{selectedMeal.meal.cuisine}</Text>
            </View>
            <View style={styles.prepTimeTag}>
              <MaterialIcons name="schedule" size={16} color="#64748B" />
              <Text style={styles.prepTimeText}>{selectedMeal.meal.prepTime}</Text>
            </View>
            <View style={styles.servingsTag}>
              <MaterialIcons name="people" size={16} color="#64748B" />
              <Text style={styles.servingsText}>{selectedMeal.meal.servings} servings</Text>
            </View>
          </View>
        </View>

        <View style={styles.recipeContent}>
          <Text style={styles.recipeDescription}>{selectedMeal.meal.description}</Text>
          
          <View style={styles.nutritionInfo}>
            <Text style={styles.sectionTitle}>Nutritional Value (per serving)</Text>
            <View style={styles.nutritionGrid}>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Calories</Text>
                <Text style={styles.nutritionValue}>{selectedMeal.meal.nutritionalValue.calories}kcal</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Protein</Text>
                <Text style={styles.nutritionValue}>{selectedMeal.meal.nutritionalValue.protein}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Carbs</Text>
                <Text style={styles.nutritionValue}>{selectedMeal.meal.nutritionalValue.carbs}g</Text>
              </View>
              <View style={styles.nutritionItem}>
                <Text style={styles.nutritionLabel}>Fat</Text>
                <Text style={styles.nutritionValue}>{selectedMeal.meal.nutritionalValue.fat}g</Text>
              </View>
            </View>
          </View>

          <View style={styles.ingredientsSection}>
            <Text style={styles.sectionTitle}>Ingredients</Text>
            {selectedMeal.meal.ingredients?.map((ingredient, index) => (
              <View key={index} style={styles.ingredientItem}>
                <MaterialIcons name="check-circle" size={16} color="#10B981" />
                <Text style={styles.ingredientText}>{ingredient}</Text>
              </View>
            ))}
          </View>

          <View style={styles.methodSection}>
            <Text style={styles.sectionTitle}>Cooking Method</Text>
            {selectedMeal.meal.method?.map((step, index) => (
              <View key={index} style={styles.methodStep}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.methodText}>{step}</Text>
              </View>
            ))}
          </View>

          {selectedMeal.meal.tips && selectedMeal.meal.tips.length > 0 && (
            <View style={styles.tipsSection}>
              <Text style={styles.sectionTitle}>Chef's Tips</Text>
              {selectedMeal.meal.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <MaterialIcons name="lightbulb" size={16} color="#F59E0B" />
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meal Planning</Text>
        <TouchableOpacity style={styles.settingsButton}>
          <MaterialCommunityIcons name="cog" size={24} color="#3B82F6" />
        </TouchableOpacity>
      </View>

      {/* Step 1: Set Budget */}
      <View style={styles.section}>
        <View style={styles.stepHeader}>
          <View style={styles.stepIndicator}>
            <MaterialIcons
              name={getCurrentBudget() > 0 ? 'check-circle' : 'radio-button-unchecked'}
              size={24}
              color={getCurrentBudget() > 0 ? '#10B981' : '#9CA3AF'}
            />
            <Text style={styles.stepText}>Step 1: Set Budget</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.budgetButton, getCurrentBudget() > 0 && styles.budgetButtonActive]}
          onPress={() => setBudgetModalVisible(true)}
        >
          <MaterialIcons name="account-balance-wallet" size={24} color="#3B82F6" />
          <Text style={styles.budgetButtonText}>
            {getCurrentBudget() > 0
              ? `Budget: ${formatBudget(getCurrentBudget())}`
              : 'Set Budget'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Step 2: Select Planning Period */}
      <View style={styles.section}>
        <View style={styles.stepHeader}>
          <View style={styles.stepIndicator}>
            <MaterialIcons
              name={getCurrentBudget() > 0 ? 'check-circle' : 'radio-button-unchecked'}
              size={24}
              color={getCurrentBudget() > 0 ? '#10B981' : '#9CA3AF'}
            />
            <Text style={styles.stepText}>Step 2: Select Period</Text>
          </View>
        </View>
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, planningPeriod === 'today' && styles.periodButtonActive]}
            onPress={() => setPlanningPeriod('today')}
          >
            <Text style={[styles.periodButtonText, planningPeriod === 'today' && styles.periodButtonTextActive]}>
              Today
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, planningPeriod === 'tomorrow' && styles.periodButtonActive]}
            onPress={() => setPlanningPeriod('tomorrow')}
          >
            <Text style={[styles.periodButtonText, planningPeriod === 'tomorrow' && styles.periodButtonTextActive]}>
              Tomorrow
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, planningPeriod === 'week' && styles.periodButtonActive]}
            onPress={() => setPlanningPeriod('week')}
          >
            <Text style={[styles.periodButtonText, planningPeriod === 'week' && styles.periodButtonTextActive]}>
              Week
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, planningPeriod === 'month' && styles.periodButtonActive]}
            onPress={() => setPlanningPeriod('month')}
          >
            <Text style={[styles.periodButtonText, planningPeriod === 'month' && styles.periodButtonTextActive]}>
              Month
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Step 3: Plan Meals */}
      {getCurrentBudget() > 0 && (
        <View style={styles.section}>
          <View style={styles.stepHeader}>
            <View style={styles.stepIndicator}>
              <MaterialIcons
                name={selectedMeals[planningPeriod].length > 0 ? 'check-circle' : 'radio-button-unchecked'}
                size={24}
                color={selectedMeals[planningPeriod].length > 0 ? '#10B981' : '#9CA3AF'}
              />
              <Text style={styles.stepText}>Step 3: Plan Meals</Text>
            </View>
          </View>

          {(planningPeriod === 'week' || planningPeriod === 'month') && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.daySelector}>
              {Array.from({ length: getDaysInPeriod() }, (_, i) => i + 1).map((day) => (
                <TouchableOpacity
                  key={day}
                  style={[styles.dayButton, selectedDay === day && styles.dayButtonActive]}
                  onPress={() => setSelectedDay(day)}
                >
                  <Text style={[styles.dayButtonText, selectedDay === day && styles.dayButtonTextActive]}>
                    {getDayLabel(day)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}

          <View style={styles.mealsContainer}>
            {(planningPeriod === 'today' ? getRemainingMeals() : ['breakfast', 'lunch', 'dinner'] as MealTime[]).map((mealType) => {
              const selectedMeal = getSelectedMealForTypeAndDay(mealType, selectedDay);
              const isNextMeal = planningPeriod === 'today' && mealType === predictNextMeal();
              
              return (
                <TouchableOpacity
                  key={mealType}
                  style={[
                    styles.mealButton,
                    selectedMeal && styles.mealButtonSelected,
                    isNextMeal && styles.nextMealButton
                  ]}
                  onPress={() => {
                    setCurrentMeal(mealType);
                    setMealPlanningModalVisible(true);
                  }}
                  disabled={getRemainingBudget() <= 0}
                >
                  <View style={styles.mealButtonContent}>
                    <MaterialIcons name={getMealIcon(mealType)} size={24} color={isNextMeal ? '#3B82F6' : '#6B7280'} />
                    <View style={styles.mealButtonText}>
                      <Text style={[styles.mealType, isNextMeal && styles.nextMealText]}>
                        {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                        {isNextMeal && ' (Next Meal)'}
                      </Text>
                      <Text style={styles.mealTime}>{getMealTimeRange(mealType)}</Text>
                    </View>
                  </View>
                  {selectedMeal && (
                    <View style={styles.selectedMealInfo}>
                      <Text style={styles.selectedMealName}>{selectedMeal.meal.name}</Text>
                      <Text style={styles.selectedMealPrice}>R{selectedMeal.meal.price.toFixed(2)}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* Recipe Section */}
      {selectedMeals[planningPeriod].length > 0 && (
        <View style={styles.recipeSection}>
          <Text style={styles.recipeSectionTitle}>Recipe Details</Text>
          {renderRecipeDetails()}
        </View>
      )}

      <BudgetModal
        visible={budgetModalVisible}
        onClose={() => setBudgetModalVisible(false)}
        onSave={saveBudget}
        period={planningPeriod}
        currentBudget={getCurrentBudget()}
      />

      <MealPlanningModal
        visible={mealPlanningModalVisible}
        onClose={() => setMealPlanningModalVisible(false)}
        onSelect={handleMealSelect}
        mealType={currentMeal}
        budget={getRemainingBudget()}
        currentBudget={getCurrentBudget()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  settingsButton: {
    padding: 4,
  },
  section: {
    marginBottom: 24,
  },
  stepHeader: {
    marginBottom: 12,
  },
  stepIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  budgetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  budgetButtonActive: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  budgetButtonText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  periodSelector: {
    flexDirection: 'row',
    marginVertical: 16,
    marginHorizontal: 20,
    gap: 12,
  },
  periodButton: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#64748B',
  },
  periodButtonTextActive: {
    color: '#FFFFFF',
  },
  mealsContainer: {
    gap: 12,
  },
  mealButton: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mealButtonSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: '#3B82F6',
  },
  mealButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealButtonText: {
    marginLeft: 12,
  },
  mealType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  mealTime: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  selectedMealInfo: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  selectedMealName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1F2937',
  },
  selectedMealPrice: {
    fontSize: 14,
    color: '#059669',
    marginTop: 4,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  stepCircleNumber: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  completedStep: {
    backgroundColor: '#10B981',
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  daySelector: {
    marginBottom: 16,
  },
  dayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  dayButtonActive: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  dayButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  dayButtonTextActive: {
    color: '#FFFFFF',
  },
  nextMealButton: {
    borderColor: '#3B82F6',
    borderWidth: 2,
  },
  nextMealText: {
    color: '#3B82F6',
    fontWeight: '600',
  },
  recipeSection: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  recipeSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  recipeDetailsContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  recipeHeader: {
    marginBottom: 16,
  },
  recipeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  recipeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  traditionalIcon: {
    marginLeft: 8,
  },
  recipeMetaInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  cuisineTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  cuisineText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4B5563',
  },
  prepTimeTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prepTimeText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4B5563',
  },
  servingsTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  servingsText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#4B5563',
  },
  recipeContent: {
    gap: 16,
  },
  recipeDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  nutritionInfo: {
    backgroundColor: '#F3F4F6',
    padding: 12,
    borderRadius: 8,
  },
  nutritionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  nutritionItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  nutritionLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  nutritionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 4,
  },
  ingredientsSection: {
    gap: 8,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  ingredientText: {
    fontSize: 14,
    color: '#4B5563',
  },
  methodSection: {
    gap: 12,
  },
  methodStep: {
    flexDirection: 'row',
    gap: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  methodText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  tipsSection: {
    gap: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
});

export default MealPlanner; 