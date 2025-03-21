/*    ----------------Created Date :: 6- August -2024   ----------------- */

import React from 'react';
import {StyleSheet, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import ScreensLabel from '../constants/ScreensLabel';
import ItemMasterItemListScreen from '../screens/item master/item list/ItemMasterListScreen';
const Tab = createMaterialTopTabNavigator();

const ItemMasterTopTab = ({navigation}) => {
  const label = ScreensLabel();
  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader headerTitle={label.ITEM_MASTER} />
      </View>
      <Tab.Navigator
        // initialRouteName={{ItemMasterItemListScreen}}
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
          name="ItemMasterItemListScreen1"
          component={ItemMasterItemListScreen}
          initialParams={{type: 'fund'}}
          options={{
            tabBarLabel: label.FUND_ITEM,
          }}
        />
        <Tab.Screen
          name="ItemMasterItemListScreen2"
          component={ItemMasterItemListScreen}
          initialParams={{type: 'stock'}}
          options={{
            tabBarLabel: label.STOCK_ITEM,
          }}
        />

        <Tab.Screen
          name="ItemMasterItemListScreen3"
          component={ItemMasterItemListScreen}
          initialParams={{type: 'all'}}
          options={{
            tabBarLabel: label.ALL_ITEMS,
          }}
        />
      </Tab.Navigator>
    </>
  );
};

export default ItemMasterTopTab;

const styles = StyleSheet.create({});
