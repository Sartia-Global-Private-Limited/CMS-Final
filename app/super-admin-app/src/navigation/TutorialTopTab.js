import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import CustomeHeader from '../component/CustomeHeader';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Colors from '../constants/Colors';
import TutorialListingScreen from '../screens/tutorials/TutorialListingScreen';
import ScreensLabel from '../constants/ScreensLabel';
import {useSelector} from 'react-redux';

const Tab = createMaterialTopTabNavigator();

const TutorialTopTab = ({navigation}) => {
  const label = ScreensLabel();
  const {isDarkMode} = useSelector(state => state.getDarkMode);
  useEffect(() => {}, [isDarkMode]);

  return (
    <>
      <View style={{marginBottom: 1}}>
        <CustomeHeader leftIconPress={() => {}} headerTitle={label.TUTORIALS} />
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
          name="TutorialListingScreen1"
          component={TutorialListingScreen}
          initialParams={{type: 'all'}}
          options={{tabBarLabel: label.ALL}}
        />
        <Tab.Screen
          name="TutorialListingScreen2"
          component={TutorialListingScreen}
          initialParams={{type: 'audio'}}
          options={{
            tabBarLabel: label.AUDIO,
          }}
        />
        <Tab.Screen
          name="TutorialListingScreen3"
          component={TutorialListingScreen}
          initialParams={{type: 'video'}}
          options={{tabBarLabel: label.VIDEO}}
        />
        <Tab.Screen
          name="TutorialListingScreen4"
          component={TutorialListingScreen}
          initialParams={{type: 'text'}}
          options={{tabBarLabel: label.TEXT}}
        />
        <Tab.Screen
          name="TutorialListingScreen5"
          component={TutorialListingScreen}
          initialParams={{type: 'pdf'}}
          options={{tabBarLabel: label.PDF}}
        />
      </Tab.Navigator>
    </>
  );
};

export default TutorialTopTab;

const styles = StyleSheet.create({});
