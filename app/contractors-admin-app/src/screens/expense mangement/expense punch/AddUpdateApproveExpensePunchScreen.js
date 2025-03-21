/*    ----------------Created Date :: 18- April -2024   ----------------- */
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
  addExpensePunchSchema,
  approveExpensePunchSchema,
} from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {CheckBox} from '@rneui/themed';
import {selectUser} from '../../../redux/slices/authSlice';
import ExpenseItemComponent from './ExpenseItemComponent';
import Images from '../../../constants/Images';
import ExpensePunchFliter from './ExpensePunchFliter';
import {getWalletDetailByUserId} from '../../../redux/slices/commonApi';
import {
  addExpensePunch,
  approveExpensePunch,
} from '../../../redux/slices/expense-management/expense-punch/addApproveExpensePunchSlice';
import {getExpensePunchDetailById} from '../../../redux/slices/expense-management/expense-punch/getExpensePunchDetailSlice';
import Loader from '../../../component/Loader';
import ExpensePunchBillComponent from './ExpensePunchBillComponent';
import ScreensLabel from '../../../constants/ScreensLabel';
const AddUpdateApproveExpensePunchScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const complaintId = route?.params?.complaintId;
  const userId = route?.params?.userId;
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const {user} = useSelector(selectUser);
  const labelString = ScreensLabel();

  /*declare useState variable here */
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [edit, setEdit] = useState([]);
  const [wallet, setWallet] = useState();

  /* values for request type*/
  const REQUEST_TYPE = [
    {label: 'SELF', value: '1'},
    {label: 'OTHER', value: '2'},
  ];

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      user_id: user.id,
      ...(type != 'approve' ? {expense_punch_for: 1} : {}),
      ...(type != 'approve' ? {regional_office: ''} : {}),
      ...(type != 'approve' ? {area_manager_id: ''} : {}),
      ...(type != 'approve' ? {supervisor_id: ''} : {}),
      ...(type != 'approve' ? {end_users_id: ''} : {}),

      complaint_id: complaintId ? complaintId : '',

      items:
        type == 'approve'
          ? edit
          : [
              {
                qty: '',
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
      type === 'approve' ? approveExpensePunchSchema : addExpensePunchSchema,

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
    let modifiedItem = [];
    if (type == 'approve') {
      values.items.forEach(request => {
        if (request?.remaining_approved_qty > 0) {
          modifiedItem.push({
            item_qty: request?.approve_qty,
            item_id: request?.item_id,
            id: request?.id,
            fund_id: request?.fund_id,
            transaction_id: request?.transaction_no,
            payment_mode: request?.payment_mode,
          });
        }
      });
    }

    if (type == 'approve') {
      values['items'] = modifiedItem;
    }

    try {
      setLoading(true);

      const res =
        type == 'approve'
          ? await dispatch(approveExpensePunch(values)).unwrap()
          : await dispatch(addExpensePunch(values)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        setApproveModalVisible(false);

        resetForm();
        navigation.navigate('ExpensePunchTopTab');
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        resetForm();
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
      getExpensePunchDetailById({complaintId, userId}),
    ).unwrap();

    if (fetchResult?.status) {
      const modifiedItem = fetchResult?.data.filter(
        itm => itm.remaining_approved_qty > 0,
      );

      setEdit(modifiedItem);

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
            ? `${labelString.EXPENSE_PUNCH} ${labelString.APPROVED} `
            : `${labelString.EXPENSE_PUNCH} ${labelString.ADD}`
        }
        rightIconPress={() => navigation.navigate('BottomTabNavigation')}
      />

      <ScrollView>
        {type !== 'approve' && (
          <View>
            <Text
              style={[
                styles.title,
                {marginLeft: 10, marginTop: 5, color: Colors().pureBlack},
              ]}>
              expense punch FOR :--
            </Text>
          </View>
        )}
        {type !== 'approve' && (
          <View style={styles.radioView}>
            {REQUEST_TYPE.map((radioButton, index) => (
              <View key={index}>
                <CheckBox
                  key={index}
                  textStyle={{
                    fontFamily: Colors().fontFamilyBookMan,
                    color: Colors().gray2,
                  }}
                  containerStyle={{
                    backgroundColor: Colors().screenBackground,
                  }}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  title={radioButton.label}
                  disabled={type == 'approve' ? true : false}
                  checked={formik.values.expense_punch_for == radioButton.value}
                  onPress={() => {
                    formik.resetForm();

                    formik.setFieldValue(
                      'expense_punch_for',
                      radioButton.value,
                    );
                  }}
                  checkedColor={Colors().aprroved}
                />
              </View>
            ))}
          </View>
        )}

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
          <ExpensePunchFliter formik={formik} type={type} edit={edit} />
        )}

        <ExpenseItemComponent formik={formik} type={type} edit={edit} />

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

          <View style={{alignSelf: 'center', marginVertical: 20}}>
            <NeumorphicButton
              title={type == 'approve' ? labelString.APPROVE : labelString.ADD}
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

export default AddUpdateApproveExpensePunchScreen;

const styles = StyleSheet.create({
  radioView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

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
