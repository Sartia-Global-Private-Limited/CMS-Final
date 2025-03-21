import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Neomorph} from 'react-native-neomorph-shadows';
import Colors from '../constants/Colors';

const Card = ({CardHeight, CardWidth}) => {
  return (
    <Neomorph
      darkShadowColor={Colors().darkShadow} // <- set this
      lightShadowColor={Colors().lightShadow} // <- this
      style={styles.shadow}></Neomorph>
  );
};

export default Card;

const styles = StyleSheet.create({
  shadow: {
    shadowOpacity: 1, // <- and this or yours opacity
    shadowRadius: 8,
    borderRadius: 10,
    backgroundColor: '#ECF0F3',
    width: 120,
    height: 120,

    //  justifyContent: 'center',
    //  alignItems: 'center',
  },
});
