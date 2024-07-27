import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import http from 'helpers/axios';
import {blobToBase64} from 'utils/image.utils';
import {useRoute} from '@react-navigation/native';
import {PRIMARY_COLOR, TEXT_DARK} from 'assets/const/FontColor';
import Button from 'base/components/Button';
const windowWidth = Dimensions.get('window').width;

const UserTransaction = () => {
  const [preview, setPreview] = useState(
    'https://cloud-atg.moph.go.th/quality/sites/default/files/default_images/default.png',
  );
  const route = useRoute();
  const {data} = route.params;
  const [dataProfile, setDataAbout] = useState({
    address: '',
    birthDate: 0,
    birthPlace: '',
    position: '',
    height: '',
    identityName: '',
    identityNumber: '',
    linkUrl: null,
    nationality: '',
    users: {
      fullname: '',
    },
    weight: '',
  });
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
        const response = await fetch.get(`/members/${data}`);
        setDataAbout(response.data);
        convert();
      } catch (error) {
        console.log(error.response.data);
      }
    };

    getProfile();
  }, [getImage, dataProfile.linkUrl, data]);
  return (
    <ScrollView style={{margin: 30}}>
      <Text style={styles.titleText}>Pemain Klub</Text>
      <View style={styles.bottomBar} />
      <Image
        style={styles.image}
        source={{
          uri: preview,
        }}
      />
      <View style={styles.listData}>
        <Text style={styles.titleText}>{dataProfile.users.fullname}</Text>
      </View>
      <View style={styles.listData}>
        <Text style={styles.textList}>Posisi</Text>
        <Text style={styles.textList}>{dataProfile.position}</Text>
      </View>
      <View style={styles.listData}>
        <Text style={styles.textList}>Nomor Punggung</Text>
        <Text style={styles.textList}>{dataProfile.identityNumber}</Text>
      </View>
      <View style={styles.listData}>
        <Text style={styles.textList}>Nama Pemain</Text>
        <Text style={styles.textList}>{dataProfile.identityName}</Text>
      </View>
      <View style={styles.listData}>
        <Text style={styles.textList}>Tempat Lahir</Text>
        <Text style={styles.textList}>{dataProfile.birthPlace}</Text>
      </View>
      <View style={styles.listData}>
        <Text style={styles.textList}>Tanggal Lahir</Text>
        <Text style={styles.textList}>{dataProfile.birthDate}</Text>
      </View>
      <View style={styles.listData}>
        <Text style={styles.textList}>Berat</Text>
        <Text style={styles.textList}>{dataProfile.weight}</Text>
      </View>
      <View style={styles.listData}>
        <Text style={styles.textList}>Tinggi</Text>
        <Text style={styles.textList}>{dataProfile.height}</Text>
      </View>
      <View style={styles.listData}>
        <Text style={styles.textList}>Kewarganegaraan</Text>
        <Text style={styles.textList}>{dataProfile.nationality}</Text>
      </View>
      <Button>Daftar Anggota</Button>
    </ScrollView>
  );
};

export default UserTransaction;

const styles = StyleSheet.create({
  titleText: {fontSize: 24, color: TEXT_DARK, fontWeight: '600', marginTop: 8},
  bottomBar: {
    borderBottomWidth: 3,
    width: '50%',
    borderColor: PRIMARY_COLOR,
    marginTop: 4,
    marginBottom: 8,
  },
  listData: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#FEE',
  },
  textList: {
    fontSize: 16,
    fontWeight: '700',
  },
  image: {
    borderRadius: 8,
    width: windowWidth - 60,
    height: windowWidth - 60,
  },
});
