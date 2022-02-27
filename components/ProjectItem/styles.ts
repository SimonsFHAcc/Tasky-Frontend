
import { StyleSheet } from 'react-native'


const styles = StyleSheet.create({
    root: {
      flexDirection: 'row',
      width: '100%',
      marginTop: 3

    },
    iconContainer:{
      width:40,
      height:40,
      justifyContent: 'center',
      alignItems:'center',
      borderRadius: 5,
      //backgroundColor:'#404040'
      marginRight: 10
    },
    titelContainer:{
      flexDirection:'row',
      alignItems:'center',
  
    },
  
    title: {
      fontSize: 20,
      marginRight: 5
    },
    time:{
      fontSize: 10
    }
  
  });

  export default styles;