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
import { ListItem, Icon } from 'react-native-elements'
import IosColors from '../../colors.js'
import API from '../../API'

export default class ReservationDetailsScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    let params = navigation.state.params
    return {
      title: 'Details',
      headerRight: (
        <Icon
          name='ios-trash-outline'
          type='ionicon'
          color={params.actual ? IosColors.LightGray : IosColors.Blue}
          disabled={params.actual}
          size={28}
          containerStyle={{ padding: 8, paddingRight: 16 }}
          onPress={navigation.getParam('showDeleteAlert')}
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
      reservation: undefined,
      actual: true
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({ showDeleteAlert: this._showDeleteAlert })
    this._getReservationAsync()
  }

  _showDeleteAlert = () => {
    if (this.state.actual) {
      AlertIOS.alert('You can not delete actual reservation', '', [
        {
          text: 'Ok',
          style: 'cancel'
        }
      ])
    } else {
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
            const now = new Date()
            this.setState(
              {
                reservation: json.reservation,
                actual: new Date(json.reservation.toDate) < now ? true : now > new Date(json.reservation.fromDate) &&
                  now < new Date(json.reservation.toDate)
              },
              () => {
                this.props.navigation.setParams({ actual: this.state.actual })
              }
            )
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
      let actual = this.state.actual
      // calculate days, set 00 hours 00 minutes 00 seconds
      let t = new Date(to.getFullYear(), to.getMonth(), to.getDate())
      let f = new Date(from.getFullYear(), from.getMonth(), from.getDate())
      let i = 1
      while (f < t) {
        i++
        f = new Date(f.getFullYear(), f.getMonth(), f.getDate() + 1)
      }
      // --------------
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
          <Text style={styles.listTitle}>
            {this.state.actual ? 'This reservation is on' : 'This is future reservation'}
          </Text>
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
            disabled={actual}
            onPress={() => {
              this.props.navigation.navigate('EditReservation', {
                reservation: this.state.reservation,
                car: this.state.reservation.car,
                ReservationDetails: this
              })
            }}
          />
        </ScrollView>
      )
    }
  }
}
