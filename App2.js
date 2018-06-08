import React, { Component } from 'react';
import { Text, View, Button, AsyncStorage } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import IosColor from './colors.js';
import CarsStack from './CarsScreen.js'

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
      <View style={styles.container}>
        <Button title="Show me more of the app" onPress={this._showMoreApp} />
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

export default createBottomTabNavigator(
  {
    Cars: CarsStack,
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
          iconName = `ios-more${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: IosColor.Blue,
      inactiveTintColor: IosColor.LightGray,
      labelStyle: {
        fontSize: 12,
      },
    },
  }
);