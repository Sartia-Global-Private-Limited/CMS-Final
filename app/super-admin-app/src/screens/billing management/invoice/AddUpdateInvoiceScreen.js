import {StyleSheet, View, SafeAreaView, ScrollView} from 'react-native';
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
import InoviceForm from './InoviceForm';
import {addInvoiceSchema} from '../../../utils/FormSchema';
import {
  generateInvoice,
  updateInvoice,
} from '../../../redux/slices/billing management/inovice/addUpdateInvoiceSlice';
import {getInvoiceDetailById} from '../../../redux/slices/billing management/inovice/getInvoiceDetailSlice';

const AddUpdateInvoiceScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;
  const dataFromListing = route?.params?.dataFromListing;
  let regionalOfficceId, companyDetails, poId, measurements;

  if (dataFromListing && Object.keys(dataFromListing).length > 0) {
    ({
      poId,
      regionalOfficceId,
      billingFromId,
      billingToId,
      measurements,
      complaint_for,
    } = dataFromListing);
  }

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
    enableReinitialize: true,
    initialValues: {
      financial_year: edit?.financial_year || '',
      invoice_date: edit?.invoice_date
        ? moment(edit.invoice_date).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD'),
      callup_number: edit?.callup_number || '',

      pi_id: edit?.getMeasurements
        ? edit?.getMeasurements.map(itm => itm?.pi_id)
        : [],

      complaint_for: edit?.complaint_for ? edit?.complaint_for : complaint_for,
      po_number: edit?.po_number
        ? {
            label: edit?.po_number,
            value: edit?.po_id,
          }
        : poId,
      regional_office: regionalOfficceId,
      billing_from: billingFromId,
      billing_to: billingToId,

      measurementIds:
        edit?.getMeasurements?.length > 0
          ? edit.getMeasurements.map(item => {
              return item?.pi_id;
            })
          : measurements,
    },
    validationSchema: addInvoiceSchema,

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      financial_year: values?.financial_year,
      callup_number: values?.callup_number,
      invoice_date: values?.invoice_date,
      pi_id: values?.pi_id,

      billing_to: values?.billing_to,
      companies_for: values?.complaint_for,
      billing_from: values?.billing_from,
      regional_office: values?.regional_office,
      po_number: values?.po_number,
    };

    const updateData = {
      financial_year: values?.financial_year,
      callup_number: values?.callup_number,
      invoice_date: values?.invoice_date,
    };

    if (edit_id) {
      updateData['id'] = edit_id;
    }

    try {
      setLoading(true);

      const res = edit_id
        ? await dispatch(updateInvoice(updateData)).unwrap()
        : await dispatch(generateInvoice(sData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
        resetForm();
        navigation.navigate('InvoiceTopTab');
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
    const fetchResult = await dispatch(getInvoiceDetailById(edit_id)).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult.data[0]);
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
            ? `${label.INVOICE} ${label.UPDATE}`
            : `${label.INVOICE} ${label.ADD}`
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <InoviceForm
            formik={formik}
            type={type}
            edit_id={edit_id}
            edit={edit}
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
            {(type == 'readytoinvoice' || type == 'final') && (
              <NeumorphicButton
                title={edit_id ? `${label.UPDATE}` : `${label.ADD}`}
                titleColor={Colors().purple}
                disabled={type == 'approve' ? !approveBtnStatus : false}
                onPress={() => {
                  edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
                }}
                loading={loading}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateInvoiceScreen;

const styles = StyleSheet.create({});
