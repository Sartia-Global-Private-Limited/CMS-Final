import React from 'react';
import {View, Text} from 'react-native';
import {CandlestickChart} from 'react-native-gifted-charts';

const data = [
  {open: 100, close: 120, high: 130, low: 90, label: 'Mon'},
  {open: 120, close: 115, high: 125, low: 105, label: 'Tue'},
  {open: 115, close: 140, high: 145, low: 110, label: 'Wed'},
  {open: 140, close: 135, high: 150, low: 130, label: 'Thu'},
  {open: 135, close: 125, high: 140, low: 120, label: 'Fri'},
];

const CandleSticksChart = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Text style={{fontWeight: 'bold', marginBottom: 10}}>
        Candlestick Chart
      </Text>
      <CandlestickChart
        data={data}
        candleWidth={10}
        candleColors={{positive: 'green', negative: 'red'}}
        yAxisTextStyle={{color: 'gray'}}
        xAxisLabelTextStyle={{color: 'black'}}
        spacing={20} // Adjust spacing between candles
        maxValue={160} // Set a suitable max value for the y-axis
        minValue={80} // Set a suitable min value for the y-axis
      />
    </View>
  );
};

export default CandleSticksChart;
