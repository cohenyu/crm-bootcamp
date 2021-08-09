import {Navigation} from 'react-native-navigation';

/**
 * Register all screens to navigation
 */
export function registerScreens() {
  Navigation.registerComponent('Home', () => require('./screens/Home').default);
  Navigation.registerComponent('Initializing', (sc) => require('./screens/Initializing').default);
  Navigation.registerComponent('SignIn', () => require('./screens/Login').default);
  Navigation.registerComponent('Projects', () => require('./screens/Projects').default);
  Navigation.registerComponent('Project', () => require('./screens/Project').default);
}