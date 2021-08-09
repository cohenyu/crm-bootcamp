import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';

function FormField(props) {
    const [isActive, setIsActive] = useState(false);
    let focusStyle = isActive ? {...styles.input, ...styles.inputFocus} : styles.input;

    return (
    <View>
         <TextInput
          value={props.value}
          style={focusStyle}
          onFocus={()=>{setIsActive(true)}}
          onBlur={()=>{setIsActive(false)}}
          placeholder={props.placeholder}
          placeholderTextColor= "#cac9c9"
          autoCapitalize="none"
          autoCorrect={false}
          onChangeText={props.changed}
        />
        {!!props.error && 
        <Text style={styles.error}>
            {props.error}
        </Text>}
    </View>
    )
    
  }
  
  export default FormField;

  const styles = StyleSheet.create({
    input: {
        width: 350,
        fontSize: 18,
        fontWeight: '500',
        height: 55,
        backgroundColor: '#FFFFFF',
        margin: 10,
        color: 'black',
        padding: 8,
        paddingLeft: 20,
        borderRadius: 30,
    },
    inputFocus: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#fe5f55'
    },
    error: {
        marginHorizontal: 20,
        color: '#fe5f55',
        marginBottom: 10
    }
  })