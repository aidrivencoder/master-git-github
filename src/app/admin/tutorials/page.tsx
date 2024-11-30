'use client';

import { useEffect, useState } from 'react';
import { Tutorial } from '@/types/tutorial';
import { tutorials } from '@/tutorials/data';

export default function TutorialsManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'premium' | 'free'>('all');

  const filteredTutorials = tutorials
    .filter(tutorial => 
      tutorial.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutorial.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(tutorial => {
      if (filter === 'premium') return tutorial.isPremium;
      if (filter === 'free') return !tutorial.isPremium;
      return true;
    });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tutorial Management</h1>
        <div className="flex items-center space-x-4">
          <select
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'premium' | 'free')}
          >
            <option value="all">All Tutorials</option>
            <option value="premium">Premium Only</option>
            <option value="free">Free Only</option>
          </select>
          <input
            type="text"
            placeholder="Search tutorials..."
            className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTutorials.map((tutorial) => (
          <div key={tutorial.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold">{tutorial.title}</h2>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  tutorial.isPremium 
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {tutorial.isPremium ? 'Premium' : 'Free'}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {tutorial.description}
              </p>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Difficulty:</span>
                  <span className="ml-2 font-medium capitalize">{tutorial.difficulty}</span>
                </div>
                <div>
                  <span className="text-gray-500">Steps:</span>
                  <span className="ml-2 font-medium">{tutorial.steps.length}</span>
                </div>
                <div>
                  <span className="text-gray-500">Est. Time:</span>
                  <span className="ml-2 font-medium">{tutorial.estimatedTime} min</span>
                </div>
                {tutorial.prerequisites && tutorial.prerequisites.length > 0 && (
                  <div>
                    <span className="text-gray-500">Prerequisites:</span>
                    <span className="ml-2 font-medium">{tutorial.prerequisites.length}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex flex-wrap gap-2">
                  <span
                    className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                  >
                    {tutorial.steps[0].type}
                  </span>
                  {tutorial.steps.some(step => step.quiz) && (
                    <span
                      className="px-2 py-1 bg-blue-100 text-blue-600 rounded-full text-xs"
                    >
                      Has Quiz
                    </span>
                  )}
                  {tutorial.steps.some(step => step.gitVisualization) && (
                    <span
                      className="px-2 py-1 bg-green-100 text-green-600 rounded-full text-xs"
                    >
                      Git Visual
                    </span>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-4 border-t flex justify-end items-center">
                <button
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                  onClick={() => {
                    // TODO: Implement edit functionality
                    console.log('Edit tutorial:', tutorial.id);
                  }}
                >
                  Edit Tutorial
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
