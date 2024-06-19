import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {TEXT_DARK} from 'assets/const/FontColor';
import {blobToBase64} from 'utils/image.utils';
import http from 'helpers/axios';

const CardNews = ({navigation, imgSrc, title, date, href}: any) => {
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

  function formatDate(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }

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
      onPress={() => navigation.navigate('MediaDetail', {data: href})}
      style={styleLocal.card}>
      <Image
        style={styleLocal.image}
        source={{
          uri: preview,
        }}
      />
      <View>
        <Text style={styleLocal.textTitle}>{title}</Text>
        <Text style={styleLocal.textDate}>{formatDate(date)}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CardNews;

const styleLocal = StyleSheet.create({
  card: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 8,
    borderBottomWidth: 0.2,
    marginVertical: 4,
    paddingBottom: 8,
  },
  image: {
    borderRadius: 8,
    height: 60,
    width: 80,
  },
  textTitle: {
    color: TEXT_DARK,
    fontSize: 16,
    fontWeight: '600',
  },
  textDate: {
    color: TEXT_DARK,
    fontSize: 8,
  },
});
