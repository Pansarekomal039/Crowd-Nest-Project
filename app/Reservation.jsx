import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { Octicons } from "@expo/vector-icons";
import {
    StyledContainer,
    InnerContainer,
    SubTitle,
    StyledFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    Colors,
    StyledButton,
    ButtonText,
    Line, 
    PageLogo,
} from '../components/style';
import { useNavigation, useRoute } from '@react-navigation/native';
import { View, TouchableOpacity, ActivityIndicator, Alert, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';

const { brand, darkLight, primary } = Colors;

const Reserve = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);
    const [dateText, setDateText] = useState('Select Date');
    const [timeText, setTimeText] = useState('Select Time');

    const handleMessage = (msg, type = 'FAILED') => {
        Alert.alert(type, msg);
    };

    const showDatepicker = () => {
        setShowDatePicker(true);
    };

    const showTimepicker = () => {
        setShowTimePicker(true);
    };

    const onChangeDate = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShowDatePicker(Platform.OS === 'ios');
        setDate(currentDate);
        setDateText(currentDate.toLocaleDateString());
    };

    const onChangeTime = (event, selectedTime) => {
        const currentTime = selectedTime || time;
        setShowTimePicker(Platform.OS === 'ios');
        setTime(currentTime);
        setTimeText(currentTime.toLocaleTimeString());
    };

    

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageLogo resizeMode="cover" source={require("../assets/images/Waiters-amico.png")} />
                    <Line />
                    <SubTitle>Reservation</SubTitle>

                    <Formik
                        initialValues={{
                            date: dateText,
                            time: timeText,
                            no_of_guest: '',
                            specialRequest: ''
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            values = { ...values, date: dateText, time: timeText };

                            if (
                                !values.date ||
                                !values.time ||
                                !values.no_of_guest ||
                                !values.specialRequest
                            ) {
                                handleMessage('Please fill all fields');
                                setSubmitting(false);
                            } else {
                                Alert.alert(
                                    "Reservation Confirmed",
                                    `Your reservation for ${values.no_of_guest} guests on ${values.date} at ${values.time} is confirmed!`,
                                    [
                                        {
                                            text: "OK",
                                            onPress: () => {
                                                // Go back to RestD screen
                                                navigation.goBack();
                                              },
                                        },
                                    ]
                                );
                                setSubmitting(false);
                            }
                        }}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, isSubmitting }) => (
                            <StyledFormArea>
                                <MyTextInput
                                    label="Date"
                                    icon="calendar"
                                    placeholder="YYYY-MM-DD"
                                    placeholderTextColor={darkLight}
                                    value={dateText}
                                    isDate={true}
                                    editable={false}
                                    showDatePicker={showDatepicker}
                                />

                                <MyTextInput
                                    label="Time"
                                    icon="clock"
                                    placeholder="HH:MM"
                                    placeholderTextColor={darkLight}
                                    value={timeText}
                                    isTime={true}
                                    editable={false}
                                    showTimePicker={showTimepicker}
                                />

                                <MyTextInput
                                    label="Number of Guests"
                                    icon="people"
                                    placeholder="2"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('no_of_guest')}
                                    onBlur={handleBlur('no_of_guest')}
                                    value={values.no_of_guest}
                                    keyboardType="numeric"
                                />

                                <MyTextInput
                                    label="Special Request"
                                    icon="pencil"
                                    placeholder="Any special requests?"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('specialRequest')}
                                    onBlur={handleBlur('specialRequest')}
                                    value={values.specialRequest}
                                    multiline
                                />

                                {!isSubmitting ? (
                                    <StyledButton onPress={handleSubmit}>
                                        <ButtonText>Reserve</ButtonText>
                                    </StyledButton>
                                ) : (
                                    <StyledButton disabled={true}>
                                        <ActivityIndicator size="large" color={primary} />
                                    </StyledButton>
                                )}

                                <Line />
                                {/* <ExtraView>
                                    <ExtraText>Already have an account?</ExtraText>
                                    <TextLink onPress={() => navigation.navigate('Login')}>
                                        <TextLinkContent>Login</TextLinkContent>
                                    </TextLink>
                                </ExtraView> */}
                            </StyledFormArea>
                        )}
                    </Formik>

                    {showDatePicker && (
                        <DateTimePicker
                            testID="datePicker"
                            value={date}
                            mode="date"
                            display="default"
                            onChange={onChangeDate}
                        />
                    )}

                    {showTimePicker && (
                        <DateTimePicker
                            testID="timePicker"
                            value={time}
                            mode="time"
                            display="default"
                            onChange={onChangeTime}
                        />
                    )}
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({
    label,
    icon,
    isDate,
    isTime,
    showDatePicker,
    showTimePicker,
    ...props
}) => (
    <View>
        <LeftIcon>
            <Octicons name={icon} size={30} color={brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        {!isDate && !isTime && <StyledTextInput {...props} />}
        {isDate && (
            <TouchableOpacity onPress={showDatePicker}>
                <StyledTextInput {...props} />
            </TouchableOpacity>
        )}
        {isTime && (
            <TouchableOpacity onPress={showTimePicker}>
                <StyledTextInput {...props} />
            </TouchableOpacity>
        )}
        
    </View>
);

export default Reserve;