import React, {useState} from 'react';
import {View, Text, ScrollView, Image, StyleSheet} from 'react-native';
import FormRegister from '../components/FormRegister';
import {TEXT_DARK} from 'assets/const/FontColor';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Register = ({navigation}: any) => {
  const [inValid, setInvalid] = useState(true);
  const [fieldForm, setFieldForm] = useState({});
  const onSubmit = (val: any) => {
    console.log(val);
    navigation.navigate('ProfileInformation');
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
      <View
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          backgroundColor: '#02184f',
          height: 300,
        }}>
        <Image
          source={require('assets/images/main.png')}
          style={{width: 90, height: 90, marginTop: 40}}
        />
      </View>
      <ScrollView style={{margin: 10, marginTop: -100}}>
        <View style={styleLocal.cardRegister}>
          <View>
            <Text style={{fontSize: 24, fontWeight: 500, color: TEXT_DARK}}>
              Daftar
            </Text>
          </View>
          <FormRegister
            navigation={navigation}
            handleChange={handleChange}
            handleBlur={handleBlur}
            handleSubmit={() => onSubmit(fieldForm)}
            formInvalid={inValid}
          />
          <Text style={styleLocal.skip} onPress={() => navigation.navigate('')}>
            Lewati Proses Pendaftaran{' '}
            <FontAwesome5 name="arrow-right" size={12} />
          </Text>
        </View>
      </ScrollView>
    </>
  );
};

export default Register;

const styleLocal = StyleSheet.create({
  skip: {
    marginRight: 24,
    textAlign: 'center',
    margin: 8,
  },
  cardRegister: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
  },
});
