import { createStackNavigator } from 'react-navigation'
import EmergencyScreen from './EmergencyScreen.js'

const EmergencyStack = createStackNavigator(
  {
    Emergency: EmergencyScreen
  },
  {
    initialRouteName: 'Emergency',
    navigationOptions: {
      title: 'Car Rental',
      headerBackTitle: 'Settings'
    }
    // mode: 'modal',
    // headerMode: 'none',
    // navigationOptions: {
    //   gesturesEnabled: true
    // }
  }
)

export default EmergencyStack
