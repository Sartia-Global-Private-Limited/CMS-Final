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
import {addResponseSchema} from '../../utils/FormSchema';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../constants/ScreensLabel';
import {addResponse} from '../../redux/slices/feedback suggestion/addUpateFeedbackSlice';

const AddResponseScreen = ({navigation, route}) => {
  const edit_id = route?.params?.edit_id;
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const label = ScreensLabel();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      response: '',
    },
    validationSchema: addResponseSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const reqbody = {
      response: values?.response,
    };
    if (edit_id) {
      reqbody['id'] = edit_id;
    }

    try {
      setLoading(true);
      const res = await dispatch(
        addResponse({reqBody: reqbody, feedbackId: edit_id}),
      ).unwrap();

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
      <CustomeHeader headerTitle={`${label.RESPONSE}`} />

      <ScrollView>
        <View style={styles.inpuntContainer}>
          <NeumorphicTextInput
            height={WINDOW_HEIGHT * 0.09}
            width={WINDOW_WIDTH * 0.9}
            title={'Response'}
            required={true}
            multiline={true}
            value={formik?.values?.response}
            onChangeText={formik.handleChange(`response`)}
            errorMessage={formik?.errors?.response}
          />
        </View>

        <View style={{alignSelf: 'center', marginVertical: 10}}>
          <NeumorphicButton
            title={'send'}
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

export default AddResponseScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 6,
    margin: WINDOW_WIDTH * 0.05,
  },
});
