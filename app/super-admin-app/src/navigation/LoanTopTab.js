import React from 'react';
import {View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import LoanListScreen from '../screens/hr management/loan/LoanListScreen';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
// import TranstionList from '../Transctions/TranstionList';
const Tab = createMaterialTopTabNavigator();

const LoanTopTab = ({navigation}) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader headerTitle={label.LOAN} />
      </View>
      <Tab.Navigator
        initialRouteName={{}}
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
          name="LoanListScreen1"
          component={LoanListScreen}
          initialParams={{type: 'pending'}}
          options={{tabBarLabel: label.PENDING}}
        />
        <Tab.Screen
          name="LoanListScreen2"
          component={LoanListScreen}
          initialParams={{type: 'active'}}
          options={{
            tabBarLabel: label.ACTIVE,
          }}
        />
        <Tab.Screen
          name="LoanListScreen3"
          component={LoanListScreen}
          initialParams={{type: 'reject'}}
          options={{tabBarLabel: label.REJECTED}}
        />
        <Tab.Screen
          name="ClosedLoanListScreen4"
          component={LoanListScreen}
          initialParams={{type: 'closed'}}
          options={{tabBarLabel: label.CLOSED}}
        />
      </Tab.Navigator>
    </>
  );
};

export default LoanTopTab;
