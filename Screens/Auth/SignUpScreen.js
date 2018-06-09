import React from 'react'
import { View, Button } from 'react-native'
import styles from '../styles.js'

export default class SignUpScreen extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Button title='Back' onPress={this._goBack} />
      </View>
    )
  }

  _goBack = async () => {
    this.props.navigation.goBack()
  };
}
