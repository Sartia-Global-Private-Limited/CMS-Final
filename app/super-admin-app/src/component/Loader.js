import {StyleSheet, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

import Images from '../constants/Images';

const Loader = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <LottieView
        source={Images.LOADER}
        autoPlay
        style={{height: '50%', width: '50%', alignSelf: 'center'}}></LottieView>
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({});
