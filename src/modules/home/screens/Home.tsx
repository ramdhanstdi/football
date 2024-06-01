import {View, ScrollView, Image, Text} from 'react-native';
import React from 'react';
import CardSlideHorizontal from '../components/CardSlideHorizontal';
import Button from 'base/components/Button';
import {PRIMARY_COLOR, TEXT_DARK, TEXT_LIGHT} from 'assets/const/FontColor';

const Home = ({navigation}: any) => {
  const dataArray = [
    {
      title: 'Orang Lucu',
      imgSrc:
        'https://cdn.britannica.com/69/228369-050-0B18A1F6/Asian-Cup-Final-2019-Hasan-Al-Haydos-Qatar-Japan-Takumi-Minamino.jpg',
      href: '',
    },
    {
      title: 'Orang Pintar',
      imgSrc:
        'https://cdn.britannica.com/69/228369-050-0B18A1F6/Asian-Cup-Final-2019-Hasan-Al-Haydos-Qatar-Japan-Takumi-Minamino.jpg',
      href: '',
    },
    {
      title: 'Orang Cerdas',
      imgSrc:
        'https://cdn.britannica.com/69/228369-050-0B18A1F6/Asian-Cup-Final-2019-Hasan-Al-Haydos-Qatar-Japan-Takumi-Minamino.jpg',
      href: '',
    },
  ];
  const handleSubmit = () => {
    navigation.navigate('media');
  };
  return (
    <View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 8,
          paddingVertical: 12,
          backgroundColor: PRIMARY_COLOR,
          alignItems: 'center',
          elevation: 10,
        }}>
        <View>
          <Image
            source={require('assets/images/main.png')}
            style={{width: 40, height: 40}}
          />
        </View>
        <Text style={{color: TEXT_LIGHT, fontSize: 16}}>
          Selamat Datang Madun
        </Text>
      </View>
      <View
        style={{
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 20,
          padding: 12,
          elevation: 10,
          marginVertical: 8,
        }}>
        <Image
          source={require('assets/images/main.png')}
          style={{width: 50, height: 50}}
        />
        <Text style={{color: TEXT_DARK, fontSize: 24}}>VS</Text>
        <Image
          source={require('assets/images/main.png')}
          style={{width: 50, height: 50}}
        />
      </View>
      <View
        style={{
          backgroundColor: '#fff',
          height: '75%',
        }}>
        <ScrollView
          horizontal
          style={{display: 'flex'}}
          showsHorizontalScrollIndicator={false}>
          {dataArray.map(data => (
            <CardSlideHorizontal
              title={data.title}
              navigation={navigation}
              imgSrc={data.imgSrc}
              href={data.href}
            />
          ))}
        </ScrollView>
        <View style={{marginBottom: 100, marginHorizontal: 'auto'}}>
          <Button
            action={handleSubmit}
            title="submit"
            text="Muat Lainnya"
            variant="secondary"
            disabled={false}
          />
        </View>
      </View>
    </View>
  );
};

export default Home;
