import axios from 'axios';
import { Recipe, RecipeSource, RecipeSourceImplementation } from '../../types/recipe.types';

export class SpoonacularSource implements RecipeSourceImplementation {
  private config: RecipeSource;
  private baseUrl = 'https://api.spoonacular.com/recipes';

  constructor(config: RecipeSource) {
    this.config = config;
  }

  public async fetchRecipes(): Promise<Recipe[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/random`, {
        params: {
          apiKey: this.config.apiKey,
          number: 10,
          tags: 'south african'
        }
      });

      return response.data.recipes.map(this.mapToRecipe.bind(this));
    } catch (error) {
      console.error('Error fetching recipes from Spoonacular:', error);
      return [];
    }
  }

  public async validateConfig(): Promise<boolean> {
    if (!this.config.apiKey) {
      console.error('Missing Spoonacular API key');
      return false;
    }

    try {
      await axios.get(`${this.baseUrl}/random`, {
        params: {
          apiKey: this.config.apiKey,
          number: 1
        }
      });
      return true;
    } catch (error) {
      console.error('Failed to validate Spoonacular API key:', error);
      return false;
    }
  }

  public getSourceType(): 'api' | 'web' | 'user' {
    return 'api';
  }

  public getSourceConfig(): RecipeSource {
    return this.config;
  }

  public mapToRecipe(data: any): Recipe {
    const difficulty = this.mapDifficulty(data.readyInMinutes);
    const category = this.mapCategory(data.dishTypes);

    return {
      externalId: data.id.toString(),
      name: data.title,
      description: data.summary,
      ingredients: data.extendedIngredients.map((ing: any) => ing.original),
      instructions: data.analyzedInstructions[0]?.steps.map((step: any) => step.step) || [],
      prepTime: `${data.preparationMinutes || 0} minutes`,
      cookTime: `${data.cookingMinutes || 0} minutes`,
      servings: data.servings,
      cuisine: data.cuisines[0] || 'Unknown',
      category,
      difficulty,
      nutritionalInfo: {
        calories: data.nutrition?.nutrients.find((n: any) => n.name === 'Calories')?.amount || 0,
        protein: data.nutrition?.nutrients.find((n: any) => n.name === 'Protein')?.amount || 0,
        carbs: data.nutrition?.nutrients.find((n: any) => n.name === 'Carbohydrates')?.amount || 0,
        fat: data.nutrition?.nutrients.find((n: any) => n.name === 'Fat')?.amount || 0,
        fiber: data.nutrition?.nutrients.find((n: any) => n.name === 'Fiber')?.amount,
        sugar: data.nutrition?.nutrients.find((n: any) => n.name === 'Sugar')?.amount,
        sodium: data.nutrition?.nutrients.find((n: any) => n.name === 'Sodium')?.amount,
      },
      tags: [...(data.dishTypes || []), ...(data.cuisines || [])],
      imageUrl: data.image,
      videoUrl: data.videoUrl,
      source: 'spoonacular',
      rating: data.spoonacularScore / 20, // Convert to 5-star scale
      reviews: data.aggregateLikes,
      isVegetarian: data.vegetarian,
      isVegan: data.vegan,
      isGlutenFree: data.glutenFree,
      isDairyFree: data.dairyFree,
      equipment: data.analyzedInstructions[0]?.steps
        .flatMap((step: any) => step.equipment)
        .map((eq: any) => eq.name)
        .filter((eq: string, index: number, self: string[]) => self.indexOf(eq) === index),
      tips: data.tips || [],
      cost: data.pricePerServing / 100, // Convert to dollars
    };
  }

  private mapDifficulty(readyInMinutes: number): Recipe['difficulty'] {
    if (readyInMinutes <= 30) return 'easy';
    if (readyInMinutes <= 60) return 'medium';
    return 'hard';
  }

  private mapCategory(dishTypes: string[]): Recipe['category'] {
    if (!dishTypes || dishTypes.length === 0) return 'dinner';
    
    const typeMap: { [key: string]: Recipe['category'] } = {
      breakfast: 'breakfast',
      brunch: 'breakfast',
      lunch: 'lunch',
      main: 'dinner',
      dinner: 'dinner',
      dessert: 'dessert',
      snack: 'snack'
    };

    for (const type of dishTypes) {
      const normalizedType = type.toLowerCase();
      if (normalizedType in typeMap) {
        return typeMap[normalizedType];
      }
    }

    return 'dinner';
  }
} 