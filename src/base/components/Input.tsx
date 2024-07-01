import {
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  Text,
} from 'react-native';
import React from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {TEXT_DARK} from 'assets/const/FontColor';

const Input = ({
  icon,
  placeholder,
  onChangeText,
  onBlur,
  name,
  defaultValue,
  disabled = true,
}: any) => {
  const [show, setShow] = React.useState(true);
  return (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginTop: 12,
      }}>
      <Text style={{color: TEXT_DARK}}>{name}</Text>
      <View style={styleLocal.wrapForm}>
        <View style={styleLocal.inputBorder}>
          <TextInput
            onChangeText={value => onChangeText(name, value)}
            onBlur={onBlur}
            style={styleLocal.text}
            placeholder={placeholder}
            secureTextEntry={icon === 'lock' ? show : false}
            defaultValue={defaultValue}
            editable={disabled}
          />
          <View>
            {icon === 'lock' ? (
              show ? (
                <TouchableOpacity
                  onPress={() => setShow(!show)}
                  style={styleLocal.icons}>
                  <FontAwesome5 name="eye" size={16} />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => setShow(!show)}
                  style={styleLocal.icons}>
                  <FontAwesome5 name="eye-slash" size={16} />
                </TouchableOpacity>
              )
            ) : null}
          </View>
        </View>
      </View>
    </View>
  );
};

const styleLocal = StyleSheet.create({
  wrapForm: {
    width: Dimensions.get('screen').width - 50,
    flexDirection: 'row',
  },
  inputBorder: {
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 10,
  },
  icons: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
    paddingHorizontal: 8,
    flex: 2,
  },
});

export default Input;
