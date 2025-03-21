import {StyleSheet, View} from 'react-native';
import React from 'react';

const SeparatorComponent = ({
  separatorColor,
  separatorWidth,
  separatorHeight,
}) => {
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: separatorColor ? separatorColor : 'black',

          width: separatorWidth ? separatorWidth : '100%',
          height: separatorHeight ? separatorHeight : '0.1%',
        },
      ]}></View>
  );
};

export default SeparatorComponent;

const styles = StyleSheet.create({});
