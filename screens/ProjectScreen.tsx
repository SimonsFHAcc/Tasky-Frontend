import { StyleSheet, FlatList, Alert, Pressable, ActivityIndicator } from 'react-native';
import React, {useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';

import EditScreenInfo from '../components/EditScreenInfo';
import ProjectItem from '../components/ProjectItem';

import { Text, View } from '../components/Themed';
import { useQuery, gql, useMutation } from '@apollo/client';

const MY_PROJECT = gql`
query myTaskLists {
  myTaskLists {
    id
    title
    createdAt
  }
}
`

const CREATE_TASKLIST = gql`
mutation createTaskList($title: String!) {
  createTaskList(title: $title) {
    id
    createdAt
    title
    progress
    todos {
      id
      content
      isCompleted
    }
    users {
      id
      name
    }
  }
}
`




export default function ProjectScreen() {
  const[project, setProject] = useState([]);
  const[title, setTitle] = useState('');

  const { data, error, loading} = useQuery(MY_PROJECT);


  const [
    createProject, { data: createTaskListData, error: createTaskListError}
  ] = useMutation(CREATE_TASKLIST, { refetchQueries: MY_PROJECT});

  const createNewItem = () => {
    createProject({
      variables: {
        title:'My New TaskList'
      }
    })
  }




  const onPress = () => {
    createNewItem();
}

  useEffect(() => {
    if(error) {
      Alert.alert('Error fetching projects', error.message);
    }
  }, [error])

  useEffect(() => {
    if(data) {
      setProject(data.myTaskLists);
    }
  }, [data])

  


  return (
    <View style={styles.container}>
      <FlatList
      data={project}
      renderItem={({item}) => <ProjectItem project={item}/>}
      style={styles.projectList}
      />

      <Pressable 
        style={styles.buttonContainer}
        onPress={onPress}
      >
        <View style={styles.addButton}>
          <AntDesign name="pluscircleo" size={35} color="black" />
        </View>
      </Pressable>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectList: {
    width: '100%',
    marginTop: 15
  },
  buttonContainer: {
    marginBottom: 50
    
  },
  addButton: {

  }
});
