/*    ----------------Created Date :: 30- April -2024   ----------------- */

import { StyleSheet, Text } from 'react-native';
import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Home from '../screens/dashboard/Home';
import ProfileScreen from '../screens/profile/ProfileScreen';
import TutorialTopTab from './TutorialTopTab';
import StoryHomeScreen from '../screens/StoriesFlow/StoryHomeScreen';
import { Icon } from '@rneui/themed';
import IconType from '../constants/IconType';
import Colors from '../constants/Colors';
import { WINDOW_WIDTH } from '../utils/ScreenLayout';
import ScreensLabel from '../constants/ScreensLabel';

const BottomTabNavigation = () => {
  const Tab = createMaterialBottomTabNavigator();
  const label = ScreensLabel();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      shifting={true}
      style={{ backgroundColor: Colors().screenBackground }}
      activeColor={'white'}
      // inactiveColor={Colors().gray2}
      barStyle={{
        backgroundColor: '#8960f0',
        position: 'absolute',
        overflow: 'hidden',
        height: 70,
        borderTopLeftRadius: WINDOW_WIDTH * 0.08,
        borderTopRightRadius: WINDOW_WIDTH * 0.08,
      }}>
      <Tab.Screen
        name="StoryHomeScreen"
        component={StoryHomeScreen}
        options={{
          tabBarLabel: (
            <Text
              style={{
                fontFamily: Colors().fontFamilyBookMan,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}>
              {label.STORIES}
            </Text>
          ),
          tabBarIcon: () => (
            <Icon name="web-stories" type={IconType.MaterialIcons} />
          ),
        }}
      />
      <Tab.Screen
        name="TutorialTopTab"
        component={TutorialTopTab}
        options={{
          tabBarLabel: (
            <Text
              style={{
                fontFamily: Colors().fontFamilyBookMan,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}>
              {label.TUTORIALS}
            </Text>
          ),
          tabBarIcon: () => (
            <Icon
              name="leanpub"
              type={IconType.FontAwesome}
              //   color={Colors().gray2}
            />
          ),
          tabBarColor: Colors().pending,
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: (
            <Text
              style={{
                fontFamily: Colors().fontFamilyBookMan,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}>
              {label.HOME}
            </Text>
          ),
          tabBarIcon: () => (
            <Icon
              name="home"
              type={IconType.MaterialIcons}
              //   color={Colors().gray2}
            />
          ),
        }}
      />

      <Tab.Screen
        name="ProfileScreen"
        component={ProfileScreen}
        options={{
          tabBarLabel: (
            <Text
              style={{
                fontFamily: Colors().fontFamilyBookMan,
                textAlign: 'center',
                textTransform: 'uppercase',
              }}>
              {label.SETTING}
            </Text>
          ),
          tabBarIcon: () => (
            <Icon
              name="settings"
              type={IconType.MaterialIcons}
              //   color={Colors().purple}
            />
          ),
          tabBarColor: Colors().pending,
        }}
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigation;

const styles = StyleSheet.create({});
