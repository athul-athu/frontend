import { StyleSheet, View, ScrollView, Dimensions } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { router } from 'expo-router';

export default function StatisticsScreen() {
  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth - 64; // 32px padding on each side
  const chartHeight = 200;
  const dataPoints = [800, 1000, 1230, 900, 1100, 850, 950];
  const labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  
  // Calculate chart points
  const maxValue = Math.max(...dataPoints);
  const minValue = Math.min(...dataPoints);
  const range = maxValue - minValue;

  const topSpending = [
    {
      id: 1,
      merchant: 'Starbucks',
      icon: 'coffee',
      amount: 150.00,
      date: 'Jan 12, 2022'
    },
    {
      id: 2,
      merchant: 'Transfer',
      icon: 'bank-transfer',
      amount: 85.00,
      date: 'Yesterday'
    },
    {
      id: 3,
      merchant: 'Youtube',
      icon: 'youtube',
      amount: 11.99,
      date: 'Jan 16, 2022'
    }
  ];

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <IconButton 
          icon="arrow-left" 
          size={24} 
          onPress={() => router.back()} 
        />
        <Text variant="headlineSmall">Statistics</Text>
        <IconButton 
          icon="share-variant-outline" 
          size={24} 
          onPress={() => {}} 
        />
      </View>

      {/* Time Period Selector */}
      <View style={styles.periodSelector}>
        <View style={[styles.periodButton, styles.periodButtonActive]}>
          <Text style={styles.periodButtonTextActive}>Day</Text>
        </View>
        <View style={styles.periodButton}>
          <Text style={styles.periodButtonText}>Week</Text>
        </View>
        <View style={styles.periodButton}>
          <Text style={styles.periodButtonText}>Month</Text>
        </View>
        <View style={styles.periodButton}>
          <Text style={styles.periodButtonText}>Year</Text>
        </View>
      </View>

      {/* Expense Filter */}
      <View style={styles.expenseFilter}>
        <Text variant="titleMedium">Expense</Text>
        <IconButton icon="chevron-down" size={24} onPress={() => {}} />
      </View>

      {/* Chart */}
      <View style={styles.chartContainer}>
        <View style={styles.chart}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((index) => (
            <View
              key={`grid-${index}`}
              style={[
                styles.gridLine,
                { top: index * (chartHeight / 4) }
              ]}
            />
          ))}
          
          {/* Data points */}
          <View style={styles.dataPointsContainer}>
            {dataPoints.map((value, index) => {
              const height = ((value - minValue) / range) * chartHeight;
              return (
                <View key={`data-point-${index}`} style={styles.dataPointColumn}>
                  <View 
                    style={[
                      styles.dataPoint,
                      { height: height }
                    ]}
                  />
                </View>
              );
            })}
          </View>
        </View>
        
        {/* X-axis labels */}
        <View style={styles.chartLabels}>
          {labels.map((label, index) => (
            <Text key={`label-${index}`} style={styles.chartLabel}>{label}</Text>
          ))}
        </View>
      </View>

      {/* Top Spending */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium">Top Spending</Text>
          <IconButton icon="arrow-right" size={24} onPress={() => {}} />
        </View>

        {topSpending.map(item => (
          <View key={item.id} style={styles.spendingItem}>
            <View style={styles.spendingLeft}>
              <IconButton
                icon={item.icon}
                size={24}
                style={styles.merchantIcon}
              />
              <View>
                <Text variant="bodyLarge">{item.merchant}</Text>
                <Text variant="bodySmall" style={styles.spendingDate}>{item.date}</Text>
              </View>
            </View>
            <Text variant="titleMedium" style={styles.spendingAmount}>
              - $ {item.amount.toFixed(2)}
            </Text>
          </View>
        ))}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <IconButton 
          icon="home" 
          size={26} 
          onPress={() => router.push('/')} 
        />
        <IconButton icon="chart-line" size={26} onPress={() => {}} />
        <IconButton icon="wallet" size={26} onPress={() => {}} />
        <IconButton 
          icon="account" 
          size={26} 
          onPress={() => router.push('/profile')} 
        />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 40,
  },
  periodSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 16,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  periodButtonActive: {
    backgroundColor: '#4C9A8A',
  },
  periodButtonText: {
    color: '#666',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  expenseFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 8,
    padding: 12,
    backgroundColor: 'white',
    borderRadius: 8,
  },
  chartContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 16,
  },
  chart: {
    height: 200,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#E0E0E0',
  },
  dataPointsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: '100%',
    paddingBottom: 20,
  },
  dataPointColumn: {
    flex: 1,
    alignItems: 'center',
  },
  dataPoint: {
    width: 8,
    backgroundColor: '#4C9A8A',
    borderRadius: 4,
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  chartLabel: {
    color: '#666',
    fontSize: 12,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  spendingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  spendingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  merchantIcon: {
    marginRight: 12,
  },
  spendingDate: {
    color: '#666',
  },
  spendingAmount: {
    color: '#e74c3c',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
}); 