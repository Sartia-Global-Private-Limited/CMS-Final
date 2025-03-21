/*    ----------------Created Date :: 12- March -2024   ----------------- */
import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
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
import moment from 'moment';
import WorkQuotationForm from './WorkQuotationForm';
import {
  addWorkQuotation,
  updateWorkQuotation,
} from '../../redux/slices/work-quotation/addUpdateQuotationSlice';
import {addQuotationSchema} from '../../utils/FormSchema';
import {getQuotationDetailById} from '../../redux/slices/work-quotation/getQuotationDetailSlice';

const AddUpdateWorkQuotationScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const complaint_id = route?.params?.complaint_id;
  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
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
      case 'add':
        return '3';
      case 'update':
        return '3';
      case 'finalsubmit':
        return '4';
      case 'readytopi':
        return '5';

      default:
        break;
    }
  };

  const modifiedItemsData = data => {
    const rData = data.map(item => {
      const totalqty = parseFloat(item?.total_qty);
      const amount = item?.rate * totalqty;
      return {
        ...item,
        amount: amount,
      };
    });

    return rData;
  };

  const formik = useFormik({
    enableReinitialize: 'true',

    initialValues: {
      company_from: parseInt(edit?.company_from) || '',
      company_from_state: parseInt(edit?.company_from_state) || '',
      company_to: parseInt(edit?.company_to) || '',
      company_to_regional_office:
        parseInt(edit?.company_to_regional_office) || '',
      quotation_date: edit?.quotation_date || '',
      regional_office_id: parseInt(edit?.regional_office_id) || '',
      sales_area_id: parseInt(edit?.sales_area_id) || '',
      outlet: parseInt(edit?.outlet) || '',
      po_id: edit?.po_id || '',

      items_id:
        edit_id && edit?.items_data
          ? edit?.items_data.map(itm => itm?.order_line_number)
          : [],
      items_data: edit?.items_data ? modifiedItemsData(edit?.items_data) : [],
      po_number: edit?.po_number || '',
      complaint_type: parseInt(edit.complaint_type) || '',
      quotation_type: edit?.quotation_type || '1',
      amount: parseInt(edit?.amount) || '',
      remark: edit?.remark || '',
    },
    validationSchema: addQuotationSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      company_from: values?.company_from,
      company_from_state: values?.company_from_state,
      company_to: values?.company_to,
      company_to_regional_office: values?.company_to_regional_office,
      quotation_date: moment(values?.quotation_date).format('YYYY-MM-DD'),
      regional_office_id: values?.regional_office_id,
      sales_area_id: values?.sales_area_id,
      outlet: values?.outlet,
      po_id: values?.po_id,
      items_data: values?.items_data,
      po_number: values?.po_number,
      quotation_type: values?.quotation_type,
      amount: values?.amount,
      complaint_type: values?.complaint_type,
      remark: values?.remark,
    };

    if (edit_id) {
      sData['id'] = edit_id;
    }

    try {
      setLoading(true);

      const res = edit_id
        ? await dispatch(
            updateWorkQuotation({reqBody: sData, id: edit_id}),
          ).unwrap()
        : await dispatch(addWorkQuotation(sData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
        resetForm();
        navigation.goBack();
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
      getQuotationDetailById(edit_id),
    ).unwrap();

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
            ? `${label.WORK_QUOTATION} ${label.UPDATE}`
            : `${label.WORK_QUOTATION} ${label.ADD}`
        }
      />

      <Text
        style={[
          styles.title,
          {
            marginLeft: 10,
            color: Colors().pending,
            height: 30,
            alignSelf: 'center',
            marginTop: 10,
          },
        ]}>
        Total ₹ {formik.values?.amount ? formik.values?.amount.toFixed(2) : 0}
      </Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <WorkQuotationForm
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

export default AddUpdateWorkQuotationScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
