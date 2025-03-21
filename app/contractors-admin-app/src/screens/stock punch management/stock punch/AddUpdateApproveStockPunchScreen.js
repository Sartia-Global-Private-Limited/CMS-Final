/*    ----------------Created Date :: 23- April -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {
  addStockPunchSchema,
  approveStockPunchSchema,
} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {selectUser} from '../../../redux/slices/authSlice';
import Images from '../../../constants/Images';
import {getWalletDetailByUserId} from '../../../redux/slices/commonApi';
import Loader from '../../../component/Loader';
import StockPunchItemComponent from './StockPunchItemComponent';
import StockPunchFilter from './StockPunchFilter';
import ExpensePunchBillComponent from '../../expense mangement/expense punch/ExpensePunchBillComponent';
import {
  addStockPunch,
  approveStockPunch,
} from '../../../redux/slices/stock-punch-management/stock-punch/addApproveStockPunchSlice';
import OTPTextView from 'react-native-otp-textinput';
import {getStockPunchDetailById} from '../../../redux/slices/stock-punch-management/stock-punch/getStockPunchDetailSlice';
import ScreensLabel from '../../../constants/ScreensLabel';
const AddUpdateApproveStockPunchScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const complaintId = route?.params?.complaintId;
  const userId = route?.params?.userId;
  const type = route?.params?.type;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const {user} = useSelector(selectUser);

  /*declare useState variable here */
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [edit, setEdit] = useState([]);
  const [wallet, setWallet] = useState();

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      ...(type == 'approve' ? {user_id: userId} : {}),
      ...(type != 'approve' ? {area_manager_id: ''} : {}),
      ...(type != 'approve' ? {supervisor_id: ''} : {}),
      ...(type != 'approve' ? {end_users_id: ''} : {}),
      ...(type != 'approve' ? {otp: ''} : {}),

      complaint_id: complaintId ? complaintId : '',

      stock_punch_detail:
        type == 'approve'
          ? edit
          : [
              {
                item_qty: 0,
                total_price: 0,
              },
            ],

      ...(type == 'approve'
        ? {
            transaction_images: [
              {
                image: '',
                title: '',
              },
            ],
          }
        : {}),
    },
    validationSchema:
      type === 'approve' ? approveStockPunchSchema : addStockPunchSchema,

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  useEffect(() => {
    requestCameraPermission();
    requestExternalWritePermission();

    if (type !== 'approve') {
      fetchWallet();
    }

    if (complaintId && userId) {
      fetchSingleDetails();
    }
  }, [
    complaintId,
    userId,
    formik.values.expense_punch_for,
    formik.values.area_manager_id,
    formik.values.supervisor_id,
    formik.values.end_users_id,
  ]);

  const handleSubmit = async (values, resetForm) => {
    let sData;
    let modifiedItem = [];
    if (type == 'approve') {
      values.stock_punch_detail.forEach(request => {
        if (request?.remaining_approved_qty > 0) {
          modifiedItem.push({
            item_qty: request?.approve_qty,
            item_id: request?.item_id,
            id: request?.id,
            remaining_qty:
              Number(request?.remaining_approved_qty) -
              Number(request?.approve_qty),
          });
        }
      });
    }
    if (type != 'approve') {
      values.stock_punch_detail.forEach(request => {
        modifiedItem.push({
          item_qty: request?.item_qty,
          item_id: request?.item_id,
          stock_id: request?.stock_id,
          remaining_qty: request?.remaining_qty,
          price: request?.price,
          total_price: request?.total_price,
        });
      });
    }

    values['stock_punch_detail'] = modifiedItem;

    if (type == 'approve') {
      sData = {
        user_id: values?.user_id,
        complaint_id: values?.complaint_id,
        items: values?.stock_punch_detail,
        transaction_images: values?.transaction_images,
      };
    }

    try {
      if (values.otp) {
        setLoading(true);
      }

      const res =
        type == 'approve'
          ? await dispatch(approveStockPunch(sData)).unwrap()
          : await dispatch(addStockPunch(values)).unwrap();

      if (res?.status) {
        if (!values.otp && type != 'approve') {
          setOtpModalVisible(true);
          Toast.show({
            type: 'success',
            text1: res?.message,
            position: 'bottom',
          });
        } else {
          Toast.show({
            type: 'success',
            text1: res?.message,
            position: 'bottom',
          });
          setLoading(false);
          setApproveModalVisible(false);

          resetForm();
          navigation.navigate('StockPunchTopTab');
        }
      } else {
        if (res?.message == 'Invalid OTP!') {
          setOtpModalVisible(true);
        }
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        setApproveModalVisible(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setLoading(false);
      setApproveModalVisible(false);
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
      getStockPunchDetailById({complaintId, userId}),
    ).unwrap();

    if (fetchResult?.status) {
      const modifiedData = fetchResult?.data.filter(
        itm => itm.remaining_approved_qty > 0,
      );
      setEdit(modifiedData);
      setIsLoading(false);
    } else {
      setEdit([]);
    }
  };

  /*funciton for fetching wallet  detail*/
  const fetchWallet = async () => {
    const fetchResult = await dispatch(
      getWalletDetailByUserId(
        formik.values.expense_punch_for == 1
          ? user.id
          : formik.values.end_users_id ||
              formik.values.supervisor_id ||
              formik.values.area_manager_id,
      ),
    ).unwrap();

    if (fetchResult?.status) {
      setWallet(fetchResult?.data);
    } else {
      setWallet('');
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
          type === 'approve'
            ? `${label.STOCK_PUNCH} ${label.APPROVE}`
            : `${label.STOCK_PUNCH} ${label.ADD}`
        }
      />

      <ScrollView>
        <ImageBackground
          source={Images.BANK_CARD}
          imageStyle={{borderRadius: WINDOW_WIDTH * 0.03}}
          style={styles.bankCard}>
          {type !== 'approve' && (
            <Text style={[styles.title, {color: 'white', fontSize: 15}]}>
              transfer Amount :₹{' '}
              {wallet ? wallet?.totalTransferAmounts : '0000'}
            </Text>
          )}
          {type == 'approve' && (
            <Text style={[styles.title, {color: 'white', fontSize: 15}]}>
              complaint no : {edit ? edit[0]?.complaint_unique_id : '0000'}
            </Text>
          )}
          {type != 'approve' && (
            <Text
              style={[
                styles.title,
                {color: 'white', fontSize: 22, alignSelf: 'center'},
              ]}>
              {wallet ? wallet?.userName : 'Account Number'}
            </Text>
          )}
          {type == 'approve' && (
            <Text
              style={[
                styles.title,
                {color: 'white', fontSize: 22, alignSelf: 'center'},
              ]}>
              {edit ? edit[0]?.user_name : 'user name'}
            </Text>
          )}

          {type !== 'approve' && (
            <View
              style={[styles.twoItemView, {justifyContent: 'space-between'}]}>
              <Text style={[styles.title, {color: 'white', maxWidth: '50%'}]}>
                Limit :₹ {wallet ? wallet?.userCreditLimit : '0000'}
              </Text>
              <Text style={[styles.title, {color: 'white', maxWidth: '50%'}]}>
                balance: ₹ {wallet ? wallet?.userWalletBalance : '0000'}
              </Text>
            </View>
          )}
        </ImageBackground>
        {type == 'approve' && isLoading && (
          <View style={{height: WINDOW_HEIGHT / 2, width: WINDOW_WIDTH}}>
            <Loader />
          </View>
        )}
        {type !== 'approve' && (
          <StockPunchFilter formik={formik} type={type} edit={edit} />
        )}

        <StockPunchItemComponent formik={formik} type={type} edit={edit} />

        {type == 'approve' && (
          <ExpensePunchBillComponent formik={formik} type={type} edit={edit} />
        )}
        <View style={{}}>
          {/* modal view for delete*/}
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
          {otpModalVisible && (
            <AlertModal
              visible={otpModalVisible}
              iconName={'checkcircleo'}
              icontype={IconType.AntDesign}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO APPROVE THIS!!'}
              cancelBtnPress={() => setOtpModalVisible(!otpModalVisible)}
              ConfirmBtnPress={() => formik.handleSubmit()}
              Component={
                <OTPTextView
                  inputCount={6}
                  textInputStyle={{
                    borderWidth: 1,
                    borderRadius: 8,
                  }}
                  offTintColor={Colors().pending}
                  tintColor={Colors().aprroved}
                  containerStyle={{
                    marginBottom: 10,
                  }}
                  handleTextChange={formik.handleChange('otp')}></OTPTextView>
              }
            />
          )}

          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={type == 'approve' ? `${label.APPROVE}` : `${label.ADD}`}
              titleColor={Colors().purple}
              onPress={() => {
                type == 'approve'
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

export default AddUpdateApproveStockPunchScreen;

const styles = StyleSheet.create({
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },
  bankCard: {
    marginHorizontal: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 10,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
    flexShrink: 1,
  },
});
