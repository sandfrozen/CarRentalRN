import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { createBottomTabNavigator } from 'react-navigation'
import IosColor from '../colors.js'
import CarsStack from './Cars/CarsStack'
import ReservationsStack from './Reservations/ReservationsStack'
import MapScreen from './Map/MapScreen'
import MoreStack from './More/MoreStack'

export default createBottomTabNavigator(
  {
    Cars: CarsStack,
    Reservations: ReservationsStack,
    Map: MapScreen,
    More: MoreStack
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state
        let iconName
        if (routeName === 'Cars') {
          iconName = `ios-car${focused ? '' : '-outline'}`
        } else if (routeName === 'Reservations') {
          iconName = `ios-list-box${focused ? '' : '-outline'}`
        } else if (routeName === 'Map') {
          iconName = `ios-navigate${focused ? '' : '-outline'}`
        } else if (routeName === 'More') {
          iconName = `ios-more${focused ? '' : '-outline'}`
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />
      }
    }),
    tabBarOptions: {
      activeTintColor: IosColor.Blue,
      inactiveTintColor: IosColor.LightGray,
      labelStyle: {
        fontSize: 14
      }
    }
  }
)
