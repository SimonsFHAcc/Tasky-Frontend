import { View, Text, TextInput, StyleSheet } from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import { useMutation, gql } from '@apollo/client';

import Checkbox from '../Checkbox';

import styles from './styles'

const UPDATE_TODO = gql`
mutation updateToDo($id:ID!, $content: String, $isCompleted: Boolean!){
    updateToDo(id: $id, content: $content, isCompleted:$isCompleted){
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
const DELETE_TODO = gql`
mutation deleteToDo($id:ID!){
  deleteToDo(id: $id)
}
`





interface ToDoItemProps {
    todo: {
        id: string;
        content: string;
        isCompleted: boolean
    }, 
    onSubmit: () => void
}

const ToDoItem = ({ todo, onSubmit }: ToDoItemProps) => {

    const [isChecked, setIsChecked] = useState(false);
    const [content, setContent] = useState('');

    const [deleteTodo, { data: deleteToDoData }] = useMutation(DELETE_TODO);

    const [updateItem] = useMutation(UPDATE_TODO);
    const input = useRef(null);


    const callUpdateItem = () => {
        updateItem({
            variables: {
                id: todo.id,
                content,
                isCompleted: isChecked,
            }
        });
    };

    const deleteToDoItem = () => {
        deleteTodo({
          variables:{
            id: todo.id
          }
        });
      };



    useEffect(() => {
        if (!todo) {return}

        setIsChecked(todo.isCompleted);
        setContent(todo.content);
    }, [todo])

    useEffect(() => {
        if (input.current){
            input?.current?.focus();
        }

    }, [input])

    const onKeyPress = ({ nativeEvent }) => {
        if (nativeEvent.key === 'Backspace' && content === '') {
            //console.warn('Delete Item');
            deleteToDoItem();
            callUpdateItem();
        }
    }


  return (
    <View style={styles.toDoItem}>

    {/* Checkbox*/}
    <Checkbox 
        isChecked={isChecked} 
        onPress={() => {
            setIsChecked(!isChecked);
            callUpdateItem();
        }}
    />

    {/* Text Input*/}
    <TextInput
        ref={input}
        value={content}
        onChangeText={setContent}
        style={ styles.toDoText }
        multiline
        onEndEditing={callUpdateItem}
        onSubmitEditing={onSubmit}
        blurOnSubmit
        onKeyPress={onKeyPress}
    />
  </View>
  )
}

export default ToDoItem;