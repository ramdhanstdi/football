import React, {useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import FormLogin from '../components/FormLogin';
import {TEXT_DARK, TEXT_LIGHT, WARNING_COLOR} from 'assets/const/FontColor';
import http from 'helpers/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToken} from 'main/TokenProvider';

const Login = ({navigation}: any) => {
  const [inValid, setInvalid] = useState(true);
  const [fieldForm, setFieldForm] = useState({});
  const [error, setError] = useState('');
  const {setToken, setUserName} = useToken();

  const setItemToken = async (
    token: string,
    username: string,
    userId: string,
    status: string,
  ) => {
    try {
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('username', username);
      await AsyncStorage.setItem('userId', userId);
      await AsyncStorage.setItem('status', status);
    } catch (error) {
      // Error saving data
    }
  };

  const onSubmit = async (val: any) => {
    const objectValue = {
      username: val.Username,
      password: val.Password,
      device: 'MOBILE',
    };
    try {
      const fetch = await http();
      const response = await fetch.post('/auth/mobile/login', {
        ...objectValue,
      });

      setItemToken(
        response.data.token,
        response.data.user.username,
        response.data.user.members.id,
        response.data.user.members.status,
      );
      setToken(response.data.token);
      setUserName(response.data.user.username);
      navigation.navigate('BottomTabComponent');
    } catch (error) {
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
    <>
      {error && (
        <View
          style={{
            backgroundColor: WARNING_COLOR,
            height: 40,
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 24, color: TEXT_LIGHT}}>{error}</Text>
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
        <View style={styleLocal.cardLogin}>
          <View>
            <Text style={{fontSize: 20, fontWeight: 500, color: TEXT_DARK}}>
              Masuk
            </Text>
          </View>
          <FormLogin
            navigation={navigation}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={() => onSubmit(fieldForm)}
            formInvalid={inValid}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default Login;

const styleLocal = StyleSheet.create({
  skip: {
    marginRight: 24,
    textAlign: 'center',
    margin: 8,
  },
  cardLogin: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
});
