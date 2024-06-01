import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {TEXT_DARK} from 'assets/const/FontColor';

const CardNews = ({imgSrc, title, date}: any) => {
  return (
    <View style={styleLocal.card}>
      <Image
        style={styleLocal.image}
        source={{
          uri: imgSrc,
        }}
      />
      <View>
        <Text style={styleLocal.textTitle}>{title}</Text>
        <Text style={styleLocal.textDate}>{date}</Text>
      </View>
    </View>
  );
};

export default CardNews;

const styleLocal = StyleSheet.create({
  card: {
    display: 'flex',
    flexDirection: 'row',
    gap: 8,
    marginHorizontal: 8,
    borderBottomWidth: 0.2,
    marginVertical: 4,
    paddingBottom: 8,
  },
  image: {
    borderRadius: 8,
    height: 60,
    width: 80,
  },
  textTitle: {
    color: TEXT_DARK,
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  textDate: {
    color: TEXT_DARK,
    fontSize: 6,
  },
});
