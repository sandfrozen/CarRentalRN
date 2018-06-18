import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  AsyncStorage,
  Button,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Keyboard,
  Alert,
  AlertIOS
} from 'react-native'
import Geocoder from 'react-native-geocoding'
import API from '../../API'
import { ListItem } from 'react-native-elements'
import IosColors from '../../colors.js'
import styles from '../../styles.js'
import RNPickerSelect from 'react-native-picker-select'

export default class EmergencyScreen extends Component {
  static navigationOptions = {
    title: 'Emergency'
  }
  state = {
    initialPosition: 'unknown',
    lastPosition: 'unknown',
    longitude: 0,
    latitude: 0,
    address: 'Bialystok, Poland',
    reservationsActual: undefined,
    selectedReservationId: 'none',
    status: 'none',
    otherProblem: '',
    reservationsArray: [
      {
        label: 'none',
        value: 'Please wait'
      }
    ],
    selectedProblemId: 'none',
    problemsArray: [
      {
        label: 'Damaged whell',
        value: '0'
      },
      {
        label: 'Accident',
        value: '1'
      },
      {
        label: 'Engine faliure',
        value: '2'
      },
      {
        label: 'Other',
        value: '3'
      }
    ]
  }
  watchID: ?number = null

  componentDidMount = () => {
    Geocoder.init('AIzaSyB3e4D9t6FnLOo2HAr_60bkttlETaLIdRI')
    this._getActualReservationsAsync()
  }

  _setLocalization = () => {
    navigator.geolocation.getCurrentPosition(
      position => {
        // const initialPosition = JSON.stringify(position)
        // this.setState({ initialPosition })
      },
      error => console.log(error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
    )
    this.watchID = navigator.geolocation.watchPosition(position => {
      const longitude = position.coords.longitude
      const latitude = position.coords.latitude
      this.setState({ longitude, latitude })

      Geocoder.from(latitude, longitude)
        .then(json => {
          var address = json.results[0].formatted_address
          this.setState({ address })
          console.log(address)
        })
        .catch(error => console.log(error))
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
          this.setState(
            {
              reservationsActual: res,
              selectedReservationId: res.length > 0 ? res[0].id : 'none'
            },
            () => {
              this.setReservationsArray()
            }
          )
        })
      } else {
        console.log('actual reservations getting error')
      }
    })
  }

  setReservationsArray () {
    const res = this.state.reservationsActual
    let reservationsArray = []
    for (let r in res) {
      reservationsArray.push({
        value: res[r].id,
        label: 'ID: ' +
          res[r].id +
          ' - ' +
          res[r].car.brand +
          ' ' +
          res[r].car.model +
          ' ' +
          res[r].car.yearprod +
          ' (' +
          res[r].car.color +
          ')'
      })
    }

    this.setState({
      reservationsArray
    })
  }

  _refreshLocalization = async () => {
    navigator.geolocation.getCurrentPosition(position => {
      console.log('new pos: ' + position.coords)
      const longitude = position.coords.longitude
      const latitude = position.coords.latitude
      this.setState({ longitude, latitude })

      Geocoder.from(latitude, longitude)
        .then(json => {
          var address = json.results[0].formatted_address
          this.setState({ address })
          console.log(address)
        })
        .catch(error => console.warn(error))
    })
  }

  stopLocalization = () => {
    navigator.geolocation.clearWatch(this.watchID)
  }

  componentWillUnmount = () => {
    navigator.geolocation.clearWatch(this.watchID)
  }

  _postEmergencyAsync = async () => {
    AlertIOS.alert('Confirmation', 'Send emergency to server?', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          const message = this.state.selectedProblemId === '3'
            ? this.state.otherProblem
            : (this.state.selectedProblemId === 'none'
                ? 'no problem choosed'
                : this.state.problemsArray[this.state.selectedProblemId].label)
          console.log('bfore send: ' + this.state.selectedReservationId)
          fetch(API.URL + '/emergencies', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              reservation: { id: this.state.selectedReservationId },
              lat: this.state.latitude,
              lon: this.state.longitude,
              message: message
            })
          })
            .then(response => {
              if (response.status === 201) {
                Alert.alert(
                  'Confirmation',
                  'Your emergency has been reported.',
                  [
                    {
                      text: 'Ok',
                      onPress: () => {
                        this.setState({ status: 'none' })
                        this.stopLocalization()
                      }
                    }
                  ],
                  {
                    cancelable: false
                  }
                )
              } else {
                this.setState({ status: 'reporting' })
                Alert.alert(
                  'Sending emergency failed',
                  'Reason: ' + response.headers.map.error + '\nTry again.',
                  [{ text: 'OK' }],
                  {
                    cancelable: false
                  }
                )
              }
            })
            .catch(() => {
              this.setState({ status: 'reporting' })
              Alert.alert(
                'Sending emergency failed',
                'Try again.',
                [{ text: 'OK' }],
                {
                  cancelable: false
                }
              )
            })
        }
      }
    ])
  }

  render () {
    const isReservation = this.state.reservationsActual === undefined
      ? false
      : this.state.reservationsActual.length > 0
    const status = this.state.status
    const isOther = this.state.selectedProblemId === '3'

    if (status === 'none') {
      return (
        <View style={styles.container}>
          <Button
            title={
              isReservation
                ? 'Report a problem'
                : 'You have 0 actual reservations'
            }
            disabled={isReservation === false}
            onPress={() => {
              this.setState({ status: 'reporting' })
              this._setLocalization()
            }}
          />
          <Button
            title={'Refresh'}
            onPress={() => {
              this._getActualReservationsAsync()
            }}
          />
        </View>
      )
    } else if (status === 'reporting') {
      return (
        <ScrollView>
          <KeyboardAvoidingView
            style={[styles.standardMargin]}
            behavior='padding'
            enabled
          >
            <Text style={styles.listTitle2}>
              Select reservation:
            </Text>
            <RNPickerSelect
              placeholder={{
                label: 'Select reservation',
                value: 'none'
              }}
              value={this.state.selectedReservationId}
              items={this.state.reservationsArray}
              onValueChange={value => {
                this.setState(
                  {
                    selectedReservationId: value
                  },
                  () => {
                    console.log(value)
                  }
                )
              }}
              style={{ ...pickerSelectStyles }}
            />
            <View style={{ padding: 8 }} />
            <Text style={styles.listTitle2}>
              Select problem:
            </Text>
            <RNPickerSelect
              placeholder={{
                label: 'Select reason',
                value: 'none'
              }}
              items={this.state.problemsArray}
              onValueChange={value => {
                this.setState(
                  {
                    selectedProblemId: value
                  },
                  () => {
                    console.log(value)
                  }
                )
              }}
              style={{ ...pickerSelectStyles }}
            />
            <View style={{ padding: 8 }} />
            {isOther === true
              ? <TextInput
                style={styles.input2}
                placeholder='other problem'
                onChangeText={otherProblem => this.setState({ otherProblem })}
                maxLength={200}
                multiline
                returnKeyType='done'
                onSubmitEditing={() => {
                  Keyboard.dismiss()
                }}
                />
              : null}
            <Text style={styles.listTitle2}>
              Your localization:
            </Text>
            <View
              backgroundColor='white'
              style={{
                borderTopWidth: 1,
                borderColor: IosColors.SuperLightGray
              }}
            >
              <ListItem
                leftIcon={{ name: 'place' }}
                key={'address'}
                title={this.state.address}
                hideChevron
              />
              <ListItem
                leftIcon={{ name: 'gps-fixed' }}
                key={'lon'}
                title={this.state.longitude}
                hideChevron
              />
              <ListItem
                leftIcon={{ name: 'gps-fixed' }}
                key={'lat'}
                title={this.state.latitude}
                hideChevron
              />
            </View>
            <Button
              title='Refresh localization'
              onPress={() => {
                this._refreshLocalization()
              }}
              style={styles.button}
            />
            <View style={{ padding: 8 }} />
            <Button
              title='Send emergency now'
              onPress={() => {
                this._postEmergencyAsync()
              }}
              style={styles.button}
              color={IosColors.Red}
            />
            <Text style={styles.divider}>
              -  or  -
            </Text>
            <Button
              title='Stop reporting'
              onPress={() => {
                this.setState({ status: 'none' })
                this.stopLocalization()
              }}
              style={styles.button}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      )
    }

    // if (isReservation) {
    //   return (
    //     <View style={styles.container}>
    //       <Text style={styles.boldText}>
    //         Current position:
    //       </Text>
    //       <Text>
    //         {this.state.longitude}
    //       </Text>
    //       <Text>
    //         {this.state.latitude}
    //       </Text>
    //       <Text>
    //         {this.state.address}
    //       </Text>
    //     </View>
    //   )
    // } else {
    //   return (
    //     <View style={styles.container}>
    //       <Button title='Report a problem' />
    //     </View>
    //   )
    // }
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     marginTop: 50
//   },
//   boldText: {
//     fontSize: 30,
//     color: 'red'
//   }
// })

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
