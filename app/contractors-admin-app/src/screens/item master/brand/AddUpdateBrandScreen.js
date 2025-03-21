/*    ----------------Created Date :: 6-August -2024   ----------------- */

import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import Colors from '../../../constants/Colors';
import AlertModal from '../../../component/AlertModal';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useFormik } from 'formik';
import { addBrandNameSchema } from '../../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import NeumorphicDropDownList from '../../../component/DropDownList';
import ScreensLabel from '../../../constants/ScreensLabel';
import {
  addBrand,
  updateBrand,
} from '../../../redux/slices/item master/brand/addUpdateBrandSlice';
import { getBrandDetailById } from '../../../redux/slices/item master/brand/getBrandDetailSlice';

const AddUpdateBrandScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const [edit, setEdit] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const label = ScreensLabel();

  useEffect(() => {
    if (edit_id) {
      fetchSingleData();
    }
  }, [edit_id]);

  const statusArray = [
    { label: 'Active', value: 1 },
    { label: 'Inactive', value: 0 },
  ];

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      brand_name: edit?.brand_name || '',
      status: edit?.status || 1,
    },
    validationSchema: addBrandNameSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const reqbody = {
      brand_name: values?.brand_name,

      status: values?.status,
    };
    if (edit_id) {
      reqbody['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateBrand(reqbody)).unwrap()
        : await dispatch(addBrand(reqbody)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('BrandListScreen');
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

  const fetchSingleData = async () => {
    const res = await dispatch(getBrandDetailById(edit_id)).unwrap();
    if (res.status) {
      setEdit(res.data);
    } else {
      setEdit({});
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={
          edit_id
            ? `${label.BRAND} ${label.UPDATE}`
            : `${label.BRAND} ${label.ADD}`
        }
      />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <NeumorphicTextInput
            title={'category name'}
            required={true}
            value={formik.values.brand_name}
            onChangeText={formik.handleChange(`brand_name`)}
            errorMessage={formik.errors.brand_name}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.9}
            title={'status'}
            required={true}
            data={statusArray}
            value={formik.values.status}
            editable={false}
            onChange={val => {
              formik.setFieldValue(`status`, val.value);
            }}
            errorMessage={formik.errors.status}
          />
        </View>

        <View style={{ alignSelf: 'center', marginVertical: 10 }}>
          <NeumorphicButton
            title={edit_id ? 'update' : 'ADD'}
            titleColor={Colors().purple}
            onPress={() => {
              edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
            }}
            loading={loading}
          />
        </View>

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

export default AddUpdateBrandScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: WINDOW_WIDTH * 0.05,
  },
});
