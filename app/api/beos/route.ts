import { NextRequest, NextResponse } from 'next/server';
import { BEO } from '@/lib/types';

// Mock data for demonstration
// In production, this would fetch from your database or Airtable
const mockBEOs: BEO[] = [
  {
    id: '1',
    eventName: 'Corporate Gala Dinner',
    eventDate: '2026-03-15',
    eventTime: '7:00 PM',
    clientName: 'Tech Corp Inc.',
    guestCount: 150,
    venue: 'Grand Ballroom',
    status: 'approved',
    menuItems: ['recipe-1', 'recipe-2'],
    totalCost: 15000,
    createdAt: '2026-02-01',
    updatedAt: '2026-02-15',
  },
  {
    id: '2',
    eventName: 'Wedding Reception',
    eventDate: '2026-04-20',
    eventTime: '6:00 PM',
    clientName: 'Smith Family',
    guestCount: 200,
    venue: 'Garden Pavilion',
    status: 'in-progress',
    menuItems: ['recipe-3', 'recipe-4', 'recipe-5'],
    totalCost: 25000,
    createdAt: '2026-02-10',
    updatedAt: '2026-02-18',
  },
];

export async function GET(request: NextRequest) {
  try {
    // In production, fetch from database/Airtable
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');

    let filteredBEOs = mockBEOs;
    if (status) {
      filteredBEOs = mockBEOs.filter(beo => beo.status === status);
    }

    return NextResponse.json(filteredBEOs);
  } catch (error) {
    console.error('Error fetching BEOs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch BEOs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // In production, validate with BEOSchema and save to database
    
    const newBEO: BEO = {
      id: Date.now().toString(),
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(newBEO, { status: 201 });
  } catch (error) {
    console.error('Error creating BEO:', error);
    return NextResponse.json(
      { error: 'Failed to create BEO' },
      { status: 500 }
    );
  }
}
