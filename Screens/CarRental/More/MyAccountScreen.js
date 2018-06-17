import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  ScrollView,
  ListView,
  Alert,
  AsyncStorage,
  AlertIOS
} from 'react-native'
import { ListItem, Icon } from 'react-native-elements'
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
      operation: 'none'
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({ showDeleteAlert: this._showDeleteAlert })
  }

  _showDeleteAlert = () => {
    AlertIOS.alert('Confirmation', 'Remove account?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        onPress: () => this._deleteAccount(),
        style: 'destructive'
      }
    ])
  }

  _deleteAccount = async () => {
    this.setState({ operation: 'removing' })
    // in reality it is PUT method that changing costomer values
    const customerId = await AsyncStorage.getItem('id')
    fetch(API.URL + '/customers/' + customerId, {
      method: 'PUT',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        mail: 'deleted-tombs@wp.pl',
        name: 'deleted-Tomek',
        password: 'deleted-password',
        surname: 'deleted-Boosl'
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

  render () {
    const operation = this.state.operation
    if (operation === 'none') {
      return (
        <ScrollView>
          <View
            backgroundColor='white'
            style={{
              marginTop: 32
            }}
          />
        </ScrollView>
      )
    } else if (operation === 'removing') {
      return (
        <View style={styles.container}>
          <Text>Removing Your data...</Text>
        </View>
      )
    }
  }
}
