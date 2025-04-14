import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import {
  StyledContainer,
  InnerContainer,
  PageLogo,
  PageTitle,
  SubTitle,
  StyledButton,
  ButtonText1,
  PageLogo1,
  Line

} from '../components/style';

const Welcome = () => {
  const navigation = useNavigation();

  return (
    <StyledContainer>
      <StatusBar style="dark" />
      <InnerContainer>
        <PageLogo1 resizeMode="cover" source={require("../assets/images/Welcome-rafiki.png")} />
        
        <PageTitle>Crowd-Nest</PageTitle>
        <SubTitle>Your journey starts here!
        <Entypo name="feather" size={25} /></SubTitle>
        

        <StyledButton onPress={() => navigation.navigate('Login')}>
          <ButtonText1>Get Started</ButtonText1>
        
        </StyledButton> 
        <Line />
      </InnerContainer>
    </StyledContainer>
  );
};

export default Welcome;