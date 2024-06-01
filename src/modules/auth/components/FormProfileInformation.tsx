import Button from 'base/components/Button';
import Input from 'base/components/Input';
import React, {useState} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {TEXT_DARK} from 'assets/const/FontColor';

//Form Formik with All Params
const FormProfileInformation = ({
  handleChange,
  handleBlur,
  handleSubmit,
  navigation,
  formInvalid,
}: any) => {
  const [showPicker, setShowPicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setSelectedDate(date);
    }
    setShowPicker(false);
  };
  return (
    <View style={styleLocal.pagelogin}>
      <View>
        <Input
          onChangeText={handleChange}
          onBlur={handleBlur}
          type="text"
          name="Alamat Email"
        />

        <Input
          onChangeText={handleChange}
          onBlur={handleBlur}
          placeholder="Password"
          type="text"
          name="Password"
        />

        <Input
          onChangeText={handleChange}
          onBlur={handleBlur}
          placeholder="Nama Lengkap"
          type="text"
          name="Nama Lengkap"
        />

        <Input
          onChangeText={handleChange}
          onBlur={handleBlur}
          placeholder="No. HP"
          type="text"
          name="No. HP"
        />
        <View style={{border: 1, height: 50, marginVertical: 8}}>
          <Text style={{color: TEXT_DARK}}>Pilih Tanggal Lahir</Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              borderWidth: 0.5,
              paddingHorizontal: 12,
              height: 45,
              borderRadius: 8,
              paddingTop: 8,
            }}>
            <Text>{selectedDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>
        {showPicker && (
          <RNDateTimePicker
            mode="date"
            value={selectedDate}
            onChange={handleDateChange}
            style={{height: 20}}
          />
        )}
        <Input
          onChangeText={handleChange}
          onBlur={handleBlur}
          placeholder="Kota"
          name="Kota"
          type="text"
        />
      </View>
      <View style={{marginTop: 24}}>
        <Button
          action={handleSubmit}
          title="submit"
          text="Daftar"
          variant="primary"
          disabled={formInvalid}
        />
      </View>
    </View>
  );
};

export default FormProfileInformation;

const styleLocal = StyleSheet.create({
  pagelogin: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
