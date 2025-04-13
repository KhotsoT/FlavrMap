import { Recipe, RecipeSource, RecipeSourceImplementation } from '../../types/recipe.types';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';

export class LocalSource implements RecipeSourceImplementation {
  private config: RecipeSource;
  private readonly COLLECTION = 'user_recipes';

  constructor(config: RecipeSource) {
    this.config = config;
  }

  public async fetchRecipes(): Promise<Recipe[]> {
    try {
      const recipesRef = collection(db, this.COLLECTION);
      const q = query(recipesRef, where('source', '==', 'local'));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
        externalId: doc.id,
      })) as Recipe[];
    } catch (error) {
      console.error('Error fetching local recipes:', error);
      return [];
    }
  }

  public async validateConfig(): Promise<boolean> {
    return true; // Local source doesn't need external validation
  }

  public getSourceType(): 'api' | 'web' | 'user' {
    return 'user';
  }

  public getSourceConfig(): RecipeSource {
    return this.config;
  }

  public mapToRecipe(data: any): Recipe {
    return {
      ...data,
      source: 'local',
      externalId: data.id || '',
    };
  }
} 