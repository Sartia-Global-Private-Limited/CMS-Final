import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Icon} from '@rneui/themed';
import IconType from '../constants/IconType';

const FloatingAddButton = ({backgroundColor, onPress}) => {
  return (
    <TouchableOpacity style={{position: 'absolute'}}>
      <Icon
        name="pluscircle"
        type={IconType.AntDesign}
        size={50}
        color={backgroundColor ? backgroundColor : 'null'}
        onPress={onPress}
      />
    </TouchableOpacity>
  );
};

export default FloatingAddButton;

const styles = StyleSheet.create({});
