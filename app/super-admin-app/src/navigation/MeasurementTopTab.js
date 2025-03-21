/*    ----------------Created Date :: 21- May -2024   ----------------- */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import MeasurementListingScreen from '../screens/billing management/measurements/MeasurementListingScreen';
import ScreensLabel from '../constants/ScreensLabel';
const Tab = createMaterialTopTabNavigator();

const MeasurementTopTab = ({navigation}) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader headerTitle={label.MEASUREMENTS} />
      </View>
      <Tab.Navigator
        initialRouteName={{MeasurementListingScreen}}
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
            margin: 1,
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
          name="MeasurementListingScreen1"
          component={MeasurementListingScreen}
          initialParams={{type: 'allcomplaint'}}
          options={{tabBarLabel: label.All_COMPLAINT}}
        />
        <Tab.Screen
          name="MeasurementListingScreen2"
          component={MeasurementListingScreen}
          initialParams={{type: 'ptm'}}
          options={{
            tabBarLabel: label.PROCESS_TO_MEASUREMENT,
          }}
        />
        <Tab.Screen
          name="MeasurementListingScreen3"
          component={MeasurementListingScreen}
          initialParams={{type: 'draft'}}
          options={{
            tabBarLabel: label.DRAFT,
          }}
        />
        <Tab.Screen
          name="MeasurementListingScreen5"
          component={MeasurementListingScreen}
          initialParams={{type: 'final'}}
          options={{
            tabBarLabel: label.FINAL,
          }}
        />
        <Tab.Screen
          name="MeasurementListingScreen4"
          component={MeasurementListingScreen}
          initialParams={{type: 'discard'}}
          options={{
            tabBarLabel: label.DISCARD,
          }}
        />

        <Tab.Screen
          name="MeasurementListingScreen6"
          component={MeasurementListingScreen}
          initialParams={{type: 'readytopi'}}
          options={{
            tabBarLabel: label.READY_TO_PI,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default MeasurementTopTab;

const styles = StyleSheet.create({});
