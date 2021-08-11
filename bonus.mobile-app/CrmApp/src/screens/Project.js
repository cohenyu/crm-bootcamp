import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated
} from 'react-native'
import CrmService from '../helpers/crmService';
import Task from '../components/Task';

function Project(props) {
    const [tasks, setTasks] = useState([]);
    const crmService = new CrmService();
    const [isEditDescription, setIsEditDescription] = useState(false);
    const [tempDescription, setTempDescription] = useState(props.description);
    const [description, setDescription] = useState(props.description);
    const [imgList, setImgList] = useState([]);
    
    useEffect(() => {

      // Fetching the project details
        (async ()=>{
          const result = await crmService.postRequest('/projects/getProject/', {projectId: props.project_id});
          if(result){
            setDescription(result.description);
            setTempDescription(result.description);
          }
        })();

        // Fetching the project's tasks
        (async () => {
            const result = await crmService.postRequest("/tasks/getAllTasks/", {projectId: props.project_id});
            if(result){
                setTasks(result);
            }
        })();

        // Fetching the project's images
        (async () => {
          console.log('fetch the imgs');
          const result = await crmService.postRequest("/imgs/getImgs/", {projectId: props.project_id});
          if(result){
              setImgList(result);
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

    /**
     * @param {string} deadline - data string
     * @returns true if the date didn't pass
     */
    const calculateDays = (deadline) => {
        return new Date() <= new Date(deadline);
    }

    /**
     * Build the due section according to the date
     * @returns Due view
     */
    const buildDue = () => {
        let boxStyle = styles.dueBox;
        let textStyle = styles.dueText;
        let title = 'Due on';
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

    /**
     * Builds the tasks view
     * @returns List of Tasks component
     */
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


    /**
     * Sends request to update project description and sets the new description
     */
    const updateDescription = async () => {
        
        if(tempDescription != description){
          await crmService.postRequest("/projects/updateProject/", {
                                                                      projectId: props.project_id, 
                                                                      set: {
                                                                        description: tempDescription
                                                                      }
                                                                    });
        }
        setDescription(tempDescription); 
        setIsEditDescription(false);
    }

    /**
     * Build the images view
     * @returns List of Img components
     */
    const getImgs = () => {
      const imgs = [];
      if(imgList.length > 0){
          imgList.forEach((imgItem, index)=>{
              const path = `http://localhost:9991/imgs/${imgItem.img_url}`;
              imgs.push(
                  <Animated.Image 
                      key={index} 
                      style={styles.img} 
                      source={{uri: path}} 
                  />
                )
          })
      }
      return imgs;
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
            {tasks.length > 0 ?  buildTasks() : <Text>You don't have tasks yet</Text>}
        </View>
        <View style={styles.OneBox}>
          <Text style={styles.boxTitle}>Attachments</Text>
          <View style={styles.row}>
            {imgList.length > 0 ?  getImgs() : <Text>You don't have attachments yet</Text>}
          </View>
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
          color: '#f7f7ff',
          title: ''
        },
        title: {
            text: 'Project',
            color: 'white'
        },
        rightButtons: [
          {
            id: 'logout',
            component: {
              name: 'logoutButton'
            }
          },
        ],
    }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#f8f8f8',
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
      flexBasis: '47%',
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
    padding: 10,
    fontSize: 18
  },
  description: {
      marginBottom: 15
  },
  img: {
    height: 90,
    width: 90,
    margin: 5,

  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap'
  }
})