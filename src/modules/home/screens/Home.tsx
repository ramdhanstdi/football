import {
  View,
  ScrollView,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
  RefreshControl,
} from 'react-native';
import React, {useCallback, useState} from 'react';
import CardSlideHorizontal from '../components/CardSlideHorizontal';
import Button from 'base/components/Button';
import {PRIMARY_COLOR, TEXT_DARK, TEXT_LIGHT} from 'assets/const/FontColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http from 'helpers/axios';
import {useFocusEffect} from '@react-navigation/native';
import {useToken} from 'main/TokenProvider';

const Home = ({navigation}: any) => {
  const [user, setUser] = useState('');
  const [idUser, setIdUser] = useState('');
  const [dataNews, setDataNews] = useState([{title: '', linkUrl: '', id: ''}]);
  const [detailUser, setDetail] = useState({fullname: ''});
  const [refreshing, setRefresing] = useState(false);
  const [statusMember, setStatusMember] = useState('');
  const {userName} = useToken();
  const handleRegistration = () => {
    navigation.navigate('Registration_sbb');
  };
  const handleSubmit = () => {
    navigation.navigate('Media');
  };

  const getDetailUsername = useCallback(async () => {
    try {
      const fetch = await http();
      const response = await fetch.post('/auth/find-username', {
        username: user || userName,
      });
      setDetail(response.data);
    } catch (error) {
      //
    }
  }, [user, userName]);

  const onRefresh = useCallback(async () => {
    setRefresing(true);
    getDetailUsername();
    setRefresing(false);
  }, [getDetailUsername]);

  useFocusEffect(
    useCallback(() => {
      const getItemtoken = async (): Promise<any> => {
        try {
          const value = await AsyncStorage.getItem('username');
          const userId = await AsyncStorage.getItem('userId');
          setIdUser(userId || userName);
          console.log(userName, 'SDFSDFSDF');

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
          const status = await fetch.get(`/members/${idUser}`);
          setStatusMember(status.data.status);
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
    }, [getDetailUsername, idUser, user]),
  );
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View style={styles.header}>
        <View>
          <Image
            source={require('assets/images/main.jpeg')}
            style={{width: 40, height: 40}}
          />
        </View>
        <View>
          {detailUser?.fullname ? (
            <Text
              style={{
                color: TEXT_LIGHT,
                fontSize: 16,
              }}>{`Selamat Datang ${detailUser.fullname}`}</Text>
          ) : (
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'flex-end',
                maxWidth: 24,
              }}>
              <Button
                action={() => navigation.navigate('Login')}
                title="submit"
                text="Login"
                style={{width: 100}}
              />
            </View>
          )}
        </View>
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
              source={require('assets/images/main.jpeg')}
              style={{width: 50, height: 50}}
            />
            <Text style={{color: TEXT_DARK, fontSize: 20, fontWeight: '600'}}>
              Selasa
            </Text>
          </View>
          <View style={styles.cardLatihan}>
            <Image
              source={require('assets/images/main.jpeg')}
              style={{width: 50, height: 50}}
            />
            <Text style={{color: TEXT_DARK, fontSize: 20, fontWeight: '600'}}>
              Jum'at
            </Text>
          </View>
        </View>
      </ImageBackground>
      {statusMember === 'INACTIVE' && (
        <View
          style={{marginTop: 24, marginBottom: 65, marginHorizontal: 'auto'}}>
          <Text style={{fontSize: 16, fontWeight: '600', padding: 12}}>
            Akun ini belum aktif mohon klik aktifasi transaksi untuk melanjutkan
            halaman ini
          </Text>
          <Button
            action={() => navigation.navigate('UserTransaction')}
            title="submit"
            text={'Daftar Transaksi'}
            variant="primary"
          />
        </View>
      )}
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
      <View style={{ marginBottom: 50, alignItems: 'center' }}>
          <Button
            action={handleRegistration}
            title="Registration SBB"
            text="Registration SBB"
            variant="primary"
            disabled={false}
          />
        </View>
    </ScrollView>
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
