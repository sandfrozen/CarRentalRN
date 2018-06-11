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

export default class AuthLoadingScreen extends React.Component {
  constructor (props) {
    super(props)
    this._bootstrapAsync()
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    const c1 = await AsyncStorage.getItem('c1')
    const c2 = await AsyncStorage.getItem('c2')
    const c3 = await AsyncStorage.getItem('c3')
    const c4 = await AsyncStorage.getItem('c4')

    if (!c1 || !c2 || !c3 || !c4) {
      this.props.navigation.navigate('Auth')
    }

    fetch('http://192.168.1.115:8080/CarRentalREST/v1/session/auth', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        id: c1,
        mail: c2,
        password: c3,
        loginKey: c4
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
