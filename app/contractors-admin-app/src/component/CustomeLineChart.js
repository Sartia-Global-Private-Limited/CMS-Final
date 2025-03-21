/*    ----------------Created Date :: 21 - August -2024   ----------------- */

import {StyleSheet, ScrollView, View} from 'react-native';
import React from 'react';
import {LineChart} from 'react-native-gifted-charts';
import Colors from '../constants/Colors';

const CustomeLineChart = ({data, bottomComponent, ...rest}) => {
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          color={Colors().skyBule}
          dataPointsColor={Colors().pureBlack}
          data={data || []}
          yAxisThickness={0}
          xAxisThickness={0}
          thickness1={1.5}
          xAxisLabelTextStyle={{
            color: Colors().pureBlack,
            fontFamily: Colors().fontFamilyBookMan,
            textTransform: 'uppercase',
          }}
          yAxisTextStyle={{
            color: Colors().pureBlack,
            fontFamily: Colors().fontFamilyBookMan,
            textTransform: 'uppercase',
          }}
          xAxisLabelTexts={[
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
          ]}
          {...rest}
        />
      </ScrollView>
      {bottomComponent && bottomComponent()}
    </View>
  );
};

export default CustomeLineChart;

const styles = StyleSheet.create({});
