import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

import { UNIT_NAME_2_CODE } from '@/lib/constants';
import { type ProductDetail, type ProductSearch } from '@/types';

export const uploadAudioAsync = async (uri: string) => {
  // let apiUrl = 'https://asr.fpt.ai/api/asr/ftg';
  let options = { encoding: FileSystem.EncodingType.Base64 };

  const base64 = await FileSystem.readAsStringAsync(uri, options);
  // const buffer = Buffer.from(base64, 'base64');
  const audioConfig = {
    encoding:
      Platform.OS === 'android'
        ? 'AMR_WB'
        : Platform.OS === 'web'
          ? 'WEBM_OPUS'
          : 'LINEAR16',
    sampleRateHertz:
      Platform.OS === 'android' ? 16000 : Platform.OS === 'web' ? 48000 : 41000,
    languageCode: 'vi-VN',
    // model: 'medical_conversation',
    speechContexts: [
      {
        phrases: [
          'Paracetamol',
          'Augmentin',
          'Amoxicillin',
          'Cefuroxim',
          'Prednisolone',
          'Levocetirizine',
          'Esomeprazole',
          'Zuiver',
          'Irbesartan',
          'Amlodipine',
          'Berodual Boehringer',
          'Xarelto',
          'Primolut',
        ],
        boost: 15,
      },
    ],
  };

  // const response = await axios({
  //   method: 'PUT',
  //   url: apiUrl,
  //   data: buffer,
  //   headers: {
  //     'api-key': '346bc054-dd3e-4bed-b246-438421f8851d',
  //     'Content-Type': 'application/octet-stream',
  //   },
  // });

  try {
    const speechResults = await fetch(
      'https://speech.googleapis.com/v1/speech:recognize',
      {
        method: 'POST',
        body: JSON.stringify({
          audio: {
            content: base64,
          },
          config: audioConfig,
        }),
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'X-goog-api-key': 'AIzaSyAxUuCuAaLzN7CTTKfnuM1wsxujJxpcjUA',
        },
      },
    ).then((res) => res.json());

    return speechResults;
  } catch (err) {
    console.log('canhnv10 ~ err:', err);
  }
};

export const transformDataRequestSearchPromotions = (
  data: ProductSearch[],
  customerInfo: any,
) => {
  return {
    items: data.map((item) => {
      const unitCode = UNIT_NAME_2_CODE.find(
        (unit) =>
          unit.name.toLowerCase() === item.price?.measureUnitName.toLowerCase(),
      );
      return {
        itemCode: item.sku,
        unitCode: unitCode ? unitCode.id : 0,
        unitName: String(item.price?.measureUnitName),
        quantity: 1,
        whsType: '010',
        price: Number(item.price?.price),
      };
    }),
    channel: 'WebNhapThuoc',
    storeType: 'NhapThuoc',
    shopCode: '',
    provinceCode: customerInfo?.profile?.provinceCode || '',
    isVisitor: customerInfo?.profile?.isVisitor || false,
    businessType: customerInfo?.profile?.businessType || '',
  };
};

export const transformDataRequestSearchPromotionSuggest = (
  data: ProductDetail,
  customerInfo: any,
) => {
  return {
    items: [
      {
        itemCode: data.sku,
        unitCode: Number(data.price?.measureUnitCode),
        unitName: String(data.price?.measureUnitName),
        quantity: 1,
        whsType: '010',
        price: Number(data.price?.price),
      },
    ],
    channel: 'WebNhapThuoc',
    storeType: 'NhapThuoc',
    shopCode: '',
    provinceCode: customerInfo?.profile?.provinceCode || '',
    isVisitor: customerInfo?.profile?.isVisitor || false,
    businessType: customerInfo?.profile?.businessType || '',
  };
};
