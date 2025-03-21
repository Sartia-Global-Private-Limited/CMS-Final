import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import React from 'react';

const ButtonComponent = ({title, textColor, borderRadius, height, width}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          height: height ? height : 40,
          width: width ? width : '100%',
          borderRadius: borderRadius ? borderRadius : 40,
        },
      ]}>
      <Text style={[styles.text, {color: textColor ? textColor : 'black'}]}>
        {title && title}
      </Text>
      <Image source={require('../assests/images/logInArrow.png')} />
    </TouchableOpacity>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8ECF0',
    shadowColor: 'red',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 17,
    elevation: 5,
  },
  text: {
    fontWeight: '600',
    fontSize: 18,
    marginRight: 10,
  },
});
