import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import http from 'helpers/axios';
import {blobToBase64} from 'utils/image.utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Input from 'base/components/Input';
import Select from 'base/components/Select';
import {PRIMARY_COLOR, SECONDARY_COLOR} from 'assets/const/FontColor';
import Button from 'base/components/Button';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {useToken} from 'main/TokenProvider';
import {useFocus} from 'helpers/useFocus';

const windowWidth = Dimensions.get('window').width;

const UserTransaction = ({navigation}) => {
  const [preview, setPreview] = useState(
    'https://cloud-atg.moph.go.th/quality/sites/default/files/default_images/default.png',
  );

  const [isEdit, setIsEdit] = useState(false);
  const [fieldForm, setFieldForm] = useState({
    identityName: '',
    identityNumber: '',
    username: '',
    isRelation: '',
    email: '.',
    phoneNumber: '',
    birthPlace: '',
    birthDate: new Date(),
    address: '',
    nationality: '',
    religion: '',
    weight: '',
    height: '',
    bio: '',
    status: '',
    id: '',
  });
  const [dataProfile, setDataProfile] = useState({
    id: '',
    address: '',
    birthDate: new Date(),
    birthPlace: '',
    position: '',
    height: '',
    email: '',
    identityName: '',
    identityNumber: '',
    linkUrl: '',
    phoneNumber: '',
    nationality: '',
    religion: '',
    users: {
      fullname: '',
      username: '',
    },
    weight: '',
  });
  const OPTIONS_NATIONALITY = ['WNI', 'WNA'];
  const OPTIONS_RELIGION = ['ISLAM', 'KRISTEN', 'HINDU', 'BUDDHA', 'KONGHUCU'];
  const [idUser, setIdUser] = useState('');
  const [statusMember, setStatusMember] = useState('');
  const [isTransaction, setIsTransaction] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const {focusCount, isFocused} = useFocus();

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setFieldForm(prevState => ({
        ...prevState,
        birthDate: date,
      }));
    }
    setShowPicker(false);
  };

  const handleChange = (field: string, value: any) => {
    setFieldForm(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const onSubmit = async () => {
    const fetch = await http();
    try {
      const response = await fetch.post('/transactions', {
        ...fieldForm,
        id: idUser,
      });
      navigation.navigate('CheckTransaction');
      console.log(response);
    } catch (error) {
      console.log(error);
    }
    return;
  };

  const getIdProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      setIdUser(value);
    } catch (error) {
      // Error saving data
    }
  };
  const getImage = useCallback(async () => {
    if (dataProfile.linkUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000000);
      const fetch = await http();
      try {
        const result = await fetch.get(
          `/files/${dataProfile.linkUrl.replace('/', '%2f')}`,
          {
            signal: controller.signal,
            responseType: 'blob',
          },
        );
        return Promise.resolve(result);
      } catch (err) {
        const error = err as any;
        return error?.response?.data;
      } finally {
        clearTimeout(timeoutId);
        controller.abort();
      }
    }
    return null;
  }, [dataProfile.linkUrl]);

  useEffect(() => {
    getIdProfile();
    const convert = async () => {
      try {
        const fileExtension = dataProfile?.linkUrl?.split('.').pop() as string;
        const result = await getImage();
        if (result) {
          const blob =
            result instanceof Blob
              ? result
              : new Blob([result._data], {
                  type: fileExtension,
                  lastModified: result.lastModified,
                });
          const base64String = await blobToBase64(blob);
          setPreview(base64String as string);
        }
      } catch (error) {
        //
      }
    };
    const getProfile = async () => {
      try {
        const fetch = await http();
        const response = await fetch.get(`/members/${idUser}`);
        const transaction = await fetch.get(`/transactions/member/${idUser}`);
        setStatusMember(response.data.status);
        setIsTransaction(!!transaction.data);
        setDataProfile(response.data);
        setFieldForm(prevState => ({
          ...prevState,
          status: response.data?.status,
        }));
        if (response.data.coaches) {
          setFieldForm(prevState => ({
            ...prevState,
            bio: response.data?.coaches.bio,
            isRelation: 'COACHES',
          }));
        }
        if (response.data.players) {
          setFieldForm(prevState => ({
            ...prevState,
            bio: response.data?.players.bio,

            isRelation: 'PLAYERS',
          }));
        }
        if (response.data.management) {
          setFieldForm(prevState => ({
            ...prevState,
            bio: response.data?.management.bio,
            isRelation: 'MANAGEMENTS',
          }));
        }

        convert();
      } catch (error) {
        console.log(error);
      }
    };
    getProfile();
    if (focusCount === 1 && isFocused) {
      getProfile();
    }
    if (focusCount > 1 && isFocused) {
      getProfile();
    }
  }, [getImage, dataProfile?.linkUrl, idUser, focusCount, isFocused]);
  return (
    <ScrollView
      style={{
        marginHorizontal: 'auto',
      }}>
      <View>
        <Input
          onChangeText={handleChange}
          type="text"
          name="identityName"
          defaultValue={dataProfile.identityName}
        />
        <Input
          onChangeText={handleChange}
          type="text"
          name="identityNumber"
          defaultValue={dataProfile.identityNumber}
        />
        {statusMember !== 'INACTIVE' && (
          <Input
            onChangeText={handleChange}
            type="text"
            name="username"
            defaultValue={dataProfile.users?.username}
          />
        )}
        <Input
          onChangeText={handleChange}
          type="text"
          name="email"
          defaultValue={dataProfile.email}
        />
        <Input
          onChangeText={handleChange}
          type="text"
          name="phoneNumber"
          defaultValue={dataProfile.phoneNumber}
        />
        <Input
          onChangeText={handleChange}
          type="text"
          name="birthPlace"
          defaultValue={dataProfile.birthPlace}
        />
        <View style={{border: 1, height: 50, marginVertical: 8}}>
          <Text>birthDate</Text>
          <TouchableOpacity
            onPress={() => setShowPicker(true)}
            style={{
              borderWidth: 0.5,
              paddingHorizontal: 12,
              height: 45,
              borderRadius: 8,
              paddingTop: 8,
            }}>
            <Text>{fieldForm.birthDate.toDateString()}</Text>
          </TouchableOpacity>
        </View>
        {showPicker && (
          <RNDateTimePicker
            mode="date"
            value={fieldForm.birthDate || dataProfile.birthDate}
            onChange={handleDateChange}
            style={{height: 20}}
          />
        )}
        <Input
          onChangeText={handleChange}
          type="text"
          name="address"
          defaultValue={dataProfile.address}
        />
        <Select
          handleChange={handleChange}
          title="nationality"
          defaultValue={dataProfile.nationality}
          value={fieldForm.nationality}
          options={OPTIONS_NATIONALITY}
          disabled={true}
        />
        <Select
          handleChange={handleChange}
          title="religion"
          defaultValue={dataProfile.religion}
          value={fieldForm.religion}
          options={OPTIONS_RELIGION}
          disabled={true}
        />
        <Input
          onChangeText={handleChange}
          type="text"
          name="weight"
          defaultValue={dataProfile.weight}
        />
        <Input
          onChangeText={handleChange}
          type="text"
          name="height"
          defaultValue={dataProfile.height}
        />
        <Input
          onChangeText={handleChange}
          type="text"
          name="bio"
          defaultValue={fieldForm.bio}
        />
        <Input
          onChangeText={handleChange}
          type="text"
          name="backName"
          defaultValue={fieldForm?.backName}
        />
        <Input
          onChangeText={handleChange}
          type="text"
          name="backNumber"
          defaultValue={fieldForm?.backNumber}
        />
      </View>
      <View style={{marginTop: 24, marginBottom: 80}}>
        <Button
          action={onSubmit}
          title="submit"
          text="Daftar"
          variant="primary"
        />
      </View>
    </ScrollView>
  );
};

export default UserTransaction;

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
    width: windowWidth - 60,
    height: windowWidth - 60,
  },
});
