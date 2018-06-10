import React, { Component } from 'react'
import { Text, View, Button } from 'react-native'

export default class ReservationsScreen extends Component {
  render () {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>
          Reservations!
        </Text>
        <Button
          title='Go to Details'
          onPress={() => this.props.navigation.navigate('ReservationDetails')}
        />
      </View>
    )
  }
}
