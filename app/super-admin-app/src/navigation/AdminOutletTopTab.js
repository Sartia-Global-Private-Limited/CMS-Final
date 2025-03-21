import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import TutorialListingScreen from '../screens/tutorials/TutorialListingScreen';
import ScreensLabel from '../constants/ScreensLabel';
import {useSelector} from 'react-redux';
import AdminOutletListScreen from '../screens/energyCompanies/outlets/AdminOutletsListScreen';

const Tab = createMaterialTopTabNavigator();

const AdminOutletTopTab = () => {
  const label = ScreensLabel();
  const {isDarkMode} = useSelector(state => state.getDarkMode);
  useEffect(() => {}, [isDarkMode]);

  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader
          leftIconPress={() => {}}
          headerTitle={label.ALL_COMPLAINT}
        />
      </View>
      <Tab.Navigator
        initialRouteName={{TutorialListingScreen}}
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
          name="OutletScreen1"
          component={AdminOutletListScreen}
          initialParams={{type: 0}}
          options={{tabBarLabel: label.CREATE}}
        />
        <Tab.Screen
          name="OutletScreen2"
          component={AdminOutletListScreen}
          initialParams={{type: 1}}
          options={{
            tabBarLabel: label.REQUESTED,
          }}
        />
        <Tab.Screen
          name="OutletScreen3"
          component={AdminOutletListScreen}
          initialParams={{type: 2}}
          options={{tabBarLabel: label.APPROVED}}
        />
        <Tab.Screen
          name="OutletScreen4"
          component={AdminOutletListScreen}
          initialParams={{type: 3}}
          options={{tabBarLabel: label.REJECTED}}
        />
        <Tab.Screen
          name="OutletScreen5"
          component={AdminOutletListScreen}
          initialParams={{type: 'resolved'}}
          options={{tabBarLabel: label.RESOLVED}}
        />
      </Tab.Navigator>
    </>
  );
};

export default AdminOutletTopTab;

const styles = StyleSheet.create({});
