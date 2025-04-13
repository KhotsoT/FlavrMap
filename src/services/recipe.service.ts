import { collection, doc, getDocs, setDoc, updateDoc, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Recipe, RecipeSource, RecipeUpdate } from '../types/recipe.types';

class RecipeService {
  private static instance: RecipeService;
  private readonly RECIPE_COLLECTION = 'recipes';
  private readonly SOURCE_COLLECTION = 'recipe_sources';
  private readonly UPDATE_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

  private constructor() {}

  public static getInstance(): RecipeService {
    if (!RecipeService.instance) {
      RecipeService.instance = new RecipeService();
    }
    return RecipeService.instance;
  }

  /**
   * Fetches recipes from various sources and updates the repository
   */
  public async updateRecipeRepository(): Promise<void> {
    try {
      // Get all configured recipe sources
      const sources = await this.getRecipeSources();
      
      // Fetch recipes from each source
      for (const source of sources) {
        const recipes = await this.fetchRecipesFromSource(source);
        await this.processAndStoreRecipes(recipes, source);
      }

      // Clean up old recipes
      await this.cleanupOldRecipes();
    } catch (error) {
      console.error('Error updating recipe repository:', error);
      throw error;
    }
  }

  /**
   * Fetches recipes from a specific source
   */
  private async fetchRecipesFromSource(source: RecipeSource): Promise<Recipe[]> {
    switch (source.type) {
      case 'api':
        return this.fetchFromAPI(source);
      case 'web':
        return this.fetchFromWeb(source);
      case 'user':
        return this.fetchUserRecipes(source);
      default:
        throw new Error(`Unsupported recipe source type: ${source.type}`);
    }
  }

  /**
   * Fetches recipes from an API source
   */
  private async fetchFromAPI(source: RecipeSource): Promise<Recipe[]> {
    // Implementation for API-based recipe fetching
    // This would use the source's configuration to make API calls
    return [];
  }

  /**
   * Fetches recipes from web sources
   */
  private async fetchFromWeb(source: RecipeSource): Promise<Recipe[]> {
    // Implementation for web scraping
    // This would use the source's configuration to scrape recipe sites
    return [];
  }

  /**
   * Fetches user-submitted recipes
   */
  private async fetchUserRecipes(source: RecipeSource): Promise<Recipe[]> {
    // Implementation for fetching user recipes
    return [];
  }

  /**
   * Processes and stores recipes in the database
   */
  private async processAndStoreRecipes(recipes: Recipe[], source: RecipeSource): Promise<void> {
    for (const recipe of recipes) {
      // Normalize recipe data
      const normalizedRecipe = this.normalizeRecipe(recipe);
      
      // Check if recipe already exists
      const existingRecipe = await this.getRecipeByExternalId(normalizedRecipe.externalId);
      
      if (existingRecipe) {
        // Update existing recipe
        await this.updateRecipe(existingRecipe.id, {
          ...normalizedRecipe,
          lastUpdated: new Date(),
          source: source.id
        });
      } else {
        // Add new recipe
        await this.addRecipe({
          ...normalizedRecipe,
          source: source.id,
          createdAt: new Date(),
          lastUpdated: new Date()
        });
      }
    }
  }

  /**
   * Normalizes recipe data to ensure consistency
   */
  private normalizeRecipe(recipe: Recipe): Recipe {
    return {
      ...recipe,
      ingredients: this.normalizeIngredients(recipe.ingredients),
      instructions: this.normalizeInstructions(recipe.instructions),
      nutritionalInfo: this.calculateNutritionalInfo(recipe),
      tags: this.generateTags(recipe)
    };
  }

  /**
   * Normalizes ingredient measurements and names
   */
  private normalizeIngredients(ingredients: string[]): string[] {
    // Implementation for ingredient normalization
    return ingredients;
  }

  /**
   * Normalizes cooking instructions
   */
  private normalizeInstructions(instructions: string[]): string[] {
    // Implementation for instruction normalization
    return instructions;
  }

  /**
   * Calculates nutritional information
   */
  private calculateNutritionalInfo(recipe: Recipe): any {
    // Implementation for nutritional calculation
    return {};
  }

  /**
   * Generates relevant tags for the recipe
   */
  private generateTags(recipe: Recipe): string[] {
    // Implementation for tag generation
    return [];
  }

  /**
   * Gets all configured recipe sources
   */
  private async getRecipeSources(): Promise<RecipeSource[]> {
    const sourcesRef = collection(db, this.SOURCE_COLLECTION);
    const snapshot = await getDocs(sourcesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as RecipeSource[];
  }

  /**
   * Gets a recipe by its external ID
   */
  private async getRecipeByExternalId(externalId: string): Promise<Recipe | null> {
    const recipesRef = collection(db, this.RECIPE_COLLECTION);
    const q = query(recipesRef, where('externalId', '==', externalId));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Recipe;
  }

  /**
   * Adds a new recipe to the database
   */
  private async addRecipe(recipe: Recipe): Promise<void> {
    const recipesRef = collection(db, this.RECIPE_COLLECTION);
    await setDoc(doc(recipesRef), recipe);
  }

  /**
   * Updates an existing recipe
   */
  private async updateRecipe(recipeId: string, updates: RecipeUpdate): Promise<void> {
    const recipeRef = doc(db, this.RECIPE_COLLECTION, recipeId);
    await updateDoc(recipeRef, updates);
  }

  /**
   * Cleans up old recipes that haven't been updated
   */
  private async cleanupOldRecipes(): Promise<void> {
    const cutoffDate = new Date(Date.now() - this.UPDATE_INTERVAL);
    const recipesRef = collection(db, this.RECIPE_COLLECTION);
    const q = query(
      recipesRef,
      where('lastUpdated', '<', cutoffDate),
      orderBy('lastUpdated', 'desc'),
      limit(100)
    );
    
    const snapshot = await getDocs(q);
    // Implementation for cleaning up old recipes
  }
}

export default RecipeService; 