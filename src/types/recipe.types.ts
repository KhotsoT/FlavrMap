export interface Recipe {
  id?: string;
  externalId: string;
  name: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
  cookTime: string;
  servings: number;
  cuisine: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'dessert';
  difficulty: 'easy' | 'medium' | 'hard';
  nutritionalInfo: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber?: number;
    sugar?: number;
    sodium?: number;
  };
  tags: string[];
  imageUrl?: string;
  videoUrl?: string;
  source: string;
  createdAt?: Date;
  lastUpdated?: Date;
  rating?: number;
  reviews?: number;
  author?: string;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  allergens?: string[];
  equipment?: string[];
  tips?: string[];
  variations?: string[];
  season?: string[];
  cost?: number;
  popularity?: number;
}

export interface RecipeSource {
  id: string;
  name: string;
  type: 'api' | 'web' | 'user';
  url?: string;
  apiKey?: string;
  config?: {
    [key: string]: any;
  };
  lastSync?: Date;
  isActive: boolean;
  priority: number;
}

export interface RecipeSourceImplementation {
  fetchRecipes(): Promise<Recipe[]>;
  validateConfig(): Promise<boolean>;
  getSourceType(): 'api' | 'web' | 'user';
  getSourceConfig(): RecipeSource;
  mapToRecipe(data: any): Recipe;
}

export interface RecipeUpdate {
  name?: string;
  description?: string;
  ingredients?: string[];
  instructions?: string[];
  prepTime?: string;
  cookTime?: string;
  servings?: number;
  cuisine?: string;
  category?: Recipe['category'];
  difficulty?: Recipe['difficulty'];
  nutritionalInfo?: Recipe['nutritionalInfo'];
  tags?: string[];
  imageUrl?: string;
  videoUrl?: string;
  lastUpdated?: Date;
  rating?: number;
  reviews?: number;
  isVegetarian?: boolean;
  isVegan?: boolean;
  isGlutenFree?: boolean;
  isDairyFree?: boolean;
  allergens?: string[];
  equipment?: string[];
  tips?: string[];
  variations?: string[];
  season?: string[];
  cost?: number;
  popularity?: number;
} 