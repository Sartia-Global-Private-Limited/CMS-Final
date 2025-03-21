import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Neomorph} from 'react-native-neomorph-shadows';

import {Icon} from '@rneui/themed';
import Colors from '../constants/Colors';

const NeumorphicCheckbox = ({isChecked, onChange, height, width, bgColor}) => {
  return (
    <TouchableOpacity onPress={() => onChange(!isChecked)}>
      <Neomorph
        inner
        darkShadowColor={Colors().darkShadow}
        lightShadowColor={Colors().lightShadow}
        style={{
          shadowRadius: 4,
          shadowOpacity: 0.8,
          borderRadius: 5,
          backgroundColor: bgColor ? bgColor : Colors().cardBackground,
          width: width ? width : 30, //30
          height: height ? height : 30, //30
          borderColor: Colors().lightShadow,
          borderWidth: 1,
        }}>
        <Icon
          style={{alignSelf: 'center'}}
          name={isChecked ? 'check' : null}
          type="antdesign"></Icon>
      </Neomorph>
    </TouchableOpacity>
  );
};

export default NeumorphicCheckbox;

const styles = StyleSheet.create({});
