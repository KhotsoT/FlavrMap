import axios from 'axios';
import { Recipe, RecipeSource, RecipeSourceImplementation } from '../../types/recipe.types';
import { CheerioAPI, Element } from 'cheerio';
import * as cheerio from 'cheerio';

export class WebScraperSource implements RecipeSourceImplementation {
  private config: RecipeSource;
  private readonly supportedDomains = [
    'food24.com',
    'tasty.co.za',
    'foodnetwork.co.za'
  ];

  constructor(config: RecipeSource) {
    this.config = config;
  }

  public async fetchRecipes(): Promise<Recipe[]> {
    try {
      if (!this.config.url) {
        throw new Error('No URL provided for web scraping');
      }

      const domain = new URL(this.config.url).hostname;
      if (!this.supportedDomains.includes(domain)) {
        throw new Error(`Unsupported domain: ${domain}`);
      }

      const response = await axios.get(this.config.url);
      const $ = cheerio.load(response.data);
      const recipes: Recipe[] = [];

      // Find recipe elements based on domain-specific selectors
      switch (domain) {
        case 'food24.com':
          recipes.push(...this.scrapeFood24($));
          break;
        case 'tasty.co.za':
          recipes.push(...this.scrapeTasty($));
          break;
        case 'foodnetwork.co.za':
          recipes.push(...this.scrapeFoodNetwork($));
          break;
      }

      return recipes;
    } catch (error) {
      console.error('Error scraping recipes:', error);
      return [];
    }
  }

  public async validateConfig(): Promise<boolean> {
    if (!this.config.url) {
      console.error('No URL provided for web scraping');
      return false;
    }

    try {
      const domain = new URL(this.config.url).hostname;
      return this.supportedDomains.includes(domain);
    } catch (error) {
      console.error('Invalid URL:', error);
      return false;
    }
  }

  public getSourceType(): 'api' | 'web' | 'user' {
    return 'web';
  }

  public getSourceConfig(): RecipeSource {
    return this.config;
  }

  public mapToRecipe(data: any): Recipe {
    return {
      externalId: data.id || `${this.config.id}_${Date.now()}`,
      name: data.title,
      description: data.description,
      ingredients: data.ingredients,
      instructions: data.instructions,
      prepTime: data.prepTime || '0 minutes',
      cookTime: data.cookTime || '0 minutes',
      servings: data.servings || 4,
      cuisine: data.cuisine || 'South African',
      category: this.mapCategory(data.category),
      difficulty: this.mapDifficulty(data.difficulty),
      nutritionalInfo: {
        calories: data.calories || 0,
        protein: data.protein || 0,
        carbs: data.carbs || 0,
        fat: data.fat || 0,
      },
      tags: data.tags || [],
      imageUrl: data.imageUrl,
      source: this.config.id,
      isVegetarian: data.isVegetarian || false,
      isVegan: data.isVegan || false,
      isGlutenFree: data.isGlutenFree || false,
      isDairyFree: data.isDairyFree || false,
    };
  }

  private scrapeFood24($: CheerioAPI): Recipe[] {
    const recipes: Recipe[] = [];
    $('.recipe-card').each((_: number, element: Element) => {
      const $el = $(element);
      recipes.push(this.mapToRecipe({
        title: $el.find('.recipe-title').text().trim(),
        description: $el.find('.recipe-description').text().trim(),
        ingredients: $el.find('.ingredients li').map((_: number, ing: Element) => $(ing).text().trim()).get(),
        instructions: $el.find('.instructions li').map((_: number, step: Element) => $(step).text().trim()).get(),
        prepTime: $el.find('.prep-time').text().trim(),
        cookTime: $el.find('.cook-time').text().trim(),
        servings: parseInt($el.find('.servings').text().trim(), 10),
        imageUrl: $el.find('img').attr('src'),
        category: $el.find('.category').text().trim(),
        difficulty: $el.find('.difficulty').text().trim(),
      }));
    });
    return recipes;
  }

  private scrapeTasty($: CheerioAPI): Recipe[] {
    const recipes: Recipe[] = [];
    $('.recipe-item').each((_: number, element: Element) => {
      const $el = $(element);
      recipes.push(this.mapToRecipe({
        title: $el.find('.recipe-name').text().trim(),
        description: $el.find('.recipe-summary').text().trim(),
        ingredients: $el.find('.ingredient-list li').map((_: number, ing: Element) => $(ing).text().trim()).get(),
        instructions: $el.find('.method-steps li').map((_: number, step: Element) => $(step).text().trim()).get(),
        prepTime: $el.find('.preparation-time').text().trim(),
        cookTime: $el.find('.cooking-time').text().trim(),
        servings: parseInt($el.find('.serves').text().trim(), 10),
        imageUrl: $el.find('.recipe-image img').attr('src'),
        category: $el.find('.meal-type').text().trim(),
        difficulty: $el.find('.skill-level').text().trim(),
      }));
    });
    return recipes;
  }

  private scrapeFoodNetwork($: CheerioAPI): Recipe[] {
    const recipes: Recipe[] = [];
    $('.recipe').each((_: number, element: Element) => {
      const $el = $(element);
      recipes.push(this.mapToRecipe({
        title: $el.find('h1').text().trim(),
        description: $el.find('.recipe-description').text().trim(),
        ingredients: $el.find('.ingredients-list li').map((_: number, ing: Element) => $(ing).text().trim()).get(),
        instructions: $el.find('.method-steps li').map((_: number, step: Element) => $(step).text().trim()).get(),
        prepTime: $el.find('.prep-time').text().trim(),
        cookTime: $el.find('.cook-time').text().trim(),
        servings: parseInt($el.find('.serves').text().trim(), 10),
        imageUrl: $el.find('.recipe-image').attr('src'),
        category: $el.find('.recipe-category').text().trim(),
        difficulty: $el.find('.difficulty-level').text().trim(),
      }));
    });
    return recipes;
  }

  private mapCategory(category: string = ''): Recipe['category'] {
    const lowerCategory = category.toLowerCase();
    if (lowerCategory.includes('breakfast')) return 'breakfast';
    if (lowerCategory.includes('lunch')) return 'lunch';
    if (lowerCategory.includes('dinner')) return 'dinner';
    if (lowerCategory.includes('dessert')) return 'dessert';
    if (lowerCategory.includes('snack')) return 'snack';
    return 'dinner';
  }

  private mapDifficulty(difficulty: string = ''): Recipe['difficulty'] {
    const lowerDifficulty = difficulty.toLowerCase();
    if (lowerDifficulty.includes('easy')) return 'easy';
    if (lowerDifficulty.includes('medium') || lowerDifficulty.includes('intermediate')) return 'medium';
    if (lowerDifficulty.includes('hard') || lowerDifficulty.includes('difficult')) return 'hard';
    return 'medium';
  }
} 