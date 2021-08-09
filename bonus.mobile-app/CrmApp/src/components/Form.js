import React, {isValidElement, useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import AppButton from './AppButton';
import FormField from './FormField';

function Form(props) {
   const [fields, setFields] = useState(props.fields);
   const [mainError, setMainError] = useState('');

   const setValue = (key, value) => {
        const fieldsTemp = {...fields};
        fieldsTemp[key].value = value;
        fieldsTemp[key].error = '';
        setFields(fieldsTemp);
    };


    const formFields = [];
    for(let field in fields){
        const comp = <FormField {...fields[field]} key={field} changed={(e)=>{setValue(field, e)}}/>;
        formFields.push(comp);
    }

    const validate = () => {
        return true;
    }

    const submit = async () => {
        // validation
        let isAllValid = true;
        const fieldsTemp = {...fields};
        const submitData = {};
        for(let field in fields){
            submitData[field] = {};
            submitData[field].value = fieldsTemp[field].value;
            submitData[field].type = fieldsTemp[field].mainType;
            // validate this field with the value
            if(!validate(field)){
                isAllValid = false;
                fieldsTemp[field].error = `invalid ${field}`
            }
        }

        if(!isAllValid){
            setFields(fieldsTemp);
            return;
        }


        // send fields value
        const responseData = await props.submit(submitData);
        console.log("responsedata ",responseData)
        if(responseData){
            const invalidFields = responseData.errors;
            if(invalidFields){
                for(let field in fieldsTemp){
                    fieldsTemp[field].error = '';
                }
                for(let errorField of invalidFields){
                    fieldsTemp[errorField].error = `Invalid ${errorField}`;
                }
                setFields(fieldsTemp);
            }
            setMainError(props.errorMap[responseData.serverError]);
        } 
        
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
            <Text style={styles.title}>
                {props.title}
            </Text>
            {formFields}
            <View style={styles.button}>
            <AppButton title={props.buttonTitle} submit={submit}/>
            </View>
            {!!mainError && <Text style={styles.error}>
                {mainError}
            </Text>}
        </View>
            </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
    )
    
  }
  
  export default Form;

  const styles = StyleSheet.create({
      container: {
        // backgroundColor: '#d1e1ef',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      title: {
        fontSize: 40,
        marginBottom: 60
      },
      button: {
        marginTop: 30
      },
      error: {
          marginTop: 15,
          color: '#fe5f55'
      }
  })