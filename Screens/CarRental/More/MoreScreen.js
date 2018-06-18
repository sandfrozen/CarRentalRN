import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  Alert,
  AsyncStorage
} from 'react-native'
import { ListItem } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from '../../styles.js'
import IosColors from '../../colors.js'

export default class MoreScreen extends Component {
  static navigationOptions = {
    title: 'More'
  }

  render () {
    return (
      <ScrollView>
        <View style={{paddingTop: 32}}>
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
          {/* <ListItem
            leftIcon={{ name: 'cancel' }}
            key={'localData'}
            title={'Delete saved data'}
            hideChevron
            titleStyle={{ fontSize: 20 }}
          /> */}
          <ListItem
            leftIcon={{ name: 'clear' }}
            key={'signInData'}
            title={'Clear login keys'}
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
            marginTop: 16
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
    await AsyncStorage.removeItem('ma')
    await AsyncStorage.removeItem('pa')
    await AsyncStorage.removeItem('lk')
    Alert.alert('Sign In keys deleted.', '', [{ text: 'OK' }], {
      cancelable: false
    })
  }

  _signOutAsync = async () => {
    await AsyncStorage.removeItem('lk')
    this.props.navigation.navigate('Auth')
  }
}
