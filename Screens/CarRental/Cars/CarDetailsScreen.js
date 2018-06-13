import React, { Component } from 'react'
import { Text, View, Image, ScrollView, ListView } from 'react-native'
import { ListItem } from 'react-native-elements'
import Ionicons from 'react-native-vector-icons/Ionicons'
import styles from '../../styles.js'

const reservations = [
  {
    from: '1',
    to: '2'
  },
  {
    from: '3',
    to: '4'
  },
  {
    from: '5',
    to: '6'
  }
]

export default class CarDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Details'
  }

  // constructor (props) {
  //   super(props)
  // }

  render () {
    const { navigation } = this.props
    const car = navigation.getParam('car', '')
    console.log(car.imageurl)
    return (
      <ScrollView>
        <View style={styles.detailsContainer}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: car.imageurl }}
              style={{ width: '100%', height: '100%' }}
              resizeMode='contain'
            />
          </View>
          <ScrollView style={styles.infoContainer}>
            <Info label='brand' value={car.brand} />
            <Info label='model' value={car.model} />
            <Info label='doors' value={car.doors} />
            <Info
              label='type'
              value={car.fueltype === 'd' ? 'diesel' : 'petrol'}
            />
            <Info
              label='gears'
              value={car.gears}
              extra={car.gearbox === 'M' ? '(manual)' : '(automatic)'}
            />
            <Info label='fuel' value={car.fuelcap} extra='L' />
            <Info label='range' value={car.range} extra='km' />
            <Info label='day' value={car.daycost} extra='PLN' />

          </ScrollView>
        </View>
        <View>
          <Text style={styles.value}>
            Reservations:
          </Text>
          {reservations.map((item, i) => (
            <ListItem
              containerStyle={{ backgroundColor: 'white' }}
              key={i}
              title={item.from + ' - ' + item.to}
              leftIcon={{ name: 'list' }}
              hideChevron
            />
          ))}
        </View>
      </ScrollView>
    )
  }
}

class Info extends Component {
  render () {
    const { label, value, extra } = this.props
    return (
      <View style={styles.info}>
        <Text style={styles.label}>
          {label}:
        </Text>
        <Text style={styles.value}>
          {value} {extra}
        </Text>
      </View>
    )
  }
}
