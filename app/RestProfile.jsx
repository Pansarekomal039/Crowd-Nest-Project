import React, { useState , useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Formik } from 'formik';
import { collection, addDoc } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth';
import { Octicons } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import * as ImagePicker from 'expo-image-picker';
import {
    StyledContainer,
    InnerContainer,
    StyledFormArea,
    LeftIcon,
    StyledInputLabel,
    StyledTextInput,
    Colors,
    StyledButton,
    ButtonText,
    Line,
    PageTitle,
    Image
} from '../components/style';
import { View, TouchableOpacity, ActivityIndicator, Alert, StyleSheet, Text } from 'react-native';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import PropTypes from 'prop-types';
import * as yup from 'yup';
import { useNavigation } from 'expo-router';
import { firestore, storage } from '../app/firebaseConfig';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
const { brand, darkLight, primary } = Colors;

const formatTime = (date) => {
    if (!date || !(date instanceof Date) || isNaN(date)) return '';
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
    });
};

const restProfileSchema = yup.object().shape({
    fullName: yup.string().required('Restaurant name is required'),
    cuisine: yup.string().required('Cuisine type is required'),
    openTime: yup.date()
        .required('Opening time is required')
        .test(
            'is-before-close',
            'Opening time must be before closing time',
            function (value) {
                return !this.parent.closeTime || value < this.parent.closeTime;
            }
        ),
    closeTime: yup.date()
        .required('Closing time is required')
        .test(
            'is-after-open',
            'Closing time must be after opening time',
            function (value) {
                return !this.parent.openTime || value > this.parent.openTime;
            }
        ),
    street: yup.string().required('Street name is required'),
    city: yup.string().required('City is required'),
    states: yup.string().required('State is required'),
    pinCode: yup.string()
        .required('Postal code is required')
        .matches(/^[0-9]{5}(?:-[0-9]{4})?$/, 'Invalid postal code'),
    no_of_guest: yup.number()
        .required('Capacity is required')
        .min(1, 'Must be at least 1')
        .integer('Must be a whole number'),
    specialRequest: yup.string()
});

const RestProfile = ({ navigation }) => {
    const auth = getAuth();
    const user = auth.currentUser;
    const [isPickerVisible, setPickerVisibility] = useState(false);
    const [currentPickerType, setCurrentPickerType] = useState('open');
    const [address, setAddress] = useState({
        street: '',
        city: '',
        states: '',
        pinCode: '',
    });

const[image, setImage] = useState(false);
const[uploading,setUploading] = useState(false);
const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
    });

    if (!result.canceled) {
        setImage(result.assets[0].uri); 
    }
};

const uploadImage = async (uri) => {
    setUploading(true);
    const response = await fetch(uri);
    const blob = await response.blob();
    const storageRef = ref(storage, `restaurant-images/${Date.now()}`); // Unique filename
    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    setUploading(false);
    return downloadURL;
};
    const handleSubmit = async (values, { setSubmitting }) => {
        let imageUrl = '';
        if (image) {
            imageUrl = await uploadImage(image); // Upload image and get URL
        }
        const newRestaurant = {
            id: Date.now().toString(),
            name: values.fullName,
            cuisine: values.cuisine,
            capacity: values.no_of_guest,
            timing: `${formatTime(values.openTime)} - ${formatTime(values.closeTime)}`,
            address: `${values.street}, ${values.city}, ${values.states} ${values.pinCode}`,
            ownerId: user.uid, 
            image: imageUrl, 
        };

        try {
            await addDoc(collection(firestore, 'restaurants'), newRestaurant);
            setSubmitting(false);

            Alert.alert(
                "Reservation Confirmed",
                `Hi ${values.fullName}, Your reservation for ${values.no_of_guest} guests is confirmed!`,
                [{
                    text: "OK",
                    onPress: () => navigation.goBack()
                }]
            );
        } catch (error) {
            console.error("Error adding restaurant: ", error);
            Alert.alert("Error", "Failed to add restaurant. Please try again.");
        }
    };

    const handleAddressChange = (field, value) => {
        setAddress(prevState => ({ ...prevState, [field]: value }));
    };

    const cuisineOptions = [
        { label: 'Gujrati', value: 'Gujrati' },
        { label: 'Maharashtrian', value: 'Maharashtrian' },
        { label: 'Punjabi', value: 'Punjabi' },
        { label: 'South Indian', value: 'South Indian' },
        { label: 'East Indian', value: 'East Indian' },
        { label: 'Chinese', value: 'Chinese' },
        { label: 'Rajasthani', value: 'Rajasthani' },
    ];

    return (
        <KeyboardAvoidingWrapper>
            <StyledContainer>
                <StatusBar style="dark" />
                <InnerContainer>
                    <PageTitle>Restaurant Reservation</PageTitle>
                    <Line />

                    <Formik
                        initialValues={{
                            openTime: new Date(new Date().setHours(10, 0, 0, 0)),
                            closeTime: new Date(new Date().setHours(22, 0, 0, 0)),
                            no_of_guest: '',
                            specialRequest: '',
                            fullName: '',
                            street: '',
                            city: '',
                            states: '',
                            pinCode: '',
                            cuisine: null,
                        }}
                        validationSchema={restProfileSchema}
                        onSubmit={handleSubmit}
                    >
                        {({ handleChange, handleBlur, handleSubmit, values, setFieldValue, setFieldTouched, isSubmitting, errors, touched }) => (
                            <StyledFormArea>
                                {/* Restaurant Name Input */}
                                <MyTextInput
                                    label="Restaurant Name"
                                    icon="person"
                                    error={touched.fullName && errors.fullName}
                                    placeholder="Name"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('fullName')}
                                    onBlur={handleBlur('fullName')}
                                    value={values.fullName}
                                />

                                {/* Cuisine Picker */}
                                <View style={{ marginBottom: 15 }}>
                                    <StyledInputLabel>Cuisine</StyledInputLabel>
                                    <RNPickerSelect
                                        placeholder={{ label: 'Select Cuisine...', value: null }}
                                        onValueChange={handleChange('cuisine')}
                                        onClose={() => handleBlur('cuisine')}
                                        value={values.cuisine}
                                        items={cuisineOptions}
                                        style={{
                                            inputAndroid: styles.pickerInput,
                                            placeholder: { color: darkLight },
                                        }}
                                    />
                                    {errors.cuisine && touched.cuisine && (
                                        <Text style={styles.errorText}>{errors.cuisine}</Text>
                                    )}
                                </View>
                                <View style={{ marginBottom: 15 }}>
                                    <StyledInputLabel>Restaurant Image</StyledInputLabel>
                                    <TouchableOpacity onPress={pickImage}>
                                        <View style={styles.imagePicker}>
                                            {image ? (
                                                <Image source={{ uri: image }} style={styles.image} />
                                            ) : (
                                                <Text style={styles.imagePlaceholder}>Tap to select an image</Text>
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                </View>

                                {/* Time Pickers */}
                                <MyTextInput
                                    label="Open Time"
                                    icon="clock"
                                    error={touched.openTime && errors.openTime}
                                    placeholder="HH:MM AM"
                                    value={formatTime(values.openTime)}
                                    onPress={() => {
                                        setCurrentPickerType('open');
                                        setPickerVisibility(true);
                                        setFieldTouched('openTime', true);
                                    }}
                                />

                                <MyTextInput
                                    label="Close Time"
                                    icon="clock"
                                    error={touched.closeTime && errors.closeTime}
                                    placeholder="HH:MM PM"
                                    value={formatTime(values.closeTime)}
                                    onPress={() => {
                                        setCurrentPickerType('close');
                                        setPickerVisibility(true);
                                        setFieldTouched('closeTime', true);
                                    }}
                                />

                                {/* Address Fields */}
                                {['street', 'city', 'states', 'pinCode'].map((field) => (
                                    <MyTextInput
                                        key={field}
                                        label={field.charAt(0).toUpperCase() + field.slice(1).replace('_', ' ')}
                                        icon="location"
                                        error={touched[field] && errors[field]}
                                        placeholder={field === 'pinCode' ? '12345' : field}
                                        placeholderTextColor={darkLight}
                                        onChangeText={(value) => {
                                            handleChange(field)(value);
                                            handleAddressChange(field, value);
                                        }}
                                        onBlur={handleBlur(field)}
                                        value={values[field]}
                                        keyboardType={field === 'pinCode' ? 'numeric' : 'default'}
                                    />
                                ))}

                                {/* Capacity Input */}
                                <MyTextInput
                                    label="Capacity of Guests"
                                    icon="people"
                                    error={touched.no_of_guest && errors.no_of_guest}
                                    placeholder="50"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('no_of_guest')}
                                    onBlur={handleBlur('no_of_guest')}
                                    value={values.no_of_guest.toString()}
                                    keyboardType="numeric"
                                />

                                {/* Special Request Input */}
                                <MyTextInput
                                    label="Special Feature"
                                    icon="pencil"
                                    placeholder="Special feature"
                                    placeholderTextColor={darkLight}
                                    onChangeText={handleChange('specialRequest')}
                                    onBlur={handleBlur('specialRequest')}
                                    value={values.specialRequest}
                                    multiline
                                />

                                {/* Submit Button */}
                                {!isSubmitting ? (
                                    <StyledButton onPress={handleSubmit}>
                                        <ButtonText>Reserve</ButtonText>
                                    </StyledButton>
                                ) : (
                                    <StyledButton disabled={true}>
                                        <ActivityIndicator size="large" color={primary} />
                                    </StyledButton>
                                )}

                                {/* Time Picker Modal */}
                                <DateTimePickerModal
                                    isVisible={isPickerVisible}
                                    mode="time"
                                    onConfirm={(selectedTime) => {
                                        const field = currentPickerType === 'open' ? 'openTime' : 'closeTime';
                                        setFieldValue(field, selectedTime);
                                        setFieldTouched(field, true);
                                        setPickerVisibility(false);
                                        validateForm();
                                    }}
                                    onCancel={() => {
                                        setPickerVisibility(false);
                                        const field = currentPickerType === 'open' ? 'openTime' : 'closeTime';
                                        setFieldTouched(field, true);
                                    }}
                                    date={currentPickerType === 'open' ? values.openTime : values.closeTime}
                                    headerTextIOS={`Select ${currentPickerType === 'open' ? 'Opening' : 'Closing'} Time`}
                                />
                            </StyledFormArea>
                        )}
                    </Formik>
                </InnerContainer>
            </StyledContainer>
        </KeyboardAvoidingWrapper>
    );
};

const MyTextInput = ({ label, icon, error, onPress, ...props }) => (
    <View style={{ marginBottom: 15 }}>
        <LeftIcon>
            <Octicons name={icon} size={30} color={brand} />
        </LeftIcon>
        <StyledInputLabel>{label}</StyledInputLabel>
        <TouchableOpacity onPress={onPress}>
            <StyledTextInput
                {...props}
                editable={!!props.onChangeText}
                style={[
                    props.style,
                    !props.onChangeText && { color: darkLight },
                    error && styles.inputError
                ]}
            />
        </TouchableOpacity>
        {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
); 

const styles = StyleSheet.create({
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
        marginLeft: 10
    },
    pickerInput: {
        fontSize: 18,
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        height: 60,
        borderColor: darkLight,
        borderRadius: 4,
        color: darkLight,
        paddingRight: 30,
        backgroundColor: '#e0e0e0',
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 1
    },
    imagePicker: {
        borderWidth: 1,
        borderColor: darkLight,
        borderRadius: 4,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        height: 100,
    },
    image: {
        width: '100%',
        height: '100%',
        borderRadius: 4,
    },
    imagePlaceholder: {
        color: darkLight,
    },
});

RestProfile.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default RestProfile;















// rules_version = '2';

// service cloud.firestore {
//   match /databases/{database}/documents {

//     // This rule allows anyone with your Firestore database reference to view, edit,
//     // and delete all data in your Firestore database. It is useful for getting
//     // started, but it is configured to expire after 30 days because it
//     // leaves your app open to attackers. At that time, all client
//     // requests to your Firestore database will be denied.
//     //
//     // Make sure to write security rules for your app before that time, or else
//     // all client requests to your Firestore database will be denied until you Update
//     // your rules
//     match /{document=**} {
//       allow read, write: if request.time < timestamp.date(2025, 2, 21);
//     }
//   }
// }