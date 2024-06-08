import {View, ScrollView, Image, Text} from 'react-native';
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
    navigation.navigate('media');
  };

  const getDetailUsername = useCallback(async () => {
    try {
      const fetch = await http();
      const response = await fetch.post('/auth/find-username', {
        username: user,
      });
      setDetail(response.data);
    } catch (error) {
      //
    }
  }, [user]);

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
        const response = await fetch.get('/news');
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
          Selamat Datang {detailUser.fullname}
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
