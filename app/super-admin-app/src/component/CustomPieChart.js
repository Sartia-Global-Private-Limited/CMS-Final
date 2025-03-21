import React from 'react';
import {View, Text} from 'react-native';
import {PieChart} from 'react-native-gifted-charts';
import Colors from '../constants/Colors';
import ChartCard from './ChartCard';

const data = [
  {value: 57.9, color: '#F49056', text: '57.9%', label: 'SERIES-1'},
  {value: 22.4, color: '#864DFF', text: '22.4%', label: 'SERIES-2'},
  {value: 19.7, color: '#38C9A8', text: '19.7%', label: 'SERIES-3'},
];

const CustomPieChart = () => {
  return (
    <ChartCard
      headerName={'Total Vendors'}
      data={[
        {
          component: (
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: Colors().screenBackground,
                padding: 15,
              }}>
              <PieChart
                isAnimated
                data={data}
                donut
                showText
                shadow={true}
                textColor="white"
                textSize={12}
                innerCircleColor="#E8E8E8"
                radius={150}
              />
              <View style={{marginTop: 20, flexDirection: 'row', gap: 20}}>
                {data?.map((item, index) => (
                  <View
                    key={index}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 5,
                    }}>
                    <View
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 10,
                        backgroundColor: item.color,
                        marginRight: 5,
                      }}
                    />
                    <Text>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          ),
        },
      ]}
    />
  );
};

export default CustomPieChart;
