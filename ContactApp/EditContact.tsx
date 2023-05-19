import React, {useState, useLayoutEffect, useRef} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Keyboard,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import FastImage from 'react-native-fast-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jsonData from './data.json';

interface ContactItem {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

const orangeCircle = require('./orange-circle.png');

const saveData = async (updatedData: ContactItem[]) => {
  try {
    const data = JSON.stringify(updatedData);
    await AsyncStorage.setItem('jsonData', data);
    console.log('Data saved successfully.');
  } catch (error) {
    console.error('Error saving data:', error);
  }
};

function EditContact(): JSX.Element {
  const navigation = useNavigation();
  const route = useRoute();
  const {value, onRefresh} = route.params;

  const [editedData, setEditedData] = useState<ContactItem>(value);
  const lastNameRef = useRef<TextInput>(null);
  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Home')}>
          <Text style={{ color: 'orange', fontSize: 20, marginLeft: 20 }}>
            Cancel
          </Text>
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={async () => {
            const updatedData = jsonData.map((item) =>
              item.id === editedData.id ? editedData : item
            );
            // Save the updated jsonData
            await saveData(updatedData);
            onRefresh(updatedData);
            // Navigate back to the previous screen
            navigation.navigate('Home');
          }}>
          <Text style={{ color: 'orange', fontSize: 20, marginRight: 20 }}>
            Save
          </Text>
        </TouchableOpacity>
      ),
    });
  }, [editedData, navigation, onRefresh]);

  const handleInputChange = (key: keyof ContactItem, value: string) => {
    setEditedData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };

  const focusNextInputField = (nextInputRef: React.RefObject<TextInput>) => {
    nextInputRef?.current?.focus();
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardDismissMode="on-drag">
      <View style={styles.imageContainer}>
        <FastImage
          style={styles.profileImage}
          resizeMode={FastImage.resizeMode.cover}
          source={orangeCircle}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Main Information</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.subTitle}>First Name</Text>
        <TextInput
          style={styles.textInput}
          value={editedData.firstName}
          onChangeText={text => handleInputChange('firstName', text)}
          returnKeyType="next"
          onSubmitEditing={() => focusNextInputField(lastNameRef)}
        />
      </View>
      <View style={styles.line} />
      <View style={styles.section}>
        <Text style={styles.subTitle}>Last Name</Text>
        <TextInput
          style={styles.textInput}
          value={editedData.lastName}
          onChangeText={text => handleInputChange('lastName', text)}
          returnKeyType="next"
          ref={lastNameRef}
          onSubmitEditing={() => focusNextInputField(emailRef)}
        />
      </View>
      <View style={styles.infoContainer}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>Sub Information</Text>
      </View>
      <View style={styles.line} />
      <View style={styles.section}>
        <Text style={styles.subTitle}>Email</Text>
        <TextInput
          style={styles.textInput}
          value={editedData.email}
          onChangeText={text => handleInputChange('email', text)}
          returnKeyType="next"
          ref={emailRef}
          onSubmitEditing={() => focusNextInputField(phoneRef)}
        />
      </View>
      <View style={styles.line} />
      <View style={styles.section}>
        <Text style={styles.subTitle}>Phone</Text>
        <TextInput
          style={styles.textInput}
          value={editedData.phone}
          onChangeText={text => handleInputChange('phone', text)}
          returnKeyType="done"
          ref={phoneRef}
          onSubmitEditing={Keyboard.dismiss}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'white',
    paddingTop: 30,
    alignItems: 'center',
  },
  imageContainer: {
    width: 150,
    height: 150,
    borderRadius: 150,
    overflow: 'hidden',
    marginLeft: 15,
  },
  profileImage: {
    flex: 1,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
  section: {
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    width: '100%',
    marginTop: 1,
    flexDirection: 'row',
  },
  line: {
    height: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#D3D3D3', // Change to desired gray color
    width: '97%',
    marginLeft: 20,
  },
  subTitle: {
    fontSize: 20,
    alignSelf: 'center',
    width: '30%',
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    width: '65%',
    marginLeft: 10,
    fontSize: 20,
  },
  infoContainer: {
    padding: 12,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    backgroundColor: '#F5F5F5',
    width: '100%',
    marginTop: '10%',
  },
});

export default EditContact;
