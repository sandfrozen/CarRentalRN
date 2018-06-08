import React, { Component } from 'react';
import { Text, View, Button, AsyncStorage } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import IosColor from './colors.js';

import CarDetailsScreen from './CarDetailsScreen.js'

class CarsScreen extends Component {
  
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cars!</Text>
        <Button
          title="Go to Details"
          onPress={() => this.props.navigation.navigate('CarDetails')}
        />
      </View>
    );
  }
}

export default CarsStack = createStackNavigator(
  {
    Cars: CarsScreen,
    CarDetails: CarDetailsScreen,
  },
  {
    initialRouteName: 'Cars',
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: true,
    },
  }
);