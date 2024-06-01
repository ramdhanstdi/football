import Button from 'base/components/Button';
import Input from 'base/components/Input';
import React from 'react';
import {StyleSheet, View} from 'react-native';

//Form Formik with All Params
const FormRegister = ({
  handleChange,
  handleBlur,
  handleSubmit,
  navigation,
  formInvalid,
}: any) => {
  return (
    <View style={styleLocal.pagelogin}>
      <View>
        <Input
          onChangeText={handleChange}
          onBlur={handleBlur}
          placeholder="Masukkan email kamu"
          type="text"
          name="Email"
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
      <View style={{marginTop: 24}}>
        <Button
          action={handleSubmit}
          title="submit"
          text="Lanjut Daftar"
          variant="primary"
          disabled={formInvalid}
        />
        <Button
          action={() => navigation.navigate('Login')}
          title="submit"
          text="Kembali Ke Login"
        />
      </View>
    </View>
  );
};

export default FormRegister;

const styleLocal = StyleSheet.create({
  pagelogin: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
