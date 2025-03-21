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
import {addDocumentCategorySchema} from '../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import {
  addDocCategory,
  updateDocCategory,
} from '../../redux/slices/document/addUpdateDocCategorySlice';
import {getDocCategoryDetailById} from '../../redux/slices/document/getDocCategoryDetailSlice';
import ScreensLabel from '../../constants/ScreensLabel';

const AddUpdateDocumentCategory = ({navigation, route}) => {
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
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: edit?.title || '',
      category: edit?.category || '',
      description: edit?.description || '',
    },
    validationSchema: addDocumentCategorySchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const reqbody = {
      title: values.title,
      category: values.category,
      description: values.description,
    };
    if (edit_id) {
      reqbody['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateDocCategory(reqbody)).unwrap()
        : await dispatch(addDocCategory(reqbody)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('DocumentCategoryListScreen');
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
    const res = await dispatch(getDocCategoryDetailById(edit_id)).unwrap();
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
            ? `${label.DOCUMENT_CATEGORY} ${label.UPDATE}`
            : `${label.DOCUMENT_CATEGORY} ${label.ADD}`
        }
      />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <NeumorphicTextInput
            width={WINDOW_WIDTH * 0.9}
            required={true}
            title={'title'}
            value={formik?.values?.title}
            onChangeText={formik.handleChange(`title`)}
            errorMessage={formik?.errors?.title}
          />
          <NeumorphicTextInput
            width={WINDOW_WIDTH * 0.9}
            required={true}
            title={'category'}
            value={formik?.values?.category}
            onChangeText={formik.handleChange(`category`)}
            errorMessage={formik?.errors?.category}
          />
          <NeumorphicTextInput
            height={WINDOW_HEIGHT * 0.09}
            width={WINDOW_WIDTH * 0.9}
            title={'description'}
            value={formik?.values?.description}
            onChangeText={formik.handleChange(`description`)}
          />
        </View>

        <View style={{alignSelf: 'center', marginVertical: 10}}>
          <NeumorphicButton
            title={edit_id ? `${label.UPDATE}` : `${label.ADD}`}
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

export default AddUpdateDocumentCategory;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: WINDOW_WIDTH * 0.05,
  },
});
