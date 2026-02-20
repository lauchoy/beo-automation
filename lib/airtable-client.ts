import Airtable from 'airtable';
import { Recipe, AirtableRecord } from './types';

const AIRTABLE_BASE_ID = 'apprdOlzDhN9YSXJs'; // Fine Dining Recipe Library

// Initialize Airtable
const getAirtableBase = () => {
  const token = process.env.AIRTABLE_TOKEN || process.env.NEXT_PUBLIC_AIRTABLE_TOKEN;
  
  if (!token) {
    throw new Error('AIRTABLE_TOKEN is not configured');
  }

  Airtable.configure({ apiKey: token });
  return Airtable.base(AIRTABLE_BASE_ID);
};

/**
 * Fetch recipes from Airtable Fine Dining Recipe Library
 */
export async function getRecipes(
  tableName: string = 'Recipes',
  options?: {
    maxRecords?: number;
    filterByFormula?: string;
    sort?: Array<{ field: string; direction: 'asc' | 'desc' }>;
  }
): Promise<Recipe[]> {
  try {
    const base = getAirtableBase();
    const records: AirtableRecord<any>[] = [];

    await base(tableName)
      .select({
        maxRecords: options?.maxRecords || 100,
        filterByFormula: options?.filterByFormula,
        sort: options?.sort,
      })
      .eachPage((pageRecords, fetchNextPage) => {
        records.push(...pageRecords.map(r => ({
          id: r.id,
          fields: r.fields,
          createdTime: r._rawJson.createdTime,
        })));
        fetchNextPage();
      });

    return records.map(record => ({
      id: record.id,
      name: record.fields.Name || '',
      category: record.fields.Category || '',
      description: record.fields.Description || '',
      ingredients: record.fields.Ingredients || [],
      instructions: record.fields.Instructions || [],
      prepTime: record.fields.PrepTime,
      cookTime: record.fields.CookTime,
      servings: record.fields.Servings || 1,
      dietaryRestrictions: record.fields.DietaryRestrictions || [],
      allergens: record.fields.Allergens || [],
      cost: record.fields.Cost,
    }));
  } catch (error) {
    console.error('Error fetching recipes from Airtable:', error);
    throw error;
  }
}

/**
 * Get a single recipe by ID
 */
export async function getRecipeById(
  recipeId: string,
  tableName: string = 'Recipes'
): Promise<Recipe | null> {
  try {
    const base = getAirtableBase();
    const record = await base(tableName).find(recipeId);

    if (!record) return null;

    return {
      id: record.id,
      name: record.fields.Name as string || '',
      category: record.fields.Category as string || '',
      description: record.fields.Description as string || '',
      ingredients: record.fields.Ingredients as any[] || [],
      instructions: record.fields.Instructions as string[] || [],
      prepTime: record.fields.PrepTime as number,
      cookTime: record.fields.CookTime as number,
      servings: record.fields.Servings as number || 1,
      dietaryRestrictions: record.fields.DietaryRestrictions as string[] || [],
      allergens: record.fields.Allergens as string[] || [],
      cost: record.fields.Cost as number,
    };
  } catch (error) {
    console.error(`Error fetching recipe ${recipeId}:`, error);
    return null;
  }
}

/**
 * Create a new record in Airtable
 */
export async function createAirtableRecord(
  tableName: string,
  fields: Record<string, any>
): Promise<string> {
  try {
    const base = getAirtableBase();
    const record = await base(tableName).create(fields);
    return record.id;
  } catch (error) {
    console.error('Error creating Airtable record:', error);
    throw error;
  }
}

/**
 * Update an existing record in Airtable
 */
export async function updateAirtableRecord(
  tableName: string,
  recordId: string,
  fields: Record<string, any>
): Promise<void> {
  try {
    const base = getAirtableBase();
    await base(tableName).update(recordId, fields);
  } catch (error) {
    console.error('Error updating Airtable record:', error);
    throw error;
  }
}

/**
 * Delete a record from Airtable
 */
export async function deleteAirtableRecord(
  tableName: string,
  recordId: string
): Promise<void> {
  try {
    const base = getAirtableBase();
    await base(tableName).destroy(recordId);
  } catch (error) {
    console.error('Error deleting Airtable record:', error);
    throw error;
  }
}
