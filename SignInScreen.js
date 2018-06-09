import React from 'react'
import {
  AsyncStorage,
  View,
  Button,
  Alert
} from 'react-native'
import styles from './styles.js'

export default class SignInScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mail: 'tombs@wp.pl',
      password: 'password'
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Button title='Sign in!' onPress={this._signInAsync} />
        <Button title='Sign up!' onPress={this._signUpAsync} />
      </View>
    )
  }

  _signInAsync = async () => {
    let id
    let loginKey
    fetch('http://10.211.55.3:8080/CarRentalREST/v1/session/signin', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mail: this.state.mail,
        password: this.state.password
      })
    }).then(response => {
      if (response.status === 202) {
        (response.json()).then((json) => {
          id = json.id
          loginKey = json.loginKey
          if (id && loginKey) {
            AsyncStorage.setItem('c1', id)
            AsyncStorage.setItem('c2', this.state.mail)
            AsyncStorage.setItem('c3', this.state.password)
            AsyncStorage.setItem('c4', loginKey)
          }
          this.props.navigation.navigate('App')
        })
      } else {
        Alert.alert(
          'Not Sign In',
          'Incorrect mail or password',
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        )
      }
    })
  };

  _signUpAsync = async () => {
    this.props.navigation.push('SignUp')
  };
}
