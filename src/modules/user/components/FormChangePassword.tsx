import Button from 'base/components/Button';
import Input from 'base/components/Input';
import React from 'react';
import {View, StyleSheet} from 'react-native';

const FormChangePassword = ({
  handleSubmit,
  handleBlur,
  handleChange,
  formInvalid,
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

        <Input
          onChangeText={handleChange}
          onBlur={handleBlur}
          icon="lock"
          placeholder="Masukkan password kamu"
          type="text"
          secure={true}
          name="Password"
        />
      </View>
      <View style={{marginTop: 16}}>
        <Button
          action={handleSubmit}
          title="submit"
          text="Change Password"
          variant="primary"
          disabled={formInvalid}
        />
      </View>
    </View>
  );
};

export default FormChangePassword;

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
