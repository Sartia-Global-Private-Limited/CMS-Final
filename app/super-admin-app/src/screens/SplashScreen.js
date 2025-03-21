import {StyleSheet, View} from 'react-native';
import React, {useEffect} from 'react';
import Images from '../constants/Images';
import LottieView from 'lottie-react-native';
import {useSelector} from 'react-redux';
import {selectUser} from '../redux/slices/authSlice';

const SplashScreen = ({navigation}) => {
  const {isAuthenticated} = useSelector(selectUser);

  useEffect(() => {
    const interval = setTimeout(() => {
      navigation.navigate(
        isAuthenticated ? 'BottomTabNavigation' : 'LoginScreen',
      );
    }, 3000);
    return () => {
      clearTimeout(interval);
    };
  }, [isAuthenticated, navigation]);

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <LottieView
        source={Images.SPLASH_LOADER}
        autoPlay
        style={{
          height: '110%',
          width: '100%',
          alignSelf: 'center',
        }}
      />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({});
