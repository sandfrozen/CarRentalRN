import React, { Component } from 'react';
import { Text, View, Button, AsyncStorage } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import IosColor from './colors.js';

export default class CarDetailsScreen extends Component {

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Car Details!</Text>
      </View>
    );
  }
}