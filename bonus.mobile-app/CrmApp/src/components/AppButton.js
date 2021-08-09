import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
// import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
// import { faCoffee } from '@fortawesome/free-solid-svg-icons';

function AppButton(props) {
   

    return (
    <View style={styles.container}>
        <Button
        color= "#FFFFFF"
        onPress={()=>{props.submit()}}
        title={props.title}
        >
             {/* <FontAwesomeIcon icon={ faCoffee } /> */}
        </Button>
    </View>
    )
    
  }
  
  export default AppButton;

  const styles = StyleSheet.create({
    container: {
        backgroundColor: '#577399',
        borderRadius: 50,
        paddingHorizontal: 10,
        paddingVertical: 2,
    },
    title: {
        color: '#577399'
    }
  })