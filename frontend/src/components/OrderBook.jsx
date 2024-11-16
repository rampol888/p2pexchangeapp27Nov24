import React from 'react';

const OrderBook = ({ orders, onBuy }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-6">Order Book</h2>
      <div className="grid grid-cols-4 gap-4 px-4 py-2 bg-gray-50 rounded-lg">
        <div className="text-gray-600 font-medium">Price</div>
        <div className="text-gray-600 font-medium">Amount</div>
        <div className="text-gray-600 font-medium">Total</div>
        <div></div>
      </div>
      <div className="space-y-2">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="grid grid-cols-4 gap-4 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="font-medium">${order.price.toLocaleString()}</div>
            <div>{order.amount}</div>
            <div>${(order.price * order.amount).toLocaleString()}</div>
            <div>
              <button
                onClick={() => onBuy(order)}
                className="button-primary w-full"
              >
                Buy
              </button>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No orders available
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderBook;