import React, { Component } from 'react'
import { View, Button } from 'react-native'
import styles from '../../styles'

export default class CarsSearchScreen extends Component {
  static navigationOptions = {
    title: 'Search'
  }

  constructor (props) {
    super(props)
    this.state = {
      queryParams: ''
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <Button
          title='Search'
          onPress={() => {
            this.props.navigation.state.params.CarsScreen._getCarsAsyncWithParams(this.state.queryParams)
            this.props.navigation.goBack()
          }}
        />
      </View>
    )
  }
}
