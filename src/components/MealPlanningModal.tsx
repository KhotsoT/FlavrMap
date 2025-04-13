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
  category: string;
  description: string;
  prepTime: string;
  isTraditional?: boolean;
  cuisine: string;
  servings: number;
  ingredients: string[];
  method: string[];
  tips?: string[];
  nutritionalValue: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
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
    cuisine: 'South African',
    servings: 2,
    ingredients: [
      '1 cup maize meal',
      '2 cups water',
      '1 tsp salt',
      '1 onion, chopped',
      '1 green pepper, chopped',
      '1 carrot, grated',
      '1 can baked beans',
      '2 tbsp curry powder',
      '1 tsp paprika',
      '2 tbsp oil'
    ],
    method: [
      'For the Mieliepap:',
      '1. Bring water to boil in a pot',
      '2. Add salt and gradually stir in maize meal',
      '3. Reduce heat and simmer for 15 minutes, stirring occasionally',
      '4. Cover and let stand for 5 minutes',
      '',
      'For the Chakalaka:',
      '1. Heat oil in a pan and sauté onions until translucent',
      '2. Add green pepper and cook for 2 minutes',
      '3. Stir in grated carrot and cook for another 2 minutes',
      '4. Add curry powder and paprika, mix well',
      '5. Add baked beans and simmer for 5 minutes',
      '6. Season to taste',
      '',
      'Serve the mieliepap hot with chakalaka on top'
    ],
    tips: [
      'For creamier pap, use milk instead of water',
      'Add a knob of butter to the pap for extra richness',
      'Adjust spice levels in chakalaka to your preference',
      'Can be served with boerewors for a complete meal'
    ],
    nutritionalValue: {
      calories: 200,
      protein: 5,
      carbs: 40,
      fat: 1,
    }
  },
  {
    id: 'b2',
    name: 'Full English Breakfast',
    price: 45.00,
    category: 'breakfast',
    description: 'Classic British breakfast with eggs, bacon, sausage, and more',
    prepTime: '25 mins',
    cuisine: 'British',
    servings: 2,
    ingredients: [
      '4 eggs',
      '4 rashers bacon',
      '4 pork sausages',
      '2 tomatoes, halved',
      '4 mushrooms',
      '1 can baked beans',
      '4 slices toast',
      'Butter for frying',
      'Salt and pepper'
    ],
    method: [
      '1. Heat a large frying pan and cook bacon until crispy',
      '2. In the same pan, cook sausages until browned',
      '3. Add tomatoes and mushrooms to the pan',
      '4. In a separate pan, heat baked beans',
      '5. Fry eggs to your preference',
      '6. Toast bread and butter',
      '7. Arrange all components on plates',
      '8. Season with salt and pepper'
    ],
    tips: [
      'Cook components in order of cooking time',
      'Keep cooked items warm in a low oven',
      'Use good quality sausages and bacon',
      'Serve with HP sauce or ketchup'
    ],
    nutritionalValue: {
      calories: 800,
      protein: 35,
      carbs: 45,
      fat: 50,
    }
  },
  {
    id: 'b3',
    name: 'Chilaquiles',
    price: 40.00,
    category: 'breakfast',
    description: 'Traditional Mexican breakfast with tortilla chips and salsa',
    prepTime: '20 mins',
    cuisine: 'Mexican',
    servings: 2,
    ingredients: [
      '4 corn tortillas, cut into triangles',
      '2 cups salsa verde',
      '2 eggs',
      '1/2 cup queso fresco',
      '1/4 cup crema',
      '1/4 cup chopped cilantro',
      '1/2 onion, sliced',
      'Oil for frying',
      'Salt to taste'
    ],
    method: [
      '1. Fry tortilla triangles until crispy',
      '2. Heat salsa verde in a pan',
      '3. Add fried tortillas to the salsa',
      '4. Fry eggs sunny-side up',
      '5. Top chilaquiles with eggs',
      '6. Garnish with queso fresco, crema, cilantro, and onions',
      '7. Season with salt'
    ],
    tips: [
      'Use homemade salsa for best flavor',
      'Don\'t let tortillas get too soggy',
      'Add avocado for extra creaminess',
      'Serve with refried beans'
    ],
    nutritionalValue: {
      calories: 450,
      protein: 15,
      carbs: 40,
      fat: 25,
    }
  },

  // Lunch Options
  {
    id: 'l1',
    name: 'Pad Thai',
    price: 65.00,
    category: 'lunch',
    description: 'Classic Thai stir-fried noodles with tamarind sauce',
    prepTime: '30 mins',
    cuisine: 'Thai',
    servings: 2,
    ingredients: [
      '200g rice noodles',
      '2 eggs',
      '100g tofu, cubed',
      '2 tbsp tamarind paste',
      '2 tbsp fish sauce',
      '1 tbsp sugar',
      '2 cloves garlic, minced',
      '1 shallot, sliced',
      '100g bean sprouts',
      '2 spring onions, chopped',
      '2 tbsp peanuts, crushed',
      'Lime wedges',
      'Oil for frying'
    ],
    method: [
      '1. Soak rice noodles in warm water for 15 minutes',
      '2. Mix tamarind paste, fish sauce, and sugar',
      '3. Heat oil and scramble eggs, set aside',
      '4. Stir-fry garlic and shallot until fragrant',
      '5. Add tofu and cook until golden',
      '6. Add noodles and sauce, toss well',
      '7. Add bean sprouts and spring onions',
      '8. Top with crushed peanuts and lime wedges'
    ],
    tips: [
      'Use fresh rice noodles if available',
      'Adjust sauce ingredients to taste',
      'Add chili flakes for heat',
      'Serve immediately for best texture'
    ],
    nutritionalValue: {
      calories: 550,
      protein: 20,
      carbs: 70,
      fat: 15,
    }
  },
  {
    id: 'l2',
    name: 'Margherita Pizza',
    price: 60.00,
    category: 'lunch',
    description: 'Classic Italian pizza with tomato and mozzarella',
    prepTime: '45 mins',
    cuisine: 'Italian',
    servings: 2,
    ingredients: [
      '250g pizza dough',
      '1/2 cup tomato sauce',
      '200g fresh mozzarella',
      'Fresh basil leaves',
      '2 tbsp olive oil',
      'Salt and pepper'
    ],
    method: [
      '1. Preheat oven to highest temperature',
      '2. Roll out pizza dough',
      '3. Spread tomato sauce evenly',
      '4. Tear mozzarella and distribute',
      '5. Drizzle with olive oil',
      '6. Bake for 10-12 minutes',
      '7. Top with fresh basil',
      '8. Season with salt and pepper'
    ],
    tips: [
      'Use a pizza stone for best results',
      'Let dough rest before rolling',
      'Use fresh, high-quality ingredients',
      'Don\'t overload with toppings'
    ],
    nutritionalValue: {
      calories: 600,
      protein: 25,
      carbs: 80,
      fat: 20,
    }
  },
  {
    id: 'l3',
    name: 'Pap and Wors',
    price: 55.00,
    category: 'lunch',
    description: 'Maize meal porridge with grilled boerewors',
    prepTime: '20 mins',
    isTraditional: true,
    cuisine: 'South African',
    servings: 2,
    ingredients: ['maize', 'boerewors'],
    method: ['cook'],
    nutritionalValue: {
      calories: 200,
      protein: 5,
      carbs: 40,
      fat: 1,
    }
  },

  // Dinner Options
  {
    id: 'd1',
    name: 'Butter Chicken',
    price: 85.00,
    category: 'dinner',
    description: 'Creamy Indian curry with tender chicken',
    prepTime: '40 mins',
    cuisine: 'Indian',
    servings: 4,
    ingredients: [
      '500g chicken thighs',
      '1 cup yogurt',
      '2 tbsp lemon juice',
      '2 tbsp garam masala',
      '1 tbsp turmeric',
      '2 tbsp butter',
      '1 onion, chopped',
      '3 cloves garlic, minced',
      '1 tbsp ginger, grated',
      '1 can tomato puree',
      '1 cup cream',
      'Fresh cilantro',
      'Salt to taste'
    ],
    method: [
      '1. Marinate chicken in yogurt, lemon juice, and spices',
      '2. Heat butter and cook onions until golden',
      '3. Add garlic and ginger, cook until fragrant',
      '4. Add tomato puree and cook for 5 minutes',
      '5. Add marinated chicken and cook until done',
      '6. Stir in cream and simmer for 5 minutes',
      '7. Garnish with fresh cilantro',
      '8. Serve with naan or rice'
    ],
    tips: [
      'Marinate chicken overnight for best flavor',
      'Use full-fat cream for richness',
      'Adjust spice levels to taste',
      'Let curry rest before serving'
    ],
    nutritionalValue: {
      calories: 450,
      protein: 30,
      carbs: 15,
      fat: 30,
    }
  },
  {
    id: 'd2',
    name: 'Beef Bourguignon',
    price: 95.00,
    category: 'dinner',
    description: 'Classic French beef stew with red wine',
    prepTime: '180 mins',
    cuisine: 'French',
    servings: 4,
    ingredients: [
      '1kg beef chuck, cubed',
      '200g bacon, diced',
      '2 onions, chopped',
      '3 carrots, sliced',
      '2 cloves garlic, minced',
      '2 cups red wine',
      '2 cups beef stock',
      '1 tbsp tomato paste',
      '1 bouquet garni',
      '250g mushrooms, quartered',
      '20 pearl onions',
      '2 tbsp flour',
      'Butter and oil for cooking',
      'Salt and pepper'
    ],
    method: [
      '1. Brown beef in batches, set aside',
      '2. Cook bacon until crispy',
      '3. Sauté onions and carrots',
      '4. Add garlic and flour, cook for 1 minute',
      '5. Deglaze with wine, add stock and tomato paste',
      '6. Return beef and add bouquet garni',
      '7. Simmer for 2 hours',
      '8. Add mushrooms and pearl onions',
      '9. Cook for 30 more minutes',
      '10. Season to taste'
    ],
    tips: [
      'Use good quality red wine',
      'Cook low and slow for tender meat',
      'Skim fat from surface while cooking',
      'Serve with mashed potatoes'
    ],
    nutritionalValue: {
      calories: 550,
      protein: 40,
      carbs: 20,
      fat: 35,
    }
  },
  {
    id: 'd3',
    name: 'Umngqusho',
    price: 70.00,
    category: 'dinner',
    description: 'Samp and beans with vegetables',
    prepTime: '20 mins',
    isTraditional: true,
    cuisine: 'South African',
    servings: 4,
    ingredients: ['samp', 'beans', 'vegetables'],
    method: ['cook'],
    nutritionalValue: {
      calories: 300,
      protein: 10,
      carbs: 50,
      fat: 1,
    }
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
          cuisine: 'International',
          prepTime: '30 mins',
          servings: 2,
          ingredients: ['meat', 'vegetables'],
          method: ['cook'],
          nutritionalValue: {
            calories: 600,
            protein: 20,
            carbs: 50,
            fat: 30,
          }
        },
        {
          id: 'custom2',
          name: `Vegetarian ${query}`,
          price: Math.min(budget, 65.00),
          description: `Meat-free version of ${query}`,
          isTraditional: false,
          category: mealType,
          cuisine: 'International',
          prepTime: '25 mins',
          servings: 2,
          ingredients: ['vegetables'],
          method: ['cook'],
          nutritionalValue: {
            calories: 300,
            protein: 5,
            carbs: 40,
            fat: 1,
          }
        },
        {
          id: 'custom3',
          name: `Spicy ${query}`,
          price: Math.min(budget, 70.00),
          description: `Hot and spicy version of ${query}`,
          isTraditional: false,
          category: mealType,
          cuisine: 'Fusion',
          prepTime: '35 mins',
          servings: 2,
          ingredients: ['meat', 'vegetables'],
          method: ['grill'],
          nutritionalValue: {
            calories: 800,
            protein: 25,
            carbs: 60,
            fat: 40,
          }
        },
        {
          id: 'custom4',
          name: `Low-Carb ${query}`,
          price: Math.min(budget, 85.00),
          description: `Healthy, low-carb version of ${query}`,
          isTraditional: false,
          category: mealType,
          cuisine: 'Health',
          prepTime: '30 mins',
          servings: 2,
          ingredients: ['meat', 'vegetables'],
          method: ['cook'],
          nutritionalValue: {
            calories: 500,
            protein: 15,
            carbs: 40,
            fat: 20,
          }
        },
        {
          id: 'custom5',
          name: `Gourmet ${query}`,
          price: Math.min(budget, 95.00),
          description: `Premium version of ${query} with special ingredients`,
          isTraditional: false,
          category: mealType,
          cuisine: 'Fusion',
          prepTime: '45 mins',
          servings: 2,
          ingredients: ['meat', 'vegetables'],
          method: ['grill'],
          nutritionalValue: {
            calories: 1000,
            protein: 30,
            carbs: 70,
            fat: 50,
          }
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
                      <Text style={styles.nutritionalValue}>{meal.nutritionalValue.calories} calories</Text>
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
                      <Text style={styles.nutritionalValue}>{meal.nutritionalValue.calories} calories</Text>
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
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
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