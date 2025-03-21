// Created At 02- sep -2024

import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, { useState } from 'react';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import Colors from '../../../constants/Colors';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import { useFormik } from 'formik';
import NeumorphicButton from '../../../component/NeumorphicButton';
import { useDispatch } from 'react-redux';
import CustomeHeader from '../../../component/CustomeHeader';
import { useNavigation } from '@react-navigation/native';
import { markSalaryDisbursal } from '../../../redux/slices/hr-management/salarydisbursal/addUpdateSalaryDisbursalSlice';
import { markSalaryDisbursalSchema } from '../../../utils/FormSchema';

const UpdateSalaryDisbursal = ({ route }) => {
  const navigation = useNavigation();
  const data = route?.params?.data;
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      user_id: data.user_id,
      amount: data?.amount,
      name: data?.name,
      due_amount: data?.due_amount,
      final_pay_amount: data?.final_pay_amount,
      gross_salary: data?.grossSalary,
      month: data?.month,
      payable_amount: data?.payable_salary,
      transaction_mode: data?.transaction_mode,
      transaction_number: data?.transaction_number,
    },
    validationSchema: markSalaryDisbursalSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      user_id: values.user_id,
      amount: values?.amount,
      due_amount: values?.due_amount,
      final_pay_amount: values?.final_pay_amount,
      gross_salary: values?.gross_salary,
      month: values?.month,
      payable_amount: values?.payable_amount,
      transaction_mode: values?.transaction_mode,
      transaction_number: values?.transaction_number,
    };

    try {
      setLoading(true);
      const addResult = await dispatch(markSalaryDisbursal(sData)).unwrap();
      if (addResult?.status) {
        setLoading(false);
        ToastAndroid.show(addResult?.message, ToastAndroid.LONG);
        navigation.goBack();
        resetForm();
      } else {
        ToastAndroid.show(addResult?.message, ToastAndroid.LONG);
        setLoading(false);
      }
      resetForm();
    } catch (error) {}
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={'Generate PaySlip Number'} />
      <ScrollView>
        <View style={styles.inpuntContainer}>
          <View style={{ rowGap: 2 }}>
            <Text style={styles.title}>Employee Name</Text>
            <NeumorphicTextInput
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik.values.name}
              onChangeText={formik.handleChange(`name`)}
            />
          </View>

          <View style={{ rowGap: 2 }}>
            <Text style={styles.title}>Month {formik.values.month} </Text>
            <NeumorphicTextInput
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik.values.month}
              onChangeText={formik.handleChange(`month`)}
            />
          </View>

          <View style={{ rowGap: 2 }}>
            <Text style={styles.title}>Gross Salary</Text>
            <NeumorphicTextInput
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik.values.gross_salary}
              onChangeText={formik.handleChange(`gross_salary`)}
            />
          </View>

          <View style={{ rowGap: 2 }}>
            <Text style={styles.title}>Payable Salary</Text>
            <NeumorphicTextInput
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik.values.payable_amount}
              onChangeText={formik.handleChange(`payable_amount`)}
            />
          </View>

          <View style={{ rowGap: 2 }}>
            <Text style={styles.title}>Final Pay Amount</Text>
            <NeumorphicTextInput
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik.values.final_pay_amount}
              onChangeText={formik.handleChange(`final_pay_amount`)}
            />
          </View>

          <View style={{ rowGap: 2 }}>
            <Text style={styles.title}>Amount</Text>
            <NeumorphicTextInput
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik.values.amount}
              onChangeText={formik.handleChange(`amount`)}
            />

            {formik?.touched?.amount && formik?.errors?.amount && (
              <Text style={styles.errorMesage}>{formik?.errors?.amount}</Text>
            )}
          </View>

          <View style={{ rowGap: 2 }}>
            <Text style={styles.title}>Transaction Number</Text>
            <NeumorphicTextInput
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik.values.transaction_number}
              onChangeText={formik.handleChange(`transaction_number`)}
            />
          </View>
          {formik?.touched?.transaction_number &&
            formik?.errors?.transaction_number && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.transaction_number}
              </Text>
            )}

          <View style={{ rowGap: 2 }}>
            <Text style={styles.title}>Transaction Mode</Text>
            <NeumorphicTextInput
              placeholder={'TYPE...'}
              style={styles.inputText}
              value={formik.values.transaction_mode}
              onChangeText={formik.handleChange(`transaction_mode`)}
            />
          </View>
          {formik?.touched?.transaction_mode &&
            formik?.errors?.transaction_mode && (
              <Text style={styles.errorMesage}>
                {formik?.errors?.transaction_mode}
              </Text>
            )}

          <View style={{ alignSelf: 'center', marginVertical: 10 }}>
            <NeumorphicButton
              title={'Save'}
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

export default UpdateSalaryDisbursal;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    margin: WINDOW_WIDTH * 0.05,
  },
  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
  },
  inputText: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  dropdown: {
    marginLeft: 10,
  },
  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
  },
  selectedTextStyle: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  btnView: {
    alignSelf: 'center',
    marginTop: WINDOW_HEIGHT * 0.01,
  },
  Image: {
    height: 40,
    width: WINDOW_WIDTH * 0.9,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
});
