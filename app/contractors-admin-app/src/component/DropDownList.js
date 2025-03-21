import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Neomorph } from 'react-native-neomorph-shadows';
import { Icon } from '@rneui/themed';
import { Dropdown } from 'react-native-element-dropdown';
import Colors from '../constants/Colors';
import IconType from '../constants/IconType';
import DropDownItem from './DropDownItem';
import { WINDOW_WIDTH } from '../utils/ScreenLayout';

const NeumorphicDropDownList = ({
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
  search,
  editable,
  title,
  errorMessage,
  valueField,
  labelField,
  ...rest
}) => {
  return (
    <View style={{ rowGap: 2 }}>
      {title && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[
              styles.title,
              { color: Colors().pureBlack, marginLeft: 5 },
            ]}>
            {title}
          </Text>
          {required && (
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
              style={{ marginLeft: 5 }}
            />
          )}
        </View>
      )}

      <Neomorph
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
          height: height ? height : 45,
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
          borderColor: Colors().lightShadow,
          borderWidth: 1,
        }}>
        {LeftIconType || LeftIconColor || LeftIconName ? (
          <View style={{ justifyContent: 'center' }}>
            <Icon
              name={LeftIconName}
              size={15}
              type={LeftIconType}
              color={LeftIconColor ? LeftIconColor : 'black'}
              onPress={LeftIconPress}
            />
          </View>
        ) : null}

        <View style={styles.inputView}>
          <Dropdown
            mode="modal"
            labelField={labelField ? labelField : 'label'}
            valueField={valueField ? valueField : 'value'}
            search={search ? search : false}
            editable={editable ? editable : false}
            activeColor={Colors().skyBule}
            placeholder={`${placeHolderTxt || ''}  ...`}
            placeholderStyle={[styles.inputText, { color: Colors().pureBlack }]}
            selectedTextStyle={[
              styles.selectedTextStyle,
              { color: Colors().pureBlack },
            ]}
            style={[styles.inputText, { color: Colors().pureBlack }]}
            containerStyle={{
              backgroundColor: Colors().inputLightShadow,
              width: WINDOW_WIDTH * 0.8,
              borderRadius: 8,
              padding: 8,
            }}
            renderItem={item => <DropDownItem item={item} />}
            {...rest}
            maxHeight={300}
            renderRightIcon={() =>
              rest?.value ? (
                <Icon
                  name={'cancel'}
                  size={20}
                  type={IconType.MaterialIcons}
                  color={RightIconColor ? RightIconColor : Colors().red}
                  onPress={rest?.onCancle}
                />
              ) : (
                <Icon
                  name={'caretdown'}
                  size={12}
                  type={IconType.AntDesign}
                  color={RightIconColor ? RightIconColor : Colors().gray}
                />
              )
            }
          />
        </View>
      </Neomorph>
      {errorMessage && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text
            style={[
              styles.errorMesage,
              { marginLeft: 10, fontSize: 11, fontWeight: '500' },
            ]}>
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default NeumorphicDropDownList;

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
  selectedTextStyle: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    fontSize: 12,
  },
});
