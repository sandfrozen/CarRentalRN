import React, { Component } from 'react'
import { Text, View, Image, ScrollView, ListView, Alert } from 'react-native'
import { ListItem } from 'react-native-elements'
import styles from '../../styles.js'
import IosColors from '../../colors.js'
import API from '../../API'

export default class CarDetailsScreen extends Component {
  static navigationOptions = {
    title: 'Details'
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
      })
    }
  }

  componentDidMount () {
    this._getCarAsync()
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

  render () {
    const car = this.state.car
    const url = this.state.car.imageurl
    const loading = this.state.car.id === 0
    return (
      <ScrollView>
        {url
          ? <Image
            source={{ uri: url }}
            style={{
              width: '100%',
              height: 200,
              backgroundColor: 'white'
            }}
            resizeMode='contain'
            />
          : <Text style={styles.listTitle}>
              Loading car...
            </Text>}
        <View
          backgroundColor='white'
          style={{
            marginTop: 2,
            marginBottom: 16
          }}
          pointerEvents={loading ? 'none' : 'auto'}
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
                id: car.id
              })
            }}
          />
        </View>
        <Text style={styles.listTitleSmall}>
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
            title={car['daycost'].toFixed(2) + '  PLN / day'}
            hideChevron
          />
        </View>
      </ScrollView>
    )
  }
}
