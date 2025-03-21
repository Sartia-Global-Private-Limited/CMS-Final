/*    ----------------Created Date :: 22- July -2024   ----------------- */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
import RetentionMoneyListScreen from '../screens/billing management/retention money/RetentionMoneyListScreen';
const Tab = createMaterialTopTabNavigator();

const RetentionMoneyTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.RETENTION_MONEY} />
      </View>
      <Tab.Navigator
        // initialRouteName={{RetentionMoneyListScreen}}
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
          name="RetentionMoneyListScreen1"
          component={RetentionMoneyListScreen}
          initialParams={{ type: 'allpaidbill' }}
          options={{
            tabBarLabel: label.ALL_PAID_BILL,
          }}
        />
        <Tab.Screen
          name="RetentionMoneyListScreen2"
          component={RetentionMoneyListScreen}
          initialParams={{ type: 'eligible' }}
          options={{
            tabBarLabel: label.ELIGIBLE_RETENTION,
          }}
        />

        <Tab.Screen
          name="RetentionMoneyListScreen3"
          component={RetentionMoneyListScreen}
          initialParams={{ type: 'process' }}
          options={{
            tabBarLabel: label.RETENTION_PROCESS,
          }}
        />
        <Tab.Screen
          name="RetentionMoneyListScreen4"
          component={RetentionMoneyListScreen}
          initialParams={{ type: 'done' }}
          options={{
            tabBarLabel: label.DONE_RETENTION,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default RetentionMoneyTopTab;

const styles = StyleSheet.create({});
