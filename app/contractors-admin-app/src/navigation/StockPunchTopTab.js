/*    ----------------Created Date :: 23- April -2024   ----------------- */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import SPListingScreen from '../screens/stock punch management/stock punch/SPListingScreen';
import ScreensLabel from '../constants/ScreensLabel';
const Tab = createMaterialTopTabNavigator();

const StockPunchTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.STOCK_PUNCH} />
      </View>
      <Tab.Navigator
        // initialRouteName={{SPListingScreen}}
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
          name="SPListingScreen1"
          component={SPListingScreen}
          initialParams={{ type: 'pending' }}
          options={{ tabBarLabel: label.PENDING }}
        />
        <Tab.Screen
          name="SPListingScreen2"
          component={SPListingScreen}
          initialParams={{ type: 'checkAndApprove' }}
          options={{
            tabBarLabel: label.CHECK_APPROVE,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default StockPunchTopTab;

const styles = StyleSheet.create({});
