/*    ----------------Created Date :: 7-August -2024   ----------------- */

import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import NeumorphicButton from '../../component/NeumorphicButton';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useFormik} from 'formik';
import {addFeedbackSchema} from '../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import NeumorphicDropDownList from '../../component/DropDownList';
import ScreensLabel from '../../constants/ScreensLabel';
import {createFeedback} from '../../redux/slices/feedback suggestion/addUpateFeedbackSlice';

const AddUpdateFeedbackSuggestionScreen = ({navigation, route}) => {
  const edit_id = route?.params?.edit_id;

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const label = ScreensLabel();

  const statusArray = [
    {label: 'Feedback', value: 1},
    {label: 'Suggestion', value: 2},
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      status: '',
      description: '',
    },
    validationSchema: addFeedbackSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const reqbody = {
      title: values?.title,
      status: values?.status,
      description: values?.description,
    };
    if (edit_id) {
      reqbody['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = await dispatch(createFeedback(reqbody)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.navigate('FeedbackSuggestionListScreen');
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
        headerTitle={`${label.FEEDBACK_AND_SUGGESTION} ${label.ADD}`}
      />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.9}
            title={'status'}
            required={true}
            data={statusArray}
            value={formik?.values?.status}
            editable={false}
            onChange={val => {
              formik.setFieldValue(`status`, val.value);
            }}
            errorMessage={formik?.errors?.status}
          />

          <NeumorphicTextInput
            width={WINDOW_WIDTH * 0.9}
            title={'title'}
            required={true}
            value={formik?.values?.title}
            onChangeText={formik.handleChange(`title`)}
            errorMessage={formik?.errors?.title}
          />
          <NeumorphicTextInput
            height={WINDOW_HEIGHT * 0.09}
            width={WINDOW_WIDTH * 0.9}
            title={'description'}
            required={true}
            value={formik?.values?.description}
            onChangeText={formik.handleChange(`description`)}
            errorMessage={formik?.errors?.description}
          />
        </View>

        <View style={{alignSelf: 'center', marginVertical: 10}}>
          <NeumorphicButton
            title={'ADD'}
            titleColor={Colors().purple}
            onPress={() => {
              formik.handleSubmit();
            }}
            loading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateFeedbackSuggestionScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: WINDOW_WIDTH * 0.05,
  },
});
