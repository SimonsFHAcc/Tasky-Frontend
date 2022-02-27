import { View, 
    Text, 
    TextInput, 
    Pressable, 
    StyleSheet, 
    ActivityIndicator,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'

import React, { useEffect, useState } from 'react';
import Navigation from '../navigation';
import { useNavigation } from '@react-navigation/native';

import { useMutation, gql } from '@apollo/client';

const SIGN_UP_MUTATION = gql `
mutation signUp( $email: String!, $password: String!, $name: String!){
    signUp (input: {email:$email, password:$password,name: $name}) {
      token
      user {
        id
        name
      }
    }
  }
`



const SignUpScreen = () => {
    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation();


    //mutation[0] : a function that will trigger the mutation
    //mutation[1] : result object
    //              {data, error, loading}
   const [signUp, { data, error, loading}] = useMutation(SIGN_UP_MUTATION);


    useEffect(() => {
        if (error) {
            Alert.alert('Error signing up. Try again');
        }
    }, [error])

    if (data) {
        // save token
        AsyncStorage
        .setItem('token', data.signUp.token)
        .then(() => {
                // redirect home
            navigation.navigate('Home');
        })
    }



    const onSubmit = () => {
        //submit
        signUp({variables: { name, email, password}})
    }

  return (
      
    <View style={styles.container}>
       <TextInput 
        placeholder='username'
        value={name}
        onChangeText={setName}
        style= {styles.name}
      />       

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
            style={styles.submitButton}
        >
            <Text style={styles.submitText}>
                Sign Up
            </Text>
        </Pressable>

        <Pressable 
            disabled={loading}
            onPress={() => navigation.navigate('SignIn')}
            style={styles.signInButton}>
                 {loading && <ActivityIndicator/>}
                <Text style={styles.signUpText}>
                    Allready have an account? Sign In here!
                </Text>
        </Pressable>


    </View>
  )
}

export default SignUpScreen

const styles = StyleSheet.create ({
    container:{
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

    name:{
        fontSize: 18,
        //width: '100%',
        marginVertical: 25
    },
    password:{
        fontSize: 18,
        //width: '100%',
        marginVertical: 25
    }, 
    submitButton:{
       backgroundColor:'black',
       width:'100%',
       height: 50,
       borderRadius: 10,
       flexDirection: 'row',
       alignItems:'center',
       justifyContent: 'center',
       marginTop: 50,
       marginRight: 5
    },
    submitText:{
        color:'white',
        fontWeight:'bold'
    }, 
    signInButton:{
        width:'100%',
        height: 50,
        borderRadius: 10,
        alignItems:'center',
        justifyContent: 'center',
        marginTop: 10
    },
    signUpText:{
        fontSize: 12,
        fontWeight: 'bold'
    }

});