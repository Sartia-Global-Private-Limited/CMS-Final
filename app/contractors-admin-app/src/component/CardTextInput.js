/*    ----------------Created Date :: 26- July -2024   ----------------- */
import {StyleSheet, View, TextInput} from 'react-native';
import React from 'react';
import IconType from '../constants/IconType';
import Colors from '../constants/Colors';
import {Icon} from '@rneui/themed';

const CardTextInput = ({value, onChange, required, ...rest}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
      <TextInput
        placeholder="TYPE...     "
        placeholderTextColor={Colors().pureBlack}
        style={[
          styles.inputText,
          {
            // height: 20,
            padding: 1,
            paddingLeft: 5,
            alignSelf: 'center',
            color: Colors().pureBlack,
            justifyContent: 'center',
            flexShrink: 1,
          },
        ]}
        value={value}
        onChangeText={onChange}
        {...rest}
      />
      {required && !value && (
        <View style={{}}>
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

export default CardTextInput;

const styles = StyleSheet.create({
  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    flexShrink: 1,
    fontFamily: Colors().fontFamilyBookMan,
  },
});
