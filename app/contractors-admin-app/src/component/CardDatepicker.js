import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import NeumorphicTextInput from './NeumorphicTextInput';
import IconType from '../constants/IconType';
import DatePicker from 'react-native-date-picker';
import Colors from '../constants/Colors';
import {Icon} from '@rneui/themed';

const CardDatepicker = ({
  height,
  width,
  onChange,
  valueOfDate,
  withoutShadow,
  required,

  ...rest
}) => {
  const [open, setOpen] = useState(false);
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <NeumorphicTextInput
        withoutShadow={true}
        height={height}
        width={width}
        placeholder={'SELECT...'}
        RightIconName={'calendar'}
        RightIconType={IconType.AntDesign}
        RightIconColor={Colors().pureBlack}
        RightIconPress={() => setOpen(!open)}
        editable={false}
        value={valueOfDate}
        style={[
          styles.inputText,
          {color: Colors().pureBlack},
        ]}></NeumorphicTextInput>

      <DatePicker
        modal
        open={open}
        date={new Date()}
        onConfirm={date => {
          onChange(date);
          setOpen(false);
        }}
        onCancel={() => {
          setOpen(false);
        }}
        {...rest}
      />
      {required && !valueOfDate && (
        <Icon
          name="asterisk"
          type={IconType.FontAwesome5}
          size={8}
          color={Colors().red}
          style={{}}
        />
      )}
    </View>
  );
};

export default CardDatepicker;

const styles = StyleSheet.create({
  inputText: {
    fontSize: 15,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
