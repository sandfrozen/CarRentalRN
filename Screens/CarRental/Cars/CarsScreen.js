import React, { Component } from 'react'
import {
  Text,
  View,
  ActivityIndicator,
  StatusBar,
  ListView,
  RefreshControl,
  Alert
} from 'react-native'
import styles from '../../styles.js'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ListItem, Icon } from 'react-native-elements'
import IosColors from '../../colors.js'
import API from '../../API'

export default class CarsScreen extends Component {
  static navigationOptions = ({ navigation, navigationOptions }) => {
    return {
      headerRight: (
        <Icon
          name='ios-search-outline'
          type='ionicon'
          color={IosColors.Blue}
          size={28}
          containerStyle={{ padding: 8, paddingRight: 16 }}
          onPress={navigation.getParam('goToSearch')}
        />
      )
    }
  }

  constructor (props) {
    super(props)
    this.state = {
      carsList: new ListView.DataSource({
        rowHasChanged: (r1, r2) => r1 !== r2
      }),
      refreshing: true
    }

    this.renderRow = this.renderRow.bind(this)
  }

  componentDidMount () {
    this.props.navigation.setParams({ goToSearch: this._goToSearch })
    this._getCarsAsync()
  }

  _goToSearch = () => {
    this.props.navigation.navigate('CarsSearch', {
      CarsScreen: this
    })
  }

  _getCarsAsync = async params => {
    this.setState({ refreshing: true })
    fetch(API.URL + '/cars' + (params === undefined ? '' : params), {
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
              carsList: this.state.carsList.cloneWithRows(json.cars)
            },
            () => {
              if (params !== undefined) {
                Alert.alert(
                  'Searing result:',
                  this.state.carsList.getRowCount() + ' cars found',
                  [
                    {
                      text: 'Ok'
                    }
                  ],
                  {
                    cancelable: false
                  }
                )
              }
            }
          )
        })
      } else {
        console.log('cars getting error')
      }
      this.setState({ refreshing: false })
    })
  }

  renderRow (rowData, sectionID) {
    return (
      <ListItem
        containerStyle={{ backgroundColor: 'white' }}
        roundAvatar
        avatar={rowData.imageurl}
        title={rowData.brand + ' ' + rowData.model}
        subtitle={rowData.daycost.toFixed(2) + ' PLN / day'}
        rightIcon={{ name: 'chevron-right' }}
        onPress={() => {
          this.props.navigation.navigate('CarDetails', {
            id: rowData.id
          })
        }}
      />
    )
  }

  _onRefresh () {
    this.setState({ refreshing: true })
    this._getCarsAsync()
  }

  render () {
    const state = this.state.refreshing
    if (state === true) {
      return (
        <View style={styles.container}>
          <ActivityIndicator />
          <StatusBar barStyle='default' />
        </View>
      )
    } else if (this.state.carsList.getRowCount() === 0) {
      return (
        <View style={styles.container}>
          <Ionicons
            name='ios-refresh-circle'
            type='Ionicons'
            size={100}
            style={styles.logoIcon}
            color={IosColors.SuperLightGray}
            onPress={() => this._getCarsAsync()}
          />
          <Text>
            There is no cars :(
          </Text>
        </View>
      )
    } else {
      return (
        <ListView
          style={{ paddingTop: 16 }}
          dataSource={this.state.carsList}
          renderRow={this.renderRow}
          enableEmptySections
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        />
      )
    }
  }
}
