/*    ----------------Created Date :: 5-March -2024   ----------------- */

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import Colors from '../../constants/Colors';
import AlertModal from '../../component/AlertModal';
import NeumorphicButton from '../../component/NeumorphicButton';

import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useFormik } from 'formik';
import { Icon } from '@rneui/themed';
import { MyprofileSchema, addQuotationSchema } from '../../utils/FormSchema';
import Toast from 'react-native-toast-message';

import moment from 'moment';
import { addWorkQuotation } from '../../redux/slices/work-quotation/addUpdateQuotationSlice';
import { getQuotationDetailById } from '../../redux/slices/work-quotation/getQuotationDetailSlice';
import { updateProfile } from '../../redux/slices/profile/addUpdateProfileSlice';

const UpdateProfileScreen = ({ navigation, route }) => {
  const user = route?.params?.userData;

  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [editAble, setEditAble] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {}, []);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      name: user?.name || '',
      email: user?.email || '',
      contact_no: user?.contact_no || '',
    },
    validationSchema: MyprofileSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    try {
      setLoading(true);
      const res = await dispatch(updateProfile(values)).unwrap();

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
      <CustomeHeader
        headerTitle={'About User'}
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'edit'}
        rightIcontype={IconType.AntDesign}
        rightIconPress={() => setEditAble(!editAble)}
      />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>name </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicTextInput
            placeholder={'TYPE...'}
            style={styles.inputText}
            value={formik.values.name}
            editable={editAble}
            onChangeText={formik.handleChange(`name`)}
          />
          {formik.touched.name && formik.errors.name && (
            <Text style={styles.errorMesage}>{formik.errors.name}</Text>
          )}

          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>email </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicTextInput
            placeholder={'TYPE...'}
            editable={editAble}
            style={styles.inputText}
            value={formik.values.email}
            onChangeText={formik.handleChange(`email`)}
          />
          {formik.touched.email && formik.errors.email && (
            <Text style={styles.errorMesage}>{formik.errors.email}</Text>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={styles.title}>Contact number </Text>
            <Icon
              name="asterisk"
              type={IconType.FontAwesome}
              size={8}
              color={Colors().red}
            />
          </View>
          <NeumorphicTextInput
            placeholder={'TYPE...'}
            style={styles.inputText}
            value={formik.values.contact_no}
            onChangeText={formik.handleChange(`contact_no`)}
            keyboardType="numeric"
            maxLength={10}
            editable={editAble}
          />
          {formik.touched.contact_no && formik.errors.contact_no && (
            <Text style={styles.errorMesage}>{formik.errors.contact_no}</Text>
          )}
        </View>

        {editAble && (
          <View style={{ alignSelf: 'center', marginVertical: 10 }}>
            <NeumorphicButton
              title={'save'}
              titleColor={Colors().purple}
              onPress={() => {
                setUpdateModalVisible(true);
              }}
              loading={loading}
            />
          </View>
        )}

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

export default UpdateProfileScreen;

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
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  selectedTextStyle: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  selectedStyle: {
    borderRadius: 12,
  },
  dropdown: {
    marginLeft: 10,
    marginRight: 10,
  },

  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
