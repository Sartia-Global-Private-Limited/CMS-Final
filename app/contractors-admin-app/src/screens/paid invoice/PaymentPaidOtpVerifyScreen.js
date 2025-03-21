/*    ----------------Created Date :: 3 - August -2024   ----------------- */
import {StyleSheet, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import NeumorphicButton from '../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import AlertModal from '../../component/AlertModal';
import ScreensLabel from '../../constants/ScreensLabel';
import {otpVerificationSchema} from '../../utils/FormSchema';
import CustomeCard from '../../component/CustomeCard';
import converToString from '../../utils/NumberToString';
import converToNumber from '../../utils/StringToNumber';
import CardTextInput from '../../component/CardTextInput';
import {verifyOtpPaymentPaid} from '../../redux/slices/paid invoice/addUpadatePaymentPaidSlice';

const PaymentPaidOtpVerifyScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.edit_id;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: 'true',

    initialValues: {
      amount_received: '',
      otp: '',
      payment_mode: '',
      manager_id: route?.params?.manager_id,
      paid_amount: route?.params?.amount,
      ro_id: route?.params?.ro_id,
      id: route?.params?.id,
    },
    validationSchema: otpVerificationSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    try {
      setLoading(true);

      const res = await dispatch(verifyOtpPaymentPaid(values)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        resetForm();

        navigation.navigate('PaidInvoiceTopTab');
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={`${label.VERIFY_OTP}`} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <CustomeCard
            headerName={'otp verification'}
            data={[
              {
                key: 'otp',
                component: (
                  <CardTextInput
                    value={converToString(formik?.values?.otp)}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`otp`, val);
                    }}
                    keyboardType="numeric"
                    maxLength={6}
                  />
                ),
              },
              {
                key: 'Amount received',
                component: (
                  <CardTextInput
                    value={converToString(formik?.values?.amount_received)}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(
                        `amount_received`,
                        converToNumber(val),
                      );
                    }}
                    keyboardType="numeric"
                  />
                ),
              },
              {
                key: 'Paymetn mode',
                component: (
                  <CardTextInput
                    value={converToString(formik?.values?.payment_mode)}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`payment_mode`, val);
                    }}
                  />
                ),
              },
            ]}
          />
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
              title={'verify'}
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

export default PaymentPaidOtpVerifyScreen;

const styles = StyleSheet.create({});
