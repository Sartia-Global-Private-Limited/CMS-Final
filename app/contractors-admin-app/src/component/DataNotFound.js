import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';

import Images from '../constants/Images';

const DataNotFound = () => {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <LottieView
        source={Images.NO_DATA_FOUND}
        autoPlay
        style={{height: '50%', width: '50%', alignSelf: 'center'}}></LottieView>
    </View>
  );
};

export default DataNotFound;

const styles = StyleSheet.create({});
