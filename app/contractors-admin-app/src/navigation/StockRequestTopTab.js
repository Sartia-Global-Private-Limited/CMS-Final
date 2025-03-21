/*    ----------------Created Date :: 1- April -2024   ----------------- */
import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import StockRequestListingScreen from '../screens/stock management/stock request/StockRequestListingScreen';
import ScreensLabel from '../constants/ScreensLabel';
const Tab = createMaterialTopTabNavigator();

const StockRequestTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.STOCK_REQUEST} />
      </View>
      <Tab.Navigator
        initialRouteName={{ StockRequestListingScreen }}
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
            // height: 800,
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
            borderBottomColor: 'red',
            borderColor: 'red',
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
          name="StockRequestListingScreen1"
          component={StockRequestListingScreen}
          initialParams={{ type: 'pending' }}
          options={{ tabBarLabel: label.PENDING }}
        />
        <Tab.Screen
          name="StockRequestListingScreen2"
          component={StockRequestListingScreen}
          initialParams={{ type: 'approved' }}
          options={{
            tabBarLabel: label.APPROVED,
          }}
        />
        <Tab.Screen
          name="StockRequestListingScreen3"
          component={StockRequestListingScreen}
          initialParams={{ type: 'rejected' }}
          options={{ tabBarLabel: label.REJECTED }}
        />
        <Tab.Screen
          name="StockRequestListingScreen4"
          component={StockRequestListingScreen}
          initialParams={{ type: 'all' }}
          options={{ tabBarLabel: label.ALL }}
        />
      </Tab.Navigator>
    </>
  );
};

export default StockRequestTopTab;

const styles = StyleSheet.create({});
