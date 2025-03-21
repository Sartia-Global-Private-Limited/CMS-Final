import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import {Icon} from '@rneui/themed';
import IconType from '../constants/IconType';

const IncreDecreComponent = ({
  defaultValue,
  MaxValue,
  onChange,
  formik,
  keyToSet,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        // flex: 1,
        gap: 10,
      }}>
      <Icon
        activeOpacity={0}
        name="minus"
        size={15}
        type={IconType.AntDesign}
        color={Colors().red}
        style={styles.actionIcon}
        disabled={defaultValue == 0}
        onPress={onChange.bind(this, {
          returnValue: parseInt(defaultValue) - 1,
          formik: formik,
          keyToSet: keyToSet,
        })}
      />

      <View style={{}}>
        <Text
          style={{
            color: Colors().pureBlack,
            fontFamily: Colors().fontFamilyBookMan,
          }}>{`${defaultValue} `}</Text>
      </View>

      <Icon
        name="plus"
        size={15}
        type={IconType.AntDesign}
        color={Colors().aprroved}
        style={styles.actionIcon}
        disabled={defaultValue >= MaxValue}
        onPress={onChange.bind(this, {
          returnValue: parseInt(defaultValue) + 1,
          formik: formik,
          keyToSet: keyToSet,
        })}
      />
    </View>
  );
};

export default IncreDecreComponent;

const styles = StyleSheet.create({
  actionIcon: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
});
