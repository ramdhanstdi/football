import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const windowWidth = Dimensions.get('window').width;

const CardHeadLine = ({navigation, href, imgSrc, title}: any) => {
  return (
    <View key={title}>
      <TouchableOpacity
        onPress={() => navigation.navigate({name: href})}
        style={styleLocal.card}>
        <Image
          style={styleLocal.image}
          source={{
            uri: imgSrc,
          }}
        />
        <Text style={styleLocal.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CardHeadLine;

const styleLocal = StyleSheet.create({
  card: {
    height: '100%',
    width: windowWidth,
  },
  image: {
    height: '100%',
  },
  text: {
    height: '100%',
  },
});
