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
  Alert,
  AlertIOS
} from 'react-native'
import styles from '../../styles.js'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ListItem, Icon } from 'react-native-elements'
import IosColors from '../../colors.js'
import API from '../../API'

export default class ReservationDetailsScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      title: 'Details',
      headerRight: (
        <Icon
          name='ios-trash-outline'
          type='ionicon'
          color={IosColors.Blue}
          size={28}
          containerStyle={{ padding: 8, paddingRight: 16 }}
          onPress={navigation.getParam('increaseCount')}
        />
      )
    }
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
    this.props.navigation.setParams({ increaseCount: this._increaseCount })
    this._getReservationAsync()
  }

  _increaseCount = () => {
    AlertIOS.alert('Delete this reservation?', '', [
      {
        text: 'Cancel',
        style: 'cancel'
      },
      {
        text: 'Delete',
        onPress: () => this._deleteReservation(),
        style: 'destructive'
      }
    ])
  }

  _deleteReservation = () => {
    fetch(API.URL + '/reservations/' + this.state.id, {
      method: 'DELETE'
    })
      .then(response => {
        if (response.status === 204) {
          this.props.navigation.state.params.ReservationsScreen._onRefresh()
          this.props.navigation.goBack()
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
        this.props.navigation.state.params.ReservationsScreen._onRefresh()
        this.props.navigation.goBack()
      })
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

      return (
        <ScrollView>
          <View
            backgroundColor='white'
            style={{
              borderColor: IosColors.SuperLightGray
            }}
          >
            <ListItem
              leftIcon={{ name: 'directions-car' }}
              key={'brand'}
              title={car['brand'] + ' ' + car['model'] + ' ' + car['yearprod']}
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
          <Button
            title='Edit reservation'
            onPress={() => {
              this.props.navigation.navigate('CarDetails', {
                id: car.id
              })
            }}
          />
        </ScrollView>
      )
    }
  }
}
