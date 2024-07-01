import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const Select = ({
  title,
  options,
  value,
  defaultValue,
  handleChange,
  disabled,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{title}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={value || defaultValue}
          style={styles.picker}
          enabled={disabled}
          onValueChange={value => handleChange(title, value)}>
          {options?.map(data => (
            <Picker.Item label={data} value={data} />
          ))}
        </Picker>
      </View>
      {/* <Text style={styles.selectedValue}>Selected: {defaultValue}</Text> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    overflow: 'hidden',
    width: '100%',
  },
  label: {
    fontSize: 18,
    marginTop: 10,
    color: '#000',
  },
  picker: {
    borderWidth: 1,
    height: 50,
    width: '100%',
    color: '#000',
  },
  selectedValue: {
    marginTop: 20,
    fontSize: 18,
  },
});

export default Select;
