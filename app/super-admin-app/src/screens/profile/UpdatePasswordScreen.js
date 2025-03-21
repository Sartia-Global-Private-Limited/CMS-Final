/*    ----------------Created Date :: 5-March -2024   ----------------- */

import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import Colors from '../../constants/Colors';
import AlertModal from '../../component/AlertModal';
import NeumorphicButton from '../../component/NeumorphicButton';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useFormik} from 'formik';
import {Icon} from '@rneui/themed';
import {ChangePasswordSchema} from '../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import {updatePassword} from '../../redux/slices/profile/addUpdateProfileSlice';

const UpdatePasswordScreen = ({navigation, route}) => {
  const user = route?.params?.userData;

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [oldHide, setOldHide] = useState(true);
  const [newHide, setNewHide] = useState(true);
  const [confirmHide, setConfirmHide] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      old_password: '',
      new_password: '',
      confirm_password: '',
    },
    validationSchema: ChangePasswordSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    try {
      setLoading(true);
      const res = await dispatch(updatePassword(values)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('ProfileScreen');
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        resetForm();
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={'Update password'} />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>olD password </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicTextInput
            width={WINDOW_WIDTH * 0.9}
            placeholder={'TYPE...'}
            style={styles.inputText}
            value={formik?.values?.old_password}
            onChangeText={formik.handleChange(`old_password`)}
            RightIconType={IconType.Feather}
            RightIconName={oldHide ? 'eye-off' : 'eye'}
            RightIconPress={() => setOldHide(!oldHide)}
            secureTextEntry={oldHide}
            RightIconColor={Colors().purple}
          />
          {formik?.touched?.old_password && formik?.errors?.old_password && (
            <Text style={styles.errorMesage}>
              {formik?.errors?.old_password}
            </Text>
          )}

          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>New password </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicTextInput
            width={WINDOW_WIDTH * 0.9}
            placeholder={'TYPE...'}
            style={styles.inputText}
            value={formik?.values?.new_password}
            onChangeText={formik.handleChange(`new_password`)}
            RightIconType={IconType.Feather}
            RightIconName={newHide ? 'eye-off' : 'eye'}
            RightIconPress={() => setNewHide(!newHide)}
            secureTextEntry={newHide}
            RightIconColor={Colors().purple}
          />
          {formik?.touched?.new_password && formik?.errors?.new_password && (
            <Text style={styles.errorMesage}>
              {formik?.errors?.new_password}
            </Text>
          )}
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.title}>confirm password </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicTextInput
            width={WINDOW_WIDTH * 0.9}
            placeholder={'TYPE...'}
            style={styles.inputText}
            value={formik?.values?.confirm_password}
            onChangeText={formik.handleChange(`confirm_password`)}
            RightIconType={IconType.Feather}
            RightIconName={confirmHide ? 'eye-off' : 'eye'}
            RightIconPress={() => setConfirmHide(!confirmHide)}
            secureTextEntry={confirmHide}
            RightIconColor={Colors().purple}
          />
          {formik?.touched?.confirm_password &&
            formik?.errors?.confirm_password && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.confirm_password}
              </Text>
            )}
        </View>

        <View style={{alignSelf: 'center', marginVertical: 10}}>
          <NeumorphicButton
            title={'save'}
            titleColor={Colors().purple}
            onPress={() => {
              setUpdateModalVisible(true);
            }}
            loading={loading}
          />
        </View>

        {/*view for modal of upate */}

        {updateModalVisible && (
          <AlertModal
            visible={updateModalVisible}
            iconName={'clock-edit-outline'}
            icontype={IconType.MaterialCommunityIcons}
            iconColor={Colors().aprroved}
            textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
            cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
            ConfirmBtnPress={() => formik.handleSubmit()}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default UpdatePasswordScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: WINDOW_WIDTH * 0.05,
  },

  errorMesage: {
    color: 'red',
    // marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 15,
    fontFamily: Colors().fontFamilyBookMan,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
  },

  inputText: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
