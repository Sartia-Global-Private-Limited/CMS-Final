import React from 'react';
import {Pressable, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';

const Tab = createMaterialTopTabNavigator();

const TopTabNavigator = ({screens, swipable = true}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <Tab.Navigator
        sceneContainerStyle={{
          backgroundColor: Colors().screenBackground,
        }}
        screenOptions={({route}) => {
          return {
            lazyPreloadDistance: 0,
            swipeVelocityImpact: 0.1,
            springVelocityScale: 1,
            lazy: true,
            swipeEnabled: swipable,
            tabBarScrollEnabled: true,
            tabBarActiveTintColor: Colors()?.purple,
            tabBarInactiveTintColor: Colors()?.screenBackground,
            tabBarLabelStyle: styles.tabBarLabel,
            tabBarItemStyle: styles.tabBarItem,
            tabBarStyle: styles.tabBar,
            tabBarPressColor: 'transparent',
            tabBarActiveStyle: styles.tabBarActive,
            unmountOnBlur: true,
            tabBarGap: 0,
            tabBarPressOpacity: 0,
            tabBarIndicatorStyle: styles.tabBarIndicator,
            tabBarIndicatorContainerStyle: styles.tabBarIndicatorContainer,
            tabBarLabel: ({focused}) => (
              <Pressable
                style={{
                  ...styles?.tabButton,
                  backgroundColor: focused
                    ? Colors().purple
                    : Colors().screenBackground,
                }}>
                <View style={{}}>
                  <Text
                    style={[
                      styles.tabButtonText,
                      {
                        color: focused
                          ? Colors()?.screenBackground
                          : Colors()?.purple,
                      },
                    ]}>
                    {route?.name}
                  </Text>
                </View>
              </Pressable>
            ),
          };
        }}>
        {screens?.map((screen, index) => (
          <Tab.Screen
            key={index}
            name={screen?.name}
            component={screen?.component}
            initialParams={screen?.initialParams}
          />
        ))}
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export default TopTabNavigator;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  tabBarLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors()?.purple,
    fontFamily: Colors().fontFamilyBookMan,
  },
  tabBarItem: {
    width: 'auto',
    elevation: 1,
  },
  tabBar: {
    backgroundColor: Colors()?.screenBackground,
  },
  tabBarActive: {
    elevation: 0.8,
    backgroundColor: Colors()?.purple,
  },
  tabBarIndicator: {
    borderColor: Colors()?.screenBackground,
    borderWidth: 1,
  },
  tabBarIndicatorContainer: {
    width: 'auto',
  },
  tabButton: {
    padding: 10,
    borderRadius: 8,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
