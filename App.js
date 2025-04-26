import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import AllCurrenciesScreen from './screens/AllCurrenciesScreen';
import DetailScreen from './screens/DetailScreen';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ headerShown: false }} 
        />
        <Stack.Screen 
          name="Detail" 
          component={DetailScreen} 
          options={{ title: 'Coin Detail', headerStyle: { backgroundColor: '#1A1A2E' }, headerTintColor: '#FFF' }} 
        />
        <Stack.Screen 
          name="Currencies" 
          component={AllCurrenciesScreen} 
          options={{ title: 'Currencies', headerStyle: { backgroundColor: '#1A1A2E' }, headerTintColor: '#FFF' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}