import { createSwitchNavigator } from 'react-navigation'

import AuthLoadingScreen from './Auth/AuthLoadingScreen'
import AuthStack from './Auth/AuthStack'
import CarRentalStack from './CarRental/CarRentalStack'

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    CarRentalStack: CarRentalStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
)
