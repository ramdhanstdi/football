import Button from 'base/components/Button';
import Input from 'base/components/Input';
import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

const FormResetPassword = ({
  handleSubmit,
  handleBlur,
  handleChange,
  navigation,
  formInvalid,
  idUser,
}: any) => {
  return (
    <View style={styleLocal.pagelogin}>
      <View style={{paddingHorizontal: 10}}>
        <Input
          onChangeText={handleChange}
          onBlur={handleBlur}
          icon="user"
          placeholder="Masukkan username kamu"
          type="text"
          name="Username"
        />

        {idUser && (
          <Input
            onChangeText={handleChange}
            onBlur={handleBlur}
            icon="lock"
            placeholder="Masukkan password kamu"
            type="text"
            secure={true}
            name="Password"
          />
        )}
      </View>
      <View style={{marginTop: 16}}>
        <Button
          action={handleSubmit}
          title="submit"
          text={idUser ? 'Cari' : 'Reset Password'}
          variant="primary"
          disabled={formInvalid}
        />
        <Button
          action={() => navigation.navigate('Register')}
          title="submit"
          text="Daftar"
        />
      </View>
    </View>
  );
};

export default FormResetPassword;

const styleLocal = StyleSheet.create({
  textForgot: {
    alignItems: 'flex-end',
    marginRight: 24,
    textAlign: 'right',
    margin: 8,
  },
  successmsg: {
    fontSize: 18,
    textAlign: 'center',
    backgroundColor: 'green',
    height: 30,
    color: '#090909',
  },
  pagelogin: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
