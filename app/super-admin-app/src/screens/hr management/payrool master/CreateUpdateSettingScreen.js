import {StyleSheet, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {addSettingSchema} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {
  createSetting,
  updateSetting,
} from '../../../redux/slices/hr-management/payroll-master/addUpdateSettingSlice';
import AlertModal from '../../../component/AlertModal';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../../constants/ScreensLabel';

const AddUpdateOrderViaScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const editData = route?.params?.editData;
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */

  const [modalVisible, setModalVisible] = useState(false);
  const [confirm, setConfrim] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      label: (editData && editData?.label) || '',
      active_setting: (editData && editData?.active_setting) || '1',
    },
    validationSchema: addSettingSchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const SETTING_OPTIONS = [
    {
      label: 'ACTIVE',
      value: '1',
    },
    {
      label: 'DEACTIVE',
      value: '0',
    },
  ];

  const handleSubmit = async values => {
    const reqBody = {
      active_setting: values.active_setting,
      input_type: 'radio',
      label: values.label,
    };
    if (editData) {
      reqBody['id'] = editData.id;
    }

    try {
      if (editData) {
        setModalVisible(true);
        setConfrim(reqBody);
      } else {
        setLoading(true);
        const createSettingResult = await dispatch(
          createSetting(reqBody),
        ).unwrap();

        if (createSettingResult?.status) {
          setLoading(false);
          Toast.show({
            type: 'success',
            text1: createSettingResult?.message,
            position: 'bottom',
          });

          navigation.navigate('PayrollMasterListScreen');
        } else {
          Toast.show({
            type: 'error',
            text1: createSettingResult?.message,
            position: 'bottom',
          });
          setLoading(false);
        }
      }
    } catch (error) {
      console.error('Error in creating setting:', error);
    }
  };

  const updateSettingFunction = async reqBody => {
    setLoading(true);

    const updateOrderViaResult = await dispatch(
      updateSetting(reqBody),
    ).unwrap();

    if (updateOrderViaResult?.status) {
      setLoading(false);
      setModalVisible(false);
      Toast.show({
        type: 'success',
        text1: updateOrderViaResult?.message,
        position: 'bottom',
      });

      navigation.navigate('PayrollMasterListScreen');
    } else {
      Toast.show({
        type: 'error',
        text1: updateOrderViaResult?.message,
        position: 'bottom',
      });
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={editData ? label.UPDATE_SETTING : label.ADD_SETTING}
        rightIconPress={() => {
          navigation.navigate('Home');
        }}
      />

      <ScrollView>
        <View style={styles.inputContainer}>
          <NeumorphicTextInput
            title={'payroll setting name'}
            required={true}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.label}
            onChangeText={formik.handleChange('label')}
            errorMessage={formik?.errors?.label}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.92}
            title={'status'}
            required={true}
            data={SETTING_OPTIONS}
            onChange={val => {
              formik.setFieldValue('active_setting', val.value);
            }}
            value={formik?.values?.active_setting}
          />

          {modalVisible && (
            <AlertModal
              visible={modalVisible}
              iconName={'circle-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={`ARE YOU SURE YOU WANT sure make it default setting`}
              cancelBtnPress={() => setModalVisible(!modalVisible)}
              ConfirmBtnPress={() => updateSettingFunction(confirm)}
            />
          )}

          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={editData ? label.UPDATE : label.ADD}
              titleColor={Colors().purple}
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateOrderViaScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
    rowGap: 10,
  },
});
