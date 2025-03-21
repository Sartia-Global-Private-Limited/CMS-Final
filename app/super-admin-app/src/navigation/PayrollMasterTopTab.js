import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import SettingListScreen from '../screens/hr management/payrool master/SettingListScreen';
import CreateAllowanceScreen from '../screens/hr management/payrool master/CreateAllowanceScreen';
import CreateDeductionScreen from '../screens/hr management/payrool master/CreateDeductionScreen';
import ScreensLabel from '../constants/ScreensLabel';
const Tab = createMaterialTopTabNavigator();

const PayrollMasterTopTab = ({navigation}) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader headerTitle={label.PAYROLL_MASTER} />
      </View>
      <Tab.Navigator
        initialRouteName={{SettingListScreen}}
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
          name="SettingListScreen"
          component={SettingListScreen}
          initialParams={{type: 1}}
          options={{tabBarLabel: label.SETTINGS}}
        />
        <Tab.Screen
          name="CreateAllowanceScreen"
          component={CreateAllowanceScreen}
          initialParams={{type: 2}}
          options={{
            tabBarLabel: label.ALLOWANCES,
          }}
        />
        <Tab.Screen
          name="CreateDeductionScreen"
          component={CreateDeductionScreen}
          initialParams={{type: 2}}
          options={{
            tabBarLabel: label.DEDUCTIONS,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default PayrollMasterTopTab;

const styles = StyleSheet.create({});
