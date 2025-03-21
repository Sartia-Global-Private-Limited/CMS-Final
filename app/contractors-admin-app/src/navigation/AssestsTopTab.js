import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
import AssetsListScreen from '../screens/assests mangement/AssetsListScreen';
const Tab = createMaterialTopTabNavigator();

const AssestsTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.ASSESTS_MANAGEMENT} />
      </View>
      <Tab.Navigator
        // initialRouteName={{AssetsListScreen}}
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
          name="AssetsListScreen1"
          component={AssetsListScreen}
          initialParams={{ type: 'requested' }}
          options={{
            tabBarLabel: label.REQUESTED,
          }}
        />
        <Tab.Screen
          name="AssetsListScreen2"
          component={AssetsListScreen}
          initialParams={{ type: 'approved' }}
          options={{
            tabBarLabel: label.APPROVED,
          }}
        />

        <Tab.Screen
          name="AssetsListScreen3"
          component={AssetsListScreen}
          initialParams={{ type: 'reject' }}
          options={{
            tabBarLabel: label.REJECTED,
          }}
        />
        <Tab.Screen
          name="AssetsListScreen4"
          component={AssetsListScreen}
          initialParams={{ type: 'assinged' }}
          options={{
            tabBarLabel: label.ASSIGN,
          }}
        />
        <Tab.Screen
          name="AssetsListScreen5"
          component={AssetsListScreen}
          initialParams={{ type: 'repair' }}
          options={{
            tabBarLabel: label.REPAIR,
          }}
        />
        <Tab.Screen
          name="AssetsListScreen6"
          component={AssetsListScreen}
          initialParams={{ type: 'scrap' }}
          options={{
            tabBarLabel: label.SCRAP,
          }}
        />
        <Tab.Screen
          name="AssetsListScreen7"
          component={AssetsListScreen}
          initialParams={{ type: 'all' }}
          options={{
            tabBarLabel: label.ALL,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default AssestsTopTab;

const styles = StyleSheet.create({});
