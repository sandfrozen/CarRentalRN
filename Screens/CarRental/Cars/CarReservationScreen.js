import React, { Component } from 'react'
import { Text, View } from 'react-native'

export default class CarReservationScreen extends Component {
  static navigationOptions = {
    title: 'Details'
  }

  render () {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>
          Car Reseravtion!
        </Text>
      </View>
    )
  }
}
