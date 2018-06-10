import { createStackNavigator } from 'react-navigation'
import CarRentalTabNavigator from './CarRentalTabNavigator'

const CarRentalStack = createStackNavigator(
  { Home: CarRentalTabNavigator },
  {
    // navigationOptions: {
    //   title: 'Car Rental'
    // },
    // mode: 'modal',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default CarRentalStack
