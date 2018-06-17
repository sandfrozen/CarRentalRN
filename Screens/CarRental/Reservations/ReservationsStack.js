import { createStackNavigator } from 'react-navigation'
import ReservationsScreen from './ReservationsScreen.js'
import ReservationDetailsScreen from './ReservationDetailsScreen.js'
import EditReservationScreen from './EditReservationScreen.js'

const ReservationsStack = createStackNavigator(
  {
    Reservations: ReservationsScreen,
    ReservationDetails: ReservationDetailsScreen,
    EditReservation: EditReservationScreen
  },
  {
    initialRouteName: 'Reservations',
    navigationOptions: {
      title: 'Car Rental',
      headerBackTitle: 'Reservations'
    }
    // mode: 'modal',
    // headerMode: 'none',
    // navigationOptions: {
    //   gesturesEnabled: true
    // }
  }
)

export default ReservationsStack
