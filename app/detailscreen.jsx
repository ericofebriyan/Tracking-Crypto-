import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ActivityIndicator, StatusBar, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useLocalSearchParams } from 'expo-router';
import { LineChart } from 'react-native-chart-kit';

const timeframes = ['1', '7', '30', '90', '365'];
const currencies = ['usd', 'idr', 'eur', 'jpy'];

export default function DetailScreen() {
  const { coin } =useLocalSearchParams();
  const [prices, setPrices] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7');
  const [selectedCurrency, setSelectedCurrency] = useState('usd');
  const coinData = JSON.parse(coin);

  const fetchPrices = async () => {
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price`,
        { params: { ids: coinData.id, vs_currencies: currencies.join(',') } }
      );
      setPrices(res.data[coinData.id]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchChartData = async () => {
    try {
      const res = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coinData.id}/market_chart`,
        { params: { vs_currency: selectedCurrency, days: selectedTimeframe } }
      );
      const priceData = res.data.prices.map((item) => item[1]);
      setChartData(priceData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchPrices();
    fetchChartData();
  }, [selectedTimeframe, selectedCurrency]);

  if (!prices || chartData.length === 0) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loaderText}>Loading data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0F0F1E" />
      <Text style={styles.title}>{coin.name}</Text>
      <Text style={styles.subtitle}>Market Data & Chart</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>💵 Harga Saat Ini</Text>
        <Text style={styles.price}>USD : ${prices.usd}</Text>
        <Text style={styles.price}>IDR : Rp {prices.idr.toLocaleString('id-ID')}</Text>
        <Text style={styles.price}>EUR : €{prices.eur}</Text>
        <Text style={styles.price}>JPY : ¥{prices.jpy}</Text>
      </View>

      <View style={styles.selector}>
        {currencies.map((cur) => (
          <TouchableOpacity
            key={cur}
            style={[styles.button, selectedCurrency === cur && styles.activeButton]}
            onPress={() => setSelectedCurrency(cur)}
          >
            <Text style={styles.buttonText}>{cur.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.selector}>
        {timeframes.map((time) => (
          <TouchableOpacity
            key={time}
            style={[styles.button, selectedTimeframe === time && styles.activeButton]}
            onPress={() => setSelectedTimeframe(time)}
          >
            <Text style={styles.buttonText}>{time === '1' ? '1D' : time === '365' ? '1Y' : `${time}D`}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.chartTitle}>📈 Harga {selectedTimeframe === '1' ? '1D' : `${selectedTimeframe}D`} ({selectedCurrency.toUpperCase()})</Text>
      <LineChart
        data={{
          labels: [],
          datasets: [{ data: chartData }],
        }}
        width={Dimensions.get('window').width - 30}
        height={250}
        yAxisLabel={selectedCurrency === 'usd' ? '$' : ''}
        chartConfig={{
          backgroundColor: '#0F0F1E',
          backgroundGradientFrom: '#0F0F1E',
          backgroundGradientTo: '#0F0F1E',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(78, 205, 196, ${opacity})`,
          labelColor: () => '#AAA',
          propsForDots: { r: '2', strokeWidth: '1', stroke: '#4ECDC4' },
        }}
        bezier
        style={{ marginVertical: 20, borderRadius: 20 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0F1E', padding: 16 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#FFF', textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#AAA', textAlign: 'center', marginBottom: 20 },
  card: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 18,
    padding: 16,
    marginVertical: 16,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  cardTitle: { fontSize: 18, color: '#FFF', marginBottom: 8 },
  price: { fontSize: 18, color: '#DDD', marginVertical: 3 },
  selector: { flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap', marginTop: 10 },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    margin: 5,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#4ECDC4',
  },
  activeButton: { backgroundColor: '#4ECDC4' },
  buttonText: { color: '#FFF', fontSize: 14 },
  chartTitle: { fontSize: 20, color: '#EEE', marginTop: 20, textAlign: 'center' },
  loader: { flex: 1, backgroundColor: '#0F0F1E', justifyContent: 'center', alignItems: 'center' },
  loaderText: { marginTop: 10, fontSize: 16, color: '#BBB' },
});
