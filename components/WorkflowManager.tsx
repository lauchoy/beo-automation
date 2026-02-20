'use client';

import { useState, useEffect } from 'react';
import { Workflow, WorkflowStep } from '@/lib/types';
import { cn, getStatusColor } from '@/lib/utils';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';

interface WorkflowManagerProps {
  beoId?: string;
}

export default function WorkflowManager({ beoId }: WorkflowManagerProps) {
  const [workflows, setWorkflows] = useState<Workflow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkflows();
  }, [beoId]);

  const fetchWorkflows = async () => {
    try {
      setLoading(true);
      const url = beoId ? `/api/workflows?beoId=${beoId}` : '/api/workflows';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch workflows');
      const data = await response.json();
      setWorkflows(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStepIcon = (status: WorkflowStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'failed':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Workflow Automation</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Create Workflow
        </button>
      </div>

      <div className="space-y-4">
        {workflows.map((workflow) => (
          <div
            key={workflow.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden"
          >
            {/* Workflow Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{workflow.name}</h3>
                  <p className="text-sm text-gray-500 mt-1">BEO ID: {workflow.beoId}</p>
                </div>
                <span
                  className={cn(
                    'px-3 py-1 text-sm font-medium rounded-full',
                    getStatusColor(workflow.status)
                  )}
                >
                  {workflow.status}
                </span>
              </div>
            </div>

            {/* Workflow Steps */}
            <div className="p-6">
              <div className="space-y-4">
                {workflow.steps.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    {/* Step Icon */}
                    <div className="flex flex-col items-center">
                      {getStepIcon(step.status)}
                      {index < workflow.steps.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900">{step.name}</h4>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                          {step.assignedTo && (
                            <p className="text-sm text-gray-500 mt-2">
                              Assigned to: {step.assignedTo}
                            </p>
                          )}
                          {step.dueDate && (
                            <p className="text-sm text-gray-500">
                              Due: {new Date(step.dueDate).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                        <span
                          className={cn(
                            'px-2 py-1 text-xs font-medium rounded',
                            getStatusColor(step.status)
                          )}
                        >
                          {step.status}
                        </span>
                      </div>

                      {step.dependencies && step.dependencies.length > 0 && (
                        <div className="mt-2 text-xs text-gray-500">
                          Depends on: {step.dependencies.join(', ')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {workflows.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No workflows found. Create your first automation workflow!</p>
        </div>
      )}
    </div>
  );
}
