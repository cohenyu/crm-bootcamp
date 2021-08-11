import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  Image,
  TouchableOpacity
} from 'react-native';
import CrmService from '../helpers/crmService';

function Task(props) {
    const [check, setCheck] = useState(props.done !== "0");
    const crmService = new CrmService();

    /**
     * Check / unchecked the task
     */
    const handleCheckTask =  async ()=> {
        console.log('check!');
        await crmService.postRequest("/tasks/updateTask/", {
                                                                taskId: props.task_id, 
                                                                set: {
                                                                    done: !check
                                                                }
                                                            });
        setCheck(!check);
    }

    return (
        <View style={styles.task}>
            <TouchableOpacity onPress={()=>{handleCheckTask()}}>
            <View style={styles.checkBox}>
                {check && <Image style={styles.check}  source={require('../assets/checkBackground.jpeg')} />}
            </View>
            </TouchableOpacity>
            <Text style={styles.title}>
                {props.description}
            </Text>
        </View>
    )
    
  }
  
  export default Task;

  const styles = StyleSheet.create({
    checkBox: {
        height: 18,
        width: 18,
        borderColor: '#DFE0EB',
        borderWidth: 1,
        borderStyle: 'solid',
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    task: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    check: {
        width: '100%',
        height: '100%'
    },
    title: {
        fontSize: 20,
        fontWeight: '400',
        padding: 3
    }
  })