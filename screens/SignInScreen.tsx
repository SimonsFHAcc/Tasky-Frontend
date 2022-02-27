import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Navigation from '../navigation'
import { useNavigation } from '@react-navigation/native'
import { useMutation, gql } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage'


const SIGN_IN_MUTATION = gql`
mutation signIn($email: String!, $password:String!){
    signIn(input: {email: $email, password: $password}){
      token
      user {
        id
        name
        email
      }
    }
  }
`;




const SignInScreen = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation();

    const [signIn, { data, error, loading}] = useMutation(SIGN_IN_MUTATION);

    const onSubmit = () => {
        //submit
        signIn({ variables: {email, password}})
    }

    useEffect(() => {
        if (error) {
            Alert.alert('Invalid Credentials. Try Again!');
        }
    }, [error])

    if (data) {
        // save token
        AsyncStorage
        .setItem('token', data.signIn.token)
        .then(() => {
                // redirect home
            navigation.navigate('Home');
        })
    }



  return (
      
    <View style={styles.container}>
      <TextInput 
        placeholder='email@email.com'
        value={email}
        onChangeText={setEmail}
        style= {styles.email}
      />

      <TextInput 
        placeholder='password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style= {styles.password}
      />

        <Pressable 
            onPress={onSubmit}
            style={styles.submitButton}>
                <Text style={styles.submitText}>
                    Sign In
                </Text>
        </Pressable>

        <Pressable 
            onPress={() => navigation.navigate('SignUp')}
            style={styles.signUpButton}>
                <Text style={styles.signUpText}>
                    New here? Sign Up
                </Text>
        </Pressable>
    </View>
  )
}

export default SignInScreen

const styles = StyleSheet.create ({
    container:{
        //flex:1,
        padding:40,
        width:'100%',
        alignItems:'center',
        justifyContent: 'center',
        marginTop: 50
    },

    email: {
        fontSize: 18,
        //width: '100%',
        marginVertical: 25
    },
    password:{
        fontSize:18,
        //width: '100%',
        //alignItems: 'center'
    }, 
    submitButton:{
       backgroundColor:'black',
       width:'100%',
       height: 50,
       borderRadius: 10,
       alignItems:'center',
       justifyContent: 'center',
       marginTop: 50
    },
    submitText:{
        color:'white',
        fontWeight:'bold'
    }, 
    signUpButton:{
        width:'100%',
        height: 50,
        borderRadius: 10,
        alignItems:'center',
        justifyContent: 'center',
        marginTop: 15
    },
    signUpText:{
        fontWeight: 'bold'
    }

});