import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import CardSlideHorizontal from '../components/CardSlideHorizontal';
import Button from 'base/components/Button';
import {PRIMARY_COLOR, TEXT_DARK, TEXT_LIGHT} from 'assets/const/FontColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http from 'helpers/axios';

const Home = ({navigation}: any) => {
  const [user, setUser] = useState('');
  const [dataNews, setDataNews] = useState([{title: '', linkUrl: '', id: ''}]);
  const [detailUser, setDetail] = useState({fullname: ''});

  const handleSubmit = () => {
    navigation.navigate('Media');
  };

  const getDetailUsername = useCallback(async () => {
    try {
      const fetch = await http();
      const response = await fetch.post('/auth/find-username', {
        username: user,
      });
      setDetail(response.data);
      if (
        response.data.members === 'INACTIVE' &&
        response.data.type === 'INTERNAL'
      ) {
        navigation.navigate('setpassword');
      }
    } catch (error) {
      //
    }
  }, [navigation, user]);

  useEffect(() => {
    const getItemtoken = async (): Promise<any> => {
      try {
        const value = await AsyncStorage.getItem('username');
        if (value !== null) {
          setUser(value);
          return value;
        }
      } catch (error) {
        return '';
      }
    };
    const getNews = async () => {
      try {
        const fetch = await http();
        const response = await fetch.get('/news', {
          params: {
            sortBy: 'createdAt | DESC',
            page: 1,
            limit: 5,
            status: 'published',
          },
        });
        setDataNews(response.data.items);
      } catch (error) {
        //
      }
    };
    getItemtoken();
    getNews();
    if (user) {
      getDetailUsername();
    }
  }, [getDetailUsername, user]);
  return (
    <View>
      <View style={styles.header}>
        <View>
          <Image
            source={require('assets/images/main.png')}
            style={{width: 40, height: 40}}
          />
        </View>
        <Text style={{color: TEXT_LIGHT, fontSize: 16}}>
          Selamat Datang {detailUser.fullname}
        </Text>
      </View>
      <ImageBackground source={require('assets/images/bg-main.jpg')}>
        <Text
          style={{
            color: TEXT_LIGHT,
            fontSize: 20,
            fontWeight: '600',
            margin: 8,
          }}>
          Jadwal Latihan
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 20,
            marginHorizontal: 8,
          }}>
          <View style={styles.cardLatihan}>
            <Image
              source={require('assets/images/main.png')}
              style={{width: 50, height: 50}}
            />
            <Text style={{color: TEXT_DARK, fontSize: 20, fontWeight: '600'}}>
              Selasa
            </Text>
          </View>
          <View style={styles.cardLatihan}>
            <Image
              source={require('assets/images/main.png')}
              style={{width: 50, height: 50}}
            />
            <Text style={{color: TEXT_DARK, fontSize: 20, fontWeight: '600'}}>
              Jum'at
            </Text>
          </View>
        </View>
      </ImageBackground>
      <View
        style={{
          backgroundColor: '#fff',
          height: '70%',
        }}>
        <Text style={styles.title}>Berita Terbaru</Text>
        <ScrollView
          horizontal
          style={{display: 'flex'}}
          showsHorizontalScrollIndicator={false}>
          {dataNews.map(data => (
            <CardSlideHorizontal
              title={data.title}
              navigation={navigation}
              imgSrc={data.linkUrl.replace('/', '%2f')}
              href={data.id}
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

const styles = StyleSheet.create({
  cardLatihan: {
    backgroundColor: '#fff',
    gap: 20,
    padding: 12,
    elevation: 10,
    marginVertical: 8,
    flex: 1,
    alignItems: 'center',
    borderRadius: 8,
  },
  header: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 12,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    elevation: 10,
  },
  title: {
    color: TEXT_DARK,
    fontSize: 20,
    margin: 8,
    fontWeight: '600',
  },
});
