/*    ----------------Created Date :: 26- July -2024   ----------------- */
import {StyleSheet, View} from 'react-native';
import React from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import Colors from '../constants/Colors';
import DropDownItem from './DropDownItem';
import {Icon} from '@rneui/themed';
import IconType from '../constants/IconType';

const CardDropDown = ({data, required, onChange, value, title, ...rest}) => {
  return (
    <View style={styles.twoItemView}>
      <View style={{flex: 1, height: 'auto'}}>
        <Dropdown
          mode="modal"
          data={data}
          placeholder={'select...'}
          labelField={'label'}
          valueField={'value'}
          iconColor={Colors().pureBlack}
          value={value}
          activeColor={Colors().skyBule}
          renderItem={item => <DropDownItem item={item}></DropDownItem>}
          placeholderStyle={[styles.inputText, {color: Colors().pureBlack}]}
          selectedTextStyle={[
            styles.selectedTextStyle,
            {color: Colors().pureBlack},
          ]}
          style={[styles.inputText, {color: Colors().pureBlack}]}
          containerStyle={{
            padding: 10,
            backgroundColor: Colors().cardBackground,
            borderRadius: 8,
          }}
          onChange={onChange}
          {...rest}
        />
      </View>
      {required && !value && (
        <View style={{alignSelf: 'center'}}>
          <Icon
            name="asterisk"
            type={IconType.FontAwesome5}
            size={8}
            color={Colors().red}
          />
        </View>
      )}
    </View>
  );
};

export default CardDropDown;

const styles = StyleSheet.create({
  twoItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    flexShrink: 1,
    fontFamily: Colors().fontFamilyBookMan,
  },
  dropdown: {
    marginLeft: 10,
    flex: 1,
  },
  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
  },
  selectedTextStyle: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  iconStyle: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
});
