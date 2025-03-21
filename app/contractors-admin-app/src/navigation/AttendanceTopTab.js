import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TimeCardScreen from '../screens/hr management/attendance/TimeCardScreen';
import ClockInScreen from '../screens/hr management/attendance/ClockInScreen';
import ClockOutScreen from '../screens/hr management/attendance/ClockOutScreen';
import Colors from '../constants/Colors';

import ScreensLabel from '../constants/ScreensLabel';

const Tab = createMaterialTopTabNavigator();

const AttendanceTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.ATTENDANCE} />
      </View>
      <Tab.Navigator
        initialRouteName={{ TimeCardScreen }}
        sceneContainerStyle={{
          backgroundColor: Colors().screenBackground,
          margin: 0,
        }}
        screenOptions={() => ({
          lazyPreloadDistance: 0,
          swipeVelocityImpact: 0.1,
          springVelocityScale: 1,
          lazy: true,
          swipeEnabled: true,
          tabBarScrollEnabled: true,
          tabBarActiveTintColor: Colors().purple,
          tabBarInactiveTintColor: Colors().gray,
          tabBarStyle: { backgroundColor: Colors().screenBackground },
          sceneContainerStyle: {
            backgroundColor: 'transparent',
            height: 800,
            padding: 0,
            margin: 0,
            borderRadius: 20,
          },
          tabStyle: {
            borderRadius: 30,
            margin: 12,
            justifyContent: 'center',
            alignContent: 'center',
            backgroundColor: 'red',
          },
          indicatorStyle: { backgroundColor: 'yellow', opacity: 0.05 },
          tabBarLabelStyle: {
            textAlign: 'center',
            fontSize: 12,
            backgroundColor: 'red',
            // height: 30,
            // width: 70,
          },
          tabBarIndicatorStyle: {
            borderBottomColor: Colors().purple,
            borderBottomWidth: 2,
          },
          style: { backgroundColor: '#ffffff' },
          tabBarLabelStyle: {
            fontSize: 13,
            textAlign: 'center',
            fontWeight: '600',
            fontFamily: Colors().fontFamilyBookMan,
          },
        })}>
        <Tab.Screen
          name="TimeCardScreen"
          component={TimeCardScreen}
          initialParams={{ type: 1 }}
          options={{ tabBarLabel: label.TIME_CARD }}
        />
        <Tab.Screen
          name="ClockInScreen"
          component={ClockInScreen}
          initialParams={{ type: 2 }}
          options={{
            tabBarLabel: label.CLOCK_IN,
          }}
        />
        <Tab.Screen
          name="ClockOutScreen"
          component={ClockOutScreen}
          initialParams={{ type: 3 }}
          options={{ tabBarLabel: label.CLOCK_OUT }}
        />
      </Tab.Navigator>
    </>
  );
};

export default AttendanceTopTab;

const styles = StyleSheet.create({});
