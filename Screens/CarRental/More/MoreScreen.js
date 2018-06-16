import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  ScrollView,
  ListView,
  Alert,
  AsyncStorage
} from 'react-native'
import { ListItem } from 'react-native-elements'
import styles from '../../styles.js'
import IosColors from '../../colors.js'
import API from '../../API'

export default class MoreScreen extends Component {
  render () {
    return (
      <ScrollView>
        <View
          backgroundColor='white'
          style={{
            marginTop: 32
          }}
        >
          <ListItem
            leftIcon={{ name: 'account-circle' }}
            key={'account'}
            title={'My account'}
            hideChevron
            titleStyle={{ fontSize: 20 }}
            onPress={() => {
              this.props.navigation.navigate('MyAccount')
            }}
          />
          <ListItem
            leftIcon={{ name: 'cancel' }}
            key={'localData'}
            title={'Delete saved data'}
            hideChevron
            titleStyle={{ fontSize: 20 }}
          />
          <ListItem
            leftIcon={{ name: 'clear' }}
            key={'signInData'}
            title={'Clear my Sign in keys'}
            hideChevron
            titleStyle={{ fontSize: 20 }}
            onPress={() => {
              this._deleteSignInKeys()
            }}
          />
        </View>
        <View
          backgroundColor='white'
          style={{
            marginTop: 32
          }}
        >
          <ListItem
            leftIcon={{ name: 'power-settings-new' }}
            key={'signOut'}
            title={'Sign out'}
            hideChevron
            titleStyle={{ fontSize: 20 }}
            onPress={() => {
              this._signOutAsync()
            }}
          />
        </View>
      </ScrollView>
    )
  }

  _deleteSignInKeys = async () => {
    await AsyncStorage.removeItem('id')
    await AsyncStorage.removeItem('ma')
    await AsyncStorage.removeItem('pa')
    await AsyncStorage.removeItem('lk')
    Alert.alert('Sign In keys deleted.', '', [{ text: 'OK' }], {
      cancelable: false
    })
  }

  _signOutAsync = async () => {
    await AsyncStorage.removeItem('id')
    await AsyncStorage.removeItem('lk')
    this.props.navigation.navigate('Auth')
  }
}
