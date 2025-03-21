/*    ----------------Created Date :: 11- March -2024   ----------------- */
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import { WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import {
  addStockRequestApproveSchema,
  addStockRequestSchema,
} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import { Icon } from '@rneui/base';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import { CheckBox } from '@rneui/themed';
import { selectUser } from '../../../redux/slices/authSlice';
import {
  addStockRequest,
  changeStockRequestStatus,
  updateStockRequest,
} from '../../../redux/slices/stock-management/stock-request/addUpdateStockRequestSlice';
import { getStockRequestDetailById } from '../../../redux/slices/stock-management/stock-request/getStockRequestDetailSlice';
import OldAndNewItem from './OldAndNewItem';
import ScreensLabel from '../../../constants/ScreensLabel';
const AddUpdateApproveStockRequestScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.edit_id;
  const request_tax_type = route?.params?.request_tax_type;
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);
  const label = ScreensLabel();

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [taxType, setTaxType] = useState(request_tax_type || '1');
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState({});

  /* values for request type*/
  const REQUEST_TYPE = [
    { label: 'SELF', value: '1' },
    { label: 'OTHER', value: '2' },
  ];

  /* values for tax type*/
  const TAX_TYPE = [
    { label: 'ITEM WISE', value: '1' },
    { label: 'OVERALL PRICE', value: '2' },
  ];

  useEffect(() => {
    requestCameraPermission();
    requestExternalWritePermission();

    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      user_id: user?.id,
      stock_request_for: edit?.stock_request_for || '1',
      request_tax_type: edit?.request_tax_type || '1',
      ...(type == 'approve' ? { approved_remarks: '' } : {}),
      request_stock_by_user: [
        {
          supplier_id: edit.supplier_id || '',
          area_manager_id: edit.area_manager_id || '',
          supervisor_id: edit.supervisor_id || '',
          office_users_id: edit.office_users_id || '',
          end_users_id: edit.end_users_id || '',

          gst_id: edit.gst_id
            ? {
                label: edit?.gst_type,
                value: edit?.gst_id,
              }
            : '',
          request_stock_images: edit?.request_stock_images || [],
          gst_percent: edit?.gst_percent || '',
          ...(type !== 'approve'
            ? { total_request_qty: edit.total_request_qty }
            : {}),
          new_request_stock:
            type == 'approve' && edit?.approved_data?.length > 0
              ? edit.approved_data?.[0]?.new_request_stock
              : edit?.request_stock?.new_request_stock || [],
          request_stock:
            type == 'approve' && edit?.approved_data?.length > 0
              ? edit.approved_data?.[0]?.request_stock
              : edit?.request_stock?.request_stock || [
                  {
                    item_name: '',
                    prev_item_price: '',
                    prev_user_stock: '',
                    request_quantity: '',
                    total_price: '',
                    current_item_price: '',
                    gst_id: '',
                    gst_percent: '',
                    ...(type === 'approve' ? { approve_quantity: 0 } : {}),
                    ...(type === 'approve' ? { approve_price: 0 } : {}),
                  },
                ],
        },
      ],
    },
    validationSchema:
      type === 'approve'
        ? addStockRequestApproveSchema
        : addStockRequestSchema(taxType),

    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    if (type == 'approve') {
      values['approve_quantity'] = getFinal(
        values.request_stock_by_user,
        'approve_quantity',
        'approved_qty',
      );

      values.request_stock_by_user.forEach(request => {
        request.new_request_stock.forEach(itm => {
          itm['requested_qty'] = itm.qty;
          itm['requested_rate'] = itm.rate;
          itm['rate'] = itm.approved_rate;
          itm['qty'] = itm.approved_qty;
        });
      });
    }

    if (type != 'approve') {
      values.request_stock_by_user.forEach(element => {
        element['total_request_qty'] = calculateFinalStockQty(
          values.request_stock_by_user,
        );
      });
    }

    if (edit_id) {
      values['id'] = edit_id;
    }
    if (type == 'approve') {
      values['status'] = '1';
    }

    try {
      setLoading(true);
      const res =
        type == 'update'
          ? await dispatch(updateStockRequest(values)).unwrap()
          : type == 'approve'
            ? await dispatch(changeStockRequestStatus(values)).unwrap()
            : await dispatch(addStockRequest(values)).unwrap();

      console.log('res', res);
      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        setApproveModalVisible(false);
        setUpdateModalVisible(false);
        resetForm();
        navigation.navigate('StockRequestTopTab');
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        setApproveModalVisible(false);
        setUpdateModalVisible(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setLoading(false);
      setApproveModalVisible(false);
      setUpdateModalVisible(false);
    }
  };

  /*function for taking camera permission */
  requestCameraPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
        );
        // If CAMERA Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        return false;
      }
    } else return true;
  };

  /*function for taking storage read permission */
  requestExternalWritePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        // If WRITE_EXTERNAL_STORAGE Permission is granted
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        // alert('Write permission err', err);
      }
      return false;
    } else return true;
  };

  /*function for fetching the detail of  stock */
  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(
      getStockRequestDetailById(edit_id),
    ).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult.data);
    } else {
      setEdit([]);
    }
  };
  /* fuction to check when approve button is enable while approve flow*/
  const getApproveButtonStatus = () => {
    return formik.values.request_stock_by_user.every(item => {
      return item.request_stock.every(itm => itm.Old_Price_Viewed === true);
    });
  };
  const approveBtnStatus = getApproveButtonStatus();

  /*function  for getting total of approve qty and amount of approved item*/
  const getTotal = (data, key) => {
    let total = 0;
    data.forEach(element => {
      total += parseFloat(element[key]) || 0;
    });

    return total;
  };

  // Function to calculate the Final Stock Amount
  function getFinal(requestData, olItemKey, newItemkey) {
    let totalOfOld = 0;
    let totalOfNew = 0;

    // Loop through each old item object
    requestData.forEach(request => {
      // Calculate sum of "old key" in "request_stock" or old item
      if (request.request_stock) {
        totalOfOld = getTotal(request.request_stock, olItemKey);
      }

      // Calculate sum of "new key" in "new_request_stock" or new item
      if (request.new_request_stock) {
        totalOfNew = getTotal(request.new_request_stock, newItemkey);
      }
    });

    return totalOfOld + totalOfNew;
  }

  // Function to calculate Final Stock Quantity
  function calculateFinalStockQty(requestData) {
    let totalRequestQty = 0;
    let totalNewRequestQty = 0;

    // Loop through each request object
    requestData.forEach(request => {
      // Calculate sum of "request qty" in "request_stock"
      if (request.request_stock) {
        totalRequestQty = getTotal(request.request_stock, 'request_quantity');
      }

      // Calculate sum of "request qty" in "new_request_stock"
      if (request.new_request_stock) {
        totalNewRequestQty = getTotal(request.new_request_stock, 'qty');
      }
    });

    return totalRequestQty + totalNewRequestQty;
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={
          type === 'update'
            ? `${label.UPDATE} ${label.STOCK_REQUEST}`
            : type === 'approve'
              ? `${label.APPROVE} ${label.STOCK_REQUEST}`
              : `${label.STOCK_REQUEST} ${label.ADD}`
        }
      />
      <ScrollView>
        <View style={{ paddingBottom: 150 }}>
          <View>
            <Text
              style={[
                styles.title,
                { marginLeft: 10, marginTop: 5, color: Colors().pureBlack },
              ]}>
              stock REQUEST FOR :--
            </Text>
          </View>
          <View style={styles.radioView}>
            {REQUEST_TYPE.map((radioButton, index) => (
              <View key={index}>
                <CheckBox
                  key={index}
                  textStyle={{
                    fontFamily: Colors().fontFamilyBookMan,
                    color: Colors().gray,
                  }}
                  containerStyle={{
                    backgroundColor: Colors().screenBackground,
                  }}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  title={radioButton.label}
                  disabled={edit_id ? true : false}
                  checked={formik.values.stock_request_for == radioButton.value}
                  onPress={() => {
                    formik.resetForm();

                    if (formik.values.request_tax_type == 2) {
                      formik.setFieldValue('request_tax_type', '2');
                    }

                    formik.setFieldValue(
                      'stock_request_for',
                      radioButton.value,
                    );
                  }}
                  checkedColor={Colors().aprroved}
                />
              </View>
            ))}
          </View>
          {type != 'approve' && (
            <View>
              <Text
                style={[
                  styles.title,
                  {
                    marginLeft: 10,
                    color: Colors().pending,
                    height: 30,
                  },
                ]}>
                FINAL Stock AMOUNT : ₹{' '}
                {getFinal(
                  formik.values.request_stock_by_user,
                  'total_price',
                  'fund_amount',
                )}
              </Text>
            </View>
          )}

          {type == 'approve' && (
            <View>
              <Text
                style={[
                  styles.title,
                  {
                    marginLeft: 10,
                    color: Colors().purple,
                    height: 30,
                  },
                ]}>
                FINAL Approve AMOUNT ₹{' '}
                {getFinal(
                  formik.values.request_stock_by_user,
                  'approve_fund_amount',
                  'approve_fund_amount',
                )}
              </Text>
            </View>
          )}

          <View>
            <Text
              style={[
                styles.title,
                { marginLeft: 10, marginTop: 5, color: Colors().pureBlack },
              ]}>
              tax type :--
            </Text>
          </View>
          <View style={styles.radioView}>
            {TAX_TYPE.map((radioButton, index) => (
              <>
                <CheckBox
                  key={index}
                  textStyle={{
                    fontFamily: Colors().fontFamilyBookMan,
                    color: Colors().gray,
                  }}
                  containerStyle={{
                    backgroundColor: Colors().screenBackground,
                  }}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  title={radioButton.label}
                  disabled={edit_id ? true : false}
                  checked={formik.values.request_tax_type === radioButton.value}
                  onPress={() => {
                    formik.resetForm();

                    if (formik.values.stock_request_for == 2) {
                      formik.setFieldValue('stock_request_for', '2');
                      setTaxType('2');
                    }

                    formik.setFieldValue('request_tax_type', radioButton.value);
                    setTaxType(radioButton.value);
                  }}
                  checkedColor={Colors().aprroved}
                />
              </>
            ))}
          </View>
          {type != 'approve' && (
            <View>
              <Text
                style={[
                  styles.title,
                  {
                    marginLeft: 10,
                    color: Colors().pending,
                    height: 30,
                  },
                ]}>
                FINAL Stock quantity :{' '}
                {getFinal(
                  formik.values.request_stock_by_user,
                  'request_quantity',
                  'qty',
                )}
              </Text>
            </View>
          )}

          {type == 'approve' && (
            <View>
              <Text
                style={[
                  styles.title,
                  {
                    marginLeft: 10,
                    color: Colors().purple,
                    height: 30,
                  },
                ]}>
                FINAL Approve Qty ₹{' '}
                {getFinal(
                  formik.values.request_stock_by_user,
                  'approve_quantity',
                  'approved_qty',
                )}
              </Text>
            </View>
          )}

          {type == 'approve' && (
            <View style={{ margin: WINDOW_WIDTH * 0.03, rowGap: 8 }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={[styles.title, { color: Colors().pureBlack }]}>
                  Approve Remark{' '}
                </Text>
                <Icon
                  name="asterisk"
                  type={IconType.FontAwesome5}
                  size={8}
                  color={Colors().red}
                />
              </View>
              <NeumorphicTextInput
                placeHolderTxt={'TYPE...'}
                placeHolderTxtColor={Colors().pureBlack}
                width={WINDOW_WIDTH * 0.9}
                value={formik.values.approved_remarks}
                style={[styles.inputText, { color: Colors().pureBlack }]}
                keyboardType={'numeric'}
                onChangeText={formik.handleChange(`approved_remarks`)}
              />

              {formik.touched.approved_remarks &&
                formik.errors.approved_remarks && (
                  <Text style={styles.errorMesage}>
                    {formik.errors.approved_remarks}
                  </Text>
                )}
            </View>
          )}

          <View style={{}}>
            <OldAndNewItem
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
                cancelBtnPress={() =>
                  setUpdateModalVisible(!updateModalVisible)
                }
                ConfirmBtnPress={() => formik.handleSubmit()}
              />
            )}

            {approveModalVisible && (
              <AlertModal
                visible={approveModalVisible}
                iconName={'checkcircleo'}
                icontype={IconType.AntDesign}
                iconColor={Colors().aprroved}
                textToShow={'ARE YOU SURE YOU WANT TO APPROVE THIS!!'}
                cancelBtnPress={() =>
                  setApproveModalVisible(!approveModalVisible)
                }
                ConfirmBtnPress={() => formik.handleSubmit()}
              />
            )}

            {type == 'approve' && (
              <View style={{ alignSelf: 'center', marginVertical: 10 }}>
                <NeumorphicButton
                  title={'Existing item '}
                  titleColor={Colors().pending}
                  onPress={() =>
                    navigation.navigate('ExistingItemListScreen', {
                      userId: user?.id,
                    })
                  }
                  // loading={loading}
                />
              </View>
            )}

            <View style={{ alignSelf: 'center', marginVertical: 10 }}>
              <NeumorphicButton
                title={
                  type == 'update'
                    ? label.UPDATE
                    : type == 'approve'
                      ? label.APPROVE
                      : label.ADD
                }
                titleColor={Colors().purple}
                disabled={type == 'approve' ? !approveBtnStatus : false}
                onPress={() => {
                  type == 'update'
                    ? setUpdateModalVisible(true)
                    : type == 'approve'
                      ? setApproveModalVisible(true)
                      : formik.handleSubmit();
                }}
                loading={loading}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateApproveStockRequestScreen;

const styles = StyleSheet.create({
  inputText: {
    fontSize: 15,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  radioView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  errorMesage: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },

  checkboxView: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: '1%',
  },
});
