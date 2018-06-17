import { createStackNavigator } from 'react-navigation'
import CarsScreen from './CarsScreen.js'
import CarDetailsScreen from './CarDetailsScreen.js'
// import CarReservationScreen from './CarReservationScreen'
import CarsSearchScreen from './CarsSearchScreen'

const CarsStack = createStackNavigator(
  {
    Cars: CarsScreen,
    CarDetails: CarDetailsScreen,
    // NewReservation: CarReservationScreen,
    CarsSearch: CarsSearchScreen
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
