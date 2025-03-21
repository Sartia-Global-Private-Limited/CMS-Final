/*    ----------------Created Date :: 1 July -2024   ----------------- */
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

import PerformaInvoiceForm from './PerformaInvoiceForm';
import {
  generatePerformaInvoice,
  updatePerformaInvoice,
} from '../../../redux/slices/billing management/performa invoice/addUpdatePerformaInvoiceSlice';
import {addPerformaInvoiceSchema} from '../../../utils/FormSchema';
import {getPIDetailById} from '../../../redux/slices/billing management/performa invoice/getPerformaInvoiceDetailSlice';

const AddUpdatePIScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const complaint_id = route?.params?.complaint_id;
  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;
  const dataFromListing = route?.params?.dataFromListing;
  let regionalOfficceId, companyDetails, poId, measurements;

  if (dataFromListing && Object.keys(dataFromListing).length > 0) {
    ({regionalOfficceId, companyDetails, poId, measurements} = dataFromListing);
  }
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState([]);
  const [buttonPressed, setButtonPressed] = useState('');

  useEffect(() => {
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  /*function will return status code to send */
  const getStatus = () => {
    switch (buttonPressed) {
      case 'update':
        return '1';
      case 'final':
        return '2';

      default:
        break;
    }
  };

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      billing_from: edit?.billing_from?.company_id || '',
      billing_from_state: edit?.billing_from_state_id || '',
      billing_to: edit?.billing_to
        ? {
            label: edit?.billing_to?.company_name,
            value: edit?.billing_to?.company_id,
          }
        : {label: companyDetails?.name, value: companyDetails?.id},
      billing_to_ro_office: edit?.billing_to_ro_office
        ? {
            label: edit?.billing_to_ro_office?.ro_name,
            value: edit?.billing_to_ro_office?.ro_id,
          }
        : {label: regionalOfficceId?.name, value: regionalOfficceId?.id},
      financial_year: edit?.financial_year || '',
      complaint_for: edit?.complaint_for
        ? edit?.complaint_for
        : companyDetails?.complaint_for,
      po_number: edit?.po_number
        ? {
            label: edit?.po_number,
            value: edit?.po_id,
          }
        : {label: poId?.name, value: poId?.id},

      measurementIds:
        edit?.getMeasurements?.length > 0
          ? edit.getMeasurements.map(item => {
              return item.measurement_list;
            })
          : measurements,

      measurements:
        edit?.getMeasurements?.length > 0
          ? edit.getMeasurements.map(item => {
              return {
                label: item.complaintDetails.complaint_unique_id,
                value: item.complaintDetails.complaint_id,
              };
            })
          : '',
      work: edit?.work || '',
      measurement_date: edit?.measurement_date
        ? moment(edit.measurement_date).format('YYYY-MM-DD')
        : moment().format('YYYY-MM-DD'),

      complaint_id: edit?.complaintDetails
        ? edit?.complaintDetails.map(itm => itm?.id)
        : [],
    },
    validationSchema: addPerformaInvoiceSchema,

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      billing_from: values?.billing_from,
      billing_from_state: values?.billing_from_state,
      billing_to: values?.billing_to?.value,
      billing_to_ro_office: values?.billing_to_ro_office?.value,

      complaint_for: values?.complaint_for,
      complaint_id: values?.complaint_id,
      po_number: values?.po_number?.value,
      financial_year: values?.financial_year,

      measurements: values?.measurements,
      work: values?.work,
    };

    if (edit_id) {
      sData['id'] = edit_id;
      sData['status'] = getStatus();
    }

    try {
      setLoading(true);

      const res = edit_id
        ? await dispatch(updatePerformaInvoice(sData)).unwrap()
        : await dispatch(generatePerformaInvoice(sData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
        resetForm();
        navigation.navigate('PerformaInvoiceTopTab');
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
    const fetchResult = await dispatch(getPIDetailById(edit_id)).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult.data);
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
            ? `${label.PERFORMA_INVOICE} ${label.UPDATE}`
            : `${label.PERFORMA_INVOICE} ${label.ADD}`
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <PerformaInvoiceForm
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
            {(type == 'readytopi' ||
              type == 'performainvoice' ||
              type == 'final') && (
              <NeumorphicButton
                title={edit_id ? `${label.UPDATE}` : `${label.ADD}`}
                titleColor={Colors().purple}
                disabled={type == 'approve' ? !approveBtnStatus : false}
                onPress={() => {
                  edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
                  edit_id && type == 'final'
                    ? setButtonPressed('final')
                    : setButtonPressed('update');
                }}
                loading={loading}
              />
            )}
            {type == 'performainvoice' && (
              <NeumorphicButton
                title={'final submit'}
                titleColor={Colors().purple}
                disabled={type == 'approve' ? !approveBtnStatus : false}
                onPress={() => {
                  edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
                  edit_id ? setButtonPressed('final') : setButtonPressed('');
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

export default AddUpdatePIScreen;

const styles = StyleSheet.create({
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
