import React from 'react'
import { ActivityIndicator, AsyncStorage, StatusBar, View } from 'react-native'
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
    }).then(response => {
      if (response.status === 202) {
        this.props.navigation.navigate('App')
      } else {
        // console.log(response.headers.map.error)
        this.props.navigation.navigate('Auth')
      }
    })

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    // this.props.navigation.navigate(auth ? 'App' : 'Auth');
  }

  // Render any loading content that you like here
  render () {
    return (
      <View style={styles.container}>
        <ActivityIndicator />
        <StatusBar barStyle='default' />
      </View>
    )
  }
}
