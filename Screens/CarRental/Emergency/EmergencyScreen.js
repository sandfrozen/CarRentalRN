import React, { Component } from 'react'
import { Text, View, StyleSheet, AsyncStorage } from 'react-native'
import Geocoder from 'react-native-geocoding'
import API from '../../API'

export default class EmergencyScreen extends Component {
  static navigationOptions = {
    title: 'Emergency'
  }
  state = {
    initialPosition: 'unknown',
    lastPosition: 'unknown',
    longitude: 0,
    latitude: 0,
    address: 'loading',
    reservationsActual: undefined
  }
  watchID: ?number = null

  componentDidMount = () => {}

  _setLocalization = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        const initialPosition = JSON.stringify(position)
        this.setState({ initialPosition })
      },
      error => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
    this.watchID = navigator.geolocation.watchPosition(position => {
      const longitude = position.coords.longitude
      const latitude = position.coords.latitude
      this.setState({ longitude, latitude })

      Geocoder.init('AIzaSyB3e4D9t6FnLOo2HAr_60bkttlETaLIdRI')
      Geocoder.from(latitude, longitude)
        .then(json => {
          var address = json.results[0].formatted_address
          this.setState({ address })
          console.log(address)
        })
        .catch(error => console.warn(error))
    })
  }

  _getActualReservationsAsync = async () => {
    this.setState({ refreshing: true })
    const customerId = await AsyncStorage.getItem('id')

    fetch(API.URL + '/customers/' + customerId + '/reservations/actual', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status === 200) {
        response.json().then(json => {
          let res = json.reservations
          res.sort((a, b) => {
            return new Date(a.fromDate) - new Date(b.fromDate)
          })
          this.setState({
            reservationsActual: this.state.reservationsActual.cloneWithRows(
              res
            )
          })
        })
      } else {
        console.log('actual reservations getting error')
      }
      this.setState({ refreshing: false })
    })
  }

  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.watchID)
  }

  render () {
    const isReservation = this.state.reservationsActual !== undefined

    if (isReservation) {
      return (
        <View style={styles.container}>
          <Text style={styles.boldText}>
            Current position:
          </Text>
          <Text>
            {this.state.longitude}
          </Text>
          <Text>
            {this.state.latitude}
          </Text>
          <Text>
            {this.state.address}
          </Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <Text style={styles.boldText}>
            No option
          </Text>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 50
  },
  boldText: {
    fontSize: 30,
    color: 'red'
  }
})
