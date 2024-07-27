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

const windowWidth = Dimensions.get('window').width;

const AboutProfile = ({navigation}) => {
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
  const [isTransaction, setIsTransaction] = useState('');
  const [success, setSuccess] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const {setToken} = useToken();

  const handleDateChange = (event, date) => {
    if (date !== undefined) {
      setFieldForm(prevState => ({
        ...prevState,
        birthDate: date,
      }));
    }
    setShowPicker(false);
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

  const handleChange = (field: string, value: any) => {
    setFieldForm(prevState => ({
      ...prevState,
      [field]: value,
    }));
  };

  const logOut = async () => {
    await removeItemtoken();
    setToken('');
  };

  const onSubmit = async () => {
    const fetch = await http();
    if (statusMember === 'INACTIVE' && !isEdit) {
      setIsEdit(true);
      return;
    }
    if (statusMember === 'INACTIVE' && isEdit) {
      try {
        const response = await fetch.post('/transactions', {
          ...fieldForm,
          playerId: idUser,
          id: idUser,
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
      return;
    }
    if (isEdit) {
      setIsEdit(false);
      try {
        await fetch.put(`/members/${idUser}`, {
          ...fieldForm,
        });

        setSuccess(true);
      } catch (error) {
        console.log(error);

        setSuccess(false);
      }
    } else {
      setIsEdit(true);
    }
  };

  const getIdProfile = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      const status = await AsyncStorage.getItem('status');
      setIdUser(value);
      setStatusMember(status);
      console.log(status);
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
        const fileExtension = dataProfile.linkUrl?.split('.').pop() as string;
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

        setIsTransaction(transaction.data.status);
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
        console.log(error.response.data);
      }
    };

    getProfile();
  }, [getImage, dataProfile.linkUrl, idUser]);
  return (
    <ScrollView
      style={{
        marginHorizontal: 'auto',
      }}>
      <View
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'row',
        }}>
        <Button
          action={logOut}
          title="submit"
          text="Logout"
          variant="primary"
          style={{
            width: 50,
            heigth: 10,
            marginTop: 24,
          }}
        />
      </View>
      {success && (
        <View
          style={{
            backgroundColor: SECONDARY_COLOR,
            height: 40,
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 24, color: PRIMARY_COLOR}}>
            Profile Berhasil diupdate
          </Text>
        </View>
      )}
      {statusMember !== 'INACTIVE' && (
        <Image
          style={styles.image}
          source={{
            uri: preview,
          }}
        />
      )}
      {statusMember !== 'INACTIVE' ||
        (isEdit && (
          <View>
            <Input
              onChangeText={handleChange}
              type="text"
              name="identityName"
              defaultValue={dataProfile.identityName}
              disabled={isEdit}
            />
            <Input
              onChangeText={handleChange}
              type="text"
              name="identityNumber"
              defaultValue={dataProfile.identityNumber}
              disabled={isEdit}
            />
            {statusMember !== 'INACTIVE' && (
              <Input
                onChangeText={handleChange}
                type="text"
                name="username"
                defaultValue={dataProfile.users?.username}
                disabled={isEdit}
              />
            )}
            <Input
              onChangeText={handleChange}
              type="text"
              name="email"
              defaultValue={dataProfile.email}
              disabled={isEdit}
            />
            <Input
              onChangeText={handleChange}
              type="text"
              name="phoneNumber"
              defaultValue={dataProfile.phoneNumber}
              disabled={isEdit}
            />
            <Input
              onChangeText={handleChange}
              type="text"
              name="birthPlace"
              defaultValue={dataProfile.birthPlace}
              disabled={isEdit}
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
              disabled={isEdit}
            />
            <Select
              handleChange={handleChange}
              title="nationality"
              defaultValue={dataProfile.nationality}
              value={fieldForm.nationality}
              disabled={isEdit}
              options={OPTIONS_NATIONALITY}
            />
            <Select
              handleChange={handleChange}
              title="religion"
              defaultValue={dataProfile.religion}
              value={fieldForm.religion}
              disabled={isEdit}
              options={OPTIONS_RELIGION}
            />
            <Input
              onChangeText={handleChange}
              type="text"
              name="weight"
              defaultValue={dataProfile.weight}
              disabled={isEdit}
            />
            <Input
              onChangeText={handleChange}
              type="text"
              name="height"
              defaultValue={dataProfile.height}
              disabled={isEdit}
            />
            <Input
              onChangeText={handleChange}
              type="text"
              name="bio"
              defaultValue={fieldForm.bio}
              disabled={isEdit}
            />
            {(fieldForm.backName || statusMember === 'INACTIVE') && (
              <Input
                onChangeText={handleChange}
                type="text"
                name="backName"
                defaultValue={fieldForm?.backName}
                disabled={isEdit}
              />
            )}
            {(fieldForm?.backNumber || statusMember === 'INACTIVE') && (
              <Input
                onChangeText={handleChange}
                type="text"
                name="backNumber"
                defaultValue={fieldForm?.backNumber}
                disabled={isEdit}
              />
            )}
          </View>
        ))}
      {statusMember !== 'INACTIVE' ? (
        <View style={{marginTop: 24, marginBottom: 80}}>
          <Button
            action={onSubmit}
            title="submit"
            text={isEdit ? 'Simpan' : 'Edit'}
            variant="primary"
          />
        </View>
      ) : (
        <View style={{marginTop: 24, marginBottom: 65}}>
          {!isEdit && (
            <Text style={{fontSize: 16, fontWeight: '600', padding: 12}}>
              Akun ini belum aktif mohon klik aktifasi transaksi untuk
              melanjutkan halaman ini
            </Text>
          )}
          <Button
            action={onSubmit}
            title="submit"
            text={'Daftar Transaksi'}
            variant="primary"
          />
        </View>
      )}
    </ScrollView>
  );
};

export default AboutProfile;

const styles = StyleSheet.create({
  image: {
    borderRadius: 8,
    width: windowWidth - 60,
    height: windowWidth - 60,
  },
});
