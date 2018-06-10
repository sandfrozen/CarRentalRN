import React from 'react'
import {
  AsyncStorage,
  View,
  Button,
  Alert,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native'
import styles from '../styles.js'
import Ionicons from 'react-native-vector-icons/Ionicons'
import IosColors from '../colors.js'

import API from '../API'

class SignInScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mail: 'tombs@wp.pl',
      password: 'password'
    }

    this.inputs = {}
  }

  focusNextField (id) {
    this.inputs[id].focus()
  }

  render () {
    const mail = this.state.mail
    const password = this.state.password
    return (
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <KeyboardAvoidingView
          style={[styles.container, styles.standardMargin]}
          behavior='padding'
          enabled
        >
          <View style={styles.logo}>
            <Text style={styles.logoTitle}>
              CarRental
            </Text>
            <Text style={styles.logoSubtitle}>
              by Tomasz Buslowski
            </Text>
            <Ionicons
              name='ios-car'
              type='Ionicons'
              size={100}
              style={styles.logoIcon}
              color={IosColors.SuperLightGray}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder='your@mail.com'
            value={mail}
            onChangeText={mail => this.setState({ mail })}
            keyboardType='email-address'
            autoCorrect={false}
            autoCapitalize='none'
            maxLength={20}
            multiline={false}
            returnKeyType='next'
            blurOnSubmit={false}
            ref={input => {
              this.inputs['1'] = input
            }}
            onSubmitEditing={() => {
              this.focusNextField('2')
            }}
          />
          <TextInput
            style={styles.input}
            placeholder='password'
            value={password}
            onChangeText={password => this.setState({ password })}
            secureTextEntry
            autoCorrect={false}
            maxLength={20}
            multiline={false}
            returnKeyType='done'
            blurOnSubmit={false}
            ref={input => {
              this.inputs['2'] = input
            }}
            onSubmitEditing={() => {
              this._signInAsync()
            }}
          />
          <Button
            title='Sign in!'
            onPress={this._signInAsync}
            style={styles.button}
          />
          <Text style={styles.divider}>
            -  or  -
          </Text>
          <Button
            title='Sign up!'
            onPress={this._signUpAsync}
            style={styles.button}
          />

        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  _signInAsync = async () => {
    let id = null
    let loginKey = null

    fetch(API.URL + '/session/signin', {
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
        response.json().then(json => {
          id = json.id
          loginKey = json.loginKey
          if (id && loginKey) {
            AsyncStorage.setItem('c1', id)
            AsyncStorage.setItem('c2', this.state.mail)
            AsyncStorage.setItem('c3', this.state.password)
            AsyncStorage.setItem('c4', loginKey)
          }
          this.props.navigation.navigate('CarRentalStack')
        })
      } else {
        Alert.alert(
          'Not Sign In',
          'Incorrect mail or password',
          [{ text: 'OK' }],
          { cancelable: false }
        )
      }
    })
  }

  _signUpAsync = async () => {
    this.props.navigation.push('SignUp')
  }
}

export default SignInScreen
