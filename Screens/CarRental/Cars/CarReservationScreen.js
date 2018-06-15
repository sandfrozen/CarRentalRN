import React, { Component } from 'react'
import {
  Text,
  View,
  ScrollView,
  Alert,
  Dimensions,
  ListView
} from 'react-native'
import { ListItem } from 'react-native-elements'
import API from '../../API'
import IosColors from '../../colors.js'
import { CalendarList } from 'react-native-calendars'

import styles from '../../styles.js'

const reservedColor = IosColors.OrangeLight
const choosedColor = IosColors.Green

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
      _markedDates: {
        '2018-06-06': {
          color: IosColors.Red,
          startingDay: true,
          endingDay: true
        }
      }
    }

    this.markedDates = this.markedDates.bind(this)
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
              this.markedDates()
            }
          )
        })
      } else {
        console.log('reservations getting error')
      }
    })
  }

  markedDates () {
    let marks = { '': {} }
    let res = this.state.reservations

    for (let i = 0; i < res.getRowCount(); i++) {
      // prepare dates
      let from = new Date(res.getRowData(0, i).fromDate)
      from = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1)
        .toISOString()
        .substring(0, 10)
      let to = new Date(res.getRowData(0, i).toDate)
      to = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1)
        .toISOString()
        .substring(0, 10)
      // -------------

      from = new Date(from)
      to = new Date(to)
      let first = from.toISOString().substring(0, 10)
      let last = to.toISOString().substring(0, 10)

      if (first === last) {
        marks[first] = {
          color: reservedColor,
          startingDay: true,
          endingDay: true
        }
      } else {
        marks[first] = {
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

          marks[date] = {
            color: reservedColor
          }
        }

        marks[last] = {
          color: reservedColor,
          endingDay: true
        }
      }
    }

    const updatedMarkedDates = marks
    this.setState({ _markedDates: updatedMarkedDates })
  }

  onDaySelect = day => {
    let _selectedDay = day.dateString
    let color = ''

    let choosedDay = this.state._markedDates[_selectedDay]
    if (choosedDay === undefined || choosedDay.color === undefined) {
      console.log('free')
      color = choosedColor
      const updatedMarkedDates = {
        ...this.state._markedDates,
        ...{
          [_selectedDay]: { color: color, startingDay: true, endingDay: true }
        }
      }
      this.setState({ _markedDates: updatedMarkedDates })
    } else if (choosedDay.color === choosedColor) {
      console.log('choosed')
      let dates = this.state._markedDates
      delete dates[_selectedDay]

      const updatedMarkedDates = { ...dates }
      this.setState({ _markedDates: updatedMarkedDates })
    }
    console.log(this.state._markedDates)
  }

  render () {
    const car = this.state.car
    const { width } = Dimensions.get('window')
    const loading = this.state.car.id === 0
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
        <View
          style={{
            marginBottom: 8
          }}
        >
          <Text style={styles.listTitle}>Choose dates:</Text>
          <CalendarList
            horizontal
            calendarWidth={width}
            firstDay={1}
            scrollEnabled
            pastScrollRange={0}
            pagingEnabled
            markedDates={this.state._markedDates}
            onDayPress={this.onDaySelect}
            markingType='period'
            theme={{
              todayTextColor: '#00adf5'
            }}
          />
          <Text style={styles.information}>Yellow means RESERVED</Text>
        </View>
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
            onPress={() => {
              this.props.navigation.goBack()
            }}
          />
        </View>
      </ScrollView>
    )
  }
}
