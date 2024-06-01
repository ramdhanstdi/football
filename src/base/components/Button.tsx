import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import React from 'react';
import {
  PRIMARY_COLOR,
  SECONDARY_COLOR,
  TEXT_DARK,
  TEXT_LIGHT,
} from 'assets/const/FontColor';

const Button = ({text, action, style, disabled, variant}: any) => {
  return (
    <View>
      <TouchableOpacity
        style={{
          ...styleLocal.buttonWrap,
          ...style,
          backgroundColor:
            variant === 'primary' ? PRIMARY_COLOR : SECONDARY_COLOR,
          opacity: disabled ? 0.5 : 1,
        }}
        disabled={disabled}
        onPress={action}>
        <Text
          style={{
            ...styleLocal.text,
            color: variant === 'primary' ? TEXT_LIGHT : TEXT_DARK,
          }}>
          {text}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styleLocal = StyleSheet.create({
  buttonWrap: {
    height: 50,
    width: Dimensions.get('screen').width - 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderRadius: 12,
    borderWidth: 1,
    elevation: 10,
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 25,
  },
});

export default Button;
