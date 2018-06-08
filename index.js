import { AppRegistry } from 'react-native';
import App from './App';

AppRegistry.registerComponent('CarRentalRN', () => App);

import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader']);
YellowBox.ignoreWarnings(['Class RCTCxxModule']);
YellowBox.ignoreWarnings(['Remote debugger is in a background']);