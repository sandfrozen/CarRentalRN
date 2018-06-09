import { createSwitchNavigator, createStackNavigator } from 'react-navigation'

import SignInScreen from './Auth/SignInScreen.js'
import AuthLoadingScreen from './Auth/AuthLoadingScreen.js'
import SignUpScreen from './Auth/SignUpScreen.js'
import App2 from './App2.js'

const AppStack = createStackNavigator(
  { Home: App2 },
  {
    navigationOptions: {
      title: 'Car Rental'
    }
  }
)

const AuthStack = createStackNavigator(
  {
    SignIn: SignInScreen,
    SignUp: SignUpScreen
  },
  {
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: true
    }
  }
)

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack
  },
  {
    initialRouteName: 'AuthLoading'
  }
)
