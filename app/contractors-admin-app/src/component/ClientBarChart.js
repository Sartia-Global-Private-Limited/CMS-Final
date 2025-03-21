import React from 'react';
import {View, Text} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import Colors from '../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/ScreenLayout';
import ChartCard from './ChartCard';

const data = [
  {value: 70, label: 'APR'},
  {value: 90, label: 'MAY'},
  {value: 100, label: 'JUN'},
  {value: 110, label: 'JUL'},
  {value: 120, label: 'AUG'},
  {value: 95, label: 'SEP'},
  {value: 85, label: 'OCT'},
  {value: 105, label: 'NOV'},
  {value: 80, label: 'DEC'},
  {value: 250, label: 'JAN'},
  {value: 50, label: 'FEB'},
  {value: 150, label: 'MAR'},
];

const ClientBarChart = () => {
  return (
    <ChartCard
      headerName={'TOTAL CLIENTS'}
      data={[
        {
          component: (
            <View
              style={{
                backgroundColor: Colors().screenBackground,
                paddingTop: 15,
              }}>
              <BarChart
                data={data}
                barWidth={8}
                barBorderRadius={4}
                frontColor={'red'}
                yAxisTextStyle={{color: 'gray'}}
                xAxisLabelTextStyle={{
                  color: 'black',
                  transform: [{rotate: '90deg'}], // Rotates the labels
                  textAlign: 'center',
                }}
                width={WINDOW_WIDTH * 0.8}
                height={WINDOW_HEIGHT * 0.45}
              />
            </View>
          ),
        },
      ]}
    />
  );
};

export default ClientBarChart;
