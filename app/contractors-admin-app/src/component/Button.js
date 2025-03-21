import React from 'react';
import {Pressable, StyleSheet, Text} from 'react-native';

const Button = ({
  title,
  onPress,
  btnStyle,
  textstyle,
  endIcon,
  disabled,
  startIcon,
}) => {
  return (
    <>
      <Pressable
        style={[style.btn, btnStyle]}
        disabled={disabled}
        onPress={onPress}>
        {startIcon}
        <Text style={[style.btn_text, textstyle]}>{title}</Text>
        {endIcon}
      </Pressable>
    </>
  );
};
export default Button;

const style = StyleSheet.create({
  btn: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 5,
  },
  buttonText: {
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    backgroundColor: 'transparent',
  },
});
