/*    ----------------Created Date :: 25- July -2024   ----------------- */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
import OutletListScreen from '../screens/outlet management/OutletListScreen';
const Tab = createMaterialTopTabNavigator();

const OutletTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.OUTLET_MANAGEMENT} />
      </View>
      <Tab.Navigator
        // initialRouteName={{OutletListScreen}}
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
          name="OutletListScreen1"
          component={OutletListScreen}
          initialParams={{ type: 'requested' }}
          options={{
            tabBarLabel: label.REQUESTED,
          }}
        />
        <Tab.Screen
          name="OutletListScreen2"
          component={OutletListScreen}
          initialParams={{ type: 'approved' }}
          options={{
            tabBarLabel: label.APPROVED,
          }}
        />

        <Tab.Screen
          name="OutletListScreen3"
          component={OutletListScreen}
          initialParams={{ type: 'reject' }}
          options={{
            tabBarLabel: label.REJECTED,
          }}
        />
        <Tab.Screen
          name="OutletListScreen4"
          component={OutletListScreen}
          initialParams={{ type: 'all' }}
          options={{
            tabBarLabel: label.ALL,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default OutletTopTab;

const styles = StyleSheet.create({});
