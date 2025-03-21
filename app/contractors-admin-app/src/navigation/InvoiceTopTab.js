/*    ----------------Created Date :: 3- July -2024   ----------------- */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';

import InvoiceListScreen from '../screens/billing management/invoice/InvoiceListScreen';

const Tab = createMaterialTopTabNavigator();

const InvoiceTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.INVOICE} />
      </View>
      <Tab.Navigator
        // initialRouteName={{InvoiceListScreen}}
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
          name="InvoiceListScreen1"
          component={InvoiceListScreen}
          initialParams={{ type: 'readytoinvoice' }}
          options={{
            tabBarLabel: label.READY_TO_INVOICE,
          }}
        />

        <Tab.Screen
          name="InvoiceListScreen2"
          component={InvoiceListScreen}
          initialParams={{ type: 'final' }}
          options={{
            tabBarLabel: label.FINAL,
          }}
        />

        <Tab.Screen
          name="InvoiceListScreen3"
          component={InvoiceListScreen}
          initialParams={{ type: 'discard' }}
          options={{
            tabBarLabel: label.DISCARD,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default InvoiceTopTab;

const styles = StyleSheet.create({});
