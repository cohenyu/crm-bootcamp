import React from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
} from 'react-native'
import { goToAuth } from '../navigation'
import {Navigation} from 'react-native-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_KEY } from '../config'

export default class Home extends React.Component {
  static options() {
    return {
      topBar: {
        background: {
          color: '#577399'
        },
        backButton: {
          color: '#f7f7ff'
        },
      }
    }
  }

  // logout = async () => {
  //   try {
  //     await AsyncStorage.removeItem(USER_KEY)
  //     goToAuth()
  //   } catch (err) {
  //     console.log('error signing out...: ', err)
  //   }
  // }

  render() {
    return (
      <View style={styles.container}>
        <Text>Home screen.</Text>
        {/* <Button
          onPress={this.logout}
          title="Sign Out"
        /> */}
        <Button
          onPress={() => {
            Navigation.push(this.props.componentId, {
              component: {
                name: 'Projects',
              }
            });
          }}
          title="My Projects"
        />
      </View>
    )
  }
}


// Home.options = {
//   topBar: {
//     // visible: false,
//     // title: {
//     //   text: 'Home',
//     //   color: 'white'
//     // },
//     background: {
//       color: '#577399'
//     }
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})