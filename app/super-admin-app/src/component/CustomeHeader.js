import {StyleSheet, TouchableOpacity, Text, View} from 'react-native';
import React from 'react';
import {Header, Icon} from '@rneui/base';
import Colors from '../constants/Colors';
import IconType from '../constants/IconType';
import {useNavigation} from '@react-navigation/native';

const CustomeHeader = ({
  lefIconName,
  lefIconType,
  rightIconName,
  rightIcontype,
  headerTitle,
  leftIconPress,
  rightIconPress,
}) => {
  const navigation = useNavigation();

  return (
    <Header
      leftComponent={
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={
              leftIconPress
                ? leftIconPress
                : () => {
                    navigation.goBack();
                  }
            }>
            <Icon
              name={lefIconName ? lefIconName : 'chevron-back'}
              type={lefIconType ? lefIconType : IconType.Ionicons}
              color={Colors().black2}
            />
          </TouchableOpacity>
        </View>
      }
      centerComponent={
        <View
          style={{
            height: 'auto',
            width: '120%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            numberOfLines={1}
            style={[styles.headeText, {color: Colors().pureBlack}]}>
            {headerTitle}
          </Text>
        </View>
      }
      centerContainerStyle={{}}
      rightComponent={
        <View style={styles.headerRight}>
          <TouchableOpacity
            onPress={
              rightIconPress
                ? rightIconPress
                : () => {
                    navigation.navigate('Home');
                  }
            }>
            <Icon
              name={rightIconName ? rightIconName : 'home'}
              type={rightIcontype ? rightIcontype : IconType.AntDesign}
              color={Colors().purple}
            />
          </TouchableOpacity>
        </View>
      }
      containerStyle={{
        backgroundColor: Colors().screenBackground,
        justifyContent: 'space-around',
        borderBottomColor: Colors().headerBottom,
        borderBottomWidth: 0.5,
      }}
    />
  );
};

export default CustomeHeader;

const styles = StyleSheet.create({
  headeText: {
    fontSize: 15,
    textAlign: 'center',
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
