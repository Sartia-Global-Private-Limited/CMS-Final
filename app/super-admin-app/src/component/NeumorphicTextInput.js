import {StyleSheet, Text, View, TextInput} from 'react-native';
import React from 'react';
import {Neomorph} from 'react-native-neomorph-shadows';
import {Icon} from '@rneui/themed';
import Colors from '../constants/Colors';
import IconType from '../constants/IconType';
import {WINDOW_WIDTH} from '../utils/ScreenLayout';

const NeumorphicTextInput = ({
  withoutShadow,
  title,
  required,
  errorMessage,
  LeftIconType,
  LeftIconName,
  LeftIconColor,
  LeftIconPress,
  RightIconType,
  RightIconName,
  RightIconColor,
  RightIconPress,
  height,
  width,
  ...rest
}) => {
  // Construct the style object conditionally
  const neomorphStyle = {
    margin: 1,
    shadowRadius: 4,
    shadowOpacity: 0.8,
    borderRadius: 8,
    width: width ? width : WINDOW_WIDTH * 0.9,
    height: height ? height : 45,
    flexDirection: 'row',
    backgroundColor: Colors().cardBackground,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    borderColor: Colors().lightShadow,
    borderWidth: 1,
  };

  // Conditionally add backgroundColor to the style object
  // if (!withoutShadow) {
  //   neomorphStyle.backgroundColor =
  //     rest?.editable === undefined
  //       ? Colors().texInputBackground
  //       : rest?.editable
  //       ? Colors().texInputBackground
  //       : Colors().darkShadow2;
  // }

  return (
    <View style={{rowGap: 0}}>
      {title && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={[styles.title, {color: Colors().pureBlack, marginLeft: 5}]}>
            {title}
          </Text>
          {required && (
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
              style={{marginLeft: 5}}
            />
          )}
        </View>
      )}
      <Neomorph
        {...(!withoutShadow && {inner: true})}
        darkShadowColor={Colors().inputDarkShadow} // <- set this
        lightShadowColor={Colors().inputLightShadow} // <- this
        style={neomorphStyle}>
        {LeftIconType || LeftIconColor || LeftIconName ? (
          <View style={{justifyContent: 'center'}}>
            <Icon
              name={LeftIconName}
              size={16}
              type={LeftIconType}
              color={LeftIconColor ? LeftIconColor : 'black'}
              onPress={LeftIconPress}
            />
          </View>
        ) : null}

        <View style={styles.inputView}>
          <TextInput
            placeholder={'TYPE ...'}
            placeholderTextColor={Colors().pureBlack}
            {...rest}
            style={[styles.inputText, {color: Colors().pureBlack}]}></TextInput>
        </View>
        {RightIconType || RightIconColor || RightIconName ? (
          <View
            style={{
              alignItems: 'center',
              // backgroundColor: 'green',
              justifyContent: 'center',
            }}>
            <Icon
              name={RightIconName}
              size={16}
              type={RightIconType}
              color={RightIconColor ? RightIconColor : 'black'}
              onPress={RightIconPress}
            />
          </View>
        ) : null}
      </Neomorph>
      {errorMessage && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={[
              styles.errorMesage,
              {marginLeft: 10, fontSize: 11, fontWeight: '500'},
            ]}>
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default NeumorphicTextInput;

const styles = StyleSheet.create({
  inputView: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    justifyContent: 'center',
  },
  icon: {
    width: 20,
    height: 20,
  },
  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  inputText: {
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
