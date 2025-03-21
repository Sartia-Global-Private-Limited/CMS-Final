import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Icon} from '@rneui/themed';
import {MultiSelect} from 'react-native-element-dropdown';
import Colors from '../constants/Colors';
import IconType from '../constants/IconType';
import DropDownItem from './DropDownItem';
import {Neomorph, NeomorphFlex} from 'react-native-neomorph-shadows';
import {WINDOW_WIDTH} from '../utils/ScreenLayout';

const MultiSelectComponent = ({
  placeHolderTxt,
  placeHolderTxtColor,
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
  required,
  title,
  errorMessage,
  valueField,
  labelField,
  ...rest
}) => {
  return (
    <View
      style={{
        rowGap: 2,
      }}>
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

      <NeomorphFlex
        inner={true}
        darkShadowColor={Colors().darkShadow}
        lightShadowColor={Colors().lightShadow}
        style={{
          margin: 1,
          shadowRadius: 4,
          shadowOpacity: 0.8,
          borderRadius: 7,
          backgroundColor: rest?.disable
            ? Colors().darkShadow2
            : Colors().cardBackground,
          width: width ? width : WINDOW_WIDTH * 0.9,
          minHeight: 50,
          maxHeight: 300,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          borderColor: Colors().lightShadow,
          borderWidth: 1,
        }}>
        {LeftIconType || LeftIconColor || LeftIconName ? (
          <View style={{justifyContent: 'center'}}>
            <Icon
              name={LeftIconName}
              size={20}
              type={LeftIconType}
              color={LeftIconColor ? LeftIconColor : 'black'}
              onPress={LeftIconPress}
            />
          </View>
        ) : null}

        <View style={styles.inputView}>
          <MultiSelect
            labelField={labelField ? labelField : 'label'}
            valueField={valueField ? valueField : 'value'}
            activeColor={Colors().skyBule}
            placeholder={`Select  ${placeHolderTxt || ''}...`}
            placeholderStyle={[styles.inputText, {color: Colors().pureBlack}]}
            selectedTextStyle={[
              styles.selectedTextStyle,
              {color: Colors().pureBlack},
            ]}
            style={[styles.inputText, {color: Colors().pureBlack}]}
            containerStyle={{
              backgroundColor: Colors().inputLightShadow,
              width: WINDOW_WIDTH * 0.9,
              borderRadius: 8,
              padding: 8,
            }}
            selectedStyle={styles.selectedStyle}
            renderItem={item => <DropDownItem item={item}></DropDownItem>}
            {...rest}
            maxHeight={300}
            renderRightIcon={() => (
              <Icon
                name={'caretdown'}
                size={12}
                type={IconType.AntDesign}
                color={RightIconColor ? RightIconColor : Colors().gray}
              />
            )}
          />
        </View>
      </NeomorphFlex>

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

export default MultiSelectComponent;

const styles = StyleSheet.create({
  inputView: {
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    justifyContent: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  inputText: {
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  selectedStyle: {
    borderRadius: 12,
    textTransform: 'uppercase',
  },
  selectedTextStyle: {
    fontSize: 12,
    color: Colors().purple,
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
