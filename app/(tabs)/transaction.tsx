import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, Card, List, Avatar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

type TransactionType = {
  id: string;
  title: string;
  amount: string;
  date: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  positive: boolean;
};

const transactions: TransactionType[] = [
  {
    id: '1',
    title: 'Upwork',
    amount: '+$850.00',
    date: 'Today',
    icon: 'work',
    positive: true,
  },
  {
    id: '2',
    title: 'Transfer',
    amount: '-$85.00',
    date: 'Yesterday',
    icon: 'swap-horiz',
    positive: false,
  },
  {
    id: '3',
    title: 'PayPal',
    amount: '-$1,200.00',
    date: '12 Feb',
    icon: 'payment',
    positive: false,
  },
  {
    id: '4',
    title: 'YouTube',
    amount: '+$90.00',
    date: '10 Feb',
    icon: 'play-circle-filled',
    positive: true,
  },
];

export default function TransactionScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Transactions</Text>
      </View>

      <Card style={styles.balanceCard}>
        <Card.Content>
          <Text variant="titleMedium">Total Balance</Text>
          <Text variant="headlineLarge" style={styles.balance}>$2,548.00</Text>
          <View style={styles.incomeExpense}>
            <View style={styles.incomeBox}>
              <MaterialIcons name="arrow-upward" size={24} color="#4C9A8A" />
              <Text variant="titleSmall">Income</Text>
              <Text variant="titleMedium" style={styles.income}>$1,840.00</Text>
            </View>
            <View style={styles.expenseBox}>
              <MaterialIcons name="arrow-downward" size={24} color="#FF5C5C" />
              <Text variant="titleSmall">Expenses</Text>
              <Text variant="titleMedium" style={styles.expense}>$284.00</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <View style={styles.transactionList}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map((transaction) => (
          <List.Item
            key={transaction.id}
            title={transaction.title}
            description={transaction.date}
            left={() => (
              <View style={styles.iconContainer}>
                <MaterialIcons
                  name={transaction.icon}
                  size={24}
                  color="#4C9A8A"
                />
              </View>
            )}
            right={() => (
              <Text
                style={[
                  styles.amount,
                  { color: transaction.positive ? '#4C9A8A' : '#FF5C5C' }
                ]}
              >
                {transaction.amount}
              </Text>
            )}
            style={styles.transactionItem}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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