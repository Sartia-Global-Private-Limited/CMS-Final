import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
import MTPIListScreen from '../screens/billing management/merge to pi/MTPIListScreen';
const Tab = createMaterialTopTabNavigator();

const MTPIToptab = ({navigation}) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader headerTitle={label.MERGED_TO_PI} />
      </View>
      <Tab.Navigator
        // initialRouteName={{MTPIListScreen}}
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
          name="MTPIListScreen1"
          component={MTPIListScreen}
          initialParams={{type: 'readytomergepi'}}
          options={{
            tabBarLabel: label.READY_TO_MERGE_PI,
          }}
        />
        <Tab.Screen
          name="MTPIListScreen2"
          component={MTPIListScreen}
          initialParams={{type: 'final'}}
          options={{
            tabBarLabel: label.FINAL,
          }}
        />

        <Tab.Screen
          name="MTPIListScreen3"
          component={MTPIListScreen}
          initialParams={{type: 'discard'}}
          options={{
            tabBarLabel: label.DISCARD,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default MTPIToptab;

const styles = StyleSheet.create({});
