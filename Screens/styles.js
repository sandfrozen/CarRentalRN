import { StyleSheet } from 'react-native'
import IosColors from './colors.js'

const styles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingTop: 13,
    paddingHorizontal: 10,
    paddingBottom: 12,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black'
  },
  miniColumn: {
    width: '50%',
    padding: 8
  },
  miniRow: {
    flex: 1,
    alignItems: 'stretch',
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomColor: IosColors.LightGray,
    borderBottomWidth: 1
  },
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
  input2: {
    borderWidth: 1,
    borderRadius: 6,
    width: '100%',
    height: 80,
    borderColor: IosColors.SuperLightGray,
    textAlign: 'left',
    fontSize: 18,
    textAlignVertical: 'center',
    backgroundColor: 'white'
  },
  input50: {
    borderWidth: 1,
    borderRadius: 6,
    width: '100%',
    height: 40,
    borderColor: IosColors.SuperLightGray,
    backgroundColor: 'white',
    marginVertical: 8,
    marginHorizontal: 16
  },
  logo: {},
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
    fontStyle: 'italic',
    textAlign: 'center'
  },
  logoIcon: {
    textAlign: 'center'
  },
  button: {
    padding: 16
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.9,
    zIndex: 999,
    backgroundColor: IosColors.SuperLightGray,
    justifyContent: 'center',
    alignItems: 'center'
  },
  viewInView: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  padding8: {
    padding: 8
  },
  activityIndicator: {
    margin: 16
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    height: 200,
    borderLeftWidth: 1,
    borderLeftColor: IosColors.LightGray
  },
  avatarContainer: {
    width: '40%',
    height: '100%',
    alignItems: 'center'
  },
  infoContainer: {
    width: '60%',
    height: '100%',
    borderLeftWidth: 1,
    borderLeftColor: IosColors.LightGray
  },
  label: {
    color: IosColors.LightGray,
    fontSize: 12,
    width: 60
  },
  value: {
    fontSize: 20
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: IosColors.LightGray,
    margin: 8
  },
  listTitle: {
    backgroundColor: IosColors.Background,
    padding: 8,
    paddingTop: 24,
    paddingLeft: 12,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  listTitle2: {
    backgroundColor: IosColors.Background,
    padding: 8,
    paddingLeft: 0,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  listTitleSmall: {
    backgroundColor: IosColors.Background,
    padding: 8,
    paddingTop: 8,
    paddingLeft: 12,
    fontWeight: 'bold',
    letterSpacing: 1
  },
  informationReserved: {
    backgroundColor: 'white',
    padding: 8,
    paddingLeft: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: IosColors.OrangeLight
  },
  informationActual: {
    backgroundColor: 'white',
    padding: 8,
    paddingLeft: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: IosColors.LightGray
  },
  informationChoosed: {
    backgroundColor: 'white',
    padding: 8,
    paddingLeft: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: IosColors.Green
  },
  buttonOption: {
    textAlign: 'left',
    fontSize: 12
  }
})

export default styles
