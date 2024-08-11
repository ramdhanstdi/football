import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {PRIMARY_COLOR, TEXT_DARK} from 'assets/const/FontColor';
import AboutDetail from '../components/AboutDetail';
import AboutTeam from '../components/AboutTeam';
import AboutProfile from '../components/AboutProfile';
import http from 'helpers/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const About = ({navigation}) => {
  const [section, setSection] = useState('about');
  const [user, setUser] = useState('');
  const [detailUser, setDetail] = useState({fullname: ''});

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
    getItemtoken();
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
          justifyContent: 'space-around',
          padding: 8,
          backgroundColor: '#fff',
        }}>
        <TouchableOpacity onPress={() => setSection('about')}>
          <Text style={styles.textTitle}>About</Text>
        </TouchableOpacity>
        {detailUser?.fullname && (
          <TouchableOpacity onPress={() => setSection('tim')}>
            <Text style={styles.textTitle}>Tim</Text>
          </TouchableOpacity>
        )}
        {detailUser?.fullname && (
          <TouchableOpacity onPress={() => setSection('profile')}>
            <Text style={styles.textTitle}>Profile User</Text>
          </TouchableOpacity>
        )}
      </View>
      {section === 'about' && (
        <View>
          <AboutDetail />
        </View>
      )}
      {section === 'tim' && (
        <View>
          <AboutTeam navigation={navigation} />
        </View>
      )}
      {section === 'profile' && (
        <View>
          <AboutProfile navigation={navigation} />
        </View>
      )}
    </View>
  );
};

export default About;

const styles = StyleSheet.create({
  headBlock: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: PRIMARY_COLOR,
    height: 300,
    alignItems: 'flex-end',
  },
  textTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: TEXT_DARK,
  },
});
