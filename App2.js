import { createSwitchNavigator, createStackNavigator } from 'react-navigation';
import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Button,
} from 'react-native';

class AuthLoadingScreen extends React.Component {
  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const userToken = await AsyncStorage.getItem('userToken');


    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    this.props.navigation.navigate(userToken ? 'App' : 'Auth');
  };

  // Render any loading content that you like here
  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle="default" />
      </View>
    );
  }
}

class SignInScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign in!" onPress={this._signInAsync} />
        <Button title="Sign up!" onPress={this._signUpAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('userToken', 'abc');
    this.props.navigation.navigate('App');
  };

  _signUpAsync = async () => {
    this.props.navigation.push('SignUp')
  };
}

class SignUpScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Button title="Back" onPress={this._goBack} />
      </View>
    );
  }

  _goBack = async () => {
    this.props.navigation.goBack();
  };
}

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome to the app!',
  };

  render() {
    return (
      <View style={styles.container}>
        <Button title="Show me more of the app" onPress={this._showMoreApp} />
        <Button title="Actually, sign me out :)" onPress={this._signOutAsync} />
      </View>
    );
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other');
  };

  _signOutAsync = async () => {
    await AsyncStorage.clear();
    this.props.navigation.navigate('Auth');
  };
}

const AppStack = createStackNavigator({ Home: HomeScreen });
const AuthStack = createStackNavigator(
  {
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
  },
  {
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: true,
    },
  }
);

export default createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
})