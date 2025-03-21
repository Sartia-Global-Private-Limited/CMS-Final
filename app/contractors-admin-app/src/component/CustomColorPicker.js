/*    ----------------Created Date :: 20- Feb -2024   ----------------- */

import {ActivityIndicator, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Colors from '../constants/Colors';
import ColorPicker from 'react-native-wheel-color-picker';
import RBSheet from 'react-native-raw-bottom-sheet';
import {WINDOW_HEIGHT} from '../utils/ScreenLayout';

const CustomColorPicker = ({defalutColor, onColorChange, btnRef}) => {
  return (
    <RBSheet
      ref={btnRef}
      height={WINDOW_HEIGHT * 0.4}
      closeOnDragDown={true}
      closeOnPressMask={false}
      customStyles={{
        wrapper: {
          backgroundColor: 'transparent',
        },
        draggableIcon: {
          backgroundColor: Colors().purple,
        },
        container: {
          borderTopEndRadius: 50,
          borderTopStartRadius: 50,

          padding: 10,
          borderColor: Colors().purple,
          borderWidth: 0.5,
        },
      }}>
      <View>
        <Text style={styles.title}>Select color</Text>
        <ColorPicker
          // ref={r => {
          //   this.picker = r;
          // }}

          // swatchesOnly={this.state.swatchesOnly}

          color={defalutColor ? defalutColor : Colors().black2}
          // onColorChange={onColorChange}
          onColorChangeComplete={onColorChange}
          thumbSize={30}
          sliderSize={30}
          noSnap={true}
          swatchesLast={false}
          swatches={true}
          // discrete={this.state.disc}

          wheelLodingIndicator={<ActivityIndicator size={40} />}
          sliderLodingIndicator={<ActivityIndicator size={20} />}
          useNativeDriver={false}
          useNativeLayout={false}
        />
      </View>
    </RBSheet>
  );
};

export default CustomColorPicker;

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().purple,
    alignSelf: 'center',
    marginVertical: 5,
  },
});
