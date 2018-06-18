import React from 'react'
import {
  View,
  Button,
  Alert,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
  Keyboard
} from 'react-native'
import styles from '../styles.js'
import Ionicons from 'react-native-vector-icons/Ionicons'

import API from '../API'
import IosColors from '../colors.js'

export default class SignUpScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      name: '',
      surname: '',
      mail: '',
      password: ''
    }

    this.inputs = {}
  }

  focusNextField (id) {
    this.inputs[id].focus()
  }

  render () {
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
              new account
            </Text>
            <Ionicons
              name='ios-person-add'
              type='Ionicons'
              size={100}
              style={styles.logoIcon}
              color={IosColors.GreenMy}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder='name'
            onChangeText={name => this.setState({ name })}
            autoCorrect={false}
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
            placeholder='surname'
            onChangeText={surname => this.setState({ surname })}
            autoCorrect={false}
            maxLength={20}
            multiline={false}
            returnKeyType='next'
            blurOnSubmit={false}
            ref={input => {
              this.inputs['2'] = input
            }}
            onSubmitEditing={() => {
              this.focusNextField('3')
            }}
          />
          <TextInput
            style={styles.input}
            placeholder='your@mail.com'
            onChangeText={mail => {
              this.setState({ mail: mail.toLowerCase() })
            }}
            autoCapitalize='none'
            keyboardType='email-address'
            autoCorrect={false}
            maxLength={20}
            multiline={false}
            returnKeyType='next'
            blurOnSubmit={false}
            ref={input => {
              this.inputs['3'] = input
            }}
            onSubmitEditing={() => {
              this.focusNextField('4')
            }}
          />
          <TextInput
            style={styles.input}
            placeholder='password'
            onChangeText={password => this.setState({ password })}
            secureTextEntry
            autoCorrect={false}
            maxLength={20}
            multiline={false}
            returnKeyType='done'
            blurOnSubmit={false}
            ref={input => {
              this.inputs['4'] = input
            }}
            onSubmitEditing={() => {
              Keyboard.dismiss()
              this._signUpAsync()
            }}
          />
          <Button
            title='Sign up!'
            onPress={this._signUpAsync}
            style={styles.button}
          />
          <Text style={styles.divider}>
            -  or  -
          </Text>
          <Button title='Back' onPress={this._goBack} />

        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  _signUpAsync = async () => {
    if (
      this.state.mail === '' ||
      this.state.name === '' ||
      this.state.surname === '' ||
      this.state.password === ''
    ) {
      Alert.alert('Not Signed In', 'Fill all fields', [{ text: 'OK' }], {
        cancelable: false
      })
      return
    }
    fetch(API.URL + '/customers', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mail: this.state.mail,
        name: this.state.name,
        surname: this.state.surname,
        password: this.state.password
      })
    }).then(response => {
      if (response.status === 201) {
        Alert.alert(
          'Signed In: ' + this.state.mail,
          'Your account has been created!',
          [{ text: 'OK', onPress: () => this.props.navigation.goBack() }],
          { cancelable: false }
        )
      } else {
        Alert.alert(
          'Not Signed In',
          'Reason: ' + response.headers.map.error,
          [{ text: 'OK' }],
          {
            cancelable: false
          }
        )
      }
    })
  }

  _goBack = async () => {
    this.props.navigation.goBack()
  }
}
