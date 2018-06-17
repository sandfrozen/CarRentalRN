import { AppRegistry, YellowBox } from 'react-native'
import App from './Screens/App.js'

AppRegistry.registerComponent('CarRentalRN', () => App)

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'RTCBridge required'])
YellowBox.ignoreWarnings(['Class RCTCxxModule'])
YellowBox.ignoreWarnings(['Remote debugger is in a background'])
YellowBox.ignoreWarnings(['Required dispatch_async'])
