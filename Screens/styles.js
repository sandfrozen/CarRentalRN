import { StyleSheet } from 'react-native'
import IosColors from './colors.js'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  redBorder: {
    borderColor: 'red',
    borderWidth: 2,
    marginVertical: 'auto'
  },
  scrollViewContainer: {
    flexGrow: 1
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    width: '80%',
    height: 50,
    borderColor: IosColors.TealBlue,
    textAlign: 'center',
    fontSize: 23,
    textAlignVertical: 'center',
    backgroundColor: 'white',
    marginBottom: 10
  },
  logo: {
    
  },
  logoTitle: {
    fontSize: 40,
    textAlign: 'center'
  },
  logoSubtitle: {
    fontSize: 17,
    textAlign: 'center'
  }
})

export default styles
