/*    ----------------Created Date :: 5- Feb -2024    ----------------- */
import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import RequestResignationScreen from '../screens/hr management/resingation/RequestResignationScreen';
import ApprovedResignationScreen from '../screens/hr management/resingation/ApprovedResignationScreen';
import RejectedResignationScreen from '../screens/hr management/resingation/RejectedResignationScreen';
import FnfResignationScreen from '../screens/hr management/resingation/FnfResignationScreen';
import Colors from '../constants/Colors';

const Tab = createMaterialTopTabNavigator();

const EmpResignationTopTab = ({navigation}) => {
  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader headerTitle={`Resignation`} />
      </View>
      <Tab.Navigator
        initialRouteName={{RequestResignationScreen}}
        sceneContainerStyle={{
          backgroundColor: '#d1dfff',
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
            // height: 30,
            // width: 70,
          },
          tabBarIndicatorStyle: {
            borderBottomColor: Colors().purple,
            borderBottomWidth: 2,
          },
          style: {backgroundColor: '#ffffff'},
          tabBarLabelStyle: {
            fontSize: 13,
            fontFamily: Colors().fontFamilyBookMan,
            textAlign: 'center',
            fontWeight: 'bold',
          },
        })}>
        <Tab.Screen
          name="RequestResignationScreen"
          component={RequestResignationScreen}
          initialParams={{type: 1}}
          options={{tabBarLabel: 'Request'}}
        />
        <Tab.Screen
          name="ApprovedResignationScreen"
          component={ApprovedResignationScreen}
          initialParams={{type: 2}}
          options={{
            tabBarLabel: 'Approval',
          }}
        />
        <Tab.Screen
          name="RejectedResignationScreen"
          component={RejectedResignationScreen}
          initialParams={{type: 3}}
          options={{tabBarLabel: 'Rejected'}}
        />
        <Tab.Screen
          name="FnfResignationScreen"
          component={FnfResignationScreen}
          initialParams={{type: 3}}
          options={{tabBarLabel: 'FNF statement'}}
        />
      </Tab.Navigator>
    </>
  );
};

export default EmpResignationTopTab;

const styles = StyleSheet.create({});
