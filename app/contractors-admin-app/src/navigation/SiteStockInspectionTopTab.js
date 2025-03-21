/*    ----------------Created Date :: 18- May -2024   ----------------- */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import SiteStockInspectionListingScreen from '../screens/site inspection/site stock inspection/SiteStockInspectionListingScreen';
import ScreensLabel from '../constants/ScreensLabel';

const Tab = createMaterialTopTabNavigator();

const SiteStockInspectionTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.SITE_STOCK_INSPECTION} />
      </View>
      <Tab.Navigator
        // initialRouteName={{SiteStockInspectionListingScreen}}
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
          name="SiteStockInspectionListingScreen1"
          component={SiteStockInspectionListingScreen}
          initialParams={{ type: 'pending' }}
          options={{ tabBarLabel: label.PENDING }}
        />
        <Tab.Screen
          name="SiteStockInspectionListingScreen2"
          component={SiteStockInspectionListingScreen}
          initialParams={{ type: 'partial' }}
          options={{
            tabBarLabel: label.PARTIAL,
          }}
        />
        <Tab.Screen
          name="SiteStockInspectionListingScreen3"
          component={SiteStockInspectionListingScreen}
          initialParams={{ type: 'approved' }}
          options={{ tabBarLabel: label.APPROVED }}
        />
      </Tab.Navigator>
    </>
  );
};

export default SiteStockInspectionTopTab;

const styles = StyleSheet.create({});
