/*    ----------------Created Date :: 20- July -2024   ----------------- */
import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
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
import CreatePaymentForm from './CreatePaymentForm';
import {
  addPayement,
  updatePayement,
} from '../../../redux/slices/billing management/payment update/addUpdatePayementSlice';
import {addPaymentSchema} from '../../../utils/FormSchema';
import {getPaymentReceivedDetailById} from '../../../redux/slices/billing management/payment received/getPaymentReceivedDetailSlice';

const AddUpdatePayment = ({navigation, route}) => {
  /* declare props constant variale*/
  const {id} = route?.params?.reqBody || {};

  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([]);

  useEffect(() => {
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

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
    const sData = values?.invoiceData.map(itm => {
      return {
        pv_number: values?.pv_number,
        receipt_date: moment(values?.receipt_date).format('YYYY-MM-DD'),
        pv_amount: converToNumber(values?.pv_amount).toFixed(2),

        invoice_number: itm.invoice_number,
        invoice_date: itm?.invoice_date,
        invoice_id: itm?.invoice_id,

        net_amount: converToNumber(itm?.net_amount).toFixed(2) || 0,
        gst_amount: converToNumber(itm?.gst_amount).toFixed(2) || 0,
        gross_amount: converToNumber(itm?.gross_amount).toFixed(2) || 0,

        igst: 0,
        sgst: 0,
        cgst: 0,
        received_gst: 0,

        tds: converToNumber(itm?.tds).toFixed(2) || 0,
        tds_amount: converToNumber(itm?.tds_amount).toFixed(2) || 0,
        tds_on_gst: converToNumber(itm?.tds_on_gst).toFixed(2) || 0,
        tds_on_gst_amount:
          converToNumber(itm?.tds_on_gst_amount).toFixed(2) || 0,
        retention: converToNumber(itm?.retention).toFixed(2) || 0,
        retention_amount: converToNumber(itm?.retention_amount).toFixed(2) || 0,

        covid19_amount_hold:
          converToNumber(itm?.covid19_amount_hold).toFixed(2) || 0,
        ld_amount: converToNumber(itm?.ld_amount).toFixed(2) || 0,
        hold_amount: converToNumber(itm?.hold_amount).toFixed(2) || 0,
        other_deduction: converToNumber(itm?.other_deduction).toFixed(2) || 0,

        amount_received: converToNumber(itm?.amount_received).toFixed(2) || 0,
      };
    });

    if (edit_id) {
      sData[0].id = edit_id;
    }

    try {
      setLoading(true);

      const res = edit_id
        ? await dispatch(updatePayement(sData)).unwrap()
        : await dispatch(addPayement(sData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
        resetForm();
        if (edit) {
          navigation.navigate('PaymentReceivedTopTab');
        } else {
          navigation.navigate('PaymentUpdateListScreen');
        }
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
  /*fucntion for fetching detail of measurement*/
  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(
      getPaymentReceivedDetailById(edit_id),
    ).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult?.data);
    } else {
      setEdit([]);
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
            ? `${label.PAYMENT} ${label.UPDATE}`
            : `${label.PAYMENT} ${label.ADD}`
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <CreatePaymentForm
            formik={formik}
            type={type}
            edit_id={edit_id}
            edit={edit}
            selectedId={id}
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
              title={edit_id ? `${label.UPDATE}` : `${label.ADD}`}
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

export default AddUpdatePayment;

const styles = StyleSheet.create({});
