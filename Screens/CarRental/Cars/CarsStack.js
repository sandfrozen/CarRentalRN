import { createStackNavigator } from 'react-navigation'
import CarDetailsScreen from './CarDetailsScreen.js'
import CarsScreen from './CarsScreen.js'

const CarsStack = createStackNavigator(
  {
    Cars: CarsScreen,
    CarDetails: CarDetailsScreen
  },
  {
    initialRouteName: 'Cars',
    navigationOptions: {
      title: 'Car Rental',
      headerBackTitle: 'Cars'
    }
    // mode: 'modal',
    // headerMode: 'none',
    // navigationOptions: {
    //   gesturesEnabled: true
    // }
  }
)

export default CarsStack
