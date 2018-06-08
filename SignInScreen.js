import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Button,
} from 'react-native';

export default class SignInScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Button title="Sign in!" onPress={this._signInAsync} />
        <Button title="Sign up!" onPress={this._signUpAsync} />
      </View>
    );
  }

  _signInAsync = async () => {
    await AsyncStorage.setItem('c1', '1');
    await AsyncStorage.setItem('c2', 'tombs@wp.pl');
    await AsyncStorage.setItem('c3', 'password');
    await AsyncStorage.setItem('c4', 'CHwH7=0wt2');
    this.props.navigation.navigate('App');
  };

  _signUpAsync = async () => {
    this.props.navigation.push('SignUp')
  };
}