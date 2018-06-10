import { StyleSheet } from 'react-native'
import IosColors from './colors.js'

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  standardMargin: {
    margin: 20
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
    borderRadius: 6,
    width: '100%',
    height: 40,
    padding: 8,
    borderColor: IosColors.SuperLightGray,
    textAlign: 'center',
    fontSize: 18,
    textAlignVertical: 'center',
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 16
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
  },
  divider: {
    color: IosColors.LightGray,
    letterSpacing: 2,
    fontStyle: 'italic'
  },
  logoIcon: {
    textAlign: 'center'
  },
  button: {
    padding: 16
  }
})

export default styles
