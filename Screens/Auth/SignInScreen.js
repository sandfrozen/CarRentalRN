import React from 'react'
import {
  AsyncStorage,
  View,
  Button,
  Alert,
  Text,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native'
import styles from '../styles.js'
import Ionicons from 'react-native-vector-icons/Ionicons'
import IosColors from '../colors.js'
import API from '../API'

// import AbortController from 'abort-controller'
// const controller = new AbortController()
// let signal = controller.signal
// signal.addEventListener('abort', () => {
//   console.log('aborted! ' + Date.now())
// })

class SignInScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mail: '',
      password: '',
      loading: false
    }
    this.inputs = {}
  }

  focusNextField (id) {
    this.inputs[id].focus()
  }

  componentDidMount () {
    this._loadAsyncStorage()
  }

  _loadAsyncStorage = async () => {
    const ma = await AsyncStorage.getItem('ma')
    const pa = await AsyncStorage.getItem('pa')
    this.setState({
      mail: ma,
      password: pa
    })
  }

  render () {
    const { mail, password, loading } = this.state

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
          {loading
            ? <View style={[styles.viewInView]}>
              <Text style={styles.padding8}>Singing in..</Text>
              <ActivityIndicator
                size='large'
                style={styles.activityIndicator}
                />
              <Button
                title='stop'
                onPress={() => {
                  this.setState({ loading: false })
                }}
                style={styles.button}
                />
            </View>
            : <View style={[styles.viewInView]}>
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
            </View>}
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

  _signInAsync = async () => {
    let id = null
    let loginKey = null
    this.setState({ loading: true })

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
    })
      .then(response => {
        if (response.status === 202) {
          response.json().then(json => {
            if (this.state.loading === true) {
              id = json.id
              loginKey = json.loginKey
              if (id && loginKey) {
                AsyncStorage.setItem('id', id)
                AsyncStorage.setItem('ma', this.state.mail)
                AsyncStorage.setItem('pa', this.state.password)
                AsyncStorage.setItem('lk', loginKey)
              }
              this.setState({ loading: false })
              this.props.navigation.navigate('CarRentalStack')
            }
          })
        } else if (response.status === 400) {
          if (this.state.loading === true) {
            this.setState({ loading: false })
            Alert.alert(
              'Not Sign In',
              'Incorrect mail or password',
              [{ text: 'OK' }],
              { cancelable: false }
            )
          }
        }
      })
      .catch(() => {
        if (this.state.loading === true) {
          this.setState({ loading: false })
          Alert.alert(
            'Not Sign In',
            'Problem with connection',
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
