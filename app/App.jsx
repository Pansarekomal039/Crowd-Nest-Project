import React from "react"; 
import RootStack from "../navigators/RootStack";
import messaging from '@react-native-firebase/messaging';

function App() {  
async function requestUserPermission(){
  const authStatus = await messaging().requestPermission();
  const enabled =
  authStatus == messaging.AuthorizationStatus.AUTHORIZED ||
  authStatus == messaging.AuthorizationStatus.PROVISIONAL;

  if(enabled) {
    console.log('Authorization status:',authStatus);
  }
} 

const getToken = async() => {
  const token = await messaging().getToken()
  console.log("Token = ", token)
}

useEffect(() => {
  requestUserPermission()
  getToken()

},[])


return (
  <RootStack />
);
}
export default App;  
