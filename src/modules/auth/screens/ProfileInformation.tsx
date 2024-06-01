import React from 'react';
import {View, Text, Image, ScrollView, StyleSheet} from 'react-native';
import {TEXT_DARK} from 'assets/const/FontColor';
import FormProfileInformation from '../components/FormProfileInformation';

const ProfileInformation = ({navigation}: any) => {
  const onSubmit = (val: any) => {
    const email = val.email;
    const password = val.password;
    const request = {email, password};
    console.log(request);
  };
  const handleChange = (val: any) => {
    console.log(val);
  };
  const handleBlur = (val: any) => {
    console.log(val);
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
            handleSubmit={onSubmit}
            formInvalid={true}
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
