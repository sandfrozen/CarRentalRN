import { createStackNavigator } from 'react-navigation'
import MoreScreen from './MoreScreen.js'

const MoreStack = createStackNavigator(
  {
    More: MoreScreen
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
