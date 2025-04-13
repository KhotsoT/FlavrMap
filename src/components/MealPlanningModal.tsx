import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Animated,
  FlatList,
} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { MealTime } from './MealPlanner';

export interface MealOption {
  id: string;
  name: string;
  price: number;
  category: 'breakfast' | 'lunch' | 'dinner';
  description: string;
  prepTime: string;
  isTraditional?: boolean;
}

export interface MealPlanningModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (meal: MealOption) => void;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  budget: number;
  currentBudget: number;
}

// Sample meal options with diverse cuisines
const MEAL_OPTIONS: MealOption[] = [
  // Breakfast Options
  {
    id: 'b1',
    name: 'Continental Breakfast',
    price: 45.00,
    category: 'breakfast',
    description: 'Fresh croissants, fruits, yogurt, and coffee',
    prepTime: '15 mins',
    isTraditional: true,
  },
  {
    id: 'b2',
    name: 'English Breakfast',
    price: 85.00,
    category: 'breakfast',
    description: 'Eggs, bacon, sausages, beans, and toast',
    prepTime: '25 mins',
  },
  {
    id: 'b3',
    name: 'Mieliepap with Chakalaka',
    price: 35.00,
    category: 'breakfast',
    description: 'Traditional porridge with spicy vegetable relish',
    prepTime: '20 mins',
    isTraditional: true,
  },
  {
    id: 'b4',
    name: 'Japanese Breakfast Set',
    price: 75.00,
    category: 'breakfast',
    description: 'Grilled fish, miso soup, rice, and pickled vegetables',
    prepTime: '30 mins',
  },

  // Lunch Options
  {
    id: 'l1',
    name: 'Mediterranean Salad Bowl',
    price: 65.00,
    category: 'lunch',
    description: 'Fresh greens, feta, olives, and grilled chicken',
    prepTime: '15 mins',
  },
  {
    id: 'l2',
    name: 'Butter Chicken with Naan',
    price: 85.00,
    category: 'lunch',
    description: 'Creamy curry served with fresh naan bread',
    prepTime: '35 mins',
  },
  {
    id: 'l3',
    name: 'Pad Thai',
    price: 70.00,
    category: 'lunch',
    description: 'Stir-fried rice noodles with shrimp and peanuts',
    prepTime: '20 mins',
  },
  {
    id: 'l4',
    name: 'Boerewors Roll',
    price: 40.00,
    category: 'lunch',
    description: 'Grilled sausage in a fresh roll with chakalaka',
    prepTime: '15 mins',
    isTraditional: true,
  },

  // Dinner Options
  {
    id: 'd1',
    name: 'Grilled Salmon',
    price: 120.00,
    category: 'dinner',
    description: 'Fresh salmon with roasted vegetables',
    prepTime: '25 mins',
  },
  {
    id: 'd2',
    name: 'Spaghetti Carbonara',
    price: 75.00,
    category: 'dinner',
    description: 'Classic pasta with creamy egg sauce and pancetta',
    prepTime: '20 mins',
  },
  {
    id: 'd3',
    name: 'Potjiekos',
    price: 85.00,
    category: 'dinner',
    description: 'Traditional slow-cooked meat and vegetable stew',
    prepTime: '180 mins',
    isTraditional: true,
  },
  {
    id: 'd4',
    name: 'Sushi Platter',
    price: 130.00,
    category: 'dinner',
    description: 'Assorted sushi rolls and sashimi',
    prepTime: '40 mins',
  },
];

const getCuisineIcon = (cuisine: string) => {
  switch (cuisine.toLowerCase()) {
    case 'british':
      return 'food-drumstick';
    case 'indian':
      return 'bowl-mix';
    case 'italian':
      return 'pasta';
    case 'japanese':
      return 'rice';
    case 'mediterranean':
      return 'food';
    case 'south african':
      return 'pot-steam';
    case 'thai':
      return 'noodles';
    default:
      return 'silverware-fork-knife';
  }
};

const getMealTypeIcon = (mealType: MealTime) => {
  switch (mealType) {
    case 'breakfast':
      return 'coffee';
    case 'lunch':
      return 'food-fork-drink';
    case 'dinner':
      return 'food-variant';
    default:
      return 'silverware-fork-knife';
  }
};

const ITEMS_PER_PAGE = 3;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const MealPlanningModal: React.FC<MealPlanningModalProps> = ({
  visible,
  onClose,
  onSelect,
  mealType,
  budget,
  currentBudget
}) => {
  const [selectedCuisine, setSelectedCuisine] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));

  const filteredMeals = useMemo(() => {
    return MEAL_OPTIONS.filter((meal) => {
      const matchesMealType = meal.category === mealType;
      const withinBudget = meal.price <= budget;
      const matchesCuisine = selectedCuisine === 'all' || meal.category === selectedCuisine;
      return matchesMealType && withinBudget && matchesCuisine;
    });
  }, [mealType, budget, selectedCuisine]);

  const totalPages = Math.ceil(filteredMeals.length / ITEMS_PER_PAGE);
  const paginatedMeals = filteredMeals.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  const availableCuisines = useMemo(() => {
    const cuisines = new Set(MEAL_OPTIONS.map((meal) => meal.category));
    return ['all', ...Array.from(cuisines)].sort();
  }, []);

  const handlePageChange = (newPage: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setCurrentPage(newPage);
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <View style={styles.paginationContainer}>
        <TouchableOpacity
          style={[styles.paginationButton, currentPage === 0 && styles.paginationButtonDisabled]}
          onPress={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          <MaterialCommunityIcons
            name="chevron-left"
            size={24}
            color={currentPage === 0 ? '#94A3B8' : '#3B82F6'}
          />
        </TouchableOpacity>
        <View style={styles.paginationInfo}>
          <Text style={styles.paginationText}>
            {currentPage + 1} of {totalPages}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.paginationButton,
            currentPage === totalPages - 1 && styles.paginationButtonDisabled,
          ]}
          onPress={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color={currentPage === totalPages - 1 ? '#94A3B8' : '#3B82F6'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const renderMealItem = ({ item }: { item: MealOption }) => (
    <TouchableOpacity
      style={styles.mealItem}
      onPress={() => {
        onSelect(item);
        onClose();
      }}
    >
      <View style={styles.mealHeader}>
        <Text style={styles.mealName}>{item.name}</Text>
        {item.isTraditional && (
          <MaterialIcons name="star" size={16} color="#FFB800" />
        )}
      </View>
      <Text style={styles.mealDescription}>{item.description}</Text>
      <View style={styles.mealFooter}>
        <Text style={styles.mealPrice}>R{item.price.toFixed(2)}</Text>
        <View style={styles.mealInfo}>
          <MaterialIcons name="schedule" size={14} color="#666" />
          <Text style={styles.prepTime}>{item.prepTime}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <MaterialCommunityIcons
                name={getMealTypeIcon(mealType)}
                size={24}
                color="#3B82F6"
                style={styles.headerIcon}
              />
              <Text style={styles.title}>
                Select {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
              </Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color="#64748B" />
            </TouchableOpacity>
          </View>

          <View style={styles.budgetInfo}>
            <MaterialCommunityIcons name="wallet" size={20} color="#3B82F6" />
            <Text style={styles.budgetText}>
              Budget: R{currentBudget.toFixed(2)} (Remaining: R{budget.toFixed(2)})
            </Text>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.cuisineFilter}
            contentContainerStyle={styles.cuisineFilterContent}
          >
            {availableCuisines.map((cuisine) => (
              <TouchableOpacity
                key={cuisine}
                style={[
                  styles.cuisineButton,
                  selectedCuisine === cuisine && styles.cuisineButtonActive,
                ]}
                onPress={() => {
                  setSelectedCuisine(cuisine);
                  setCurrentPage(0);
                }}
              >
                <MaterialCommunityIcons
                  name={getCuisineIcon(cuisine)}
                  size={16}
                  color={selectedCuisine === cuisine ? '#FFFFFF' : '#64748B'}
                  style={styles.cuisineIcon}
                />
                <Text
                  style={[
                    styles.cuisineButtonText,
                    selectedCuisine === cuisine && styles.cuisineButtonTextActive,
                  ]}
                >
                  {cuisine === 'all' ? 'All Cuisines' : cuisine}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <ScrollView 
            style={styles.mealList}
            showsVerticalScrollIndicator={false}
          >
            <Animated.View style={[styles.mealGrid, { opacity: fadeAnim }]}>
              {paginatedMeals.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={styles.mealCard}
                  onPress={() => {
                    onSelect(meal);
                    onClose();
                  }}
                >
                  <View style={styles.mealImageContainer}>
                    <View style={styles.mealImage}>
                      <MaterialCommunityIcons
                        name={getCuisineIcon(meal.category)}
                        size={24}
                        color="#3B82F6"
                      />
                    </View>
                    {meal.isTraditional && (
                      <MaterialCommunityIcons
                        name="star"
                        size={16}
                        color="#EAB308"
                        style={styles.traditionalIcon}
                      />
                    )}
                  </View>

                  <View style={styles.mealHeader}>
                    <Text style={styles.mealName} numberOfLines={1}>
                      {meal.name}
                    </Text>
                    <View style={styles.cuisineTagContainer}>
                      <MaterialCommunityIcons
                        name={getCuisineIcon(meal.category)}
                        size={12}
                        color="#64748B"
                        style={styles.cuisineTagIcon}
                      />
                      <Text style={styles.cuisineTag}>{meal.category}</Text>
                    </View>
                  </View>

                  <Text style={styles.mealDescription} numberOfLines={2}>
                    {meal.description}
                  </Text>

                  <View style={styles.mealFooter}>
                    <View style={styles.mealMeta}>
                      <View style={styles.mealTiming}>
                        <MaterialIcons
                          name="schedule"
                          size={14}
                          color="#64748B"
                        />
                        <Text style={styles.timingText}>{meal.prepTime}</Text>
                      </View>
                    </View>
                    <Text style={styles.mealPrice}>R {meal.price.toFixed(2)}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </Animated.View>
            {filteredMeals.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons
                  name="food-off"
                  size={48}
                  color="#94A3B8"
                />
                <Text style={styles.emptyStateText}>
                  No meals available within your remaining budget of R{budget.toFixed(2)}
                </Text>
              </View>
            )}
          </ScrollView>
          {renderPagination()}
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginRight: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  closeButton: {
    padding: 4,
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8FAFC',
  },
  budgetText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#3B82F6',
    fontWeight: '500',
  },
  cuisineFilter: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  cuisineFilterContent: {
    padding: 16,
  },
  cuisineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  cuisineButtonActive: {
    backgroundColor: '#3B82F6',
  },
  cuisineIcon: {
    marginRight: 6,
  },
  cuisineButtonText: {
    color: '#64748B',
    fontWeight: '500',
  },
  cuisineButtonTextActive: {
    color: '#FFFFFF',
  },
  mealList: {
    flex: 1,
  },
  mealGrid: {
    padding: 16,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealImageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  mealImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mealHeader: {
    marginBottom: 8,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  cuisineTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  cuisineTagIcon: {
    marginRight: 4,
  },
  cuisineTag: {
    fontSize: 12,
    color: '#64748B',
  },
  traditionalIcon: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 2,
  },
  mealDescription: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 12,
    lineHeight: 20,
  },
  mealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  mealMeta: {
    flex: 1,
  },
  mealTiming: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  timingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#64748B',
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
  },
  emptyState: {
    alignItems: 'center',
    padding: 24,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  paginationButton: {
    padding: 8,
    borderRadius: 8,
  },
  paginationButtonDisabled: {
    opacity: 0.5,
  },
  paginationInfo: {
    marginHorizontal: 16,
  },
  paginationText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  mealItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  mealInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prepTime: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
});

export default MealPlanningModal; 