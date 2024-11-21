import React from 'react';

export const Alert = ({ children, className = '' }) => (
  <div className={`rounded-lg p-4 ${className}`}>
    {children}
  </div>
);

export const AlertDescription = ({ children, className = '' }) => (
  <p className={`text-sm ${className}`}>
    {children}
  </p>
);
