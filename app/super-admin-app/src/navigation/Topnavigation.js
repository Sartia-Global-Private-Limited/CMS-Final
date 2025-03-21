import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ComplaintListing from '../screens/complaints/ComplaintListing';
// import TranstionList from '../Transctions/TranstionList';
const Tab = createMaterialTopTabNavigator();

const Topnavigation = ({}) => {
  return (
    <Tab.Navigator
      sceneContainerStyle={{
        backgroundColor: '#d1dfff',
        margin: 0,
      }}
      screenOptions={() => ({
        tabBarActiveTintColor: '#7C7C7C',
        tabBarInactiveTintColor: '#7C7C7C',
        tabBarStyle: {backgroundColor: '#FFF', height: 50},
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
        },
        indicatorStyle: {backgroundColor: '#987', opacity: 0.05},
        tabBarLabelStyle: {
          textAlign: 'center',
          fontSize: 12,
          backgroundColor: 'red',
          height: 30,
          width: 70,
        },
        tabBarIndicatorStyle: {
          borderBottomColor: 'red',
          borderBottomWidth: 2,
        },
        style: {backgroundColor: '#ffffff'},
        tabBarLabelStyle: {
          fontSize: 12,
          textAlign: 'center',
          fontWeight: 'bold',
          fontFamily: 'Montserrat-VariableFont_wght',
        },
      })}>
      <Tab.Screen
        name="All"
        component={ComplaintListing}
        initialParams={{type: ''}}
      />
      <Tab.Screen
        name="Sent"
        component={ComplaintListing}
        initialParams={{type: 3}}
      />
      <Tab.Screen
        name="Recieve"
        component={ComplaintListing}
        initialParams={{type: 2}}
      />
      <Tab.Screen
        name="Cash"
        component={ComplaintListing}
        initialParams={{type: 1}}
      />
    </Tab.Navigator>
  );
};

export default Topnavigation;

const styles = StyleSheet.create({});
