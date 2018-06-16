import React from 'react'
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  View,
  Text,
  Button
} from 'react-native'
import styles from '../styles.js'
import API from '../API'

export default class AuthLoadingScreen extends React.Component {
  constructor (props) {
    super(props)
    this._bootstrapAsync()
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const id = await AsyncStorage.getItem('id')
    const ma = await AsyncStorage.getItem('ma')
    const pa = await AsyncStorage.getItem('pa')
    const lk = await AsyncStorage.getItem('lk')

    if (!id || !ma || !pa || !lk) {
      this.props.navigation.navigate('Auth')
    }

    fetch(API.URL + '/session/auth', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: id,
        mail: ma,
        password: pa,
        loginKey: lk
      })
    })
      .then(response => {
        if (response.status === 202) {
          this.props.navigation.navigate('CarRentalStack')
        } else {
          this.props.navigation.navigate('Auth')
        }
      })
      .catch(() => {
        this.props.navigation.navigate('Auth')
      })
  }

  // Render any loading content that you like here
  render () {
    return (
      <View style={styles.container}>
        <StatusBar barStyle='default' />
        <Text style={styles.padding8}>Checking your last login data</Text>
        <ActivityIndicator style={styles.activityIndicator} />
        <Button
          title='Click here to Sign In now.'
          onPress={() => {
            this.props.navigation.navigate('Auth')
          }}
          style={styles.button}
        />
      </View>
    )
  }
}
