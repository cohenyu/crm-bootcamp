import React, { useEffect, useRef } from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions
} from 'react-native';
import AuthService from '../helpers/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { goToAuth, goHome } from '../navigation';

import { USER_KEY } from '../config';


function Initialising(props) {
    const authService = new AuthService();
    var translation = useRef(new Animated.Value(-150)).current;
    var translationPoint = useRef(new Animated.Value(-20)).current;
    var pointSize = new Animated.Value(25)

    const styles = StyleSheet.create({
        welcome: {
          fontSize: 80,
          color: 'white',
        },
        text: {
        //   flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ translateX: translation }]
        },
        point: {
            height: 1,
            width: 1,
            borderRadius: 20,
            backgroundColor: '#fe5f55',
            marginLeft:  Dimensions.get('window').width/2 - 80,
            transform: [{ translateY: translationPoint}, {scaleX: pointSize}, {scaleY: pointSize}],
          },
        container: {
            flex: 1,
            display: 'flex',
            flexDirection: 'row',
            backgroundColor: '#bdd5ea'
          }
      })

    useEffect(()=>{
        Animated.sequence([
            Animated.timing(translation, {
                toValue: Dimensions.get('window').width/2 - 100,
                useNativeDriver: true,
                easing: Easing.exp,
                duration: 1500
              }),
              Animated.timing(translationPoint, {
                toValue: Dimensions.get('window').height / 2 + 15,
                useNativeDriver: true,
                easing: Easing.bounce,
                duration: 2000
              }),
              Animated.timing(pointSize, {
                useNativeDriver: true,
                toValue: 1000,
                duration: 1000,
                easing: Easing.ease
            })
        ]).start();

        (async () => {
          try {
            const user = await authService.getUser();
            console.log('user is exist!', user);
            setTimeout(()=>{
              if (user) {
                  goHome()
                } else {
                  goToAuth()
                }
            }, 5000);

          } catch (err) {
            console.log('error: ', err)
            goToAuth()
          }
        })(); 
    }, []);

 
    return (
        <Animated.View style={styles.container}>
            <Animated.View style={styles.text}>
                <Text style={styles.welcome}>RGB</Text>
            </Animated.View>
            <Animated.View style={styles.point}>
            </Animated.View>
        </Animated.View>
    );
  
}


export default Initialising;