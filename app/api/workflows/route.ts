import { NextRequest, NextResponse } from 'next/server';
import { Workflow } from '@/lib/types';

// Mock data for demonstration
const mockWorkflows: Workflow[] = [
  {
    id: '1',
    beoId: '1',
    name: 'Corporate Gala Setup Workflow',
    status: 'in-progress',
    steps: [
      {
        id: 'step-1',
        name: 'Menu Planning',
        description: 'Review and finalize menu with client',
        status: 'completed',
        assignedTo: 'Chef John',
      },
      {
        id: 'step-2',
        name: 'Ingredient Procurement',
        description: 'Order all necessary ingredients',
        status: 'in-progress',
        assignedTo: 'Purchasing Team',
        dependencies: ['step-1'],
      },
      {
        id: 'step-3',
        name: 'Staff Scheduling',
        description: 'Assign staff for event day',
        status: 'pending',
        assignedTo: 'HR Manager',
      },
      {
        id: 'step-4',
        name: 'Setup & Preparation',
        description: 'Prepare venue and kitchen',
        status: 'pending',
        dependencies: ['step-2', 'step-3'],
      },
    ],
    createdAt: '2026-02-15',
    updatedAt: '2026-02-19',
  },
];

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const beoId = searchParams.get('beoId');

    let filteredWorkflows = mockWorkflows;
    if (beoId) {
      filteredWorkflows = mockWorkflows.filter(w => w.beoId === beoId);
    }

    return NextResponse.json(filteredWorkflows);
  } catch (error) {
    console.error('Error fetching workflows:', error);
    return NextResponse.json(
      { error: 'Failed to fetch workflows' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newWorkflow: Workflow = {
      id: Date.now().toString(),
      ...body,
      status: 'not-started',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(newWorkflow, { status: 201 });
  } catch (error) {
    console.error('Error creating workflow:', error);
    return NextResponse.json(
      { error: 'Failed to create workflow' },
      { status: 500 }
    );
  }
}
