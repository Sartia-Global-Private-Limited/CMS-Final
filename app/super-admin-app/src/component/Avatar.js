import {StyleSheet, View, Image} from 'react-native';
import React from 'react';
import {Neomorph} from 'react-native-neomorph-shadows';
import Colors from '../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../utils/ScreenLayout';

const Avatar = ({imageUri}) => {
  return (
    <Neomorph
      darkShadowColor={Colors().darkShadow}
      lightShadowColor={Colors().lightShadow}
      style={{
        shadowOpacity: 5,
        shadowRadius: 15,
        borderRadius: 120,
        backgroundColor: Colors().screenBackground,
        width: WINDOW_WIDTH * 0.26,
        height: WINDOW_HEIGHT * 0.15,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Neomorph
        inner
        darkShadowColor={Colors().darkShadow}
        lightShadowColor={Colors().lightShadow}
        style={{
          shadowOpacity: 10,
          shadowRadius: 7,
          borderRadius: 110,
          backgroundColor: Colors().screenBackground,
          width: WINDOW_WIDTH * 0.22,
          height: WINDOW_HEIGHT * 0.13,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{}}>
          <Image
            source={{uri: imageUri}}
            style={{
              width: WINDOW_WIDTH * 0.22,
              height: WINDOW_HEIGHT * 0.13,
              borderRadius: 110,
            }}
          />
        </View>
      </Neomorph>
    </Neomorph>
  );
};

export default Avatar;

const styles = StyleSheet.create({});
