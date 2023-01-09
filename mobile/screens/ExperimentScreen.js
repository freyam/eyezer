import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Video from 'react-native-video';

import EyezerScenery from '../assets/videos/app_bg_loop.mp4';

export function ExperimentScreen({navigation, route}) {
  const {experimentData} = route.params;

  setTimeout(() => {
    let dummy =
      "b'\\n3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,?,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,?,3.59,3.59,3.59,3.59,3.59,3.59,3.59,3.59,3.59,3.59,?,3.58,3.58,3.58,3.58,3.58,3.58,?,3.52,3.52,3.52,3.52,3.52,?,3.56,3.56,3.56,3.56,3.56,3.56,3.56,3.56,?,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,?,3.61,3.61,3.61,3.61,3.61,3.61,?,3.62,3.62,3.62,3.62,3.62,?,3.59,3.59,3.59,3.59,3.59,?,3.54,3.54,3.54,3.54,3.54,3.54,3.54,3.54,3.54,3.54,?,3.57,3.57,3.57,3.57,3.57,3.57,3.57,3.57,3.57,?,";

    experimentData.pupilDiameters = dummy;
    navigation.navigate('Results', {experimentData});
  }, 5000);

  // let intervalID = setInterval(() => {
  //   const READ_KEY = '5Y175EF80D2KQ470';
  //   const WRITE_KEY = 'P3RYOEFOD90DB9FY';
  //   const CHANNEL_ID = '1848369';

  //   let timeSaved = false;

  //   let URI =
  //     'http://api.thingspeak.com/channels/' +
  //     CHANNEL_ID +
  //     '/feeds/last.json?api_key=' +
  //     READ_KEY;

  //   fetch(URI)
  //     .then(response => response.json())
  //     .then(responseJson => {
  //       // 2022-09-24T06:47:21Z
  //       // 2022-09-24T06:58:08Z
  //       // 2022-09-24T06:58:40Z

  //       // 2022-09-24T07:14:55Z
  //       // console.log(responseJson.field6);
  //       // if (!timeSaved) experimentData.time = responseJson.created_at;
  //       // timeSaved = true;

  //       responseJson.field6 =
  //         "b'\\n3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,?,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,?,3.59,3.59,3.59,3.59,3.59,3.59,3.59,3.59,3.59,3.59,?,3.58,3.58,3.58,3.58,3.58,3.58,?,3.52,3.52,3.52,3.52,3.52,?,3.56,3.56,3.56,3.56,3.56,3.56,3.56,3.56,?,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,?,3.61,3.61,3.61,3.61,3.61,3.61,?,3.62,3.62,3.62,3.62,3.62,?,3.59,3.59,3.59,3.59,3.59,?,3.54,3.54,3.54,3.54,3.54,3.54,3.54,3.54,3.54,3.54,?,3.57,3.57,3.57,3.57,3.57,3.57,3.57,3.57,3.57,?,";

  //       if (responseJson.field6 != null) {
  //         experimentData.pupilDiameters = responseJson.field6;
  //         navigation.navigate('Results', {experimentData});
  //         clearInterval(intervalID);
  //       }
  //     });
  // }, 5000);

  return (
    <View style={styles.container}>
      <Video
        repeat
        source={EyezerScenery}
        resizeMode="cover"
        style={styles.backgroundVideo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    alignItems: 'center',
    paddingTop: 30,
  },
  backgroundVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
