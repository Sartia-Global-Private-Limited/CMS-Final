import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import OfficeStockInspectionListingScreen from '../screens/office inspection/office stock inspection/OfficeStockInspectionListingScreen';
import ScreensLabel from '../constants/ScreensLabel';

const Tab = createMaterialTopTabNavigator();

const OfficeStockInspectionTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.OFFICE_STOCK_INSPECTION} />
      </View>
      <Tab.Navigator
        // initialRouteName={{OfficeStockInspectionListingScreen}}
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
          name="OfficeStockInspectionListingScreen1"
          component={OfficeStockInspectionListingScreen}
          initialParams={{ type: 'pending' }}
          options={{ tabBarLabel: label.PENDING }}
        />
        <Tab.Screen
          name="OfficeStockInspectionListingScreen2"
          component={OfficeStockInspectionListingScreen}
          initialParams={{ type: 'partial' }}
          options={{
            tabBarLabel: label.PARTIAL,
          }}
        />
        <Tab.Screen
          name="OfficeStockInspectionListingScreen3"
          component={OfficeStockInspectionListingScreen}
          initialParams={{ type: 'approved' }}
          options={{ tabBarLabel: label.APPROVED }}
        />
      </Tab.Navigator>
    </>
  );
};

export default OfficeStockInspectionTopTab;

const styles = StyleSheet.create({});
