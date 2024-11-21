// src/hooks/useOrders.js
import { useState } from 'react';

export const useOrders = (initialOrders = []) => {
  const [orders, setOrders] = useState(initialOrders);
  const [error, setError] = useState(null);

  const addOrder = (newOrder) => {
    try {
      setOrders(prevOrders => [...prevOrders, newOrder]);
    } catch (err) {
      setError(err);
    }
  };

  return { orders, addOrder, error };
};




