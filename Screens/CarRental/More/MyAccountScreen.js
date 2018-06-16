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
        />
      </ScrollView>
    )
  }
}
