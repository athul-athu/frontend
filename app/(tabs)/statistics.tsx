import { StyleSheet, View, ScrollView } from 'react-native';
import { Text, SegmentedButtons, List } from 'react-native-paper';
import { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const KIWI_PRIMARY = '#8CB369';
const KIWI_LIGHT = '#BED8A4';
const KIWI_DARK = '#5B8E31';

const spendingData = [
  { id: '1', category: 'Shopping', amount: 450, icon: 'shopping-cart' },
  { id: '2', category: 'Transport', amount: 200, icon: 'directions-car' },
  { id: '3', category: 'Bills', amount: 800, icon: 'receipt-long' },
  { id: '4', category: 'Entertainment', amount: 150, icon: 'local-movies' },
];

export default function StatisticsScreen() {
  const [timeRange, setTimeRange] = useState('week');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[KIWI_DARK, KIWI_PRIMARY, KIWI_LIGHT]}
        style={styles.gradient}
      >
        <ScrollView style={styles.scrollView}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>Statistics</Text>
          </View>

          <View style={[styles.timeSelector, { backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 8 }]}>
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
            <LinearGradient
              colors={[KIWI_DARK, KIWI_PRIMARY]}
              style={styles.chartGradient}
            >
              <View style={styles.chartHeader}>
                <Text variant="titleMedium" style={styles.chartTitle}>Spending</Text>
                <Text variant="headlineMedium" style={styles.totalAmount}>₹1,600</Text>
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
            </LinearGradient>
          </View>

          <View style={styles.spendingList}>
            <Text variant="titleMedium" style={styles.sectionTitle}>Top Spending</Text>
            {spendingData.map((item) => (
              <List.Item
                key={item.id}
                title={item.category}
                description={`₹${item.amount}`}
                left={() => (
                  <MaterialIcons
                    name={item.icon}
                    size={24}
                    color={KIWI_PRIMARY}
                    style={styles.categoryIcon}
                  />
                )}
                style={styles.spendingItem}
              />
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  timeSelector: {
    paddingHorizontal: 20,
    marginBottom: 20,
    padding: 4,
  },
  chartContainer: {
    margin: 20,
    overflow: 'hidden',
  },
  chartGradient: {
    padding: 20,
    borderRadius: 12,
  },
  chartHeader: {
    marginBottom: 20,
  },
  chartTitle: {
    color: '#ffffff',
    opacity: 0.9,
  },
  totalAmount: {
    color: '#ffffff',
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    backgroundColor: KIWI_LIGHT,
    borderRadius: 10,
    marginBottom: 8,
  },
  barLabel: {
    color: '#ffffff',
    opacity: 0.9,
  },
  spendingList: {
    padding: 20,
  },
  sectionTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  spendingItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 8,
    borderRadius: 8,
  },
  categoryIcon: {
    backgroundColor: '#ffffff',
    padding: 8,
    borderRadius: 8,
    marginRight: 8,
  },
}); 