import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import NeumorphicTextInput from './NeumorphicTextInput';
import IconType from '../constants/IconType';
import DatePicker from 'react-native-date-picker';
import Colors from '../constants/Colors';
import { Icon } from '@rneui/themed';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../utils/ScreenLayout';

const NeumorphDatePicker = ({
  height,
  width,
  iconPress,
  valueOfDate,
  withoutShadow,
  title,
  required,
  errorMessage,
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
      <NeumorphicTextInput
        // withoutShadow={withoutShadow}
        height={height ? height : 45}
        width={width ? width : WINDOW_WIDTH * 0.9}
        placeholder={'SELECT...'}
        RightIconName={'calendar'}
        RightIconType={IconType.AntDesign}
        RightIconColor={Colors().pureBlack}
        RightIconPress={iconPress}
        editable={false}
        value={valueOfDate}
        style={[
          styles.inputText,
          { color: Colors().pureBlack },
        ]}></NeumorphicTextInput>

      <DatePicker {...rest} />
      {errorMessage && (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={[styles.errorMesage, { marginLeft: 10 }]}>
            {errorMessage}
          </Text>
        </View>
      )}
    </View>
  );
};

export default NeumorphDatePicker;

const styles = StyleSheet.create({
  inputText: {
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  title: {
    fontSize: 12,
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
