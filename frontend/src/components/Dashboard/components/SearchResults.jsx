import React from 'react';

export function SearchResults({ results = [], isLoading = false }) {
  if (isLoading) {
    return (
      <div className="absolute top-full mt-2 w-full rounded-lg bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
        <div className="p-4">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return null;
  }

  return (
    <div className="absolute top-full mt-2 w-full rounded-lg bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="py-2">
        {results.map((result) => (
          <button
            key={result.id}
            className="w-full px-4 py-2 text-left hover:bg-gray-700 cursor-pointer transition-colors 
              border-b border-gray-700 last:border-0"
            onClick={() => result.onClick?.()}
          >
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-white font-medium">{result.title}</h4>
                <p className="text-sm text-gray-400">{result.subtitle}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">
                  {result.formattedValue}
                </p>
                <p className={`text-sm flex items-center ${
                  result.isPositive ? 'text-green-400' : 'text-red-400'
                }`}>
                  {result.isPositive ? (
                    <ArrowUpRight className="h-4 w-4 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 mr-1" />
                  )}
                  {result.change}%
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
} 