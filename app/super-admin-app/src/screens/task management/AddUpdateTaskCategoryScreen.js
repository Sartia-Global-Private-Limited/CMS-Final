/*    ----------------Created Date :: 2 - March -2024   ----------------- */

import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import Colors from '../../constants/Colors';
import AlertModal from '../../component/AlertModal';
import NeumorphicButton from '../../component/NeumorphicButton';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useFormik} from 'formik';
import ScreensLabel from '../../constants/ScreensLabel';
import {addTaskCategoryNameSchema} from '../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import NeumorphicDropDownList from '../../component/DropDownList';
import {
  addTaskCategory,
  updateTaskCategory,
} from '../../redux/slices/task-mangement/addUpdateTaskCategorySlice';
import {getTaskCategoryDetailById} from '../../redux/slices/task-mangement/getTaskCategoryDetailSlice';

const AddUpdateTaskCategoryScreen = ({navigation, route}) => {
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
    {label: 'Active', value: 1},
    {label: 'Inactive', value: 0},
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: edit?.name || '',
      status: edit_id
        ? edit?.status
          ? edit?.status
          : 1 || !edit?.status
          ? 0
          : 1
        : 1,
    },
    validationSchema: addTaskCategoryNameSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const reqbody = {
      name: values.name,

      status: values.status,
    };
    if (edit_id) {
      reqbody['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateTaskCategory(reqbody)).unwrap()
        : await dispatch(addTaskCategory(reqbody)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('TaskCategoryListScreen');
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
    const res = await dispatch(getTaskCategoryDetailById(edit_id)).unwrap();
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
            ? `${label.TASK_CATEGORY} ${label.UPDATE}`
            : `${label.TASK_CATEGORY} ${label.ADD}`
        }
      />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <NeumorphicTextInput
            width={WINDOW_WIDTH * 0.9}
            required={true}
            title={'category name'}
            value={formik?.values?.name}
            onChangeText={formik.handleChange(`name`)}
            errorMessage={formik?.errors?.name}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.9}
            required={true}
            title={'status'}
            data={statusArray}
            value={formik?.values?.status}
            onChange={val => {
              formik.setFieldValue(`status`, val.value);
            }}
            errorMessage={formik?.errors?.status}
          />
        </View>

        <View style={{alignSelf: 'center', marginVertical: 10}}>
          <NeumorphicButton
            title={edit_id ? label.UPDATE : label.ADD}
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

export default AddUpdateTaskCategoryScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: WINDOW_WIDTH * 0.05,
  },
});
