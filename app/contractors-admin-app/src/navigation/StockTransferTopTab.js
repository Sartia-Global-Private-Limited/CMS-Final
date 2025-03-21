/*    ----------------Created Date :: 6 - April -2024   ----------------- */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import StockTransferListingScreen from '../screens/stock management/stock transfer/StockTransferListingScreen';
import ScreensLabel from '../constants/ScreensLabel';

const Tab = createMaterialTopTabNavigator();

const StockTransferTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.STOCK_TRANSFER} />
      </View>
      <Tab.Navigator
        // initialRouteName={{StockTransferListingScreen}}
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
          name="StockTransferListingScreen1"
          component={StockTransferListingScreen}
          initialParams={{ type: 'pending' }}
          options={{ tabBarLabel: label.PENDING }}
        />
        <Tab.Screen
          name="StockTransferListingScreen2"
          component={StockTransferListingScreen}
          initialParams={{ type: 'reschedule' }}
          options={{
            tabBarLabel: label.RESCHEDULE,
          }}
        />
        <Tab.Screen
          name="StockTransferListingScreen3"
          component={StockTransferListingScreen}
          initialParams={{ type: 'transfer' }}
          options={{ tabBarLabel: label.TRANSFER }}
        />
        <Tab.Screen
          name="StockTransferListingScreen4"
          component={StockTransferListingScreen}
          initialParams={{ type: 'all' }}
          options={{ tabBarLabel: label.ALL }}
        />
      </Tab.Navigator>
    </>
  );
};

export default StockTransferTopTab;

const styles = StyleSheet.create({});
