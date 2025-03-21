import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';
import Colors from '../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../utils/ScreenLayout';
import ChartCard from './ChartCard';

const CustomLineChart = () => {
  const data = [
    { value: 70, label: 'APR' },
    { value: 90, label: 'MAY' },
    { value: 100, label: 'JUN' },
    { value: 110, label: 'JUL' },
    { value: 120, label: 'AUG' },
    { value: 95, label: 'SEP' },
    { value: 85, label: 'OCT' },
    { value: 105, label: 'NOV' },
    { value: 80, label: 'DEC' },
    { value: 10, label: 'JAN' },
    { value: 5, label: 'FEB' },
    { value: 2, label: 'MAR' },
  ];

  return (
    <ChartCard
      headerName={'TOTAL MY COMPANY'}
      data={[
        {
          component: (
            <View
              style={{
                backgroundColor: Colors().screenBackground,
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: '#888',
                  textAlign: 'center',
                  marginBottom: 10,
                  left: 25,
                  justifyContent: 'center',
                }}>
                15 April - 21 April
              </Text>

              <LineChart
                data={data}
                width={WINDOW_WIDTH * 0.82}
                height={WINDOW_HEIGHT * 0.4}
                isAnimated
                color="#FF3B30"
                thickness={5}
                hideDataPoints
                adjustToWidth
                yAxisTextStyle={{ color: '#888', fontSize: 10 }}
                xAxisTextStyle={{ color: '#888', fontSize: 8 }}
                dataPointsHeight={6}
                dataPointsWidth={6}
                dataPointsColor="#FF3B30"
                dataPointsRadius={3}
                showScrollIndicator={false}
                yAxisOffset={10}
                xAxisLabelTextStyle={{
                  color: 'black',
                  transform: [{ rotate: '60deg' }],
                  textAlign: 'center',
                }}
                initialSpacing={10}
                rulesColor="green"
                showVerticalLines={false}
                yAxisLabelWidth={20}
                renderTooltip={(item, index) => {
                  if (item.value === 120) {
                    return (
                      <View
                        style={{
                          backgroundColor: '#FF3B30',
                          padding: 4,
                          borderRadius: 4,
                        }}>
                        <Text style={{ color: '#fff', fontSize: 10 }}>
                          {item.value} additional text
                        </Text>
                      </View>
                    );
                  }
                  return null;
                }}
              />
            </View>
          ),
        },
      ]}
    />
  );
};

export default CustomLineChart;
