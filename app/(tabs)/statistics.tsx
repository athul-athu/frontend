import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, SegmentedButtons, List } from 'react-native-paper';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';

const spendingData = [
  { id: '1', category: 'Shopping', amount: 450, icon: 'shopping-bag' },
  { id: '2', category: 'Transport', amount: 200, icon: 'directions-car' },
  { id: '3', category: 'Bills', amount: 800, icon: 'receipt' },
  { id: '4', category: 'Entertainment', amount: 150, icon: 'movie' },
];

export default function StatisticsScreen() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineMedium" style={styles.title}>Statistics</Text>
      </View>

      <View style={styles.timeSelector}>
        <SegmentedButtons
          value={timeRange}
          onValueChange={setTimeRange}
          buttons={[
            { value: 'day', label: 'Day' },
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'year', label: 'Year' },
          ]}
        />
      </View>

      <View style={styles.chartContainer}>
        <View style={styles.chartHeader}>
          <Text variant="titleMedium">Spending</Text>
          <Text variant="headlineMedium" style={styles.totalAmount}>$1,600</Text>
        </View>

        <View style={styles.chart}>
          <View style={styles.gridLines}>
            {[0, 1, 2, 3, 4].map((i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>
          <View style={styles.bars}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => (
              <View key={`${day}-${index}`} style={styles.barContainer}>
                <View 
                  style={[
                    styles.bar, 
                    { height: [70, 45, 90, 60, 80, 30, 50][index] }
                  ]} 
                />
                <Text style={styles.barLabel}>{day}</Text>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.spendingList}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Top Spending</Text>
        {spendingData.map((item) => (
          <List.Item
            key={item.id}
            title={item.category}
            description={`$${item.amount}`}
            left={() => (
              <MaterialIcons
                name={item.icon}
                size={24}
                color="#4C9A8A"
                style={styles.categoryIcon}
              />
            )}
            style={styles.spendingItem}
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
  },
  title: {
    fontWeight: 'bold',
  },
  timeSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  chartContainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 20,
    borderRadius: 12,
  },
  chartHeader: {
    marginBottom: 20,
  },
  totalAmount: {
    color: '#4C9A8A',
    fontWeight: 'bold',
  },
  chart: {
    height: 200,
    marginTop: 20,
  },
  gridLines: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  gridLine: {
    width: '100%',
    height: 1,
    backgroundColor: '#f0f0f0',
  },
  bars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingTop: 20,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: 20,
    backgroundColor: '#4C9A8A',
    borderRadius: 10,
    marginBottom: 8,
  },
  barLabel: {
    color: '#666',
  },
  spendingList: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  spendingItem: {
    backgroundColor: '#fff',
    marginBottom: 8,
    borderRadius: 8,
  },
  categoryIcon: {
    backgroundColor: '#E8F5F3',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
}); 