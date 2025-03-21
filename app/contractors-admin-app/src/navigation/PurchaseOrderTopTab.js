/*    ----------------Created Date :: 13- sep -2024   ----------------- */

import React from 'react';
import { View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
import PurchaseOrderListScreen from '../screens/purchase & sale/purchase order/PurchaseOrderListScreen';
import SecurityDepositListScreen from '../screens/purchase & sale/purchase order/SecurityDepositListScreen';

const Tab = createMaterialTopTabNavigator();

const PurchaseOrderTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={`${label.PURCHASE} ${label.ORDER}`} />
      </View>
      <Tab.Navigator
        // initialRouteName={{MeasurementListingScreen}}
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
          name="PurchaseOrderListScreen"
          component={PurchaseOrderListScreen}
          initialParams={{ type: 'purchase_order' }}
          options={{ tabBarLabel: `${label.PURCHASE} ${label.ORDER}` }}
        />
        <Tab.Screen
          name="SecurityDepositListScreen1"
          component={SecurityDepositListScreen}
          initialParams={{ type: 'deposit' }}
          options={{
            tabBarLabel: `${label.SECURITY} ${label.DEPOSIT}`,
          }}
        />
        <Tab.Screen
          name="SecurityDepositListScreen2"
          component={SecurityDepositListScreen}
          initialParams={{ type: 'eligible' }}
          options={{
            tabBarLabel: `${label.SECURITY} ${label.ELIGIBLE}`,
          }}
        />
        <Tab.Screen
          name="SecurityDepositListScreen3"
          component={SecurityDepositListScreen}
          initialParams={{ type: 'process' }}
          options={{
            tabBarLabel: `${label.SECURITY} ${label.PROCESS}`,
          }}
        />
        <Tab.Screen
          name="SecurityDepositListScreen4"
          component={SecurityDepositListScreen}
          initialParams={{ type: 'paid' }}
          options={{
            tabBarLabel: `${label.SECURITY} ${label.PAID}`,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default PurchaseOrderTopTab;
