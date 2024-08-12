import React, {useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import {
  SUCCESS_COLOR,
  TEXT_DARK,
  TEXT_LIGHT,
  WARNING_COLOR,
} from 'assets/const/FontColor';
import http from 'helpers/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormChangePassword from '../components/FormChangePassword';

const ChangePassword = ({navigation}: any) => {
  const [inValid, setInvalid] = useState(true);
  const [fieldForm, setFieldForm] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [idUser, setIdUser] = useState({type: 'Player', id: ''});

  const onSubmit = async (val: any) => {
    const objectValue = {
      password: val.Password,
    };

    try {
      const value = await AsyncStorage.getItem('userId');
      setIdUser(prevState => ({...prevState, id: value as string}));
      const fetch = await http();
      const user = await fetch.put(
        `/auth/reset-password/${idUser.id}`,
        objectValue,
      );
      console.log(idUser.id);

      const set = await fetch.put(
        `/auth/set-new-password/${idUser.id}/${idUser.type}`,
        {...objectValue},
      );
      console.log(user, set);

      setSuccess('Berhasil Ganti Password');
      setTimeout(() => navigation.navigate('BottomTabComponent'), 3000);
    } catch (error) {
      console.log(error.response.data.message);
      setError(error.response.data.message);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFieldForm(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const handleBlur = () => {
    if (Object.keys(fieldForm).length >= 2) {
      const isValid = Object.values(fieldForm).every(
        val => val !== null && val !== '',
      );
      setInvalid(!isValid);
    }
  };

  return (
    <ScrollView>
      {(error || success) && (
        <View
          style={{
            backgroundColor: error ? WARNING_COLOR : SUCCESS_COLOR,
            height: 40,
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 24, color: TEXT_LIGHT}}>
            {typeof error === 'string' ? error : error[0] || success}
          </Text>
        </View>
      )}
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: '#02184f',
          height: 300,
        }}>
        <Image
          source={require('assets/images/main.jpeg')}
          style={{width: 90, height: 90, marginTop: 40}}
        />
      </View>
      <ScrollView style={{margin: 10, marginTop: -100}}>
        <View style={styleLocal.cardChangePassword}>
          <View>
            <Text style={{fontSize: 20, fontWeight: 500, color: TEXT_DARK}}>
              Change Password
            </Text>
          </View>
          <FormChangePassword
            navigation={navigation}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={() => onSubmit(fieldForm)}
            formInvalid={inValid}
          />
        </View>
      </ScrollView>
    </ScrollView>
  );
};

export default ChangePassword;

const styleLocal = StyleSheet.create({
  skip: {
    marginRight: 24,
    textAlign: 'center',
    margin: 8,
  },
  cardChangePassword: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
});
