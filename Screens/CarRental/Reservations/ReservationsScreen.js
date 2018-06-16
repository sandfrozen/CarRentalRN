import React, { Component } from 'react'
import {
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  ListView,
  RefreshControl,
  AsyncStorage,
  ScrollView
} from 'react-native'
import styles from '../../styles.js'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ListItem } from 'react-native-elements'
import IosColors from '../../colors.js'
import API from '../../API'

export default class ReservationsScreen extends Component {
  constructor (props) {
    super(props)

    this.state = {
      reservationsPast: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      reservationsActual: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      reservationsFuture: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      refreshing: true,
      pastVisible: false,
      actualVisible: true,
      futureVisible: false
    }

    this.renderRow = this.renderRow.bind(this)
  }

  componentDidMount () {
    this._getActualReservationsAsync()
    this._getFutureReservationsAsync()
    this._getPastReservationsAsync()
  }

  _getPastReservationsAsync = async () => {
    this.setState({ refreshing: true })
    const customerId = await AsyncStorage.getItem('id')

    fetch(API.URL + '/customers/' + customerId + '/reservations/past', {
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
            reservationsPast: this.state.reservationsPast.cloneWithRows(res)
          })
        })
      } else {
        console.log('past reservations getting error')
      }
      this.setState({ refreshing: false })
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

  _getFutureReservationsAsync = async () => {
    this.setState({ refreshing: true })
    const customerId = await AsyncStorage.getItem('id')

    fetch(API.URL + '/customers/' + customerId + '/reservations/future', {
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
            reservationsFuture: this.state.reservationsFuture.cloneWithRows(
              res
            )
          })
        })
      } else {
        console.log('future reservations getting error')
      }
      this.setState({ refreshing: false })
    })
  }

  renderRow (rowData, sectionID) {
    const from = new Date(rowData.fromDate)
    const to = new Date(rowData.toDate)
    const date =
      from.getDate().toString().padStart(2, '0') +
      '.' +
      (from.getMonth() + 1).toString().padStart(2, '0') +
      ' - ' +
      to.getDate().toString().padStart(2, '0') +
      '.' +
      (to.getMonth() + 1).toString().padStart(2, '0') +
      '.' +
      to.getFullYear()

    return (
      <ListItem
        avatar={rowData.car.imageurl}
        title={rowData.car.brand + ' ' + rowData.car.model + ' ' + rowData.id}
        subtitle={date}
        rightIcon={{ name: 'chevron-right' }}
        onPress={() => {
          this.props.navigation.navigate('ReservationDetails', {
            reservationId: rowData.id,
            ReservationsScreen: this
          })
        }}
      />
    )
  }

  _onRefresh () {
    this.setState({ refreshing: true })
    this._getActualReservationsAsync()
    this._getFutureReservationsAsync()
    this._getPastReservationsAsync()
  }

  render () {
    const state = this.state.refreshing
    const pastCount = this.state.reservationsPast.getRowCount()
    const actualCount = this.state.reservationsActual.getRowCount()
    const futureCount = this.state.reservationsFuture.getRowCount()
    // const pastVisible = this.state.pastVisible
    // const actualVisible = this.state.actualVisible
    // const futureVisible = this.state.futureVisible
    if (state === true) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <StatusBar barStyle='default' />
        </View>
      )
    } else if (pastCount === 0 && actualCount === 0 && futureCount === 0) {
      return (
        <View style={styles.container}>
          <Ionicons
            name='ios-refresh-circle'
            type='Ionicons'
            size={100}
            style={styles.logoIcon}
            color={IosColors.SuperLightGray}
            onPress={() => this._onRefresh()}
          />
          <Text>
            You dont have reservations.
          </Text>
        </View>
      )
    } else {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          <View
            backgroundColor='white'
            style={{
              marginTop: 16,
              borderColor: IosColors.SuperLightGray
            }}
          >
            <ListItem
              key={'actuals'}
              title={'Past reservations: ' + pastCount}
              hideChevron
            />
            {pastCount > 0
              ? <ListView
                dataSource={this.state.reservationsPast}
                renderRow={this.renderRow}
                enableEmptySections
                style={{ backgroundColor: 'rgb(216, 216, 216)' }}
                type={'past'}
                pointerEvents={'none'}
              />
              : null}
          </View>
          <View
            backgroundColor='white'
            style={{
              marginTop: 16,
              borderColor: IosColors.SuperLightGray
            }}
          >
            <ListItem
              key={'actuals'}
              title={'Actual reservations: ' + actualCount}
              hideChevron
            />
            {actualCount > 0
              ? <ListView
                dataSource={this.state.reservationsActual}
                renderRow={this.renderRow}
                enableEmptySections
                style={{ backgroundColor: 'rgb(226, 243, 255)' }}
                type={'actual'}
              />
              : null}
          </View>
          <View
            backgroundColor='white'
            style={{
              marginTop: 16,
              borderColor: IosColors.SuperLightGray
            }}
          >
            <ListItem
              key={'actuals'}
              title={'Future reservations: ' + futureCount}
              hideChevron
            />
            {futureCount > 0
              ? <ListView
                dataSource={this.state.reservationsFuture}
                renderRow={this.renderRow}
                enableEmptySections
                style={{ backgroundColor: 'white' }}
                type={'future'}
              />
              : null}
          </View>
        </ScrollView>
      )
    }
  }
}
