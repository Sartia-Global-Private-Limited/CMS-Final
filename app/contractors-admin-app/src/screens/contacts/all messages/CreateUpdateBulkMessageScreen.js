import { SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';
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
import { createMessageSchema } from '../../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../../constants/ScreensLabel';
import MultiSelectComponent from '../../../component/MultiSelectComponent';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import moment from 'moment';
import {
  createBulkMessage,
  updateMessage,
} from '../../../redux/slices/contacts/all message/addUpdateBulkMessageSlice';
import { getBulkMessageDetailById } from '../../../redux/slices/contacts/all message/getBulkMessageDetailSlice';

const CreateUpdateBulkMessageScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const [edit, setEdit] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);
  const [sendUserData, setSendUserData] = useState(
    route?.params?.reqBody.map(itm => {
      return {
        label: itm?.value,
        value: itm?.id,
      };
    }),
  );
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
      to: edit?.category_name || '',
      user_ids: edit?.user_ids || route?.params?.reqBody.map(item => item.id),
      title: edit?.title || '',
      message: edit?.message || '',
      date: edit?.date || '',
    },
    validationSchema: createMessageSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const reqbody = {
      to: values?.user_ids?.join(),
      user_ids: values?.user_ids,
      title: values?.title,
      message: values?.message,
      date: moment(values?.date).format('YYYY-MM-DD'),
    };
    if (edit_id) {
      reqbody['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateMessage(reqbody)).unwrap()
        : await dispatch(createBulkMessage(reqbody)).unwrap();

      if (res.status) {
        setLoading(false);

        navigation.navigate(
          edit_id ? 'AllBulkMessageListScreen' : 'ContactTopTab',
        );
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
    const res = await dispatch(getBulkMessageDetailById(edit_id)).unwrap();
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
      <CustomeHeader headerTitle={`${label.MESSAGE} ${label.SEND}`} />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <MultiSelectComponent
            title={'To'}
            required={true}
            data={sendUserData}
            value={formik.values.user_ids}
            onChange={item => {
              formik.setFieldValue(`user_ids`, item);
            }}
            inside={true}
            errorMessage={formik?.errors?.user_ids}
          />

          <NeumorphDatePicker
            height={WINDOW_HEIGHT * 0.06}
            width={WINDOW_WIDTH * 0.9}
            iconPress={() => setOpenEndDate(!openEndDate)}
            valueOfDate={
              formik?.values?.date
                ? moment(formik.values.date).format('DD/MM/YYYY')
                : ''
            }
            modal
            required={true}
            errorMessage={formik?.errors?.date}
            open={openEndDate}
            date={new Date()}
            mode="date"
            onConfirm={date => {
              formik.setFieldValue(`date`, date);

              setOpenEndDate(false);
            }}
            onCancel={() => {
              setOpenEndDate(false);
            }}></NeumorphDatePicker>

          <NeumorphicTextInput
            title={'title'}
            required={true}
            value={formik.values.title}
            onChangeText={formik.handleChange(`title`)}
            errorMessage={formik.errors.title}
          />
          <NeumorphicTextInput
            height={WINDOW_HEIGHT * 0.09}
            width={WINDOW_WIDTH * 0.9}
            title={'Message'}
            required={true}
            multiline={true}
            value={formik.values.message}
            onChangeText={formik.handleChange(`message`)}
            errorMessage={formik.errors.message}
          />
        </View>

        <View style={{ alignSelf: 'center', marginVertical: 10 }}>
          <NeumorphicButton
            title={label.SEND}
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

export default CreateUpdateBulkMessageScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: WINDOW_WIDTH * 0.05,
  },
});
