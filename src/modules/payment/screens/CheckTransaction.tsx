import {
  Image,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {PRIMARY_COLOR} from 'assets/const/FontColor';
import {MSG, NO_WHATSAPP} from 'assets/const/WhatsApp';
import AsyncStorage from '@react-native-async-storage/async-storage';
import http from 'helpers/axios';

const CheckTransaction = ({navigation}) => {
  const [statusMember, setStatusMember] = useState('');
  const [refreshing, setRefresing] = useState(false);
  const [idUser, setIdUser] = useState('');

  const onRefresh = useCallback(async () => {
    setRefresing(true);
    const fetch = await http();
    const response = await fetch.get(`/members/${idUser}`);
    setStatusMember(response.data.status);
    setRefresing(false);
  }, [idUser]);

  const getIdProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      setIdUser(value);
    } catch (error) {
      // Error saving data
    }
  };

  useEffect(() => {
    getIdProfile();
    onRefresh();
  }, []);
  const openWhatsapp = () => {
    Linking.openURL(`whatsapp://send?phone=${NO_WHATSAPP}&text=${MSG}`);
  };
  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      <View
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
          justifyContent: 'center',
          alignItems: 'center',
          marginVertical: 64,
        }}>
        <Text style={{fontSize: 24, fontWeight: '700'}}>Transaction</Text>
        {statusMember !== 'INACTIVE' && (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 24,
            }}>
            <Image
              source={require('assets/images/checked.png')}
              style={{width: 120, height: 120, marginTop: 40}}
            />
            <Text style={{fontSize: 24, fontWeight: '700'}}>
              Payment Confirmed
            </Text>
            <TouchableOpacity
              style={{
                width: 200,
                height: 50,
                borderRadius: 16,
                backgroundColor: PRIMARY_COLOR,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => navigation.navigate('Home')}>
              <Text style={{color: 'white'}}>Back To Home</Text>
            </TouchableOpacity>
          </View>
        )}
        {statusMember === 'INACTIVE' && (
          <View
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 24,
            }}>
            <Image
              source={require('assets/images/waiting.png')}
              style={{width: 120, height: 120, marginTop: 40}}
            />
            <Text style={{fontSize: 24, fontWeight: '700'}}>
              Waiting Payment Confirmation
            </Text>
            <TouchableOpacity
              style={{
                width: 200,
                height: 50,
                borderRadius: 16,
                backgroundColor: PRIMARY_COLOR,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={openWhatsapp}>
              <Text style={{color: 'white'}}>Contact Admin</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default CheckTransaction;

const styles = StyleSheet.create({});
