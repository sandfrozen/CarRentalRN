import React from 'react';
import {
  ActivityIndicator,
  AsyncStorage,
  StatusBar,
  StyleSheet,
  View,
  Button,
} from 'react-native';

export default class SignUpScreen extends React.Component {

  render() {
    return (
      <View style={styles.container}>
        <Button title="Back" onPress={this._goBack} />
      </View>
    );
  }

  _goBack = async () => {
    this.props.navigation.goBack();
  };
}