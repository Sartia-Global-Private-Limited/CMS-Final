import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
import SalesOrderListScreen from '../screens/purchase & sale/sale order/SalesOrderListScreen';
import SalesSalesSecurityDepositListScreen from '../screens/purchase & sale/sale order/SalesSecurityDepositListScreen';

const Tab = createMaterialTopTabNavigator();

const SalesOrderTopTab = ({navigation}) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader headerTitle={`${label.SALE} ${label.ORDER}`} />
      </View>
      <Tab.Navigator
        // initialRouteName={{MeasurementListingScreen}}
        sceneContainerStyle={{
          backgroundColor: Colors().screenBackground,
          margin: 0,
        }}
        screenOptions={() => ({
          lazy: true,
          lazyPreloadDistance: 0,
          swipeVelocityImpact: 0.1,
          springVelocityScale: 1,
          lazy: true,
          swipeEnabled: true,
          tabBarScrollEnabled: true,

          tabBarActiveTintColor: Colors().purple,
          tabBarInactiveTintColor: Colors().gray,
          tabBarStyle: {backgroundColor: Colors().screenBackground},
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
          indicatorStyle: {backgroundColor: 'yellow', opacity: 0.05},
          tabBarLabelStyle: {
            textAlign: 'center',
            fontSize: 12,
            backgroundColor: 'red',
          },
          tabBarIndicatorStyle: {
            borderBottomColor: Colors().purple,
            borderBottomWidth: 2,
          },

          style: {backgroundColor: '#ffffff'},
          tabBarLabelStyle: {
            fontSize: 13,
            textAlign: 'center',
            fontWeight: '600',
            fontFamily: Colors().fontFamilyBookMan,
          },
        })}>
        <Tab.Screen
          name="SalesOrderListScreen"
          component={SalesOrderListScreen}
          initialParams={{type: 'sale_order'}}
          options={{tabBarLabel: `${label.SALE} ${label.ORDER}`}}
        />
        <Tab.Screen
          name="SalesSalesSecurityDepositListScreen1"
          component={SalesSalesSecurityDepositListScreen}
          initialParams={{type: 'deposit'}}
          options={{
            tabBarLabel: `${label.SECURITY} ${label.DEPOSIT}`,
          }}
        />
        <Tab.Screen
          name="SalesSalesSecurityDepositListScreen2"
          component={SalesSalesSecurityDepositListScreen}
          initialParams={{type: 'eligible'}}
          options={{
            tabBarLabel: `${label.SECURITY} ${label.ELIGIBLE}`,
          }}
        />
        <Tab.Screen
          name="SalesSalesSecurityDepositListScreen3"
          component={SalesSalesSecurityDepositListScreen}
          initialParams={{type: 'process'}}
          options={{
            tabBarLabel: `${label.SECURITY} ${label.PROCESS}`,
          }}
        />
        <Tab.Screen
          name="SalesSalesSecurityDepositListScreen4"
          component={SalesSalesSecurityDepositListScreen}
          initialParams={{type: 'paid'}}
          options={{
            tabBarLabel: `${label.SECURITY} ${label.PAID}`,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default SalesOrderTopTab;

const styles = StyleSheet.create({});
