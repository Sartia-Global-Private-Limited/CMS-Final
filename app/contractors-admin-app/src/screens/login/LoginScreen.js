import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  StatusBar,
} from 'react-native';
import React, { useState } from 'react';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import SeparatorComponent from '../../component/SeparatorComponent';
import NeumorphicButton from '../../component/NeumorphicButton';
import IconType from '../../constants/IconType';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import { login } from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import { adminLogin } from '../../services/authApi';
import { loginSchema } from '../../utils/FormSchema';
import { useFormik } from 'formik';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { setToken } from '../../redux/slices/tokenAuthSlice';
import ScreensLabel from '../../constants/ScreensLabel';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({}) => {
  const [hidePassword, setHidePassword] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const screenLabel = ScreensLabel();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: 'contractor1@gmail.com',
      password: '12345678',
    },
    validationSchema: loginSchema,
    onSubmit: values => {
      clickOnLoginButton();
      // signInWithMobileNumber();
    },
  });

  const signInWithMobileNumber = async mobileNumber => {
    const confirmation = await auth().signInWithPhoneNumber('+91 7047650826');
  };

  const requestBody = {
    email: formik.values.email,
    password: formik.values.password,
  };

  const clickOnLoginButton = async () => {
    setShowLoader(true);
    const res = await adminLogin(requestBody);
    if (res.status) {
      setShowLoader(false);
      AsyncStorage.setItem('cms-client-token', res.token);
      dispatch(login(res.data));
      dispatch(setToken(res.token));
      Toast.show({
        type: 'success',
        text1Style: {
          fontFamily: Colors().fontFamilyBookMan,
          textTransform: 'uppercase',
        },
        text1: res?.message,
        position: 'bottom',
      });
      // navigation.navigate('Home');
    } else {
      Toast.show({
        type: 'error',
        text1Style: {
          fontFamily: Colors().fontFamilyBookMan,
          textTransform: 'uppercase',
        },
        text1: res?.message,
        position: 'bottom',
      });
      setShowLoader(false);
    }
  };

  return (
    <SafeAreaView
      style={[
        styles.mainContainer,
        { backgroundColor: Colors().screenBackground },
      ]}>
      <ScrollView scrollEnabled={true} keyboardShouldPersistTaps="always">
        <View>
          <View
            style={{
              alignSelf: 'flex-end',
            }}>
            <Image
              style={{
                height: WINDOW_HEIGHT * 0.475,
                width: WINDOW_WIDTH,
              }}
              source={require('../../assests/images/bubble.png')}
            />
          </View>
          <View style={styles.logo}>
            <Image
              style={{
                height: WINDOW_HEIGHT * 0.2,
                width: WINDOW_WIDTH * 0.6,
              }}
              resizeMode="contain"
              source={require('../../assests/images/logo.png')}
            />
          </View>
        </View>
        <View style={styles.inputView}>
          <NeumorphicTextInput
            title={'Email Address'}
            width={WINDOW_WIDTH * 0.9}
            placeHolderTxt={'LOGIN ID'}
            placeHolderTxtColor={Colors().pureBlack}
            LeftIconType={IconType.AntDesign}
            LeftIconName={'user'}
            LeftIconColor={Colors().purple}
            value={formik?.values?.email}
            onChangeText={text => formik.setFieldValue(`email`, text)}
            style={[styles.inputText, { color: Colors().gray }]}
            errorMessage={formik?.errors?.email}
          />
          <SeparatorComponent
            separatorColor={Colors().screenBackground}
            separatorHeight={20}
          />

          <NeumorphicTextInput
            title={'Password'}
            width={WINDOW_WIDTH * 0.9}
            placeHolderTxt={'PASSWORD'}
            placeHolderTxtColor={Colors().pureBlack}
            LeftIconType={IconType.MaterialCommunityIcons}
            LeftIconName={'lock-check-outline'}
            LeftIconColor={Colors().purple}
            value={formik.values.password}
            onChangeText={formik.handleChange('password')}
            RightIconType={IconType.Feather}
            RightIconName={hidePassword ? 'eye-off' : 'eye'}
            RightIconPress={() => setHidePassword(!hidePassword)}
            secureTextEntry={hidePassword}
            RightIconColor={Colors().purple}
            style={[styles.inputText, { color: Colors().gray }]}
            errorMessage={formik?.errors?.password}
          />

          <SeparatorComponent
            separatorColor={Colors().screenBackground}
            separatorHeight={20}
          />
        </View>

        <SeparatorComponent
          separatorColor={Colors().screenBackground}
          separatorHeight={20}
        />

        <View style={{ alignSelf: 'center', marginTop: 20 }}>
          <NeumorphicButton
            title={screenLabel.LOGIN}
            titleColor={Colors().purple}
            iconType={IconType.AntDesign}
            iconName={'login'}
            iconColor={Colors().purple}
            onPress={formik.handleSubmit}
            loading={showLoader}
          />
          <Text style={[styles.versionTxt, { color: Colors().pureBlack }]}>
            {screenLabel.VERSION} 1.5
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    height: '100%',
    width: '100%',
    flexDirection: 'column',
  },
  logo: {
    alignSelf: 'flex-start',
    position: 'absolute',
    marginTop: '65%',
    marginLeft: '2%',
  },
  versionTxt: {
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 18,
    marginTop: '5%',
    alignSelf: 'center',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  inputView: {
    marginTop: '10%',
    marginLeft: '10%',
    marginRight: '10%',
    alignItems: 'center',
  },
  errorMesage: {
    color: 'red',
    marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 15,
    fontFamily: Colors().fontFamilyBookMan,
    textTransform: 'uppercase',
  },
  inputText: {
    fontSize: 20,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
