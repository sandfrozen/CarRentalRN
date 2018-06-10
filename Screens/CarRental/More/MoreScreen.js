import React, { Component } from 'react'
import { View, Button, AsyncStorage } from 'react-native'
import styles from '../../styles'

export default class MoreScreen extends Component {
  render () {
    return (
      <View style={styles.container}>
        <Button title='Actually, sign me out :)' onPress={this._signOutAsync} />
      </View>
    )
  }

  _showMoreApp = () => {
    this.props.navigation.navigate('Other')
  };

  _signOutAsync = async () => {
    await AsyncStorage.removeItem('c1')
    await AsyncStorage.removeItem('c4')
    this.props.navigation.navigate('Auth')
  };
}
