/*    ----------------Created Date :: 10 - August -2024   ----------------- */
import {StyleSheet, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import NeumorphicButton from '../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../constants/ScreensLabel';
import {regionalOfficePaymentSchema} from '../../utils/FormSchema';
import CustomeCard from '../../component/CustomeCard';
import converToString from '../../utils/NumberToString';
import converToNumber from '../../utils/StringToNumber';
import CardTextInput from '../../component/CardTextInput';
import CardDropDown from '../../component/CardDropDown';
import {updatePaymentRegionalOffice} from '../../redux/slices/regional office/addUpdateRegionalOfficeSlice';

const CreateRegionalOfficePayment = ({navigation, route}) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.edit_id;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: 'true',

    initialValues: {
      payment_mode: '',
      transaction_id: '',

      amount_received: route?.params?.amount,
      ro_id: route?.params?.ro_id,
      id: route?.params?.id,
    },
    validationSchema: regionalOfficePaymentSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const paymentMode = [
    {label: 'Cash', value: 'cash'},
    {label: 'Online', value: 'online'},
  ];

  const handleSubmit = async (values, resetForm) => {
    try {
      setLoading(true);

      const res = await dispatch(updatePaymentRegionalOffice(values)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        resetForm();

        navigation.navigate('RegionalOfficeTopTab');
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
      <CustomeHeader
        headerTitle={`${label.REGIONAL_OFFICE} ${label.PAYMENT}`}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <CustomeCard
            headerName={'Regional office payment'}
            data={[
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
                    editable={false}
                    keyboardType="numeric"
                  />
                ),
              },
              {
                key: 'Paymetn mode',
                component: (
                  <CardDropDown
                    data={paymentMode}
                    required={true}
                    value={formik?.values.payment_mode}
                    onChange={val => {
                      formik?.setFieldValue(`payment_mode`, val?.value);
                      formik.setFieldValue(`transaction_id`, '');
                    }}
                  />
                ),
              },
              {
                key: 'Transaction id',
                component: (
                  <CardTextInput
                    value={converToString(formik?.values?.transaction_id)}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`transaction_id`, val);
                    }}
                    editable={
                      formik.values?.payment_mode == 'cash' ? false : true
                    }
                    keyboardType="numeric"
                  />
                ),
              },
            ]}
          />

          <View
            style={{
              justifyContent: 'center',
              marginVertical: 20,
              gap: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <NeumorphicButton
              title={`${label.SUBMIT}`}
              titleColor={Colors().purple}
              onPress={() => {
                formik.handleSubmit();
              }}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateRegionalOfficePayment;

const styles = StyleSheet.create({});
