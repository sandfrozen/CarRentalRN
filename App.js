import React, { Component } from 'react';
import { Text, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation';
import IosColor from './colors.js';

class CarsScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cars!</Text>
      </View>
    );
  }
}

class ReservationsScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Reservations!</Text>
      </View>
    );
  }
}

class MapScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Map!</Text>
      </View>
    );
  }
}

class MoreScreen extends Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>More!</Text>
      </View>
    );
  }
}

export default createBottomTabNavigator(
  {
    Cars: CarsScreen,
    Reservations: ReservationsScreen,
    Map: MapScreen,
    More: MoreScreen,
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Cars') {
          iconName = `ios-car${focused ? '' : '-outline'}`;
        } else if (routeName === 'Reservations') {
          iconName = `ios-list-box${focused ? '' : '-outline'}`;
        } else if (routeName === 'Map') {
          iconName = `ios-navigate${focused ? '' : '-outline'}`;
        } else if (routeName === 'More') {
          iconName = `ios-menu${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: IosColor.Blue,
      inactiveTintColor: IosColor.LightGray,
    },
  }
);