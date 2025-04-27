import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, RefreshControl, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { router } from 'expo-router';
import CoinItem from './components/CoinItem';

export default function HomeScreen({ navigation }) {
  const [coins, setCoins] = useState([]);
  const [filteredCoins, setFilteredCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchCoins = async () => {
    try {
      const res = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: 10,
            page: 1,
            sparkline: false,
          },
        }
      );
      setCoins(res.data);
      setFilteredCoins(res.data);
      setLoading(false);
      setRefreshing(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchCoins();
  };

  const handleSearch = (text) => {
    setSearch(text);
    const filtered = coins.filter((coin) =>
      coin.name.toLowerCase().includes(text.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCoins(filtered);
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4ECDC4" />
        <Text style={styles.loaderText}>Loading crypto prices...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1A1A2E" />
      <Text style={styles.title}>📊 trecker crypto </Text>

      <TextInput
        style={styles.searchInput}
        placeholder="Search coin or symbol..."
        placeholderTextColor="#AAAAAA"
        value={search}
        onChangeText={handleSearch}
      />
      <TouchableOpacity 
  style={{
    backgroundColor: '#4ECDC4',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 10
  }}
  onPress={() => router.push('/allcurrencies')}
>
  <Text style={{ color: '#0F0F1E', fontWeight: 'bold', textAlign: 'center' }}>
    coin-coin populer 
  </Text>
</TouchableOpacity>


      <FlatList
        data={filteredCoins}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => router.push({
            pathname: "/detailscreen",
            params:{
              coin: JSON.stringify(item)
            }
          })}>
            <CoinItem coin={item} />
          </TouchableOpacity>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F1E',
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    backgroundColor: '#0F0F1E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#BBBBBB',
  },
  searchInput: {
    backgroundColor: '#1A1A2E',
    color: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});