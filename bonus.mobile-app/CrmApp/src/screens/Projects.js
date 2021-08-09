import React, {useEffect, useState} from 'react'
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  FlatList
} from 'react-native'
import { goToAuth } from '../navigation'
import {Navigation} from 'react-native-navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { USER_KEY } from '../config';
import ProjectCard from '../components/ProjectCard';
import CrmService from '../helpers/crmService';

function Projects(props) {

    const [projectsData, setProjectsData] = useState([]);
    const crmService = new CrmService();

    useEffect(()=>{
        (async () => {
         const result = await crmService.postRequest("/projects/getAllProjects/", {user: true});
         if(result){
            setProjectsData(result);
         }
        })();
      }, []);

    /**
     * Navigates to a project screen according to the project details
     * @param {object} project - project details
     */
   const navigate = (project) => {
    Navigation.push(props.componentId, {
        component: {
          name: 'Project',
          passProps: {
            ...project
           }
        }
      });
   }

   /**
    * Creates Project Card 
    * @param {FlatList item} param0 
    * @returns ProjectCard
    */
   const renderProjectCard = ({item}) => {
       return (<ProjectCard {...item} navigate={()=>{navigate(item)}}/>);
   }

    return (
      <View style={styles.container}>
          <FlatList
            // columnWrapperStyle={{justifyContent: 'space-evenly'}}
            numColumns={1}
            data={projectsData}
            renderItem={renderProjectCard}
            keyExtractor={item => item.project_id}
          />
      </View>
    );
  
}

export default Projects; 


Projects.options = {
    topBar: {
        background: {
            color: '#577399'
        },
        backButton: {
            color: 'white',
            title: 'Home'
        },
        title: {
            text: 'My Projects',
            color: 'white'
        },
    }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    // alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#f8f8f8'
  },
  scrollView: {
    //   flex: 1,
      width: '100%',
      justifyContent: 'space-between',
      flexDirection: 'row',
      flexWrap: 'wrap',
      flexGrow: 0
  } , 
})