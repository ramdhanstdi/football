import {Dimensions, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useCallback, useState} from 'react';
import CardHeadLine from '../components/CardHeadLine';
import {SwiperFlatList} from 'react-native-swiper-flatlist';
import {PRIMARY_COLOR, TEXT_DARK, TEXT_LIGHT} from 'assets/const/FontColor';
import YoutubePlayer from 'react-native-youtube-iframe';
import Button from 'base/components/Button';
import CardNews from '../components/CardNews';

const windowWidth = Dimensions.get('window').width;

const Media = ({navigation}: any) => {
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

  const DataVideo = [
    {
      id: 'n_ewurDjjaM',
    },
    {
      id: 'zzGpbFYLdwk',
    },
    {
      id: 'beh7EriNScQ',
    },
  ];

  const DataNews = [
    {
      title: 'Kita Menang Mengalahkan dragon force',
      imgSrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2yeVyg4EBrVyBpQngkdeq-ot2rzIq8Jy8xw&s',
      href: '',
      date: '12/12/2023',
    },
    {
      title: 'Kita Menang Men',
      imgSrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2yeVyg4EBrVyBpQngkdeq-ot2rzIq8Jy8xw&s',
      href: '',
      date: '12/12/2023',
    },
    {
      title: 'Kita Menang Mengalahkan  force',
      imgSrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2yeVyg4EBrVyBpQngkdeq-ot2rzIq8Jy8xw&s',
      href: '',
      date: '12/12/2023',
    },
    {
      title: 'Kita Menang Mengalahkan  force',
      imgSrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2yeVyg4EBrVyBpQngkdeq-ot2rzIq8Jy8xw&s',
      href: '',
      date: '12/12/2023',
    },
    {
      title: 'Kita Menang Mengalahkan  force',
      imgSrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2yeVyg4EBrVyBpQngkdeq-ot2rzIq8Jy8xw&s',
      href: '',
      date: '12/12/2023',
    },
    {
      title: 'Kita Menang Mengalahkan  force',
      imgSrc:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2yeVyg4EBrVyBpQngkdeq-ot2rzIq8Jy8xw&s',
      href: '',
      date: '12/12/2023',
    },
  ];

  const [playing, setPlaying] = useState(false);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
    }
  }, []);

  const togglePlaying = useCallback(() => {
    setPlaying(prev => !prev);
  }, []);

  const handleSubmit = () => {
    navigation.navigate('media');
  };

  return (
    <ScrollView>
      <View>
        <SwiperFlatList
          autoplay
          autoplayDelay={2}
          autoplayLoop
          index={2}
          showPagination
          data={dataArray}
          style={{height: windowWidth - 50}}
          renderItem={({item}) => (
            <CardHeadLine
              title={item.title}
              navigation={navigation}
              imgSrc={item.imgSrc}
              href={item.href}
            />
          )}
        />
      </View>
      <View style={{backgroundColor: PRIMARY_COLOR}}>
        <Text style={styles.textTV}>PERSIB TV</Text>
        <SwiperFlatList
          index={0}
          showPagination
          data={DataVideo}
          style={{height: 220}}
          renderItem={({item}) => (
            <View style={{marginLeft: 20, borderRadius: 16}}>
              <YoutubePlayer
                height={300}
                play={playing}
                videoId={item.id}
                onChangeState={onStateChange}
              />
              <Button
                title={playing ? 'pause' : 'play'}
                onPress={togglePlaying}
              />
            </View>
          )}
        />
      </View>
      <View style={{backgroundColor: '#fff'}}>
        <Text style={styles.textNews}>Berita Terbaru</Text>
        {DataNews.map(item => (
          <CardNews imgSrc={item.imgSrc} title={item.title} date={item.date} />
        ))}
        <View style={{marginHorizontal: 'auto'}}>
          <Button
            action={handleSubmit}
            title="submit"
            text="Muat Lainnya"
            variant="secondary"
            disabled={false}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default Media;

const styles = StyleSheet.create({
  textNews: {
    fontSize: 16,
    marginVertical: 16,
    marginHorizontal: 8,
    fontWeight: '500',
    color: TEXT_DARK,
  },
  textTV: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_LIGHT,
    textAlign: 'center',
    marginVertical: 16,
  },
});
