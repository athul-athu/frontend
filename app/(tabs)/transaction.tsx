import { StyleSheet, View, ScrollView, RefreshControl } from 'react-native';
import { Text, Card, List, ActivityIndicator } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useState, useEffect, useCallback } from 'react';
import { getTransactions } from '../../utils/network';
import { format } from 'date-fns';

interface Transaction {
  id: number;
  amount: string;
  transaction_type: 'INCOME' | 'EXPENSE';
  description: string;
  date: string;
  category: string | null;
}

export default function TransactionScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totals, setTotals] = useState({
    balance: 0,
    income: 0,
    expense: 0
  });

  const loadTransactions = async () => {
    try {
      const response = await getTransactions();
      if (response.status === 'success' && response.data) {
        setTransactions(response.data);
        
        // Calculate totals
        const newTotals = response.data.reduce((acc, transaction) => {
          const amount = parseFloat(transaction.amount);
          if (transaction.transaction_type === 'INCOME') {
            acc.income += amount;
            acc.balance += amount;
          } else {
            acc.expense += amount;
            acc.balance -= amount;
          }
          return acc;
        }, { balance: 0, income: 0, expense: 0 });
        
        setTotals(newTotals);
        setError(null);
      } else {
        setError(response.message);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadTransactions();
  }, []);

  useEffect(() => {
    loadTransactions();
  }, []);

  const formatAmount = (amount: string, type: 'INCOME' | 'EXPENSE') => {
    const value = parseFloat(amount).toFixed(2);
    return type === 'INCOME' ? `+₹${value}` : `-₹${value}`;
  };

  const getTransactionIcon = (category: string | null) => {
    switch (category?.toLowerCase()) {
      case 'food':
        return 'restaurant';
      case 'transport':
        return 'directions-car';
      case 'shopping':
        return 'shopping-bag';
      case 'entertainment':
        return 'movie';
      default:
        return 'account-balance-wallet';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return format(date, 'dd MMM yy');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4C9A8A" />
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Transactions</Text>
      </View>

      {error ? (
        <Card style={styles.errorCard}>
          <Card.Content>
            <Text variant="bodyMedium" style={styles.errorText}>{error}</Text>
          </Card.Content>
        </Card>
      ) : (
        <>
          <Card style={styles.balanceCard}>
            <Card.Content>
              <Text variant="titleMedium">Total Balance</Text>
              <Text variant="headlineLarge" style={styles.balance}>
                ₹{totals.balance.toFixed(2)}
              </Text>
              <View style={styles.incomeExpense}>
                <View style={styles.incomeBox}>
                  <MaterialIcons name="arrow-upward" size={24} color="#4C9A8A" />
                  <Text variant="titleSmall">Income</Text>
                  <Text variant="titleMedium" style={styles.income}>
                    ₹{totals.income.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.expenseBox}>
                  <MaterialIcons name="arrow-downward" size={24} color="#FF5C5C" />
                  <Text variant="titleSmall">Expenses</Text>
                  <Text variant="titleMedium" style={styles.expense}>
                    ₹{totals.expense.toFixed(2)}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          <View style={styles.transactionList}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Recent Transactions</Text>
            {transactions.map((transaction) => (
              <List.Item
                key={transaction.id}
                title={transaction.description}
                description={formatDate(transaction.date)}
                left={() => (
                  <View style={styles.iconContainer}>
                    <MaterialIcons
                      name={getTransactionIcon(transaction.category)}
                      size={24}
                      color="#4C9A8A"
                    />
                  </View>
                )}
                right={() => (
                  <Text
                    style={[
                      styles.amount,
                      { color: transaction.transaction_type === 'INCOME' ? '#4C9A8A' : '#FF5C5C' }
                    ]}
                  >
                    {formatAmount(transaction.amount, transaction.transaction_type)}
                  </Text>
                )}
                style={styles.transactionItem}
              />
            ))}
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontWeight: 'bold',
  },
  balanceCard: {
    margin: 16,
  },
  errorCard: {
    margin: 16,
    backgroundColor: '#FFE5E5',
  },
  errorText: {
    color: '#FF5C5C',
  },
  balance: {
    color: '#4C9A8A',
    fontWeight: 'bold',
    marginVertical: 8,
  },
  incomeExpense: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  incomeBox: {
    alignItems: 'flex-start',
  },
  expenseBox: {
    alignItems: 'flex-start',
  },
  income: {
    color: '#4C9A8A',
    marginTop: 4,
  },
  expense: {
    color: '#FF5C5C',
    marginTop: 4,
  },
  transactionList: {
    padding: 16,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  transactionItem: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
  },
  iconContainer: {
    backgroundColor: '#E8F5F3',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
  },
}); 