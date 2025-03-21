import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
import AllBulkMessageListScreen from '../screens/contacts/all messages/AllBulkMessageListScreen';
const Tab = createMaterialTopTabNavigator();

const MessageTopTab = ({navigation}) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader headerTitle={label.MESSAGE} />
      </View>
      <Tab.Navigator
        // initialRouteName={{MeasurementListingScreen}}
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
          name="AllBulkMessageListScreen1"
          component={AllBulkMessageListScreen}
          initialParams={{type: 'all'}}
          options={{tabBarLabel: label.ALL_MESSAGES}}
        />
        <Tab.Screen
          name="AllBulkMessageListScreen2"
          component={AllBulkMessageListScreen}
          initialParams={{type: 'upcoming'}}
          options={{
            tabBarLabel: label.UPCOMING_MESSAGES,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default MessageTopTab;

const styles = StyleSheet.create({});
