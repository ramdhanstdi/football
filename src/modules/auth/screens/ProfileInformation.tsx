import React, {useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TEXT_DARK,
  WARNING_COLOR,
} from 'assets/const/FontColor';
import FormProfileInformation from '../components/FormProfileInformation';
import {useRoute} from '@react-navigation/native';
import http from 'helpers/axios';

const ProfileInformation = ({navigation}: any) => {
  const [inValid, setInvalid] = useState(true);
  const [fieldForm, setFieldForm] = useState({});
  const [message, setMessage] = useState('');
  const onSubmit = async (val: any) => {
    const objectValue = {
      username: val.Username,
      fullname: val.Nama,
      email: data.Email,
      password: data.Password,
    };

    try {
      const fetch = await http();
      const response = await fetch.post('/auth/register', {
        ...objectValue,
      });

      if (response) {
        setMessage('Registrasi Berhasil Silahkan Login');
        setTimeout(() => {
          navigation.navigate('Login');
        }, 3000);
      }
    } catch (error) {
      setMessage(error.response.data.message[0]);
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
  const route = useRoute();
  const {data} = route.params;

  return (
    <>
      {message && (
        <View
          style={{
            backgroundColor: message.includes('Berhasil')
              ? SECONDARY_COLOR
              : WARNING_COLOR,
            height: 50,
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontSize: 24,
              color: message.includes('Berhasil')
                ? PRIMARY_COLOR
                : SECONDARY_COLOR,
            }}>
            {message}
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
        <View style={styleLocal.cardProfileInformation}>
          <View>
            <Text style={{fontSize: 20, fontWeight: 500, color: TEXT_DARK}}>
              Masuk
            </Text>
          </View>
          <FormProfileInformation
            navigation={navigation}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={() => onSubmit(fieldForm)}
            formInvalid={inValid}
            initialValue={data}
          />
        </View>
      </ScrollView>
    </>
  );
};

export default ProfileInformation;

const styleLocal = StyleSheet.create({
  cardProfileInformation: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
});
