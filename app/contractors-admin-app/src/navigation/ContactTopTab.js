import React from 'react';
import { StyleSheet, View } from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
import ContactListScreen from '../screens/contacts/all contact/ContactListScreen';
const Tab = createMaterialTopTabNavigator();

const ContactTopTab = ({ navigation }) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.CONTACT} />
      </View>
      <Tab.Navigator
        // initialRouteName={{ContactListScreen}}
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
          name="ContactListScreen1"
          component={ContactListScreen}
          initialParams={{ type: 'company' }}
          options={{
            tabBarLabel: label.COMPANY_CONTACT,
          }}
        />
        <Tab.Screen
          name="ContactListScreen2"
          component={ContactListScreen}
          initialParams={{ type: 'dealer' }}
          options={{
            tabBarLabel: label.DEALER_CONTACT,
          }}
        />

        <Tab.Screen
          name="ContactListScreen3"
          component={ContactListScreen}
          initialParams={{ type: 'supplier' }}
          options={{
            tabBarLabel: label.SUPPLIER_CONTACT,
          }}
        />
        <Tab.Screen
          name="ContactListScreen4"
          component={ContactListScreen}
          initialParams={{ type: 'client' }}
          options={{
            tabBarLabel: label.CLIENT_CONTACT,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default ContactTopTab;

const styles = StyleSheet.create({});
