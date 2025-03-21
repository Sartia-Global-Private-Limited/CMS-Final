import {StyleSheet, ScrollView, View} from 'react-native';
import React from 'react';
import {BarChart} from 'react-native-gifted-charts';
import Colors from '../constants/Colors';

const CustomeBarChart = ({data, bottomComponent, isGrouped, ...rest}) => {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <BarChart
          // isThreeD
          barWidth={20}
          barBorderTopLeftRadius={4}
          barBorderTopRightRadius={4}
          frontColor={Colors().skyBule}
          data={data || []}
          yAxisThickness={0}
          xAxisThickness={0}
          yAxisTextStyle={{
            color: Colors().pureBlack,
            fontFamily: Colors().fontFamilyBookMan,
            textTransform: 'uppercase',
          }}
          xAxisLabelTextStyle={{
            color: Colors().pureBlack,
            fontFamily: Colors().fontFamilyBookMan,
            textTransform: 'uppercase',
          }}
          {...(isGrouped == false
            ? {
                xAxisLabelTexts: [
                  'Apr',
                  'May',
                  'June',
                  'July',
                  'Aug',
                  'Sep',
                  'Oct',
                  'Nov',
                  'Dec',
                  'Jan',
                  'Feb',
                  'Mar',
                ],
              }
            : {})}
          {...rest}
        />
      </ScrollView>
      {bottomComponent && bottomComponent()}
    </View>
  );
};

export default CustomeBarChart;

const styles = StyleSheet.create({});
