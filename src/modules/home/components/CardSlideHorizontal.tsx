import {TEXT_DARK} from 'assets/const/FontColor';
import http from 'helpers/axios';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {blobToBase64} from 'utils/image.utils';

const windowWidth = Dimensions.get('window').width;

const CardSlideHorizontal = ({navigation, title, href, imgSrc}: any) => {
  const [preview, setPreview] = useState(
    'https://cloud-atg.moph.go.th/quality/sites/default/files/default_images/default.png',
  );

  const getImage = useCallback(async () => {
    if (imgSrc) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1000000);
      const fetch = await http();
      try {
        const result = await fetch.get(`/files/${imgSrc}`, {
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
    <View key={href}>
      <TouchableOpacity
        onPress={() => navigation.navigate('MediaDetail', {data: href})}
        style={styleLocal.card}>
        <Image
          style={styleLocal.image}
          source={{
            uri: preview,
          }}
        />
        <Text style={styleLocal.text}>{title}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CardSlideHorizontal;

const styleLocal = StyleSheet.create({
  card: {
    marginTop: 8,
    marginBottom: 20,
    borderRadius: 8,
    marginLeft: 8,
    width: windowWidth - 60,
    height: 180,
  },
  image: {
    borderRadius: 8,
    width: windowWidth - 60,
    height: 180,
  },
  text: {
    color: TEXT_DARK,
    fontSize: 16,
    marginTop: 4,
  },
});
