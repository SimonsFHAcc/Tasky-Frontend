import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";
import AsyncStorage from '@react-native-async-storage/async-storage'
import { setContext } from '@apollo/client/link/context';

const URI = 'http://localhost:4000/';

const httpLink = createHttpLink({
    uri: URI,
});

const authLink = setContext(async (_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = await AsyncStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
      headers: {
        ...headers,
        authorization: token || '',
      }
    }
  });




export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
});

