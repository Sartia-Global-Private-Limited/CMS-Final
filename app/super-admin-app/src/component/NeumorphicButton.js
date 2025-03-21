import {StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import {Neomorph} from 'react-native-neomorph-shadows';
import {Icon} from '@rneui/themed';
import LottieView from 'lottie-react-native';
import Images from '../constants/Images';
import Colors from '../constants/Colors';

const NeumorphicButton = ({
  onPress,
  title,
  titleColor,
  iconName,
  iconType,
  iconColor,
  btnHeight,
  btnWidth,
  btnRadius,
  loading,
  btnBgColor,
  disabled,
  fontSize,
  style,
}) => {
  return (
    <Neomorph
      darkShadowColor={Colors().darkShadow}
      lightShadowColor={Colors().lightShadow}
      style={{
        ...style,
        shadowOpacity: 0.8,
        shadowRadius: 10,
        borderRadius: btnRadius ? btnRadius : 50,
        backgroundColor: btnBgColor ? btnBgColor : Colors().cardBackground,
        width: btnWidth ? btnWidth : 200,
        height: btnHeight ? btnHeight : 50,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors().lightShadow,
        borderWidth: 1,
      }}>
      <LottieView source={Images.DOT_LOADER} autoPlay={true} />
      {loading ? (
        <LottieView
          source={Images.DOT_LOADER}
          autoPlay
          loop
          style={{height: 80, width: 80}}
        />
      ) : (
        <TouchableOpacity
          disabled={disabled}
          style={{flexDirection: 'row'}}
          onPress={onPress}>
          <Text
            style={{
              color: titleColor ? titleColor : 'black',
              fontWeight: '600',
              fontSize: fontSize ? fontSize : 18,
              fontFamily: Colors().fontFamilyBookMan,
              textTransform: 'uppercase',
              textAlign: 'center',
            }}>
            {title}
          </Text>
          {iconType || iconColor || iconName ? (
            <Icon
              name={iconName}
              size={20}
              type={iconType}
              color={iconColor ? iconColor : Colors().purple}
              style={{marginLeft: 10}}
            />
          ) : null}
        </TouchableOpacity>
      )}
    </Neomorph>
  );
};

export default NeumorphicButton;

const styles = StyleSheet.create({});
