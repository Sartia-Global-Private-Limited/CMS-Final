import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import RequestedLeaveScreen from '../screens/hr management/leaves/RequestedLeaveScreen';
import RejectedLeaveScreen from '../screens/hr management/leaves/RejectedLeaveScreen';
import ApprovedLeaveScreen from '../screens/hr management/leaves/ApprovedLeaveScreen';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
const Tab = createMaterialTopTabNavigator();

const LeaveTopTab = ({navigation}) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader headerTitle={label.LEAVE} />
      </View>
      <Tab.Navigator
        initialRouteName={{RequestedLeaveScreen}}
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
            textAlign: 'center',
            fontWeight: '600',
            fontFamily: Colors().fontFamilyBookMan,
          },
        })}>
        <Tab.Screen
          name="RequestedLeaveScreen"
          component={RequestedLeaveScreen}
          initialParams={{type: 1}}
          options={{tabBarLabel: label.REQUESTED}}
        />
        <Tab.Screen
          name="ApprovedLeaveScreen"
          component={ApprovedLeaveScreen}
          initialParams={{type: 2}}
          options={{
            tabBarLabel: label.APPROVED,
          }}
        />
        <Tab.Screen
          name="RejectedLeaveScreen"
          component={RejectedLeaveScreen}
          initialParams={{type: 3}}
          options={{tabBarLabel: label.REJECTED}}
        />
      </Tab.Navigator>
    </>
  );
};

export default LeaveTopTab;

const styles = StyleSheet.create({});
