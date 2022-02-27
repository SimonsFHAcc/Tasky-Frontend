import React, {useEffect, useState} from 'react';
import { AntDesign } from '@expo/vector-icons';
import { 
  StyleSheet, 
  FlatList, 
  TextInput, 
  KeyboardAvoidingView,
  Platform,
  Alert,
  Pressable
 } from 'react-native';

import ToDoItem from '../components/ToDoItem';
import { useQuery, gql, useMutation } from '@apollo/client';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { useRoute } from '@react-navigation/native';

const GET_PROJECT = gql`
query getTaskList($id: ID!){
  getTaskList(id: $id){
    id
    title
    createdAt
    todos {
      id
      content
      isCompleted
    }
  }
}
`
const CREATE_TODO = gql`
mutation createToDo($content: String!, $taskListId: ID!){
  createToDo(content: $content, taskListId:$taskListId){
    id
    content
    isCompleted

    taskList{
      id
      title
      progress
      todos {
        id
        content
        isCompleted
      }
    }
  }
}
`






let id = '4'

export default function ToDoScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [project, setProject] = useState(null);
  const [title, setTitle] = useState('');

  const route = useRoute();
  const id = route.params.id;

  const {data, error, loading} = useQuery(GET_PROJECT, { variables: { id }});

  const [
    createTodo, { data: createTodoData, error: createTodoError}
  ] = useMutation(CREATE_TODO, { refetchQueries: GET_PROJECT});



  useEffect(() => {
    if (error) {
      Alert.alert('Error fetching project', error.message);
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setProject(data.getTaskList);
      setTitle(data.getTaskList.title);
    }
  }, [data]);





  const createNewItem = (atIndex: number) => {
    createTodo({
      variables: {
        content: '',
        taskListId: id
      }
    })
  }



  const onPress = () => {
    createNewItem(1);
  }

  if(!project) {
    return null;
  }
  
  return (
    <KeyboardAvoidingView 
    
    style={styles.container}>

      <TextInput 
        value={title}
        onChangeText={setTitle}
        placeholder={'Title'}
        style={styles.title}
      />

      <FlatList 
        data={project.todos}
        renderItem={ ( { item, index } ) => (
          <ToDoItem 
            todo={item} 
            onSubmit={() => createNewItem(index + 1)}
          />
        )}
        style={styles.todos} 
      />

      <Pressable 
        style={styles.buttonContainer}
        onPress={onPress}
      >
        <View style={styles.addButton}>
          <AntDesign name="pluscircleo" size={35} color="black" />
        </View>
      </Pressable>



    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
  },
  title: {
    width:'100%',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  todos: {
    width: '100%'
  },
  buttonContainer: {
    marginBottom: 50
    
  },
  addButton: {

  }
});
