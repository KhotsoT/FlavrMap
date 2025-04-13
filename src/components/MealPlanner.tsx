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
        <Text style={styles.stepNumber}>{step}</Text>
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
        <View style={styles.periodButtons}>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
  periodButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: '#3B82F6',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
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
  completedStep: {
    backgroundColor: '#34D399',
  },
  stepNumber: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepTitle: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
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
});

export default MealPlanner; 