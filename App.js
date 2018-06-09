import { createSwitchNavigator, createStackNavigator } from 'react-navigation'
import React from 'react'
import {
  AsyncStorage,
  View,
  Button
} from 'react-native'

import styles from './styles.js'
import SignInScreen from './SignInScreen.js'
import AuthLoadingScreen from './AuthLoadingScreen.js'
import SignUpScreen from './SignUpScreen.js'
import App2 from './App2.js'

class HomeScreen extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Button title='Show me more of the app' onPress={this._showMoreApp} />
        <Button title='Actually, sign me out :)' onPress={this._signOutAsync} />
      </View>
    )
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other')
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear()
    this.props.navigation.navigate('Auth')
  };
}

const AppStack = createStackNavigator(
  { Home: App2, HomeScreen },
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
