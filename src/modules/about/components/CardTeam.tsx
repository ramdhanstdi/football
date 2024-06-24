import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {TEXT_DARK} from 'assets/const/FontColor';
import {blobToBase64} from 'utils/image.utils';
import http from 'helpers/axios';

const windowWidth = Dimensions.get('window').width;

const CardTeam = ({
  navigation,
  backName,
  backNumber,
  bio,
  position,
  imgSrc,
  id,
}: any) => {
  const [preview, setPreview] = useState(
    'https://cloud-atg.moph.go.th/quality/sites/default/files/default_images/default.png',
  );

  const getImage = useCallback(async () => {
    if (imgSrc) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000000);
      const fetch = await http();
      try {
        const result = await fetch.get(`/files/${imgSrc.replace('/', '%2f')}`, {
          signal: controller.signal,
          responseType: 'blob',
        });
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
  }, [imgSrc]);

  useEffect(() => {
    const convert = async () => {
      try {
        const fileExtension = imgSrc.split('.').pop();
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
    convert();
  }, [getImage, imgSrc]);
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('UserDetail', {data: id})}
      style={{
        width: '100%',
        marginHorizontal: 'auto',
        backgroundColor: '#e4e3e3e3',
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 8,
        borderRadius: 12,
      }}>
      <Image
        style={styles.image}
        source={{
          uri: preview,
        }}
      />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginVertical: 4,
          justifyContent: 'space-between',
        }}>
        <Text style={styles.textStyle}>{backName}</Text>
        <Text style={{...styles.textStyle, fontSize: 36, fontWeight: '900'}}>
          {backNumber}
        </Text>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          marginBottom: 4,
          justifyContent: 'space-between',
        }}>
        <Text style={styles.textStyle}>{bio}</Text>
        <Text style={styles.textStyle}>{position}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CardTeam;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    color: TEXT_DARK,
  },
  image: {
    borderRadius: 8,
    width: windowWidth - 60,
    height: windowWidth - 60,
  },
});
