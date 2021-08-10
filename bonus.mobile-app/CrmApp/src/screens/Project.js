import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  Linking,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity
} from 'react-native'
import { goToAuth } from '../navigation'
import {Navigation} from 'react-native-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_KEY } from '../config';
import CrmService from '../helpers/crmService';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CheckBox from '@react-native-community/checkbox';
import Task from '../components/Task';

function Project(props) {
    const [tasks, setTasks] = useState([]);
    const crmService = new CrmService();
    const [isEditDescription, setIsEditDescription] = useState(false);
    const [tempDescription, setTempDescription] = useState(props.description);
    const [description, setDescription] = useState(props.description);
    
    useEffect(() => {
        (async () => {
            const result = await crmService.postRequest("/tasks/getAllTasks/", {projectId: props.project_id});
            if(result){
                console.log(result);
                setTasks(result);
            }
        })();
    }, []);

    /**
     * Convert date - yyyy-mm-dd to dd/mm/yyyy
     * @param {String} date 
     * @returns new string date in format dd/mm/yyyy
     */
    const parseDate = (date) => {
        return date.split(' ')[0].split('-').reverse().join('/');
    };

    const calculateDays = (deadline) => {
        return new Date() <= new Date(deadline);
    }

    const buildDue = () => {
        let boxStyle = styles.dueBox;
        let textStyle = styles.dueText;
        let title = 'Due on';
        console.log('due in: ',calculateDays(props.deadline));
        if(calculateDays(props.deadline) <= 0){
            boxStyle = styles.overdueBox;
            textStyle = styles.overdueText;
            title = 'Overdue';
        }
        return (
            <View style={[styles.box, boxStyle]}>
                <Text style={[styles.boxTitle,  textStyle]}>{title}</Text>
                <Text style={[styles.boxMain, textStyle]}>{parseDate(props.deadline)}</Text>
            </View>
        );
    }

    const buildTasks = () => {
        if(tasks){
            return tasks.map((item)=>{
                return (
                    <Task key={item.task_id} {...item}/>
                );
               
            })
        }
        return [];
    }

    const updateDescription = () => {
        // request for update
        setDescription(tempDescription); 
        setIsEditDescription(false);
    }
 
    return (
        <ScrollView style={styles.container}>
        <View style={styles.header}>
            <Text style={styles.title}>{props.item_type}</Text>
            <Text style={props.project_status === 'in progress' ? styles.statusOpen : styles.statusClosed}>{props.project_status}</Text>
        </View>
        {isEditDescription ? 
            <View style={styles.description}>
            <TextInput
            style={[styles.text, styles.textInput]}
            multiline={true}
            numberOfLines={4}
            onChangeText={(text) => {setTempDescription(text)}}
            value={tempDescription}/>
            <TouchableOpacity style={styles.buttonContainer} onPress={()=>{updateDescription()}}>
                <Text style={styles.button}>Save</Text>
                </TouchableOpacity>
            </View>
            :
            <View style={styles.description}> 
                <Text style={styles.text}>{description}</Text>
                <TouchableOpacity style={styles.buttonContainer} onPress={()=>{setIsEditDescription(true)}}>
                <Text style={styles.button}>Edit</Text>
                </TouchableOpacity>
             </View>
        } 

        <View style={styles.boxContainer}>
        {buildDue()}
        <View style={styles.box}>
            <Text style={styles.boxTitle}>estimated hours</Text>
            <Text style={styles.boxMain}>{props.estimated_time}</Text>
        </View>
        </View>
        <View style={styles.OneBox}>
        <Text style={styles.boxTitle}>Client Details</Text>
        <Text style={styles.boxMain}>{props.client_name}</Text>
        <Text style={styles.boxMain}>{props.client_phone}</Text>
        <Text style={styles.boxMain} >{props.client_mail}</Text>
        </View>
        <View style={styles.OneBox}>
        <Text style={styles.boxTitle}>Tasks</Text>
            {buildTasks()}
        </View>
        </ScrollView>
    );
  
}

export default Project;

Project.options = {
    topBar: {
        background: {
          color: '#577399'
        },
        backButton: {
          color: '#f7f7ff'
        },
        title: {
            text: 'Project',
            color: 'white'
        }
    }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  title: {
    fontSize: 35,
    marginBottom: 5,
    fontWeight: '500'
  },
  text: {
    fontSize: 20,
    fontWeight: '200',
    marginBottom: 5
  },
  box: {
      borderColor: '#DFE0EB',
      borderWidth: 1,
      borderStyle: 'solid',
      backgroundColor: 'white',
      borderRadius: 12,
    //   width: '47%',
      flexBasis: '47%',
    //   marginVertical: 15,
      marginTop: 15,
      padding: 10,
      alignItems:'center',
  },
  dueBox: {
      borderColor: '#3751FF',
  },
  overdueBox: {
    borderColor: '#fe5f55',
  },
  header: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'baseline',
      marginBottom: 10
  },
  boxContainer: {
      flexWrap: 'wrap',
      flexDirection: 'row',
      justifyContent: 'space-between'
  },
  boxTitle: {
      fontWeight: '200',
      marginBottom: 10,
      fontSize: 15,
    //   color: '#9FA2B4'
  },
  boxMain: {
    fontSize: 20,
    fontWeight: '400',
    padding: 3
  },
  dueText: {
    color: '#3751FF'
  },
  overdueText: {
    color: '#fe5f55',
  },
  OneBox: {
    borderColor: '#DFE0EB',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 15,
    padding: 20,
    // alignItems:'center',
  },
  statusClosed: {
    marginTop: 10,
    color: '#fe5f55',
    fontSize: 14
  },
  statusOpen: {
    marginTop: 10,
    color: '#74c69d',
    fontSize: 16
  },
  button: {
      fontSize: 15,
      color: '#6aa7ee'
  },
  buttonContainer: {
      width: 40
  },
  textInput: {
    borderColor: '#DFE0EB',
    borderWidth: 1,
    borderStyle: 'solid',
    backgroundColor: 'white',
    borderRadius: 12,
    // flexBasis: '47%',
    padding: 10,
    // alignItems:'center',
    fontSize: 18
  },
  description: {
      marginBottom: 15
  }
})