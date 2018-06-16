import React, { Component } from 'react'
import {
  Text,
  View,
  // ActivityIndicator,
  // StatusBar,
  // ListView,
  // RefreshControl,
  // AsyncStorage,
  Button,
  ScrollView,
  Image,
  Alert
} from 'react-native'
import styles from '../../styles.js'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ListItem, ButtonGroup } from 'react-native-elements'
import IosColors from '../../colors.js'
import API from '../../API'

const buttonsHeight = 40

export default class ReservationDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Details'
  }
  constructor (props) {
    super(props)

    const { navigation } = this.props
    const id = navigation.getParam('reservationId', '')

    this.state = {
      id: id,
      reservation: undefined
    }
  }

  componentDidMount () {
    this._getReservationAsync()
  }

  _getReservationAsync = async () => {
    fetch(API.URL + '/reservations/' + this.state.id, {
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
              reservation: json.reservation
            })
            console.log(json.reservation)
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

  deleteReservation = () => {
    console.log('delete')
  }

  editReservation = () => {
    console.log('edit')
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
      const car = this.state.reservation.car
      let from = new Date(this.state.reservation.fromDate)
      let to = new Date(this.state.reservation.toDate)
      let f = from
      let i = 1
      while (f < to) {
        i++
        f = new Date(f.getFullYear(), f.getMonth(), f.getDate() + 1)
      }
      const cost = (car.daycost * i).toFixed(2)
      from =
        from.getDate().toString().padStart(2, '0') +
        '.' +
        (from.getMonth() + 1).toString().padStart(2, '0') +
        '.' +
        from.getFullYear()

      to =
        to.getDate().toString().padStart(2, '0') +
        '.' +
        (to.getMonth() + 1).toString().padStart(2, '0') +
        '.' +
        to.getFullYear()

      const component1 = () => (
        <Text style={{ color: IosColors.Red, fontWeight: 'bold',  }}>Delete</Text>
      )
      const component2 = () => (
        <Text style={{ color: IosColors.Blue, fontWeight: '600' }}>Edit</Text>
      )
      const buttons = [{ element: component1 }, { element: component2 }]
      return (
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ScrollView style={{ width: '100%', marginBottom: buttonsHeight }}>
            <View
              backgroundColor='white'
              style={{
                marginBottom: 16,
                borderColor: IosColors.SuperLightGray
              }}
            >
              <ListItem
                leftIcon={{ name: 'directions-car' }}
                key={'brand'}
                title={
                  car['brand'] + ' ' + car['model'] + ' ' + car['yearprod']
                }
                hideChevron
              />
              <Image
                source={{ uri: car.imageurl }}
                style={{
                  width: '100%',
                  height: 100,
                  backgroundColor: 'white'
                }}
                resizeMode='contain'
              />
            </View>
            <Button
              title='Show car details'
              onPress={() => {
                this.props.navigation.navigate('CarDetails', {
                  id: car.id
                })
              }}
            />
            <View
              backgroundColor='white'
              style={{
                marginTop: 16,
                borderColor: IosColors.SuperLightGray
              }}
            >
              <ListItem
                leftIcon={{ name: 'attach-money' }}
                key={'cost'}
                title={cost + '  PLN / ' + i + ' days'}
                hideChevron
              />
              <ListItem
                leftIcon={{ name: 'keyboard-arrow-right' }}
                key={'from'}
                title={'From day: ' + from}
                hideChevron
              />
              <ListItem
                leftIcon={{ name: 'keyboard-arrow-left' }}
                key={'to'}
                title={'To day: ' + to}
                hideChevron
              />
            </View>
          </ScrollView>
          <ButtonGroup
            buttons={buttons}
            containerStyle={{
              height: buttonsHeight,
              position: 'absolute',
              left: 0,
              right: 0,
              bottom: 0,
              marginLeft: 0,
              marginBottom: 0,
              marginRight: 0,
              marginTop: 0
            }}
            onPress={index => {
              if (index === 0) {
                this.deleteReservation()
              } else if (index === 1) {
                this.editReservation()
              }
            }}
          />
        </View>
      )
    }
  }
}
