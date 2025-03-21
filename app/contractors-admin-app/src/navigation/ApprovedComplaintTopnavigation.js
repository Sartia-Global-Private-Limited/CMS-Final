import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AssignedComplaintScreen from '../screens/complaints/AssignedComplaintScreen';
import UnAssignedComplaintScreen from '../screens/complaints/UnAssignedComplaintScreen';
import AllApprovedComplaintScreen from '../screens/complaints/AllApprovedComplaintScreen';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
const Tab = createMaterialTopTabNavigator();

const ApprovedComplaintTopnavigation = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.APPROVED_COMPLAINT} />
      </View>
      <Tab.Navigator
        initialRouteName={{ UnAssignedComplaintScreen }}
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
          name="RequestCompUnAssignedComplaintScreenlaintScreen"
          component={UnAssignedComplaintScreen}
          initialParams={{ type: 1 }}
          options={{ tabBarLabel: label.UN_ASSIGN }}
        />
        <Tab.Screen
          name="AssignedComplaintScreen"
          component={AssignedComplaintScreen}
          initialParams={{ type: 2 }}
          options={{
            tabBarLabel: label.ASSIGN,
          }}
        />
        <Tab.Screen
          name="AllApprovedComplaintScreen"
          component={AllApprovedComplaintScreen}
          initialParams={{ type: 3 }}
          options={{ tabBarLabel: label.ALL }}
        />
      </Tab.Navigator>
    </>
  );
};

export default ApprovedComplaintTopnavigation;

const styles = StyleSheet.create({});
