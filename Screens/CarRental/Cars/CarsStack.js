import { createStackNavigator } from 'react-navigation'
import CarsScreen from './CarsScreen.js'
import CarDetailsScreen from './CarDetailsScreen.js'
import NewReservationScreen from './NewReservationScreen.js'

const CarsStack = createStackNavigator(
  {
    Cars: CarsScreen,
    CarDetails: CarDetailsScreen,
    NewReservation: NewReservationScreen
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
