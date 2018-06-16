import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  Alert,
  Dimensions,
  ListView,
  AsyncStorage,
  ActivityIndicator
} from 'react-native'
import { ListItem } from 'react-native-elements'
import API from '../../API'
import IosColors from '../../colors.js'
import { CalendarList } from 'react-native-calendars'

import styles from '../../styles.js'

const reservedColor = IosColors.OrangeLight
const selectedColor = IosColors.Green

export default class CarReservationScreen extends Component {
  static navigationOptions = {
    title: 'Reservation'
  }

  constructor (props) {
    super(props)

    const { navigation } = this.props
    const id = navigation.getParam('id', '')

    this.state = {
      id: id,
      car: {
        boot: 0,
        brand: 'Loading',
        color: 'Loading',
        daycost: 0.0,
        doors: 0,
        drive: 'Loading',
        fuelcap: 0,
        fueltype: 'Loading',
        gearbox: 'Loading',
        gears: 0,
        id: 0,
        imageurl: '',
        lastUpdate: '',
        model: 'Loading',
        range: 0,
        yearprod: 0
      },
      reservations: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      _reservedDays: {},
      _selectedDays: {},
      status: 'filling'
    }

    this._setReservedDates = this._setReservedDates.bind(this)
  }

  componentDidMount () {
    this._getCarAsync()
    this._getReservationsAsync()
  }

  _getCarAsync = async () => {
    fetch(API.URL + '/cars/' + this.state.id, {
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
              car: json.car
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

  _getReservationsAsync = async () => {
    fetch(API.URL + '/cars/' + this.state.id + '/reservations', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status === 200) {
        response.json().then(json => {
          this.setState(
            {
              reservations: this.state.reservations.cloneWithRows(
                json.reservations
              )
            },
            () => {
              this._setReservedDates()
            }
          )
        })
      } else {
        console.log('reservations getting error')
      }
    })
  }

  _setReservedDates = async () => {
    let reservedDays = { '': {} }
    let reservations = this.state.reservations

    for (let i = 0; i < reservations.getRowCount(); i++) {
      // prepare dates
      let from = new Date(reservations.getRowData(0, i).fromDate)
      from = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1)
        .toISOString()
        .substring(0, 10)
      let to = new Date(reservations.getRowData(0, i).toDate)
      to = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1)
        .toISOString()
        .substring(0, 10)
      // -------------

      from = new Date(from)
      to = new Date(to)
      let first = from.toISOString().substring(0, 10)
      let last = to.toISOString().substring(0, 10)

      if (first === last) {
        reservedDays[first] = {
          color: reservedColor,
          startingDay: true,
          endingDay: true
        }
      } else {
        reservedDays[first] = {
          color: reservedColor,
          startingDay: true
        }
        from = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1)
        while (from < to) {
          from = new Date(
            from.getFullYear(),
            from.getMonth(),
            from.getDate() + 1
          )
          let date = from.toISOString().substring(0, 10)

          reservedDays[date] = {
            color: reservedColor
          }
        }

        reservedDays[last] = {
          color: reservedColor,
          endingDay: true
        }
      }
    }

    const updatedReservedDates = reservedDays
    this.setState({ _reservedDays: updatedReservedDates })
  }

  onDayPress = day => {
    let _selectedDay = day.dateString

    let isFree = this.state._reservedDays[_selectedDay] === undefined
    if (isFree) {
      let now = new Date()
      let selectedDate = new Date(_selectedDay)
      if (selectedDate > now) {
        let choosedDay = this.state._selectedDays[_selectedDay]

        if (choosedDay === undefined || choosedDay.color === undefined) {
          console.log('free')
          const updatedSelectedDays = {
            ...this.state._selectedDays,
            ...{
              [_selectedDay]: {
                color: selectedColor,
                startingDay: true,
                endingDay: true
              }
            }
          }
          this.setState({ _selectedDays: updatedSelectedDays }, () =>
            console.log(this.state._selectedDays)
          )
        } else {
          console.log('choosed')
          let dates = this.state._selectedDays
          delete dates[_selectedDay]

          const updatedSelectedDays = { ...dates }
          this.setState({ _selectedDays: updatedSelectedDays }, () =>
            console.log(this.state._selectedDays)
          )
        }
      } else {
        Alert.alert(
          'This day is unavailable.',
          'Select future day.',
          [{ text: 'OK' }],
          {
            cancelable: false
          }
        )
      }
    } else {
      Alert.alert(
        'This day is unavailable',
        'Select free day',
        [{ text: 'OK' }],
        {
          cancelable: false
        }
      )
    }
  }

  onPressSave = async () => {
    this.setState({ status: 'saving' })
    const selected = this.state._selectedDays
    const size = Object.keys(selected).length
    const keys = Object.keys(selected)

    let fromDate
    let toDate

    if (size > 0) {
      fromDate = new Date(keys[0])
      toDate = new Date(keys[0])
      if (size === 1) {
        // it is okay one day
      } else {
        for (let i = 1; i < size; i++) {
          let tmpDate = new Date(keys[i])

          if (tmpDate < fromDate) {
            fromDate = tmpDate
          } else if (tmpDate > toDate) {
            toDate = tmpDate
          }
        }
      }
      fromDate = fromDate.toISOString()
      fromDate = fromDate.substring(0, 10) + 'T06:00:00.000+02:00'
      toDate = toDate.toISOString()
      toDate = toDate.substring(0, 10) + 'T22:00:00.000+02:00'
      const carId = this.state.car.id
      const customerId = await AsyncStorage.getItem('id')

      await this._postReservationAsync(customerId, carId, fromDate, toDate)
    }
  }

  _postReservationAsync = async (customerId, carId, from, to) => {
    fetch(API.URL + '/reservations', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        car: { id: carId },
        customer: { id: customerId },
        fromDate: from,
        toDate: to
      })
    }).then(response => {
      if (response.status === 201) {
        this.setState({ status: 'saved' })
        Alert.alert(
          'Thank You !',
          "Your reservation has been saved.\nLet's go to:",
          [
            {
              text: 'Cars',
              onPress: () => this.props.navigation.navigate('Cars')
            },
            {
              text: 'Reservations',
              onPress: () => {
                this.props.navigation.navigate('Cars')
                this.props.navigation.navigate('Reservations')
              }
            }
          ],
          {
            cancelable: false
          }
        )
      } else {
        this.setState({ status: 'filling' })
        Alert.alert(
          'Saving reservation failed',
          'Reason: ' + response.headers.map.error + '\nTry again.',
          [{ text: 'OK' }],
          {
            cancelable: false
          }
        )
      }
    })
  }

  render () {
    const car = this.state.car
    const { width } = Dimensions.get('window')
    const loading = this.state.car.id === 0
    const marked = { ...this.state._reservedDays, ...this.state._selectedDays }
    const days = Object.keys(this.state._selectedDays).length
    const price = (this.state.car.daycost * days).toFixed(2)
    return (
      <ScrollView>
        <Text style={styles.listTitle}>
          Car Reservation:
        </Text>
        <View backgroundColor='white'>
          <ListItem
            leftIcon={{ name: 'directions-car' }}
            key={'brand'}
            title={car.brand + ' ' + car.model + ' ' + car.yearprod}
            hideChevron
          />
        </View>
        {this.state.status === 'filling'
          ? <View>
            <View
              style={{
                marginBottom: 8
              }}
              >
              <Text style={styles.listTitle}>Choose days:</Text>
              <CalendarList
                horizontal
                calendarWidth={width}
                firstDay={1}
                scrollEnabled
                pastScrollRange={0}
                pagingEnabled
                markedDates={marked}
                onDayPress={this.onDayPress}
                markingType='period'
                theme={{
                  todayTextColor: '#00adf5'
                }}
                />
              <Text style={styles.information}>Yellow means RESERVED</Text>
            </View>
            <Text style={styles.listTitle}>
                Total cost: {price} PLN / {days} days
              </Text>
            <View
              backgroundColor='white'
              style={{
                marginVertical: 24
              }}
              pointerEvents={loading ? 'none' : 'auto'}
              >
              <ListItem
                key={'add'}
                title={'Save Reservation'}
                hideChevron
                titleStyle={{
                  textAlign: 'center',
                  color: IosColors.Red
                }}
                onPress={this.onPressSave}
                />
            </View>
          </View>
          : this.state.status === 'saving'
              ? <View style={[styles.viewInView]}>
                <Text style={styles.listTitle}>
                    We are saving Your reservation. Please wait.
                  </Text>
                <ActivityIndicator
                  size='large'
                  style={styles.activityIndicator}
                  />
              </View>
              : <View style={[styles.viewInView]}>
                <Text style={styles.listTitle}>
                    Success.
                  </Text>
              </View>}
      </ScrollView>
    )
  }
}
