import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CoinItem = ({ coin }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={{ uri: coin.image }} style={styles.image} />
        <View>
          <Text style={styles.name}>{coin.name}</Text>
          <Text style={styles.symbol}>{coin.symbol.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.price}>${coin.current_price.toFixed(2)}</Text>
        <Text style={[styles.change, { color: coin.price_change_percentage_24h >= 0 ? '#4ECDC4' : '#FF6B6B' }]}>
          {coin.price_change_percentage_24h.toFixed(2)}%
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1A1A2E',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  symbol: {
    fontSize: 14,
    color: '#888888',
    textTransform: 'uppercase',
  },
  rightSection: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  change: {
    fontSize: 14,
    marginTop: 4,
  },
});

export default CoinItem;
