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

import { addUnitDataSchema } from '../../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import {
  addUnitData,
  updateUnitData,
} from '../../../redux/slices/category&product/unitData/addUpdateUnitDataSlice';
import { getUnitDataDetailById } from '../../../redux/slices/category&product/unitData/getUnitDataDetailSlice';
import ScreensLabel from '../../../constants/ScreensLabel';

const AddUpdateUnitData = ({ navigation, route }) => {
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

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      name: edit?.name || '',
      short_name: edit?.short_name || '',
    },
    validationSchema: addUnitDataSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const reqbody = {
      name: values.name,

      short_name: values.short_name,
    };

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(
            updateUnitData({ id: edit_id, reqBody: reqbody }),
          ).unwrap()
        : await dispatch(addUnitData(reqbody)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('UnitDataListScreen');
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
    const res = await dispatch(getUnitDataDetailById(edit_id)).unwrap();
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
            ? `${label.UNIT_DATA} ${label.UPDATE}`
            : `${label.UNIT_DATA} ${label.ADDs}`
        }
      />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <NeumorphicTextInput
            title={'unit name'}
            required={true}
            value={formik.values.name}
            onChangeText={formik.handleChange(`name`)}
            errorMessage={formik?.errors?.name}
          />

          <NeumorphicTextInput
            title={'short name'}
            required={true}
            value={formik.values.short_name}
            onChangeText={formik.handleChange(`short_name`)}
            errorMessage={formik?.errors?.short_name}
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

export default AddUpdateUnitData;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: WINDOW_WIDTH * 0.05,
  },
});
