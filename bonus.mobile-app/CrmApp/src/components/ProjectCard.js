import React, {useState} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
} from 'react-native';
import {Navigation} from 'react-native-navigation';


function ProjectCard(props) {
   
/**
 * Convert date - yyyy-mm-dd to dd/mm/yyyy
 * @param {String} date 
 * @returns new string date in format dd/mm/yyyy
 */
  const parseDate = (date) => {
    return date.split(' ')[0].split('-').reverse().join('/');
  };
  
  function capitalizeTheFirstLetterOfEachWord(words) {
    var separateWord = words.toLowerCase().split(' ');
    for (var i = 0; i < separateWord.length; i++) {
       separateWord[i] = separateWord[i].charAt(0).toUpperCase() +
       separateWord[i].substring(1);
    }
    return separateWord.join(' ');
 }

    return (
    <View style={styles.container} onStartShouldSetResponder={()=>{props.navigate()}}>
      <View style={styles.header}>
        <Text style={styles.type}>{capitalizeTheFirstLetterOfEachWord(props.item_type)}</Text>
        <Text style={props.project_status === 'in progress' ? styles.statusOpen : styles.statusClosed}>{props.project_status}</Text>
      </View>
      <View style={styles.group}>
      <Text style={styles.detailsTitle}>Client: </Text>
        <Text style={styles.details}>{capitalizeTheFirstLetterOfEachWord(props.client_name)}</Text>
      </View>
        <View style={styles.group}>
        <Text style={styles.detailsTitle}>Deadline: </Text>
        <Text style={styles.details}>{parseDate(props.deadline)}</Text>
        </View>
        
    </View>
    )
    
  }
  
  export default ProjectCard;

  const styles = StyleSheet.create({
    container: {
        flexBasis: '46%',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginVertical: 5,
        marginHorizontal: 10,
        borderColor: '#DFE0EB',
        borderWidth: 1,
        borderStyle: 'solid',
    },
    type: {
        fontSize: 25,
        marginBottom:10,
        fontWeight: '500'
    },
    detailsTitle: {
      color: 'black',
      fontWeight: '200',
      fontSize: 14,
      marginTop: 10
    },
    details: {
      color: 'black',
      fontWeight: '300',
      fontSize: 18
    },
    statusClosed: {
      marginTop: 10,
      color: '#fe5f55'
    },
    statusOpen: {
      marginTop: 10,
      color: '#74c69d'
    },
    group: {
      flexDirection: 'row',
      alignItems: 'baseline'
    },
    header: {
      flexDirection: 'row',
      alignItems: 'baseline',
      justifyContent: 'space-between'
    }
  })