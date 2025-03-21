import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
import PerformaInvoiceListScreen from '../screens/billing management/performa invoice/PerformaInvoiceListScreen';

const Tab = createMaterialTopTabNavigator();

const PerformaInvoiceTopTab = ({navigation}) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader headerTitle={label.PERFORMA_INVOICE} />
      </View>
      <Tab.Navigator
        // initialRouteName={{PerformaInvoiceListScreen}}
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
          name="PerformaInvoiceListScreen1"
          component={PerformaInvoiceListScreen}
          initialParams={{type: 'readytopi'}}
          options={{
            tabBarLabel: label.READY_TO_PI,
          }}
        />
        <Tab.Screen
          name="PerformaInvoiceListScreen2"
          component={PerformaInvoiceListScreen}
          initialParams={{type: 'performainvoice'}}
          options={{
            tabBarLabel: label.PERFORMA_INVOICE,
          }}
        />
        <Tab.Screen
          name="PerformaInvoiceListScreen3"
          component={PerformaInvoiceListScreen}
          initialParams={{type: 'final'}}
          options={{
            tabBarLabel: label.FINAL,
          }}
        />

        <Tab.Screen
          name="PerformaInvoiceListScreen4"
          component={PerformaInvoiceListScreen}
          initialParams={{type: 'discard'}}
          options={{
            tabBarLabel: label.DISCARD,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default PerformaInvoiceTopTab;

const styles = StyleSheet.create({});
