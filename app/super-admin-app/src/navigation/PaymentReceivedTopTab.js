import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
import PaymentReceivedListScreen from '../screens/billing management/payment received/PaymentReceivedListScreen';
const Tab = createMaterialTopTabNavigator();

const PaymentReceivedTopTab = ({navigation}) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader headerTitle={label.PAYMENT_RECEIVED} />
      </View>
      <Tab.Navigator
        // initialRouteName={{PaymentReceivedListScreen}}
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
          tabBarGap: 50,

          tabBarActiveTintColor: Colors().purple,
          tabBarInactiveTintColor: Colors().gray,
          tabBarStyle: {backgroundColor: Colors().screenBackground},

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
          name="PaymentReceivedListScreen1"
          component={PaymentReceivedListScreen}
          initialParams={{type: 'partial'}}
          options={{
            tabBarLabel: label.PARTIAL,
          }}
        />
        <Tab.Screen
          name="PaymentReceivedListScreen2"
          component={PaymentReceivedListScreen}
          initialParams={{type: 'done'}}
          options={{
            tabBarLabel: label.DONE,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default PaymentReceivedTopTab;

const styles = StyleSheet.create({});
