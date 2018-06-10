import { createStackNavigator } from 'react-navigation'
import SignInScreen from './SignInScreen.js'
import SignUpScreen from './SignUpScreen.js'

const AuthStack = createStackNavigator(
  {
    SignIn: SignInScreen,
    SignUp: SignUpScreen
  },
  {
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default AuthStack
