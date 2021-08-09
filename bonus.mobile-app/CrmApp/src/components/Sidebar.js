import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import { Navigation } from 'react-native-navigation'

class Sidebar extends React.Component {
  static options() {
    return {
      topBar: {
        leftButtons: {
          id: 'sideMenu',
          title: 'bla'
        }
      }
    };
  }

  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  render() {
    return (
      <View>
        <Text>Click the hamburger icon to open the side menu</Text>
      </View>
    );
  }

  navigationButtonPressed({ buttonId }) {
    if (buttonId === 'sideMenu') {
      Navigation.mergeOptions(this, {
        sideMenu: {
          left: {
            visible: true
          }
        }
      });
    }
  }
}