import { NextRequest, NextResponse } from 'next/server';
import { getRecipes } from '@/lib/airtable-client';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');
    const maxRecords = parseInt(searchParams.get('maxRecords') || '100');

    const filterFormula = category ? `{Category} = '${category}'` : undefined;

    const recipes = await getRecipes('Recipes', {
      maxRecords,
      filterByFormula: filterFormula,
      sort: [{ field: 'Name', direction: 'asc' }],
    });

    return NextResponse.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch recipes from Airtable' },
      { status: 500 }
    );
  }
}
