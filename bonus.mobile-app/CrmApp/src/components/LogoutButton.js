import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity
} from 'react-native';
import AuthService from '../helpers/authService';
import { goToAuth } from '../navigation';

function LogoutButton(props) {

    const authService = new AuthService();

    /**
     * Sends request to logout and redirects to login page
     */
    const handleLogout = async () => {
        await authService.logout();
        goToAuth();

    };

    return (
        <TouchableOpacity onPress={()=>{handleLogout()}}>
                <Text style={styles.title}>logout</Text>
        </TouchableOpacity>
    );
    
  }

  export default LogoutButton;

  const styles = StyleSheet.create({
    title: {
      color: '#bdd5ea'
    } , 
  })

