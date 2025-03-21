import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import SeparatorComponent from '../../component/SeparatorComponent';
import NeumorphicButton from '../../component/NeumorphicButton';
import IconType from '../../constants/IconType';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import NeumorphicCheckbox from '../../component/NeumorphicCheckbox';
import {login} from '../../redux/slices/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '../../constants/Colors';
import {adminLogin} from '../../services/authApi';
import {loginSchema} from '../../utils/FormSchema';
import {useFormik} from 'formik';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import ScreensLabel from '../../constants/ScreensLabel';

const LoginScreen = ({navigation}) => {
  const screenLabel = ScreensLabel();
  const [isChecked, setIsChecked] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);
  const [showLoader, setShowLoader] = useState(false);

  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      email: 'cmsithubpvtltd@gmail.com',
      password: '1234567',
    },
    validationSchema: loginSchema,
    onSubmit: values => {
      clickOnLoginButton();
    },
  });

  const requestBody = {
    email: formik?.values?.email,
    password: formik?.values?.password,
  };

  const clickOnLoginButton = async () => {
    setShowLoader(true);
    const res = await adminLogin(requestBody);

    if (res.status) {
      setShowLoader(false);
      AsyncStorage.setItem('cms-sa-token', res.token);
      dispatch(login(res.data));
      dispatch(setToken(res.token));
      ToastAndroid.show(res.message, ToastAndroid.LONG);
      navigation.navigate('Home');
    } else {
      ToastAndroid.show(res.message, ToastAndroid.LONG);
      setShowLoader(false);
    }
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ScrollView scrollEnabled={true}>
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
            placeHolderTxtColor={'#C4D1E6'}
            LeftIconType={IconType.AntDesign}
            LeftIconName={'user'}
            LeftIconColor={Colors().purple}
            value={formik?.values?.email}
            onChangeText={formik.handleChange('email')}
            style={styles.inputText}
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
            placeHolderTxtColor={'#C4D1E6'}
            LeftIconType={IconType.MaterialCommunityIcons}
            LeftIconName={'lock-check-outline'}
            LeftIconColor={Colors().purple}
            value={formik?.values?.password}
            onChangeText={formik.handleChange('password')}
            RightIconType={IconType.Feather}
            RightIconName={hidePassword ? 'eye-off' : 'eye'}
            RightIconPress={() => setHidePassword(!hidePassword)}
            secureTextEntry={hidePassword}
            RightIconColor={Colors().purple}
            style={styles.inputText}
            errorMessage={formik?.errors?.password}
          />
          <SeparatorComponent
            separatorColor={Colors().screenBackground}
            separatorHeight={20}
          />
        </View>

        <View style={styles.checkboxView}>
          <NeumorphicCheckbox
            isChecked={isChecked}
            onChange={value => setIsChecked(value)}></NeumorphicCheckbox>
          <Text style={styles.rememberTxt}>REMEMBER ME</Text>
        </View>

        <SeparatorComponent
          separatorColor={Colors().screenBackground}
          separatorHeight={20}
        />

        <View style={{alignSelf: 'center', marginTop: 10}}>
          <NeumorphicButton
            title={'LOGIN IN'}
            titleColor={Colors().purple}
            iconType={IconType.AntDesign}
            iconName={'login'}
            onPress={formik.handleSubmit}
            loading={showLoader}
          />
          <Text style={styles.versionTxt}>{screenLabel.VERSION} 1.5</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: Colors().screenBackground,
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
    color: '#8D929B',
    fontWeight: '400',
    fontSize: 12,
    textTransform: 'uppercase',
    lineHeight: 18,
    marginTop: '20%',
    alignSelf: 'center',
    fontFamily: Colors().fontFamilyBookMan,
  },
  rememberTxt: {
    marginLeft: '2%',
    color: '#5D5D64',
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  inputView: {
    marginTop: '10%',
    marginLeft: '10%',
    marginRight: '10%',
    alignItems: 'center',
  },
  checkboxView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: '5%',
  },
  errorMesage: {
    color: 'red',
    marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  inputText: {
    color: Colors().gray,
    fontSize: 20,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
