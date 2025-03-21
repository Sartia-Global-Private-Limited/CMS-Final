/*    ---------Created Date :: 12- Sep -2024   ---------*/

import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
import PaymentPaidListScreen from '../screens/paid invoice/PaymentPaidListScreen';
const Tab = createMaterialTopTabNavigator();

const PaidInvoiceTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.PAYMENT_PAID} />
      </View>
      <Tab.Navigator
        initialRouteName={{ PaymentPaidListScreen }}
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
          name="PaymentPaidListScreen1"
          component={PaymentPaidListScreen}
          initialParams={{ type: 'all' }}
          options={{
            tabBarLabel: label.ALL_PAID_BILL,
          }}
        />
        <Tab.Screen
          name="PaymentPaidListScreen2"
          component={PaymentPaidListScreen}
          initialParams={{ type: 'process' }}
          options={{
            tabBarLabel: label.PAYMENT_PROCESS,
          }}
        />

        <Tab.Screen
          name="PaymentPaidListScreen3"
          component={PaymentPaidListScreen}
          initialParams={{ type: 'done' }}
          options={{
            tabBarLabel: label.PAYMENT_DONE,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default PaidInvoiceTopTab;

const styles = StyleSheet.create({});
