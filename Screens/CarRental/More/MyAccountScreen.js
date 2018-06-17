import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  Alert,
  AsyncStorage,
  AlertIOS,
  TextInput,
  Button,
  KeyboardAvoidingView,
  Keyboard
} from 'react-native'
import { Icon } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from '../../styles.js'
import IosColors from '../../colors.js'
import API from '../../API'

export default class MoreScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: 'My Account',
      headerRight: (
        <Icon
          name='ios-trash-outline'
          type='ionicon'
          color={IosColors.Red}
          size={28}
          containerStyle={{ padding: 8, paddingRight: 16 }}
          onPress={navigation.getParam('showDeleteAlert')}
        />
      )
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      operation: 'loading',
      customer: undefined,
      name: '',
      surname: '',
      password: '',
      mail: ''
    }
    this.inputs = {}
  }

  componentDidMount () {
    this.props.navigation.setParams({ showDeleteAlert: this._showDeleteAlert })
    this._getCustomerAsync()
  }

  _getCustomerAsync = async () => {
    const id = await AsyncStorage.getItem('id')
    fetch(API.URL + '/customers/' + id, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 200) {
          response.json().then(json => {
            this.setState({
              customer: json.customer,
              name: json.customer.name,
              surname: json.customer.surname,
              mail: json.customer.mail,
              password: json.customer.password,
              operation: 'none',
              changed: false
            })
          })
        } else {
          Alert.alert('Connection problem', '', [{ text: 'OK' }], {
            cancelable: false
          })
          this.props.navigation.goBack()
        }
      })
      .catch(() => {
        Alert.alert('Connection problem', '', [{ text: 'OK' }], {
          cancelable: false
        })
        this.props.navigation.goBack()
      })
  }

  focusNextField (id) {
    this.inputs[id].focus()
  }

  _showDeleteAlert = () => {
    AlertIOS.alert('Confirmation', 'Remove account?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        onPress: () => this._deleteAccount(this.state.customer),
        style: 'destructive'
      }
    ])
  }

  _deleteAccount = async (customer) => {
    this.setState({ operation: 'removing' })
    console.log(customer)
    fetch(API.URL + '/customers/' + customer.id, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: 'deleted-' + customer.name,
        surname: 'deleted-' + customer.surname,
        mail: 'deleted-' + customer.mail,
        password: 'deleted-' + customer.password
      })
    })
      .then(response => {
        if (response.status === 201) {
          AsyncStorage.removeItem('id')
          AsyncStorage.removeItem('ma')
          AsyncStorage.removeItem('pa')
          AsyncStorage.removeItem('lk')
          Alert.alert('Your account has been deleted.', '', [{ text: 'OK' }], {
            cancelable: false
          })
          this.props.navigation.navigate('Auth')
        } else {
          Alert.alert('Connection problem', '', [{ text: 'OK' }], {
            cancelable: false
          })
          this.setState({ operation: 'none' })
        }
      })
      .catch(() => {
        Alert.alert('Connection problem', '', [{ text: 'OK' }], {
          cancelable: false
        })
        this.props.navigation.navigate('Auth')
      })
  }

  _putNewCustomerData = async (name, surname, mail, password) => {
    this.setState({ operation: 'loading' })

    fetch(API.URL + '/customers/' + this.state.customer.id, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        surname: surname,
        mail: mail,
        password: password
      })
    })
      .then(response => {
        if (response.status === 201) {
          AsyncStorage.setItem('ma', mail)
          AsyncStorage.setItem('pa', password)
          Alert.alert('Your data has been changed.', '', [{ text: 'OK' }], {
            cancelable: false
          })
          this._getCustomerAsync()
        } else {
          Alert.alert('Connection problem', '', [{ text: 'OK' }], {
            cancelable: false
          })
        }
      })
      .catch(() => {
        Alert.alert('Connection problem', '', [{ text: 'OK' }], {
          cancelable: false
        })
      })
    this.setState({ operation: 'none' })
  }

  _saveChanges = async () => {
    const name = this.state.name
    const surname = this.state.surname
    const mail = this.state.mail
    const password = this.state.password
    const c = this.state.customer
    console.log('save preseed')
    if (
      c.name === name &&
      c.surname === surname &&
      c.mail === mail &&
      c.password === password
    ) {
    } else {
      this._putNewCustomerData(name, surname, mail, password)
    }
  }

  checkChanges = () => {
    const name = this.state.name
    const surname = this.state.surname
    const mail = this.state.mail
    const password = this.state.password
    const c = this.state.customer
    if (
      c.name === name &&
      c.surname === surname &&
      c.mail === mail &&
      c.password === password
    ) {
      this.setState({ changed: false })
    } else {
      this.setState({ changed: true })
    }
  }

  render () {
    const operation = this.state.operation
    const { name, surname, mail, password, changed } = this.state
    if (operation === 'none') {
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
                Your account settings
              </Text>
              <Ionicons
                name='md-contact'
                type='ionicons'
                size={70}
                style={styles.logoIcon}
                color={IosColors.Blue}
              />
            </View>
            <TextInput
              style={styles.input}
              placeholder='name'
              onChangeText={name => this.setState({ name })}
              value={name}
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
              onEndEditing={() => {
                this.checkChanges()
              }}
            />
            <TextInput
              style={styles.input}
              placeholder='surname'
              onChangeText={surname => this.setState({ surname })}
              value={surname}
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
              onEndEditing={() => {
                this.checkChanges()
              }}
            />
            <TextInput
              style={styles.input}
              placeholder='your@mail.com'
              onChangeText={mail => {
                this.setState({ mail: mail.toLowerCase() })
              }}
              value={mail}
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
              onEndEditing={() => {
                this.checkChanges()
              }}
            />
            <TextInput
              style={styles.input}
              placeholder='password'
              onChangeText={password => this.setState({ password })}
              value={password}
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
                this._saveChanges()
              }}
              onEndEditing={() => {
                this.checkChanges()
              }}
            />
            <Button
              title={changed ? 'Save changes' : 'No changes found'}
              disabled={!changed}
              onPress={this._saveChanges}
              style={styles.button}
            />

          </KeyboardAvoidingView>
        </ScrollView>
      )
    } else if (operation === 'removing') {
      return (
        <View style={styles.container}>
          <Text>Removing Your data...</Text>
        </View>
      )
    } else if (operation === 'loading') {
      return (
        <View style={styles.container}>
          <Text>Loading Your data</Text>
        </View>
      )
    }
  }
}
