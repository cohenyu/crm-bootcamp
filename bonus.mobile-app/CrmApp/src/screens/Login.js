import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  StatusBar
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { goHome } from '../navigation'
import { USER_KEY } from '../config'
import AppButton from '../components/AppButton';
import Form from '../components/Form';
import AuthService from '../helpers/authService';


function SignIn(props) {
  const [userMail, setUserMail] = useState('');
  const [password, setPassword] = useState('');
  const authService = new AuthService();
  // const customStyle1 = isActive ? {...styles.input,...styles.inputFocus}: styles.input;
  // const customStyle2 = isActive ? {...styles.input,...styles.inputFocus}: styles.input;

  useEffect(()=>{
   
  }, [])
  const onChangeText = (setFunc, value) => {
    setFunc(value);
  };

  const submit = async (data) => {
    console.log('login');
    try {
       // login with provider
       const response = await authService.login(data);

       if(response.valid){
         goHome();
       } else {
         return response;
       }
  
    } catch (err) {
      console.log('error:', err)
    }
  };

  const LoginForm = {
    mail: {
      placeholder: 'Mail',
      mainType: 'mail',
    },
    password: {
      placeholder: 'Password',
      mainType: 'password',
    }
  }

  const errorMap =  {
    'serverError': 'Try again later',
    'IncorrectMailOrPassword': 'Incorrect mail or password'
  };

    return (
      <View style={styles.container}>
        <Form fields={LoginForm} buttonTitle='OK' submit={submit} title='Login' errorMap={errorMap}/>
      </View>
    );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d1e1ef',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})

SignIn.options = {
  topBar: {
    visible: false,
    // title: {
    //   text: 'Home',
    //   color: 'white'
    // },
    // background: {
    //   color: '#4d089a'
    // }
  }
}

export default SignIn;