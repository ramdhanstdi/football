import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {StackActions} from '@react-navigation/native';
import {useNavigation} from '@react-navigation/native';

const getItemtoken = async (): Promise<any> => {
  try {
    const value = await AsyncStorage.getItem('token');
    if (value !== null) {
      return value;
    }
  } catch (error) {
    return '';
  }
};
const removeItemtoken = async (): Promise<any> => {
  try {
    const value = await AsyncStorage.removeItem('token');
    if (value !== null) {
      return value;
    }
  } catch (error) {
    return '';
  }
};

const http = async () => {
  let headers = {};
  const token = await getItemtoken();
  if (token) {
    headers = {authorization: `Bearer ${token}`};
  }
  const inst = axios.create({
    headers,
    baseURL: process.env.BACKEND_URL,
  });

  inst.interceptors.response.use(
    response => {
      return response.data;
    },
    async error => {
      if (error.response.data.statusCode === 401) {
        await removeItemtoken();
        const navigation = useNavigation();
        navigation.dispatch(StackActions.replace('Login'));
      }
      return Promise.reject(error);
    },
  );

  return inst;
};

export default http;
