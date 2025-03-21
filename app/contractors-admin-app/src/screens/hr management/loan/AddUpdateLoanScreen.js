/*    ----------------Created Date :: 5- Feb -2024    ----------------- */
import { SafeAreaView, StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import IconType from '../../../constants/IconType';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import Colors from '../../../constants/Colors';
import { useFormik } from 'formik';
import NeumorphicButton from '../../../component/NeumorphicButton';
import { useDispatch } from 'react-redux';
import { getAllUsers } from '../../../redux/slices/commonApi';
import CustomeHeader from '../../../component/CustomeHeader';
import { addLoanSchema } from '../../../utils/FormSchema';
import ScreensLabel from '../../../constants/ScreensLabel';
import AlertModal from '../../../component/AlertModal';
import {
  createLoan,
  updateLoan,
} from '../../../redux/slices/hr-management/loan/addUpdateLoanSlice';
import CustomeCard from '../../../component/CustomeCard';
import CardDropDown from '../../../component/CardDropDown';
import CardTextInput from '../../../component/CardTextInput';
import CardDatepicker from '../../../component/CardDatepicker';
import moment from 'moment';
import converToString from '../../../utils/NumberToString';
import Toast from 'react-native-toast-message';

const AddUpdateLoanScreen = ({ navigation, route }) => {
  const edit = route?.params?.editData;
  const label = ScreensLabel();
  const [allUser, setAllUser] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [confirm, setConfrim] = useState(false);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  useEffect(() => {
    fetchAllUser();
  }, []);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      user_id: edit?.user_id ? edit?.user_id : '',
      loan_amount: edit?.loan_amount.toString() || '',
      loan_type: edit?.loan_type || '',
      loan_term: edit?.loan_term || '',
      remarks: edit?.remarks || '',
      loan_date: edit?.loan_date || '',
      emi_start_from: edit?.emi_start_from || '',
      interest_rate: edit?.interest_rate || '',
      interest_mode: edit?.interest_mode || '',
      no_of_payments: edit?.no_of_payments || '',
      emi: edit?.emi || '',
      payment_date: edit?.payment_date || '',
      payment_mode: edit?.payment_mode || '',
      cheque_number: edit?.cheque_number || '',
      cheque_date: edit?.cheque_date || '',
      bank: edit?.bank || '',
      branch: edit?.branch || '',
    },
    validationSchema: addLoanSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      user_id: values?.user_id,
      loan_amount: values?.loan_amount,
      loan_type: values?.loan_type,
      loan_term: values?.loan_term,
      remarks: values?.remarks,
      loan_date: moment(values?.loan_date).format('YYYY-MM-DD'),
      emi_start_from: moment(values?.emi_start_from).format('YYYY-MM-DD'),
      interest_rate: values?.interest_rate,
      interest_mode: values?.interest_mode,
      no_of_payments: values?.no_of_payments,
      emi: values?.emi,
      payment_date: moment(values?.payment_date).format('YYYY-MM-DD'),
      payment_mode: values?.payment_mode,
      cheque_number: values?.cheque_number,
      cheque_date: moment(values?.cheque_date).format('YYYY-MM-DD'),
      bank: values?.bank,
      branch: values?.branch,
    };

    if (edit?.id) {
      sData['id'] = edit.id;
    }

    try {
      if (edit) {
        setUpdateModalVisible(true);
        setConfrim(sData);
      } else {
        setLoading(true);
        const creaLoanResult = await dispatch(createLoan(sData)).unwrap();

        if (creaLoanResult?.status) {
          setLoading(false);
          Toast.show({
            type: 'success',
            position: 'bottom',
            text1: creaLoanResult?.message,
          });
          navigation.navigate('LoanListingScreen');
          resetForm();
        } else {
          Toast.show({
            type: 'error',
            position: 'bottom',
            text1: creaLoanResult?.message,
          });
          setLoading(false);
        }
        // resetForm();
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: error,
      });
      console.error('Error in creating loan:', error);
    }
  };

  const loanTypeData = [
    { value: '1', label: 'Home Loan' },
    {
      value: '2',
      label: 'Education Loan',
    },
    {
      value: '3',
      label: 'Vehicle Loan',
    },
    {
      value: '4',
      label: 'Gold Loan',
    },
  ];

  const interestModeData = [
    { value: '1', label: 'fixed' },
    { value: '2', label: 'simple interest' },
    {
      value: '3',
      label: 'accrued interest',
    },
    {
      value: '4',
      label: 'compounding interest',
    },
  ];

  const paymentModeData = [
    { value: '1', label: 'Online' },
    {
      value: '2',
      label: 'Cheque',
    },
    {
      value: '3',
      label: 'credit/debit',
    },
  ];
  /*function for fetching all user data*/
  const fetchAllUser = async () => {
    try {
      const result = await dispatch(getAllUsers()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllUser(rData);
      } else {
        setAllUser([]);
      }
    } catch (error) {
      setAllUser([]);
    }
  };

  /*function for updating of Loan*/
  const updateLoanfunction = async reqBody => {
    setLoading(true);

    const updateLoanResult = await dispatch(updateLoan(reqBody)).unwrap();

    if (updateLoanResult?.status) {
      setLoading(false);
      setUpdateModalVisible(false);
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: updateLoanResult?.message,
      });

      navigation.navigate('LoanListingScreen');
    } else {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: updateLoanResult?.message,
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
      <CustomeHeader
        headerTitle={
          edit ? `${label.LOAN} ${label.UPDATE}` : `${label.LOAN} ${label.ADD}`
        }
      />
      <ScrollView>
        <View style={{}}>
          <CustomeCard
            headerName={'Loan details'}
            data={[
              {
                key: 'user name',
                component: (
                  <CardDropDown
                    data={allUser}
                    value={formik?.values?.user_id}
                    onChange={val => {
                      formik.setFieldValue(`user_id`, val.value);
                    }}
                    required={formik.values?.user_id}
                  />
                ),
              },
              {
                key: 'Loan amount',
                component: (
                  <CardTextInput
                    value={formik?.values?.loan_amount}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`loan_amount`, val);
                      formik.setFieldValue(
                        `emi`,
                        (val / formik?.values?.no_of_payments).toFixed(2),
                      );
                    }}
                    keyboardType="numeric"
                  />
                ),
              },
              {
                key: 'Loan type',
                component: (
                  <CardDropDown
                    data={loanTypeData}
                    value={formik?.values?.loan_type}
                    onChange={val => {
                      formik.setFieldValue(`loan_type`, val.value);
                    }}
                    required={formik.values?.loan_type}
                  />
                ),
              },
              {
                key: 'Loan term (in years)',
                component: (
                  <CardTextInput
                    value={formik?.values?.loan_term}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`loan_term`, val);
                    }}
                    keyboardType="numeric"
                  />
                ),
              },
              {
                key: 'Loan date',
                component: (
                  <CardDatepicker
                    width={WINDOW_WIDTH * 0.5}
                    height={WINDOW_HEIGHT * 0.04}
                    valueOfDate={
                      formik.values.loan_date
                        ? moment(formik?.values?.loan_date).format('DD-MM-YYYY')
                        : ''
                    }
                    mode="date"
                    required={true}
                    onChange={date => formik.setFieldValue(`loan_date`, date)}
                  />
                ),
              },
              {
                key: 'emi start date',
                component: (
                  <CardDatepicker
                    width={WINDOW_WIDTH * 0.5}
                    height={WINDOW_HEIGHT * 0.04}
                    valueOfDate={
                      formik?.values?.emi_start_from
                        ? moment(formik?.values?.emi_start_from).format(
                            'DD-MM-YYYY',
                          )
                        : ''
                    }
                    mode="date"
                    required={true}
                    onChange={date =>
                      formik.setFieldValue(`emi_start_from`, date)
                    }
                  />
                ),
              },
              {
                key: 'No of payment',
                component: (
                  <CardTextInput
                    value={formik?.values?.no_of_payments}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`no_of_payments`, val);
                      formik.setFieldValue(
                        `emi`,
                        (formik?.values?.loan_amount / val).toFixed(2),
                      );
                    }}
                    keyboardType="numeric"
                  />
                ),
              },
              {
                key: 'Emi',
                component: (
                  <CardTextInput
                    value={converToString(formik?.values?.emi)}
                    onChange={val => {
                      formik.setFieldValue(`emi`, val);
                    }}
                    editable={false}
                  />
                ),
              },
              {
                key: 'interest mode',
                component: (
                  <CardDropDown
                    data={interestModeData}
                    value={formik?.values?.interest_mode}
                    onChange={val => {
                      formik.setFieldValue(`interest_mode`, val.value);
                    }}
                    required={formik.values?.interest_mode}
                  />
                ),
              },
              {
                key: 'Interest rate',
                component: (
                  <CardTextInput
                    value={formik?.values?.interest_rate}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`interest_rate`, val);
                    }}
                    keyboardType="numeric"
                  />
                ),
              },
            ]}
          />

          <CustomeCard
            headerName={'Payment details'}
            data={[
              {
                key: 'Payment date',
                component: (
                  <CardDatepicker
                    width={WINDOW_WIDTH * 0.5}
                    height={WINDOW_HEIGHT * 0.04}
                    valueOfDate={
                      formik.values.payment_date
                        ? moment(formik?.values?.payment_date).format(
                            'DD-MM-YYYY',
                          )
                        : ''
                    }
                    mode="date"
                    required={true}
                    onChange={date =>
                      formik.setFieldValue(`payment_date`, date)
                    }
                  />
                ),
              },
              {
                key: 'payment mode',
                component: (
                  <CardDropDown
                    data={paymentModeData}
                    value={formik?.values?.payment_mode}
                    onChange={val => {
                      formik.setFieldValue(`payment_mode`, val.value);
                      formik.setFieldValue(`cheque_number`, '');
                      formik.setFieldValue(`cheque_date`, '');
                    }}
                    required={formik.values?.payment_mode}
                  />
                ),
              },
              ...(formik?.values.payment_mode == '2'
                ? [
                    {
                      key: 'cheque no.',
                      component: (
                        <CardTextInput
                          value={formik?.values?.cheque_number}
                          required={true}
                          onChange={val => {
                            formik.setFieldValue(`cheque_number`, val);
                          }}
                          keyboardType="numeric"
                        />
                      ),
                    },
                  ]
                : []),
              ...(formik?.values?.payment_mode == '2'
                ? [
                    {
                      key: 'cheque date',
                      component: (
                        <CardDatepicker
                          width={WINDOW_WIDTH * 0.5}
                          height={WINDOW_HEIGHT * 0.04}
                          valueOfDate={
                            formik.values.cheque_date
                              ? moment(formik?.values?.cheque_date).format(
                                  'DD-MM-YYYY',
                                )
                              : ''
                          }
                          mode="date"
                          required={true}
                          onChange={date =>
                            formik.setFieldValue(`cheque_date`, date)
                          }
                        />
                      ),
                    },
                  ]
                : []),

              {
                key: 'Bank name',
                component: (
                  <CardTextInput
                    value={formik?.values?.bank}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`bank`, val);
                    }}
                  />
                ),
              },
              {
                key: 'branch name',
                component: (
                  <CardTextInput
                    value={formik?.values?.branch}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`branch`, val);
                    }}
                  />
                ),
              },
              {
                key: 'Remark',
                component: (
                  <CardTextInput
                    value={formik?.values?.remarks}
                    onChange={val => {
                      formik.setFieldValue(`remarks`, val);
                    }}
                  />
                ),
              },
            ]}
          />

          <View style={{ alignSelf: 'center', marginVertical: 10 }}>
            <NeumorphicButton
              title={edit ? `${label.UPDATE}` : `${label.ADD}`}
              titleColor={Colors().purple}
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>
          {/*view for modal of upate */}
          {updateModalVisible && (
            <AlertModal
              visible={updateModalVisible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
              ConfirmBtnPress={() => updateLoanfunction(confirm)}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateLoanScreen;

const styles = StyleSheet.create({});
