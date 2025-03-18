import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons, Ionicons, Fontisto } from "@expo/vector-icons";
import { Alert, View, ActivityIndicator } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper.jsx';
import { GoogleAuthProvider, signInWithCredential, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from "../app/firebaseConfig";
// import auth from '@react-native-firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session'

WebBrowser.maybeCompleteAuthSession();

import {
    StyledContainer,
    InnerContainer, 
    PageLogo,
    PageTitle,
    SubTitle, 
    StyledFormArea,
    LeftIcon,
    StyledInputLabel, 
    StyledTextInput,
    RightIcon, 
    Colors,
    StyledButton,
    ButtonText,
    MsgBox, 
    Line,
    ExtraView, 
    ExtraText,  
    TextLinkContent,
    TextLink
} from '../components/style';

const { brand, darkLight, primary } = Colors;

const O_Login = ({ navigation }) => {
    const [hidePassword, setHidePassword] = useState(true);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const redirectUri = AuthSession.makeRedirectUri({
        useProxy: true, 
      });
      console.log("Redirect URI:", redirectUri);
    const [request, response, promptAsync] = Google.useAuthRequest({
        androidClientId: '1097395079037-cd1km9dlgme1tgpt8fm3oi7iiga42017.apps.googleusercontent.com',
        webClientId: '1097395079037-cd1km9dlgme1tgpt8fm3oi7iiga42017.apps.googleusercontent.com',
        expoClientId: '506618426674-nn94d2dvub4jai55kchpncja4ckvbdjj.apps.googleusercontent.com',
        redirectUri,
    });

    useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;
            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth, credential)
                .then(() => {
                    Alert.alert('Success', 'Google sign-in successful!');
                    navigation.replace('RestProfile');
                })
                .catch((error) => {
                    handleMessage(error.message);
                });
        }
    }, [response]);

    const handleMessage = (message, type = 'ERROR') => {
        setMessage(message);
        setMessageType(type);
    };

    const handleLogin = async (email, password, setSubmitting) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Logged in successfully!');
            navigation.replace('RestProfile');
        } catch (error) {
            handleMessage(error.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    {/* <PageLogo resizeMode="cover" source={require("../assets/images/Log_in.jpg")} /> */}
                    <PageTitle>Owner Login</PageTitle>
                    <Line />
                    {/* <SubTitle>Account Login</SubTitle> */}
                    <Formik
                        initialValues={{ email: '', password: '' }}
                        onSubmit={(values, { setSubmitting }) => {
                            if (!values.email || !values.password) {
                                handleMessage('Please fill all the fields');
                                setSubmitting(false);
                            } else {
                                handleLogin(values.email, values.password, setSubmitting);
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                            <StyledFormArea>
                                <MyTextInput
                                    label="Email Address"
                                    icon="mail"
                                    placeholder="abc@gmail.com"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('email')}
                                    onBlur={handleBlur('email')}
                                    value={values.email}
                                    keyboardType="email-address"
                                />
                                <MyTextInput
                                    label="Password"
                                    icon="lock"
                                    placeholder="********"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('password')}
                                    onBlur={handleBlur('password')}
                                    value={values.password}
                                    secureTextEntry={hidePassword}
                                    isPassword={true}
                                    hidePassword={hidePassword}
                                    setHidePassword={setHidePassword}
                                />
                                <MsgBox type={messageType}>{message}</MsgBox>
                                {!isSubmitting ? (
                                    <StyledButton onPress={handleSubmit}>
                                        <ButtonText>Login</ButtonText>
                                    </StyledButton>
                                ) : (
                                    <StyledButton disabled={true}>
                                        <ActivityIndicator size="large" color={primary} />
                                    </StyledButton>
                                )}
                                <Line />
                                <StyledButton google={true} onPress={() => promptAsync()}>
                                    <Fontisto name="google" color={primary} size={25} />
                                    <ButtonText> Sign in with Google</ButtonText>
                                </StyledButton>
                                <ExtraView>
                                    <ExtraText>Don't have an account already? </ExtraText>
                                    <TextLink onPress={() => navigation.navigate('O_signup')}>
                                        <TextLinkContent>SignUp</TextLinkContent>
                                    </TextLink>
                                </ExtraView>
                            </StyledFormArea>
                        )}
                    </Formik>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({ label, icon, isPassword, hidePassword, setHidePassword, ...props }) => {
    return (
        <View>
            <LeftIcon>
                <Octicons name={icon} size={30} color={brand} />
            </LeftIcon>
            <StyledInputLabel>{label}</StyledInputLabel>
            <StyledTextInput {...props} />
            {isPassword && (
                <RightIcon onPress={() => setHidePassword(!hidePassword)}>
                    <Ionicons name={hidePassword ? 'eye-off' : 'eye'} size={30} color={darkLight} />
                </RightIcon>
            )}
        </View>
    );
};

export default O_Login;

