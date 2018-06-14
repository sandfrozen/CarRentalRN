import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  ScrollView,
  ListView,
  Dimensions
} from 'react-native'
import { ListItem, Button } from 'react-native-elements'
import styles from '../../styles.js'
import IosColors from '../../colors.js'
import API from '../../API'
import { CalendarList } from 'react-native-calendars'

export default class CarDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Details'
  }

  constructor (props) {
    super(props)

    const { navigation } = this.props
    const car = navigation.getParam('car', '')

    this.state = {
      car: car,
      reservations: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      })
    }

    this.renderRow = this.renderRow.bind(this)
  }

  componentDidMount () {
    this._getReservationsAsync()
  }

  _getReservationsAsync = async () => {
    fetch(API.URL + '/cars/' + this.state.car.id + '/reservations', {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }).then(response => {
      if (response.status === 200) {
        response.json().then(json => {
          this.setState({
            reservations: this.state.reservations.cloneWithRows(
              json.reservations
            )
          })
          console.log(json.reservations)
        })
      } else {
        console.log('reservations getting error')
      }
    })
  }

  renderRow (rowData, sectionID) {
    const from = new Date(rowData.fromDate).toLocaleDateString()
    const to = new Date(rowData.toDate).toLocaleDateString()
    return (
      <ListItem
        hideChevron
        leftIcon={{ name: 'event-note' }}
        title={from + ' -> ' + to}
      />
    )
  }

  render () {
    const { navigation } = this.props
    const car = navigation.getParam('car', '')
    const { width } = Dimensions.get('window')
    return (
      <ScrollView>
        <Image
          source={{ uri: car.imageurl }}
          style={{
            width: '100%',
            height: 200,
            backgroundColor: 'white'
          }}
          resizeMode='contain'
        />
        <Text style={styles.listTitle}>
          Details:
        </Text>
        <View
          backgroundColor='white'
          style={{
            borderTopWidth: 1,
            borderColor: IosColors.SuperLightGray
          }}
        >
          <ListItem
            leftIcon={{ name: 'directions-car' }}
            key={'brand'}
            title={car['brand'] + ' ' + car['model']}
            hideChevron
          />
          <ListItem
            leftIcon={{ name: 'check' }}
            key={'doors'}
            title={car['doors'] + ' doors'}
            hideChevron
          />
          <ListItem
            leftIcon={{ name: 'check' }}
            key={'gears'}
            title={
              car['gears'] +
                ' gears ' +
                (car['gearbox'] === 'A' ? '(automatic)' : '(manual)')
            }
            hideChevron
          />
          <ListItem
            leftIcon={{ name: 'check' }}
            key={'fueltype'}
            title={
              (car['fueltype'] === 'd' ? 'diesel (' : 'petrol (') +
                car['fuelcap'] +
                ' l.)'
            }
            hideChevron
          />
        </View>
        <View
          backgroundColor='white'
          style={{
            marginTop: 24
          }}
        >
          <ListItem
            key={'add'}
            title={'Reserve This Car'}
            hideChevron
            titleStyle={{
              textAlign: 'center',
              color: IosColors.Blue
            }}
            onPress={() => {
              this.props.navigation.navigate('NewReservation', {
                car: car
              })
            }}
          />
        </View>
        <View
          style={{
            marginBottom: 24
          }}
        >
          <Text style={styles.listTitle}>
            Actual Reservations:
          </Text>

          <CalendarList
            horizontal
            calendarWidth={width}
            firstDay={1}
            scrollEnabled
            pastScrollRange={0}
            pagingEnabled
          />
        </View>
      </ScrollView>
    )
  }
}
