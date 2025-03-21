import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import TutorialListingScreen from '../screens/tutorials/TutorialListingScreen';
import ScreensLabel from '../constants/ScreensLabel';
import {useSelector} from 'react-redux';
import ComplaintListScreen from '../screens/AllComplaints/ComplaintListScreen';
import SetApprovalComplaints from '../screens/AllComplaints/SetApprovalComplaints';

const Tab = createMaterialTopTabNavigator();

const ComplaintsTopTab = () => {
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
          name="RequestComplaintScreen1"
          component={ComplaintListScreen}
          initialParams={{type: 'new'}}
          options={{tabBarLabel: label.NEW}}
        />
        <Tab.Screen
          name="RequestComplaintScreen2"
          component={ComplaintListScreen}
          initialParams={{type: 'pending'}}
          options={{
            tabBarLabel: label.PENDING,
          }}
        />
        <Tab.Screen
          name="AllApprovedComplaintScreen"
          component={ComplaintListScreen}
          initialParams={{type: 'approved'}}
          options={{tabBarLabel: label.APPROVED}}
        />
        <Tab.Screen
          name="RejectedComplaintScreen"
          component={ComplaintListScreen}
          initialParams={{type: 'rejected'}}
          options={{tabBarLabel: label.REJECTED}}
        />
        <Tab.Screen
          name="ResolvedComplaintScreen"
          component={ComplaintListScreen}
          initialParams={{type: 'resolved'}}
          options={{tabBarLabel: label.RESOLVED}}
        />
        <Tab.Screen
          name="setApproval"
          component={SetApprovalComplaints}
          initialParams={{type: ''}}
          options={{tabBarLabel: label.SET_APPROVAL}}
        />
      </Tab.Navigator>
    </>
  );
};

export default ComplaintsTopTab;

const styles = StyleSheet.create({});
