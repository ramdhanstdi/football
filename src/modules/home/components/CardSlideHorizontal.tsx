import {TEXT_DARK} from 'assets/const/FontColor';
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

const CardSlideHorizontal = ({navigation, title, href, imgSrc}: any) => {
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

export default CardSlideHorizontal;

const styleLocal = StyleSheet.create({
  card: {
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 8,
    marginLeft: 8,
    width: windowWidth - 60,
    height: 180,
  },
  image: {
    borderRadius: 8,
    width: windowWidth - 60,
    height: 180,
  },
  text: {
    color: TEXT_DARK,
    fontSize: 16,
    marginTop: 4,
  },
});
