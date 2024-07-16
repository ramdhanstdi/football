import React, {useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import {TEXT_DARK, TEXT_LIGHT, WARNING_COLOR} from 'assets/const/FontColor';
import http from 'helpers/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToken} from 'main/TokenProvider';
import FormResetPassword from '../components/FormResetPassword';

const ResetPassword = ({navigation}: any) => {
  const [inValid, setInvalid] = useState(true);
  const [fieldForm, setFieldForm] = useState({});
  const [error, setError] = useState('');
  const {setToken} = useToken();
  const [idUser, setIdUser] = useState({type: '', id: ''});

  const onSubmit = async (val: any) => {
    const objectValue = {
      username: val.Username,
      password: val.Password,
    };
    if (!idUser) {
      try {
        const fetch = await http();
        const response = await fetch.post('/auth/find-username', {
          ...objectValue,
        });
        setIdUser({id: response.data.id, type: response.data.type});
        await fetch.post(`/auth/reset-password/${response.data.id}`);
      } catch (error) {
        setError(error.response.data.message);
      }
    } else {
      try {
        const fetch = await http();
        const response = await fetch.post(
          `/auth/set-new-password/${idUser.id}/${idUser.type}`,
          {
            ...objectValue,
          },
        );
        setIdUser(response.data.id);
      } catch (error) {
        setError(error.response.data.message);
      }
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
        <View style={styleLocal.cardResetPassword}>
          <View>
            <Text style={{fontSize: 20, fontWeight: 500, color: TEXT_DARK}}>
              {idUser.id ? 'Reset Password' : 'Cari User'}
            </Text>
          </View>
          <FormResetPassword
            idUser={idUser.id}
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

export default ResetPassword;

const styleLocal = StyleSheet.create({
  skip: {
    marginRight: 24,
    textAlign: 'center',
    margin: 8,
  },
  cardResetPassword: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
});
