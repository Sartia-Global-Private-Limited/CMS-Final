/*   ---------------Created By ::  Suryabhan Chauhan    --------------  */
/*    ----------------Created Date :: 11- March -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import {
  addFundRequestSchema,
  approveFundRequestSchema,
} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { Avatar, CheckBox } from '@rneui/themed';
import Images from '../../../constants/Images';
import { apiBaseUrl } from '../../../../config';
import { selectUser } from '../../../redux/slices/authSlice';
import {
  addFundRequest,
  changeFundRequestStatus,
  updateFundRequest,
} from '../../../redux/slices/fund-management/fund-request/addUpdateFundRequestSlice';
import { getFundRequestDetailById } from '../../../redux/slices/fund-management/fund-request/getFundRequestDetailSlice';
import FundRequestFilter from './FundRequestFilter';
import OldFundRequestItem from './OldFundRequestItem';
import NewFundRequestItem from './NewFundRequestItem';
import ScreensLabel from '../../../constants/ScreensLabel';

const AddUpdateApproveFundRequestScreen = ({ navigation, route }) => {
  /* declare props constant variale*/

  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState({});

  const COMPANY_TYPE = [
    { label: 'SELF REQUEST', value: '1' },
    { label: 'OTHER REQUEST', value: '2' },
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
      request_data: [
        {
          supplier_id: edit?.supplier_id || {},
          user_id: edit?.user_id
            ? {
                label: edit.user_name,
                value: edit.user_id,
                image: `${apiBaseUrl}${edit?.user_image}`,
              }
            : {
                value: user?.id,
                label: `${user?.name} (${user?.employee_id} - self)`,
                image: user?.image
                  ? `${apiBaseUrl}${user?.image}`
                  : `${apiBaseUrl}/assets/images/default-image.png`,
              },
          area_manager_id: edit?.area_manager_id?.id
            ? {
                label: edit?.area_manager_id?.name,
                value: edit?.area_manager_id?.id,
                image: `${apiBaseUrl}${edit?.area_manager_id?.image}`,
              }
            : '',
          office_users_id: edit?.office_users_id?.id
            ? {
                label: edit?.office_users_id?.name,
                value: edit?.office_users_id?.id,
                image: `${apiBaseUrl}${edit?.office_users_id?.image}`,
              }
            : '',
          supervisor_id: edit?.supervisor_id?.id
            ? {
                label: edit.supervisor_id?.name,
                value: edit.supervisor_id?.id,
                image: `${apiBaseUrl}${edit.supervisor_id?.image}`,
              }
            : '',
          end_users_id: edit?.end_users_id?.id
            ? {
                label: edit.end_users_id?.name,
                value: edit.end_users_id?.id,
                image: `${apiBaseUrl}${edit.end_users_id?.image}`,
              }
            : '',
          request_fund: edit?.approved_data
            ? edit?.approved_data?.request_fund
            : edit?.request_fund?.request_fund || [
                {
                  item_name: '',
                  description: '',
                  current_user_stock: '',
                  previous_price: '',
                  current_price: '',
                  request_quantity: '',
                  fund_amount: '',
                  request_transfer_fund: 0,
                  total_approve_amount: 0,
                },
              ],
          new_request_fund: edit?.approved_data
            ? edit?.approved_data?.new_request_fund
            : edit?.request_fund?.new_request_fund || [],
        },
      ],
      fund_request_for: edit?.fund_request_for?.toString() || '1',
    },
    validationSchema:
      type == 'approve' ? approveFundRequestSchema : addFundRequestSchema,

    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const modifiedRequest = values?.request_data?.map(item => {
      const totalRequest_amount_oldItems =
        item?.request_fund.reduce(
          (total, itm) => total + +itm?.fund_amount,
          0,
        ) || 0;

      const totalRequest_amount_newItems =
        item?.new_request_fund?.reduce(
          (total, itm) => total + +itm?.fund_amount,
          0,
        ) || 0;

      const new_request_fund_modified =
        values?.request_data?.[0].new_request_fund.map(data => {
          return {
            ...data,
            requested_rate: data.rate,
            requested_qty: data?.qty,
            rate: data?.approved_rate,
            qty: data?.approved_qty,
            fund_amount: data?.approve_fund_amount,
          };
        });

      const request_fund = item?.request_fund
        .map(d => {
          if (d.item_name) return d;
        })
        .filter(a => a);
      const totalApproveQty = item?.request_fund.reduce(
        (userTotal, item) =>
          edit?.approved_data
            ? userTotal +
              +item?.quantity * +item?.price +
              item?.total_approved_amount
            : userTotal + +item?.quantity * +item?.price,
        0,
      );

      return {
        ...item,
        ...(type === 'approve' && {
          total_approve_amount: totalApproveQty,
        }),

        request_fund: request_fund,
        new_request_fund:
          type == 'approve' ? new_request_fund_modified : item.new_request_fund,
        total_request_amount:
          totalRequest_amount_oldItems + totalRequest_amount_newItems,
        user_id: item?.user_id?.value,
        area_manager_id: item?.area_manager_id?.value,
        supervisor_id: item?.supervisor_id?.value,
        end_users_id: item?.end_users_id?.value,
        office_users_id: item?.office_users_id?.value,
      };
    });

    const sData = {
      fund_request_for: +values?.fund_request_for,
      user_id: values?.request_data[0]?.user_id?.value,
      request_data: modifiedRequest,
    };

    if (edit_id) {
      sData['id'] = edit_id;
    }
    if (type == 'approve') {
      values['status'] = '1';
    }
    // return console.log('values', values);

    try {
      setLoading(true);

      const res =
        type == 'update'
          ? await dispatch(updateFundRequest(sData)).unwrap()
          : type == 'approve'
            ? await dispatch(changeFundRequestStatus(sData)).unwrap()
            : await dispatch(addFundRequest(sData)).unwrap();

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
        navigation.navigate('FundRequestTopTab');
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
      console.log('error', error);
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

  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(
      getFundRequestDetailById(edit_id),
    ).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult.data);
    } else {
      setEdit([]);
    }
  };

  const getApproveButtonStatus = () => {
    return formik.values.request_data.every(item => {
      return item?.request_fund.every(itm => itm?.Old_Price_Viewed === true);
    });
  };

  const approveBtnStatus = getApproveButtonStatus();

  // Function to calculate the sum of "fund_amount"
  function calculateTotalFundAmount(requestData) {
    let totalRequestAmt = 0;
    let totalNewRequestAmount = 0;

    // Loop through each request object
    requestData.forEach(request => {
      // Calculate sum of "fund_amount" in "request_fund"
      if (request.request_fund) {
        request.request_fund.forEach(item => {
          totalRequestAmt += item?.fund_amount || 0;
        });
      }

      // Calculate sum of "fund_amount" in "new_request_fund"
      if (request.new_request_fund) {
        request.new_request_fund.forEach(item => {
          totalNewRequestAmount += item?.fund_amount || 0;
        });
      }
    });

    return totalRequestAmt + totalNewRequestAmount;
  }

  // Function to calculate the sum of approved "fund_amount"
  function calculateTotalApprovedAmount(requestData) {
    let totalApprovedAmt = 0;
    let totalNewApprovedAmount = 0;

    requestData.forEach(request => {
      // Calculate sum of "fund_amount" in "request_fund"
      if (request.request_fund) {
        request.request_fund.forEach(item => {
          totalApprovedAmt += parseFloat(item?.total_approve_amount) || 0;
        });
      }

      // Calculate sum of "fund_amount" in "new_request_fund"
      if (request.new_request_fund) {
        request.new_request_fund.forEach(item => {
          totalNewApprovedAmount += parseFloat(item?.approve_fund_amount) || 0;
        });
      }
    });

    return totalApprovedAmt + totalNewApprovedAmount;
  }
  const totalFundAmount = calculateTotalFundAmount(formik.values.request_data);
  const totalApprovedAmount = calculateTotalApprovedAmount(
    formik.values.request_data,
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        leftIconPress={() => navigation.goBack()}
        // headerTitle={edit_id ? 'update fund request ' : 'Add Fund request'}
        headerTitle={
          type === 'update'
            ? `${label.UPDATE} ${label.FUND_MANAGEMENT}`
            : type === 'approve'
              ? `${label.APPROVE} ${label.FUND_MANAGEMENT}`
              : ` ${label.FUND_MANAGEMENT} ${label.ADD}`
        }
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'home'}
        rightIcontype={IconType.AntDesign}
        rightIconPress={() => navigation.navigate('BottomTabNavigation')}
      />
      <Text
        style={[
          styles.title,
          { marginLeft: 10, marginTop: 5, color: Colors().pureBlack },
        ]}>
        FUND REQUEST FOR :--
      </Text>
      <View
        style={{
          flexDirection: 'row',
          // backgroundColor: Colors().darkShadow,

          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}>
        {COMPANY_TYPE.map((radioButton, index) => (
          <>
            <CheckBox
              key={index}
              textStyle={{
                fontFamily: Colors().fontFamilyBookMan,
                color: Colors().pureBlack,
              }}
              containerStyle={{
                backgroundColor: Colors().screenBackground,
              }}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              title={radioButton.label}
              disabled={edit_id ? true : false}
              checked={formik.values.fund_request_for === radioButton.value}
              onPress={() => {
                formik.resetForm();
                // if (radioButton.value == 2) {
                //   fetchMangerData();
                //   fetchUserData();
                // }

                formik.setFieldValue('fund_request_for', radioButton.value);
              }}
              checkedColor={Colors().aprroved}
            />
          </>
        ))}
      </View>

      <Text
        style={[
          styles.title,
          {
            marginLeft: 10,
            color: Colors().pending,
            height: 30,
          },
        ]}>
        FINAL FUND AMOUNT ₹ {totalFundAmount}
      </Text>
      {type == 'approve' && (
        <Text
          style={[
            styles.title,
            {
              marginLeft: 10,
              color: Colors().aprroved,
              height: 30,
            },
          ]}>
          FINAL Approve AMOUNT ₹ {totalApprovedAmount}
        </Text>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {formik.values.request_data.map((item, index) => (
            <>
              <View style={{ rowGap: 2 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  {formik.values.fund_request_for == 1 && (
                    <>
                      <NeuomorphAvatar gap={4}>
                        <Avatar
                          size={40}
                          rounded
                          source={{
                            uri: user?.image
                              ? `${apiBaseUrl}${user?.image}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          }}
                        />
                      </NeuomorphAvatar>
                      <Text
                        numberOfLines={2}
                        style={[
                          styles.title,
                          {
                            alignSelf: 'center',
                            marginHorizontal: 10,
                            textAlign: 'center',
                            color: Colors().gray2,
                          },
                        ]}>
                        {user?.name} ({user?.employee_id} self)
                      </Text>
                    </>
                  )}
                </View>
              </View>
              <FundRequestFilter
                formik={formik}
                type={type}
                edit={edit}
                index={index}
                edit_id={edit_id}
              />

              <OldFundRequestItem
                item={item}
                index={index}
                formik={formik}
                type={type}
                edit_id={edit_id}
                edit={edit}
              />

              <NewFundRequestItem
                item={item}
                index={index}
                formik={formik}
                type={type}
                edit_id={edit_id}
                edit={edit}
              />
            </>
          ))}

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

          <View style={{ alignSelf: 'center', marginVertical: 20 }}>
            <NeumorphicButton
              title={
                type == 'update'
                  ? `${label.UPDATE}`
                  : type == 'approve'
                    ? `${label.APPROVE}`
                    : `${label.ADD}`
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateApproveFundRequestScreen;

const styles = StyleSheet.create({
  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
