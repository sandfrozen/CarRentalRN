import { createStackNavigator } from 'react-navigation'
import MoreScreen from './MoreScreen.js'
import MyAccountScreen from './MyAccountScreen.js'

const MoreStack = createStackNavigator(
  {
    More: MoreScreen,
    MyAccount: MyAccountScreen
  },
  {
    initialRouteName: 'More',
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

export default MoreStack
