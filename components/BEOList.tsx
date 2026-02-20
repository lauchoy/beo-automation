'use client';

import { useState, useEffect } from 'react';
import { BEO } from '@/lib/types';
import { formatDate, formatCurrency, getStatusColor, cn } from '@/lib/utils';
import { Calendar, Users, MapPin, DollarSign } from 'lucide-react';

export default function BEOList() {
  const [beos, setBeos] = useState<BEO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchBEOs();
  }, []);

  const fetchBEOs = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/beos');
      if (!response.ok) throw new Error('Failed to fetch BEOs');
      const data = await response.json();
      setBeos(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Banquet Event Orders</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition">
          Create New BEO
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {beos.map((beo) => (
          <div
            key={beo.id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold text-gray-900">{beo.eventName}</h3>
              <span
                className={cn(
                  'px-2 py-1 text-xs font-medium rounded-full',
                  getStatusColor(beo.status)
                )}
              >
                {beo.status}
              </span>
            </div>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(beo.eventDate)} at {beo.eventTime}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{beo.guestCount} guests</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{beo.venue}</span>
              </div>
              {beo.totalCost && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4" />
                  <span>{formatCurrency(beo.totalCost)}</span>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Client: {beo.clientName}</p>
            </div>
          </div>
        ))}
      </div>

      {beos.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No BEOs found. Create your first event!</p>
        </div>
      )}
    </div>
  );
}
