import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, Send, Plus, History } from 'lucide-react';

export const WalletComponent = () => {
  // State for multiple currency balances
  const [balances, setBalances] = useState({
    USD: 0,
    EUR: 0,
    SGD: 0,
    AUD: 0,
    JPY: 0
  });

  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [showSend, setShowSend] = useState(false);
  const [addAmount, setAddAmount] = useState('');
  const [sendAmount, setSendAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [notification, setNotification] = useState('');
  const [recentTransactions, setRecentTransactions] = useState([]);

  // Currency configuration with symbols and exchange rates
  const currencyConfig = {
    USD: { symbol: '$', rate: 1, icon: '🇺🇸' },
    EUR: { symbol: '€', rate: 0.85, icon: '🇪🇺' },
    SGD: { symbol: 'S$', rate: 1.34, icon: '🇸🇬' },
    AUD: { symbol: 'A$', rate: 1.52, icon: '🇦🇺' },
    JPY: { symbol: '¥', rate: 110.42, icon: '🇯🇵' }
  };

  // Format currency with proper symbol and decimals
  const formatCurrency = (amount, currencyCode) => {
    if (!currencyCode) currencyCode = 'USD';
    
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currencyCode,
        minimumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
        maximumFractionDigits: currencyCode === 'JPY' ? 0 : 2,
      }).format(amount || 0);
    } catch (error) {
      console.error('Currency formatting error:', error);
      return `${currencyConfig[currencyCode].symbol}${amount || 0}`;
    }
  };

  // Handle adding money to wallet
  const handleAddMoney = () => {
    if (addAmount && !isNaN(addAmount) && Number(addAmount) > 0) {
      setBalances(prev => ({
        ...prev,
        [selectedCurrency]: prev[selectedCurrency] + Number(addAmount)
      }));

      const newTransaction = {
        id: Date.now(),
        type: 'deposit',
        amount: Number(addAmount),
        currency: selectedCurrency,
        date: new Date().toLocaleDateString(),
        recipient: 'Wallet'
      };

      setRecentTransactions(prev => [newTransaction, ...prev]);
      setNotification(`Successfully added ${formatCurrency(Number(addAmount), selectedCurrency)}`);
      setAddAmount('');
      setShowAddMoney(false);
      setTimeout(() => setNotification(''), 3000);
    }
  };

  // Handle sending money
  const handleSendMoney = () => {
    if (sendAmount && recipient && !isNaN(sendAmount) && Number(sendAmount) > 0) {
      if (Number(sendAmount) <= balances[selectedCurrency]) {
        setBalances(prev => ({
          ...prev,
          [selectedCurrency]: prev[selectedCurrency] - Number(sendAmount)
        }));

        const newTransaction = {
          id: Date.now(),
          type: 'send',
          amount: Number(sendAmount),
          currency: selectedCurrency,
          date: new Date().toLocaleDateString(),
          recipient: recipient
        };

        setRecentTransactions(prev => [newTransaction, ...prev]);
        setNotification(`Successfully sent ${formatCurrency(Number(sendAmount), selectedCurrency)} to ${recipient}`);
        setSendAmount('');
        setRecipient('');
        setShowSend(false);
        setTimeout(() => setNotification(''), 3000);
      } else {
        setNotification('Insufficient balance');
        setTimeout(() => setNotification(''), 3000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <Card className="bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-2xl">
                <div className="p-2 bg-wallet-500 rounded-lg">
                  <Wallet className="h-6 w-6 text-white" />
                </div>
                Digital Wallet
              </div>
              <div className="flex gap-2">
                {Object.entries(currencyConfig).map(([code, { icon }]) => (
                  <button
                    key={code}
                    onClick={() => setSelectedCurrency(code)}
                    className={`p-2 rounded-lg transition-all ${
                      selectedCurrency === code
                        ? 'bg-wallet-500 text-white'
                        : 'bg-wallet-50 hover:bg-wallet-100'
                    }`}
                  >
                    <span className="text-lg">{icon}</span>
                  </button>
                ))}
              </div>
            </CardTitle>
          </CardHeader>

          <CardContent>
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {Object.entries(balances).map(([currency, amount]) => (
                <div
                  key={currency}
                  className={`p-4 rounded-xl transition-all ${
                    selectedCurrency === currency
                      ? 'bg-gradient-to-r from-wallet-500 to-purple-600 text-white'
                      : 'bg-white/50 border border-gray-200 hover:border-wallet-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className={selectedCurrency === currency ? 'text-white/80' : 'text-gray-500'}>
                      {currencyConfig[currency].icon} {currency}
                    </span>
                    {currency !== 'USD' && (
                      <span className="text-xs opacity-70">
                        ≈ {formatCurrency(amount * currencyConfig[currency].rate, 'USD')}
                      </span>
                    )}
                  </div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(amount, currency)}
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mb-6">
              <Button 
                className="flex-1 bg-wallet-500 hover:bg-wallet-600 text-white"
                onClick={() => setShowAddMoney(!showAddMoney)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Money
              </Button>
              <Button 
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setShowSend(!showSend)}
              >
                <Send className="w-4 h-4 mr-2" />
                Send Money
              </Button>
            </div>

            {/* Add Money Form */}
            {showAddMoney && (
              <div className="space-y-4 mb-6 bg-gray-50/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Add Money</h3>
                <div className="space-y-4">
                  <Input
                    type="number"
                    placeholder={`Enter amount in ${selectedCurrency}`}
                    value={addAmount}
                    onChange={(e) => setAddAmount(e.target.value)}
                  />
                  <Button onClick={handleAddMoney} className="w-full">
                    Add Money
                  </Button>
                </div>
              </div>
            )}

            {/* Send Money Form */}
            {showSend && (
              <div className="space-y-4 mb-6 bg-gray-50/50 backdrop-blur-sm p-6 rounded-xl border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Send Money</h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Recipient"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder={`Enter amount in ${selectedCurrency}`}
                    value={sendAmount}
                    onChange={(e) => setSendAmount(e.target.value)}
                  />
                  <Button onClick={handleSendMoney} className="w-full">
                    Send Money
                  </Button>
                </div>
              </div>
            )}

            {/* Notification */}
            {notification && (
              <Alert className="mb-6 bg-wallet-50 border-wallet-100">
                <AlertDescription>{notification}</AlertDescription>
              </Alert>
            )}

            {/* Recent Transactions */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2 text-gray-700 font-semibold mb-4">
                <History className="w-5 h-5 text-wallet-500" />
                Recent Transactions
              </div>
              
              <div className="space-y-3">
                {recentTransactions.map(transaction => (
                  <div 
                    key={transaction.id} 
                    className="bg-white/50 hover:bg-gray-50/80 transition-colors rounded-xl p-4 border border-gray-100"
                  >
                    <div className="flex justify-between items-center">
                      <div className="flex gap-3 items-center">
                        <div className={`p-2 rounded-full ${
                          transaction.type === 'send' ? 'bg-orange-100' : 'bg-green-100'
                        }`}>
                          {transaction.type === 'send' ? 
                            <Send className="w-4 h-4 text-orange-600" /> : 
                            <Plus className="w-4 h-4 text-green-600" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">
                            {transaction.recipient}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <p className={`font-medium ${
                        transaction.type === 'send' ? 'text-orange-600' : 'text-green-600'
                      }`}>
                        {transaction.type === 'send' ? '-' : '+'}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default WalletComponent;// test comment
