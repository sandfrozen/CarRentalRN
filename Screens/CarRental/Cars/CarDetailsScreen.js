import React, { Component } from 'react'
import {
  Text,
  View,
  Image,
  ScrollView,
  ListView,
  Dimensions
} from 'react-native'
import { ListItem } from 'react-native-elements'
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
    this.markedDates = this.markedDates.bind(this)
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

      console.log(from)
      console.log(to)
      const color = IosColors.OrangeLight

      if (first === last) {
        console.log('in eq ' + from)
        marks[first] = {
          color: color,
          startingDay: true,
          endingDay: true
        }
      } else {
        marks[first] = {
          startingDay: true,
          color: color
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
            color: color
          }
        }

        marks[last] = {
          color: color,
          endingDay: true
        }
      }
    }
    return marks
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
            title={car['brand'] + ' ' + car['model'] + ' ' + car['yearprod']}
            hideChevron
          />
          <ListItem
            leftIcon={{ name: 'check' }}
            key={'color'}
            title={'color: ' + car['color']}
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
            key={'boot'}
            title={car['boot'] + ' liters boot'}
            hideChevron
          />
          <ListItem
            leftIcon={{ name: 'check' }}
            key={'gears'}
            title={
              car['gears'] +
                ' gears ' +
                (car['gearbox'] === 'A' ? '(automatic, ' : '(manual, ') +
                car['drive'] +
                ')'
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
          <ListItem
            leftIcon={{ name: 'check' }}
            key={'price'}
            title={car['daycost'].toFixed(2) + '  pln / day'}
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
          <Text style={styles.listTitle}>Actual Reservations:</Text>
          <CalendarList
            horizontal
            current
            calendarWidth={width}
            firstDay={1}
            scrollEnabled
            pastScrollRange={0}
            pagingEnabled
            markedDates={this.markedDates()}
            markingType='period'
            theme={{
              todayTextColor: '#00adf5'
            }}
          />
        </View>
      </ScrollView>
    )
  }
}
