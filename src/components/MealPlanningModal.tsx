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
  TextInput,
  ActivityIndicator,
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
  nutritionalValue: string;
  cuisine?: string;
  ingredients?: string[];
}

export interface MealPlanningModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (meal: MealOption) => void;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  budget: number;
  currentBudget: number;
}

// Traditional South African meal options with prices
const MEAL_OPTIONS: MealOption[] = [
  // Breakfast Options
  {
    id: 'b1',
    name: 'Mieliepap with Chakalaka',
    price: 35.00,
    category: 'breakfast',
    description: 'Traditional maize porridge served with spicy vegetable relish',
    prepTime: '20 mins',
    isTraditional: true,
    nutritionalValue: 'High in carbs, fiber, vitamins',
    cuisine: 'South African'
  },
  {
    id: 'b2',
    name: 'Vetkoek & Mince',
    price: 45.00,
    category: 'breakfast',
    description: 'Deep-fried bread filled with seasoned minced meat',
    prepTime: '25 mins',
    isTraditional: true,
    nutritionalValue: 'High in protein, carbs',
    cuisine: 'South African'
  },
  {
    id: 'b3',
    name: 'Fruit and Yogurt Bowl',
    price: 40.00,
    category: 'breakfast',
    description: 'Fresh seasonal fruits with local yogurt',
    prepTime: '15 mins',
    nutritionalValue: 'Rich in vitamins, probiotics',
    cuisine: 'International'
  },

  // Lunch Options
  {
    id: 'l1',
    name: 'Bobotie',
    price: 65.00,
    category: 'lunch',
    description: 'Spiced minced meat bake with egg custard topping',
    prepTime: '35 mins',
    isTraditional: true,
    nutritionalValue: 'High in protein, moderate carbs',
    cuisine: 'South African'
  },
  {
    id: 'l2',
    name: 'Boerewors Roll',
    price: 40.00,
    category: 'lunch',
    description: 'Traditional South African sausage in a fresh roll',
    prepTime: '15 mins',
    isTraditional: true,
    nutritionalValue: 'High in protein',
    cuisine: 'South African'
  },
  {
    id: 'l3',
    name: 'Pap and Wors',
    price: 55.00,
    category: 'lunch',
    description: 'Maize meal porridge with grilled boerewors',
    prepTime: '20 mins',
    isTraditional: true,
    nutritionalValue: 'High in protein, carbs',
    cuisine: 'South African'
  },

  // Dinner Options
  {
    id: 'd1',
    name: 'Potjiekos',
    price: 85.00,
    category: 'dinner',
    description: 'Slow-cooked meat and vegetable stew',
    prepTime: '180 mins',
    isTraditional: true,
    nutritionalValue: 'Balanced protein, vegetables',
    cuisine: 'South African'
  },
  {
    id: 'd2',
    name: 'Braai Platter',
    price: 120.00,
    category: 'dinner',
    description: 'Grilled meats with pap and chakalaka',
    prepTime: '25 mins',
    isTraditional: true,
    nutritionalValue: 'High in protein, balanced sides',
    cuisine: 'South African'
  },
  {
    id: 'd3',
    name: 'Umngqusho',
    price: 70.00,
    category: 'dinner',
    description: 'Samp and beans with vegetables',
    prepTime: '20 mins',
    isTraditional: true,
    nutritionalValue: 'High in protein, fiber',
    cuisine: 'South African'
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
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [customRecipes, setCustomRecipes] = useState<MealOption[]>([]);

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

  const formatPrice = (price: number) => `R${price.toFixed(2)}`;

  // Generate recipe variations based on search query
  const generateRecipeVariations = async (query: string) => {
    setIsSearching(true);
    // Simulate API call to recipe service
    // In a real app, this would call a recipe API
    setTimeout(() => {
      const variations: MealOption[] = [
        {
          id: 'custom1',
          name: `Classic ${query}`,
          price: Math.min(budget, 75.00),
          description: `Traditional recipe for ${query}`,
          isTraditional: false,
          category: mealType,
          nutritionalValue: 'Balanced meal',
          cuisine: 'International',
          prepTime: '30 mins'
        },
        {
          id: 'custom2',
          name: `Vegetarian ${query}`,
          price: Math.min(budget, 65.00),
          description: `Meat-free version of ${query}`,
          isTraditional: false,
          category: mealType,
          nutritionalValue: 'Plant-based protein',
          cuisine: 'International',
          prepTime: '25 mins'
        },
        {
          id: 'custom3',
          name: `Spicy ${query}`,
          price: Math.min(budget, 70.00),
          description: `Hot and spicy version of ${query}`,
          isTraditional: false,
          category: mealType,
          nutritionalValue: 'Balanced meal',
          cuisine: 'Fusion',
          prepTime: '35 mins'
        },
        {
          id: 'custom4',
          name: `Low-Carb ${query}`,
          price: Math.min(budget, 85.00),
          description: `Healthy, low-carb version of ${query}`,
          isTraditional: false,
          category: mealType,
          nutritionalValue: 'High protein, low carb',
          cuisine: 'Health',
          prepTime: '30 mins'
        },
        {
          id: 'custom5',
          name: `Gourmet ${query}`,
          price: Math.min(budget, 95.00),
          description: `Premium version of ${query} with special ingredients`,
          isTraditional: false,
          category: mealType,
          nutritionalValue: 'Gourmet balanced meal',
          cuisine: 'Fusion',
          prepTime: '45 mins'
        },
      ];

      setCustomRecipes(variations.filter(meal => meal.price <= budget));
      setIsSearching(false);
    }, 1500);
  };

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

          <View style={styles.budgetContainer}>
            <View style={styles.budgetInfo}>
              <MaterialCommunityIcons name="wallet" size={20} color="#3B82F6" />
              <Text style={styles.budgetText}>
                Budget: {formatPrice(currentBudget)}
              </Text>
            </View>
            <Text style={styles.remainingBudget}>
              Remaining: {formatPrice(budget)}
            </Text>
          </View>

          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Search or type a meal (e.g. lamb chops)"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => generateRecipeVariations(searchQuery)}
                returnKeyType="search"
              />
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => generateRecipeVariations(searchQuery)}
              >
                <MaterialIcons name="search" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.filterTabs}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterTabsContent}
            >
              <TouchableOpacity
                style={[
                  styles.filterTab,
                  selectedCuisine === 'all' && styles.filterTabActive,
                ]}
                onPress={() => setSelectedCuisine('all')}
              >
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={20}
                  color={selectedCuisine === 'all' ? '#FFFFFF' : '#64748B'}
                />
                <Text
                  style={[
                    styles.filterTabText,
                    selectedCuisine === 'all' && styles.filterTabTextActive,
                  ]}
                >
                  All Cuisines
                </Text>
              </TouchableOpacity>
              {['breakfast', 'lunch', 'dinner'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.filterTab,
                    selectedCuisine === type && styles.filterTabActive,
                  ]}
                  onPress={() => setSelectedCuisine(type)}
                >
                  <MaterialCommunityIcons
                    name={getMealTypeIcon(type as MealTime)}
                    size={20}
                    color={selectedCuisine === type ? '#FFFFFF' : '#64748B'}
                  />
                  <Text
                    style={[
                      styles.filterTabText,
                      selectedCuisine === type && styles.filterTabTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <ScrollView style={styles.resultsContainer}>
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={styles.loadingText}>Finding meal variations...</Text>
              </View>
            ) : searchQuery && customRecipes.length > 0 ? (
              <>
                <Text style={styles.sectionTitle}>Recipe Variations</Text>
                {customRecipes.map((meal) => (
                  <TouchableOpacity
                    key={meal.id}
                    style={styles.mealCard}
                    onPress={() => onSelect(meal)}
                  >
                    <View style={styles.mealHeader}>
                      <View style={styles.mealTitleContainer}>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        <View style={styles.cuisineTagContainer}>
                          <Text style={styles.cuisineTag}>{meal.cuisine}</Text>
                        </View>
                      </View>
                      <Text style={styles.mealPrice}>{formatPrice(meal.price)}</Text>
                    </View>
                    <Text style={styles.mealDescription}>{meal.description}</Text>
                    <View style={styles.mealFooter}>
                      <View style={styles.mealMeta}>
                        <MaterialIcons name="schedule" size={16} color="#64748B" />
                        <Text style={styles.timingText}>{meal.prepTime}</Text>
                      </View>
                      <Text style={styles.nutritionalValue}>{meal.nutritionalValue}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <>
                <Text style={styles.sectionTitle}>Available Meals</Text>
                {paginatedMeals.map((meal) => (
                  <TouchableOpacity
                    key={meal.id}
                    style={styles.mealCard}
                    onPress={() => onSelect(meal)}
                  >
                    <View style={styles.mealHeader}>
                      <View style={styles.mealTitleContainer}>
                        <Text style={styles.mealName}>{meal.name}</Text>
                        {meal.isTraditional && (
                          <MaterialIcons
                            name="star"
                            size={16}
                            color="#FFB800"
                            style={styles.traditionalIcon}
                          />
                        )}
                      </View>
                      <Text style={styles.mealPrice}>{formatPrice(meal.price)}</Text>
                    </View>
                    <Text style={styles.mealDescription}>{meal.description}</Text>
                    <View style={styles.mealFooter}>
                      <View style={styles.mealMeta}>
                        <MaterialIcons name="schedule" size={16} color="#64748B" />
                        <Text style={styles.timingText}>{meal.prepTime}</Text>
                      </View>
                      <Text style={styles.nutritionalValue}>{meal.nutritionalValue}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
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
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  budgetContainer: {
    padding: 16,
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  budgetInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  budgetText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '600',
  },
  remainingBudget: {
    marginLeft: 28,
    fontSize: 14,
    color: '#3B82F6',
    fontWeight: '500',
  },
  searchSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  searchButton: {
    width: 44,
    height: 44,
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterTabs: {
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  filterTabsContent: {
    padding: 16,
  },
  filterTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    marginRight: 8,
  },
  filterTabActive: {
    backgroundColor: '#3B82F6',
  },
  filterTabText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#64748B',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#FFFFFF',
  },
  resultsContainer: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  mealCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  mealTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginRight: 8,
  },
  traditionalIcon: {
    marginLeft: 4,
  },
  cuisineTagContainer: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  cuisineTag: {
    fontSize: 12,
    color: '#64748B',
  },
  mealPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3B82F6',
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
    alignItems: 'center',
  },
  mealMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timingText: {
    marginLeft: 4,
    fontSize: 14,
    color: '#64748B',
  },
  nutritionalValue: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic',
  },
  loadingContainer: {
    padding: 32,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#64748B',
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