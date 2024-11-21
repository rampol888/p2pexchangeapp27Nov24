function CurrencyCard({ currency, rate, change }) {
  const isPositive = change >= 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-gray-800 rounded-xl p-6 border border-gray-700"
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">USD/{currency}</h3>
          <p className="text-2xl font-bold text-white">{rate.toFixed(4)}</p>
        </div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className={`p-2 rounded-lg ${
            isPositive ? 'bg-green-900/30' : 'bg-red-900/30'
          }`}
        >
          <TrendingUp className={`h-6 w-6 ${
            isPositive ? 'text-green-500' : 'text-red-500'
          }`} />
        </motion.div>
      </div>
      <div className="mt-4 flex items-center">
        {isPositive ? (
          <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
        ) : (
          <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
        )}
        <span className={`text-sm ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          {change.toFixed(2)}%
        </span>
      </div>
    </motion.div>
  );
} 