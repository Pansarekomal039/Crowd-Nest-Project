import { View ,Image} from 'react-native';
import { StyleSheet,Text} from 'react-native';
import React from 'react' ;
import Entypo from '@expo/vector-icons/Entypo';
import {useEffect} from 'react';
import * as SplashScreen from 'expo-splash-screen';

const Splash = ({ navigation }) => {
  useEffect(() => {
    const hideSplash = async () => {
    await SplashScreen.preventAutoHideAsync();

    setTimeout( async () =>  {
      await SplashScreen.hideAsync();
      navigation.replace("Welcome");
    }, 2000);
  };
  hideSplash();
  }, []);

  return(
    // <View style={styles.container}>
    //   <Image source={require("../assets/images/Time.jpg")} style={StyleSheet.image} />
    // </View>
    <View
    style={{ flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor: '#6D28D9' }}
    >
    <Text style ={{'fontSize':20}} >Crowd-Nest</Text>
    <Entypo name="flower" size={50} />
  </View>
  );
};

//  const styles = StyleSheet.create({
//   container:{
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#ffffff",
//   },
//     image:{
//       width: 200,
//       height: 200,
//       resizeMode: "contain",
//   },
// });

export default Splash;