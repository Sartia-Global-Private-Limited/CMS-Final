/*    ----------------Created Date :: 25- March -2024   ----------------- */
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
import {Menu, MenuItem} from 'react-native-material-menu';
import MeasurementForm from './MeasurementForm';
import {
  addMeasurement,
  updateMeasurement,
} from '../../../redux/slices/billing management/measurement/addUpdateMeasurementSlice';
import {getMeasurementByComplaintId} from '../../../redux/slices/billing management/measurement/getMeasurementDetailSlice';

const AddUpdateMeasurementScreen = ({navigation, route}) => {
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
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState([]);
  const [buttonPressed, setButtonPressed] = useState('');

  const menuData = ['View Hard copy', 'View Fund detail', 'View stock detail'];

  /*fucntion for menu button action*/
  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');

    setVisible(false);

    switch (valueToSend) {
      case 'ViewHardcopy':
        navigation.navigate('ViewMeasurementDetailScreen', {
          complaint_id: complaint_id,
        });
        break;
      case 'ViewFunddetail':
        navigation.navigate('PtmStockAndFundViewScreen', {
          complaint_id: complaint_id,
          type: 'fund',
        });
        break;
      case 'Viewstockdetail':
        navigation.navigate('PtmStockAndFundViewScreen', {
          complaint_id: complaint_id,
          type: 'stock',
        });
        break;

      default:
        break;
    }
  };

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
      ro_office_id: edit
        ? {
            regional_office_name: edit?.regional_office_name,
            id: edit?.ro_office_id,
          }
        : '',
      sale_area_id: edit
        ? {
            sales_area_name: edit?.sales_area_name,
            id: edit?.sale_area_id,
          }
        : '',
      outlet_id: edit
        ? {
            outlet_name: edit?.outlet_name,
            id: edit?.outlet_id,
          }
        : '',
      complaint_id: complaint_id,
      energy_company_id: edit?.energy_company_id || '',
      complaint_for: edit?.complaint_for || '',
      complaint_unique_id: edit?.complaint_type_name || '',

      financial_year: edit?.financial_year || '',
      measurement_date: edit?.measurement_date || '',

      po_id: edit?.po_id || '',
      po_for: edit?.po_for || '',
      poLimit: '',
      poUsedAmount: '',

      items_id:
        edit_id && edit?.items_data
          ? edit?.items_data.map(itm => itm?.order_line_number)
          : [],
      items_data: edit?.items_data ? modifiedItemsData(edit?.items_data) : [],
      status: edit?.status || '',
      amount: edit?.measurement_amount || '',
    },
    // validationSchema: addPoSchema,

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      energy_company_id: values?.energy_company_id,
      amount: values?.amount,

      complaint_for: values?.complaint_for,
      complaint_id: values?.complaint_id,

      po_for: values?.po_for,
      po_id: values?.po_id,

      measurement_date: values?.measurement_date
        ? moment(values?.measurement_date).format('YYYY-MM-DD')
        : moment().format('YYYY - MM - DD'),
      financial_year: values?.financial_year,

      ro_office_id: values?.ro_office_id?.id,
      sale_area_id: values?.sale_area_id?.id,
      outlet_id: values?.outlet_id?.id,
      items_data: values?.items_data,
      status: getStatus(),
    };

    if (edit_id) {
      sData['id'] = edit_id;
    }

    try {
      setLoading(true);

      const res = edit_id
        ? await dispatch(updateMeasurement(sData)).unwrap()
        : await dispatch(addMeasurement(sData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
        resetForm();
        navigation.navigate('MeasurementTopTab');
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
      getMeasurementByComplaintId(edit_id),
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
            ? `${label.MEASUREMENTS} ${label.UPDATE}`
            : `${label.MEASUREMENTS} ${label.ADD}`
        }
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'dots-three-vertical'}
        rightIcontype={IconType.Entypo}
        rightIconPress={() => setVisible(!visible)}
      />
      <View style={{}}>
        <View style={{alignSelf: 'flex-end'}}>
          <Menu
            visible={visible}
            onRequestClose={() => setVisible(false)}
            style={{}}>
            {menuData.map(itm => (
              <MenuItem
                style={{
                  backgroundColor: Colors().cardBackground,
                }}
                textStyle={
                  [styles.cardtext, {color: Colors().pureBlack}] // Otherwise, use the default text style
                }
                onPress={() => {
                  hideMenu(itm);
                }}>
                {itm}
              </MenuItem>
            ))}
          </Menu>
        </View>
      </View>

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
      {formik.values.po_for == '2' &&
        formik.values.amount >
          formik.values?.poLimit - formik.values?.poUsedAmount && (
          <Text
            style={[
              styles.title,
              {
                marginLeft: 10,
                color: Colors().red,
                height: 30,
                alignSelf: 'center',
              },
            ]}>
            TOTAL ITEM AMOUNT IS GREATER THAN LIMIT
          </Text>
        )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <MeasurementForm
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
            {(type == 'ptm' || type == 'readytopi' || type == 'draft') && (
              <NeumorphicButton
                title={edit_id ? `${label.UPDATE}` : `${label.ADD}`}
                titleColor={Colors().purple}
                disabled={type == 'approve' ? !approveBtnStatus : false}
                onPress={() => {
                  edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
                  edit_id
                    ? setButtonPressed('update')
                    : setButtonPressed('add');
                }}
                loading={loading}
              />
            )}
            {(type == 'draft' || type == 'final') && (
              <NeumorphicButton
                title={'Final submit'}
                titleColor={Colors().purple}
                disabled={type == 'approve' ? !approveBtnStatus : false}
                onPress={() => {
                  edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
                  setButtonPressed('finalsubmit');
                }}
                loading={loading}
              />
            )}

            {type == 'final' && (
              <NeumorphicButton
                title={'Ready to pi'}
                titleColor={Colors().purple}
                disabled={type == 'approve' ? !approveBtnStatus : false}
                onPress={() => {
                  edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
                  setButtonPressed('readytopi');
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

export default AddUpdateMeasurementScreen;

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
