import { Audio } from 'expo-av';

export const recordingOptions: any = {
  // android not currently in use, but parameters are required
  // android: {
  //   extension: '.m4a',
  //   sampleRate: 44100,
  //   numberOfChannels: 2,
  //   bitRate: 128000,
  // },
  // ios: {
  //   extension: '.wav',
  //   sampleRate: 44100,
  //   numberOfChannels: 1,
  //   bitRate: 128000,
  //   linearPCMBitDepth: 16,
  //   linearPCMIsBigEndian: false,
  //   linearPCMIsFloat: false,
  // },
  android: {
    extension: '.amr',
    outputFormat: Audio.AndroidOutputFormat.AMR_WB,
    audioEncoder: Audio.AndroidAudioEncoder.AMR_WB,
    sampleRate: 16000,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.wav',
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};
