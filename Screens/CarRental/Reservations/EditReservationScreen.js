import React, { Component } from 'react'
import {
  Text,
  View,
  Button,
  ScrollView,
  Alert,
  StyleSheet,
  Dimensions,
  ListView,
  AsyncStorage,
  AlertIOS
} from 'react-native'
import styles from '../../styles.js'
import IosColors from '../../colors.js'
import API from '../../API'
import RNPickerSelect from 'react-native-picker-select'
import { CalendarList } from 'react-native-calendars'

const reservedColor = IosColors.OrangeLight
const selectedColor = IosColors.Green
const actualColor = IosColors.SuperLightGray

export default class EditReservationScreen extends Component {
  static navigationOptions = {
    title: 'Reservation'
  }

  constructor (props) {
    super(props)

    const { navigation } = this.props
    const res = navigation.getParam('reservation', '')
    const car = navigation.getParam('car', '')

    this.state = {
      reservation: res,
      reservations: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      cars: undefined,
      car: car,
      selectedCarId: car.id,
      carsArray: [
        {
          label: 'none',
          value: 'Please wait'
        }
      ],
      _reservedDays: {},
      _selectedDays: {}
    }
  }

  componentDidMount () {
    this._getCarsAsync()
    this._getReservationsForCarAsync()
  }

  _getReservationsForCarAsync = async () => {
    fetch(API.URL + '/cars/' + this.state.selectedCarId + '/reservations', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
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
          Alert.alert('Connection problem', '', [{ text: 'OK' }], {
            cancelable: false
          })
        }
      })
      .catch(() => {
        Alert.alert('Connection problem', '', [{ text: 'OK' }], {
          cancelable: false
        })
      })
  }

  _getCarAsync = async () => {
    fetch(API.URL + '/cars/' + this.state.selectedCarId, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    })
      .then(response => {
        if (response.status === 200) {
          response.json().then(json => {
            this.setState(
              {
                car: json.car
              },
              () => {
                this._setReservedDates()
              }
            )
          })
        } else {
          Alert.alert('Connection problem', '', [{ text: 'OK' }], {
            cancelable: false
          })
        }
      })
      .catch(() => {
        Alert.alert('Connection problem', '', [{ text: 'OK' }], {
          cancelable: false
        })
      })
  }

  _setReservedDates = async () => {
    let reservedDays = { '': {} }
    let selectedDaysTmp = this.state._selectedDays
    let reservations = this.state.reservations
    const thisres = this.state.reservation

    for (let i = 0; i < reservations.getRowCount(); i++) {
      const localres = reservations.getRowData(0, i)
      const localColor = thisres.id === localres.id
        ? actualColor
        : reservedColor

      // prepare dates
      let from = new Date(localres.fromDate)
      from = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 1)
        .toISOString()
        .substring(0, 10)
      let to = new Date(localres.toDate)
      to = new Date(to.getFullYear(), to.getMonth(), to.getDate() + 1)
        .toISOString()
        .substring(0, 10)
      // -------------

      from = new Date(from)
      to = new Date(to)
      let first = from.toISOString().substring(0, 10)
      let last = to.toISOString().substring(0, 10)

      if (selectedDaysTmp[first] !== undefined) {
        delete selectedDaysTmp[first]
      }

      if (first === last) {
        reservedDays[first] = {
          color: localColor,
          startingDay: true,
          endingDay: true
        }
      } else {
        reservedDays[first] = {
          color: localColor,
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
          if (selectedDaysTmp[date] !== undefined) {
            delete selectedDaysTmp[date]
          }
          reservedDays[date] = {
            color: localColor
          }
        }
        if (selectedDaysTmp[last] !== undefined) {
          delete selectedDaysTmp[last]
        }

        reservedDays[last] = {
          color: localColor,
          endingDay: true
        }
      }
    }

    const updatedSelectedDates = selectedDaysTmp
    const updatedReservedDates = reservedDays
    this.setState({
      _reservedDays: updatedReservedDates,
      _selectedDays: updatedSelectedDates
    })
  }

  _getCarsAsync = async () => {
    fetch(API.URL + '/cars', {
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
              cars: json.cars
            },
            () => this.setCarsArray()
          )
        })
      } else {
        console.log('cars getting error')
      }
    })
  }

  setCarsArray = () => {
    const cars = this.state.cars
    let carsArray = []
    for (let c in cars) {
      carsArray.push({
        value: cars[c].id,
        label: cars[c].brand +
          ' ' +
          cars[c].model +
          ' ' +
          cars[c].yearprod +
          ' (' +
          cars[c].color +
          ')'
      })
    }

    this.setState({
      carsArray: carsArray
    })
  }

  onDayPress = day => {
    let _selectedDay = day.dateString

    let isFree =
      this.state._reservedDays[_selectedDay] === undefined ||
      this.state._reservedDays[_selectedDay].color === actualColor
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
      let fromTmp = fromDate
      const reserved = this.state._reservedDays
      let i = 0
      while (fromTmp <= toDate) {
        let day = fromTmp.toISOString()
        day = day.substring(0, 10)
        if (
          reserved[day] !== undefined &&
          reserved[day].color !== actualColor
        ) {
          Alert.alert(
            'Incorrect days range',
            'Days must follow each other.',
            [
              {
                text: 'OK'
              }
            ],
            {
              cancelable: false
            }
          )
          return
        }
        fromTmp = new Date(
          fromTmp.getFullYear(),
          fromTmp.getMonth(),
          fromTmp.getDate() + 1
        )
        console.log('next day: ' + fromTmp)
        i++
      }
      fromDate = fromDate.toISOString()
      fromDate = fromDate.substring(0, 10) + 'T06:00:00.000+02:00'
      toDate = toDate.toISOString()
      toDate = toDate.substring(0, 10) + 'T22:00:00.000+02:00'
      const carId = this.state.car.id
      const customerId = await AsyncStorage.getItem('id')
      const cost = (i * this.state.car.daycost).toFixed(2)

      await this._putReservationAsync(
        customerId,
        carId,
        fromDate,
        toDate,
        cost,
        i
      )
    }
  }

  _putReservationAsync = async (customerId, carId, from, to, cost, days) => {
    AlertIOS.alert(
      'Confirmation',
      'Reservation total cost:\n' + cost + ' PLN/' + days + ' days',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Save',
          style: 'destructive',
          onPress: () => {
            this.setState({ status: 'saving' })
            fetch(API.URL + '/reservations/' + this.state.reservation.id, {
              method: 'PUT',
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
                  'Your reservation has been saved.',
                  [
                    {
                      text: 'Ok',
                      onPress: () => {
                        if (
                          this.props.navigation.state.params
                            .ReservationDetails === undefined
                        ) {
                          this.props.navigation.goBack()
                          this.props.navigation.navigate('Cars')
                          this.props.navigation.navigate('Cars')
                        } else {
                          this.props.navigation.goBack()
                          this.props.navigation.state.params.ReservationDetails._getReservationAsync()
                        }
                        // if Parent is ReservationDetails
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
        }
      ]
    )
  }

  render () {
    const loading = this.state.reservation === undefined
    if (loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Text>
            loading reservarions details
          </Text>
        </View>
      )
    } else {
      const { width } = Dimensions.get('window')
      const reservation = this.state.reservation
      const marked = {
        ...this.state._reservedDays,
        ...this.state._selectedDays
      }
      const days = Object.keys(this.state._selectedDays).length
      const changed = days > 0
      const price = (this.state.car.daycost * days).toFixed(2)
      return (
        <ScrollView>
          <Text style={styles.listTitle}>
            Choose car:
          </Text>
          <View style={{ paddingHorizontal: 12 }}>
            <RNPickerSelect
              placeholder={{
                label: 'Select car',
                value: 'none'
              }}
              value={this.state.selectedCarId}
              items={this.state.carsArray}
              onValueChange={value => {
                this.setState(
                  {
                    selectedCarId: value
                  },
                  () => {
                    this._getCarAsync()
                    this._getReservationsForCarAsync()
                  }
                )
              }}
              style={{ ...pickerSelectStyles }}
            />
          </View>
          <Button
            title='Update calendar'
            onPress={() => {
              this._getReservationsForCarAsync()
            }}
          />
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
            <Text style={styles.informationReserved}>
              RESERVED
            </Text>
            {reservation.id === 0
              ? ''
              : <Text style={styles.informationActual}>
                  ACTUAL
                </Text>}
            <Text style={styles.informationChoosed}>
              CHOOSED
            </Text>
            <Text style={styles.listTitle}>
              Estimated cost: {price} PLN / {days} days
            </Text>
          </View>
          <Button
            title={changed ? 'Save' : 'Select days'}
            disabled={changed === false}
            onPress={() => {
              this.onPressSave()
            }}
          />
        </ScrollView>
      )
    }
  }
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingTop: 13,
    paddingHorizontal: 8,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: IosColors.LightGray,
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black'
  }
})
