/*    ----------------Created Date :: 23- July -2024   ----------------- */
import {StyleSheet, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicButton from '../../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import ScreensLabel from '../../../constants/ScreensLabel';
import moment from 'moment';
import converToNumber from '../../../utils/StringToNumber';
import RetentionMoneyForm from './RetentionMoneyForm';
import {addPaymentSchema} from '../../../utils/FormSchema';
import {updatePayementRetentionById} from '../../../redux/slices/billing management/retention money/addUpdateRetentionSlice';

const CreateRetentionScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    enableReinitialize: 'true',

    initialValues: {
      pv_number: '',
      receipt_date: '',
      pv_amount: '',
      invoiceData: [],
    },
    validationSchema: addPaymentSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      id: edit_id,
      pv_number: values?.pv_number,
      receipt_date: moment(values?.receipt_date).format('YYYY-MM-DD'),
      pv_amount: converToNumber(values?.pv_amount).toFixed(2),

      retention:
        converToNumber(values?.invoiceData?.[0]?.retention).toFixed(2) || 0,
      retention_amount:
        converToNumber(values?.invoiceData?.[0]?.retention_amount).toFixed(2) ||
        0,
    };

    try {
      setLoading(true);

      const res = await dispatch(updatePayementRetentionById(sData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
        resetForm();
        navigation.navigate('RetentionMoneyTopTab');
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setLoading(false);

      setUpdateModalVisible(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={`${label.RETENTION_MONEY} ${label.UPDATE}`} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <RetentionMoneyForm formik={formik} type={type} edit_id={edit_id} />

          {/* modal view for delete*/}
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

          <View
            style={{
              justifyContent: 'center',
              marginVertical: 20,
              gap: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <NeumorphicButton
              title={`${label.UPDATE}`}
              titleColor={Colors().purple}
              onPress={() => {
                edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
              }}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRetentionScreen;

const styles = StyleSheet.create({});
