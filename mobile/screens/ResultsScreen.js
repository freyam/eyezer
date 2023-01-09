import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {exp} from 'react-native/Libraries/Animated/Easing';
import {Dimensions} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

export function ResultsScreen({navigation, route}) {
  const {experimentData} = route.params;

  const pupilDiametersDict = {
    light: [],
    avgLight: 0,
    dark: [],
    avgDark: 0,
    red: [],
    avgRed: 0,
    red_pause: [],
    avgRedPause: 0,
    green: [],
    avgGreen: 0,
    green_pause: [],
    avgGreenPause: 0,
    blue: [],
    avgBlue: 0,
    blue_pause: [],
    avgBluePause: 0,
    yellow: [],
    avgYellow: 0,
    yellow_pause: [],
    avgYellowPause: 0,
    white: [],
    avgWhite: 0,
    white_pause: [],
    avgWhitePause: 0,
    final_list: [],
  };

  experimentData.pupilDiameters =
    "b'\\n3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,3.58,?,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,3.65,?,3.59,3.59,3.59,3.59,3.59,3.59,3.59,3.59,3.59,3.59,?,3.58,3.58,3.58,3.58,3.58,3.58,?,3.52,3.52,3.52,3.52,3.52,?,3.56,3.56,3.56,3.56,3.56,3.56,3.56,3.56,?,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,3.5,?,3.61,3.61,3.61,3.61,3.61,3.61,?,3.62,3.62,3.62,3.62,3.62,?,3.59,3.59,3.59,3.59,3.59,?,3.54,3.54,3.54,3.54,3.54,3.54,3.54,3.54,3.54,3.54,?,3.57,3.57,3.57,3.57,3.57,3.57,3.57,3.57,3.57,?,";

  // enter the pupil diameters into the final_list array witout NaN values or null values
  const foo = experimentData.pupilDiameters
    .split(',')
    .filter(item => item !== 'NaN' && item !== '?');

  // remove first and last values of list
  foo.shift();
  foo.pop();

  // convert foo to int arry
  const bar = foo.map(Number);

  useEffect(() => {
    console.log(bar);
  }, []);

  // create iteration number array for bar at intervals of 5 and reamining empty values
  const iterationNumber = [];
  for (let i = 0; i < bar.length; i++) {
    if (i % 10 === 0) {
      iterationNumber.push(i);
    } else {
      iterationNumber.push('');
    }
  }

  let pupilDiameters = experimentData.pupilDiameters.slice(4);
  pupilDiameters = pupilDiameters.split('?');
  for (let i = 0; i < pupilDiameters.length; i++) {
    const pupilDiameter = pupilDiameters[i].split(',');
    for (let j = 0; j < pupilDiameter.length; j++) {
      if (pupilDiameter[j] !== '') {
        switch (j) {
          case 0:
            pupilDiametersDict.light.push(pupilDiameter[j]);
            break;
          case 1:
            pupilDiametersDict.dark.push(pupilDiameter[j]);
            break;
          case 2:
            pupilDiametersDict.red.push(pupilDiameter[j]);
            break;
          case 3:
            pupilDiametersDict.red_pause.push(pupilDiameter[j]);
            break;
          case 4:
            pupilDiametersDict.green.push(pupilDiameter[j]);
            break;
          case 5:
            pupilDiametersDict.green_pause.push(pupilDiameter[j]);
            break;
          case 6:
            pupilDiametersDict.blue.push(pupilDiameter[j]);
            break;
          case 7:
            pupilDiametersDict.blue_pause.push(pupilDiameter[j]);
            break;
          case 8:
            pupilDiametersDict.yellow.push(pupilDiameter[j]);
            break;
          case 9:
            pupilDiametersDict.yellow_pause.push(pupilDiameter[j]);
            break;
          case 10:
            pupilDiametersDict.white.push(pupilDiameter[j]);
            break;
          case 11:
            pupilDiametersDict.white_pause.push(pupilDiameter[j]);
            break;
        }
      }
    }
  }

  function calcAvg(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += parseFloat(arr[i]);
    }
    return sum / arr.length;
  }

  pupilDiametersDict.avgLight =
    Math.round(calcAvg(pupilDiametersDict.light) * 100) / 100;
  pupilDiametersDict.avgDark =
    Math.round(calcAvg(pupilDiametersDict.dark) * 100) / 100;
  pupilDiametersDict.avgRed =
    Math.round(calcAvg(pupilDiametersDict.red) * 100) / 100;
  pupilDiametersDict.avgRedPause =
    Math.round(calcAvg(pupilDiametersDict.red_pause) * 100) / 100;
  pupilDiametersDict.avgGreen =
    Math.round(calcAvg(pupilDiametersDict.green) * 100) / 100;
  pupilDiametersDict.avgGreenPause =
    Math.round(calcAvg(pupilDiametersDict.green_pause) * 100) / 100;
  pupilDiametersDict.avgBlue =
    Math.round(calcAvg(pupilDiametersDict.blue) * 100) / 100;
  pupilDiametersDict.avgBluePause =
    Math.round(calcAvg(pupilDiametersDict.blue_pause) * 100) / 100;
  pupilDiametersDict.avgYellow =
    Math.round(calcAvg(pupilDiametersDict.yellow) * 100) / 100;
  pupilDiametersDict.avgYellowPause =
    Math.round(calcAvg(pupilDiametersDict.yellow_pause) * 100) / 100;
  pupilDiametersDict.avgWhite =
    Math.round(calcAvg(pupilDiametersDict.white) * 100) / 100;
  pupilDiametersDict.avgWhitePause =
    Math.round(calcAvg(pupilDiametersDict.white_pause) * 100) / 100;

  experimentData.pupilDiameters = pupilDiametersDict;

  console.log(JSON.stringify(experimentData, null, 2));

  return (
    <ScrollView>
      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Config
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Name: {experimentData.name}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Age: {experimentData.age}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Color: {experimentData.color}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Eye: {experimentData.eye}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Iterations: {experimentData.iterations}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Duration: {experimentData.duration}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Delay: {experimentData.delay}
      </Text>
      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Intensity: {experimentData.intensity}
      </Text>

      <Text
        style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Pupil Diameters
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Light:
        {'\n'}
        Average: {experimentData.pupilDiameters.avgLight}
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Dark:
        {'\n'}
        Average: {experimentData.pupilDiameters.avgDark}
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Red:
        {'\n'}
        Average: {experimentData.pupilDiameters.avgRed}
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Red Pause:
        {'\n'}
        Average: {experimentData.pupilDiameters.avgRedPause}
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Green:
        {'\n'}
        Average: {experimentData.pupilDiameters.avgGreen}
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Green Pause:
        {'\n'}
        Average: {experimentData.pupilDiameters.avgGreenPause}
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Blue:
        {'\n'}
        Average: {experimentData.pupilDiameters.avgBlue}
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Blue Pause:
        {'\n'}
        Average: {experimentData.pupilDiameters.avgBluePause}
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Yellow:
        {'\n'}
        Average: {experimentData.pupilDiameters.avgYellow}
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        Yellow Pause:
        {'\n'}
        Average: {experimentData.pupilDiameters.avgYellowPause}
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        White:
        {'\n'}
        Average: {experimentData.pupilDiameters.avgWhite}
      </Text>

      <Text
        style={{
          fontSize: 15,
          color: 'black',
          textAlign: 'center',
          marginTop: 20,
        }}>
        White Pause:
        {'\n'}
        Average: {experimentData.pupilDiameters.avgWhitePause}
      </Text>
      <View
        style={{
          marginTop: 20,
          marginBottom: 20,
          marginLeft: 20,
          marginRight: 20,
          // alignItems: 'center',
          // justifyContent: 'center',
        }}>
        <LineChart
          data={{
            labels: iterationNumber,
            datasets: [
              {
                data: bar,
              },
            ],
          }}
          width={Dimensions.get('window').width - 40} // from react-native
          height={220}
          yAxisSuffix=" mm"
          yAxisInterval={1} // optional, defaults to 1
          chartConfig={{
            backgroundColor: '#ffffff',
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '0.01',
              strokeWidth: '2',
            },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </View>
    </ScrollView>
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
