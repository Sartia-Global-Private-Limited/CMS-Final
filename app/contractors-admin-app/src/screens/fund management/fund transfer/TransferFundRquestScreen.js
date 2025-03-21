/*    ----------------Created Date :: 11- March -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { transferFundRequestSchema } from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import { Icon } from '@rneui/base';
import Toast from 'react-native-toast-message';

import {
  getAllAccount,
  getAllBank,
  getAllPaymentMethod,
  getPreviousBalance,
} from '../../../redux/slices/commonApi';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { Avatar, Badge } from '@rneui/themed';
import Images from '../../../constants/Images';
import { apiBaseUrl } from '../../../../config';
import SeparatorComponent from '../../../component/SeparatorComponent';
import { selectUser } from '../../../redux/slices/authSlice';
import { getFundRequestDetailById } from '../../../redux/slices/fund-management/fund-request/getFundRequestDetailSlice';
import { addFundTransfer } from '../../../redux/slices/fund-management/fund-transfer/changeFundTransferStausSlice';
import CustomeCard from '../../../component/CustomeCard';
import IncreDecreComponent from '../../../component/IncreDecreComponent';
import ScreensLabel from '../../../constants/ScreensLabel';

const TransferFundRquestScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);

  /*declare useState variable here */
  const [loading, setLoading] = useState(false);
  const [allPayMethod, setAllPayMethod] = useState([]);
  const [allBank, setAllBank] = useState([]);
  const [allAccount, setAllAccount] = useState([]);
  const [previousBalance, setPreviousBalance] = useState('');

  const [edit, setEdit] = useState({});

  useEffect(() => {
    fetchPreviousBalance();
    fetchAllPayMethod();
    fetchAllBank();

    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: 'true',
    initialValues: {
      id: edit_id,
      account_id: '',
      remark: '',
      transaction_id: '',
      payment_mode: '',
      transfer_data: [
        {
          transfer_fund: edit?.approved_data?.request_fund || [],
          new_transfer_fund: edit?.approved_data?.new_request_fund || [],
        },
      ],
    },
    validationSchema: transferFundRequestSchema,

    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      id: edit_id,
      remark: values.remark,
      payment_mode: values.payment_mode.label,
      transaction_id: values.transaction_id,
      account_id: values.account_id.value,
      transfer_data: values.transfer_data,
    };

    try {
      setLoading(true);

      const res = await dispatch(addFundTransfer(sData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        resetForm();
        navigation.navigate('FundTransferTopTab');
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setLoading(false);
    }
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

  /*function for fetching payment method*/
  const fetchAllPayMethod = async () => {
    try {
      const result = await dispatch(getAllPaymentMethod()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.method,
          value: itm?.id,
        }));

        setAllPayMethod(rData);
      } else {
        setAllPayMethod([]);
      }
    } catch (error) {
      setAllPayMethod([]);
    }
  };

  /*function for fetching All bank*/
  const fetchAllBank = async () => {
    try {
      const result = await dispatch(getAllBank()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.bank_name,
          value: itm?.id,
          image: itm?.logo,
        }));

        setAllBank(rData);
      } else {
        setAllBank([]);
      }
    } catch (error) {
      setAllBank([]);
    }
  };

  /*function for fetching supervisor list data*/
  const handleBankChange = async bank_id => {
    formik.setFieldValue('account_id', '');
    try {
      const result = await dispatch(getAllAccount(bank_id)).unwrap();
      if (result.status) {
        const rData = result?.data.map(itm => {
          return {
            ...itm,
            label: itm?.account_number,
            value: itm?.id,
          };
        });

        setAllAccount(rData);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setAllAccount([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });

      setAllAccount([]);
    }
  };
  /*function for fetching Previous balance data*/
  const fetchPreviousBalance = async () => {
    try {
      const result = await dispatch(getPreviousBalance(user.id)).unwrap();

      if (result.status) {
        setPreviousBalance(result?.finalBalance);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setPreviousBalance('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });

      setPreviousBalance('');
    }
  };

  // Function to calculate the sum of "fund_amount"
  function calculateFinalTransferAmount(requestData) {
    let totalRequestAmt = 0;
    let totalNewRequestAmount = 0;

    // Loop through each request object
    requestData.forEach(request => {
      // Calculate sum of "fund_amount" in "request_fund"
      if (request.transfer_fund) {
        request.transfer_fund.forEach(item => {
          totalRequestAmt += parseFloat(item.request_transfer_fund) || 0;
        });
      }

      // Calculate sum of "fund_amount" in "new_request_fund"
      if (request.new_transfer_fund) {
        request.new_transfer_fund.forEach(item => {
          totalNewRequestAmount += parseFloat(item.request_transfer_fund) || 0;
        });
      }
    });

    return totalRequestAmt + totalNewRequestAmount;
  }

  /*function for total price based on rate and qty*/
  const multipliedPrice = (
    changeAblevalue, //this the value which
    fixedValue,
    assignKey,
    setFormikValues,
  ) => {
    const total = changeAblevalue * fixedValue;
    setFormikValues(assignKey, parseFloat(isNaN(total) ? 0 : total));
  };

  const onIncreDecre = ({ returnValue, formik, keyToSet }) => {
    formik.setFieldValue(keyToSet, returnValue);
    let str = keyToSet;
    let parts = str.split('.');
    let index = parts[1]; // Get the first index
    let idx = parts[3]; // Get the second index

    multipliedPrice(
      returnValue, //change value
      formik.values.transfer_data[index]?.transfer_fund[idx]?.price, // itm.current_item_price, //fixed value
      `transfer_data.${index}.transfer_fund.${idx}.request_transfer_fund`,
      formik.setFieldValue,
    );
    if (edit?.transfer_data) {
      formik.setFieldValue(
        `transfer_data.${index}.transfer_fund.${idx}.remaining_quantity`,
        parseInt(edit?.transfer_data?.transfer_fund[idx].remaining_quantity) -
          parseInt(returnValue),
      );
    }

    if (!edit?.transfer_data) {
      formik.setFieldValue(
        `transfer_data.${index}.transfer_fund.${idx}.remaining_quantity`,
        parseInt(
          formik.values.transfer_data[index]?.transfer_fund[idx]?.quantity || 0,
        ) - parseInt(returnValue),
      );
    }
  };
  const onIncreDecre1 = ({ returnValue, formik, keyToSet }) => {
    formik.setFieldValue(keyToSet, returnValue);
    let str = keyToSet;
    let parts = str.split('.');
    let index = parts[1]; // Get the first index
    let idx = parts[3]; // Get the second index

    multipliedPrice(
      returnValue, //change value
      formik.values.transfer_data[index]?.new_transfer_fund[idx]?.rate, // itm.current_item_price, //fixed value
      `transfer_data.${index}.new_transfer_fund.${idx}.request_transfer_fund`,
      formik.setFieldValue,
    );
    if (edit?.transfer_data) {
      formik.setFieldValue(
        `transfer_data.${index}.new_transfer_fund.${idx}.remaining_quantity`,
        parseInt(
          edit?.transfer_data?.new_transfer_fund[idx].remaining_quantity,
        ) - parseInt(returnValue),
      );
    }

    if (!edit?.transfer_data) {
      formik.setFieldValue(
        `transfer_data.${index}.new_transfer_fund.${idx}.remaining_quantity`,
        parseInt(
          formik.values.transfer_data[index]?.new_transfer_fund[idx]
            ?.approved_qty || 0,
        ) - parseInt(returnValue),
      );
    }
  };

  // Function to calculate the sum of approved "fund_amount"
  function calculateTotalApprovedAmount(requestData) {
    let totalApprovedAmt = 0;
    let totalNewApprovedAmount = 0;

    requestData.forEach(request => {
      // Calculate sum of "fund_amount" in "request_fund"
      if (request.request_fund) {
        request.request_fund.forEach(item => {
          totalApprovedAmt += parseFloat(item.total_approve_amount) || 0;
        });
      }

      // Calculate sum of "fund_amount" in "new_request_fund"
      if (request.new_request_fund) {
        request.new_request_fund.forEach(item => {
          totalNewApprovedAmount += parseFloat(item.approve_fund_amount) || 0;
        });
      }
    });

    return totalApprovedAmt + totalNewApprovedAmount;
  }
  const totalFundAmount = calculateFinalTransferAmount(
    formik.values.transfer_data,
  );
  const totalApprovedAmount = calculateTotalApprovedAmount(
    formik.values.transfer_data,
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={label.TRANSFER_FUND}
        rightIconPress={() => navigation.navigate('BottomTabNavigation')}
      />
      <ScrollView>
        <ImageBackground
          source={Images.BANK_CARD}
          imageStyle={{ borderRadius: WINDOW_WIDTH * 0.03 }}
          style={styles.bankCard}>
          <Text style={[styles.title, { color: 'white', fontSize: 20 }]}>
            {formik.values?.account_id
              ? formik.values?.account_id?.account_holder_name
              : 'Account Holder name'}
          </Text>
          <View
            style={[styles.twoItemView, { justifyContent: 'space-between' }]}>
            <Text style={[styles.title, { color: 'white', maxWidth: '50%' }]}>
              {formik.values?.payment_mode
                ? formik.values?.payment_mode.label
                : 'Pay MOde'}
            </Text>
            <Text style={[styles.title, { color: 'white', maxWidth: '50%' }]}>
              {formik.values?.bank_id
                ? formik.values?.bank_id?.label
                : '-- -- --'}
            </Text>
          </View>

          <Text
            style={[
              styles.title,
              { color: 'white', fontSize: 22, alignSelf: 'center' },
            ]}>
            {formik.values?.account_id
              ? formik.values?.account_id?.label
              : 'Account Number'}
          </Text>

          <Text style={[styles.title, { color: 'white' }]}>
            PRev.balance : ₹ {previousBalance}
          </Text>

          <View
            style={[styles.twoItemView, { justifyContent: 'space-between' }]}>
            <Text style={[styles.title, { color: 'white', maxWidth: '50%' }]}>
              Limit: ₹ {edit?.request_for_credit_limt}
            </Text>
            <Text style={[styles.title, { color: 'white', maxWidth: '50%' }]}>
              balance: ₹{' '}
              {formik.values?.account_id
                ? formik.values?.account_id?.balance
                : '0000'}
            </Text>
          </View>
        </ImageBackground>

        <View style={{ marginHorizontal: WINDOW_WIDTH * 0.03 }}>
          <Text
            style={[
              styles.title,
              {
                color: Colors().pending,
                alignSelf: 'center',
              },
            ]}>
            FINAL Transfer AMOUNT ₹ {totalFundAmount}
          </Text>
        </View>

        <View style={{ rowGap: 8, marginHorizontal: WINDOW_WIDTH * 0.03 }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <>
              <NeuomorphAvatar gap={4}>
                <Avatar
                  size={40}
                  rounded
                  source={{
                    uri: user?.image
                      ? `${apiBaseUrl}${user?.image}`
                      : `${
                          Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri
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
                    color: Colors().pureBlack,
                  },
                ]}>
                {user?.name} ({user?.employee_id} self)
              </Text>
            </>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            columnGap: 10,
            padding: WINDOW_WIDTH * 0.01,
          }}>
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            title={'Payment mode'}
            required={true}
            data={allPayMethod}
            value={formik.values?.payment_mode}
            onChange={val => {
              formik.setFieldValue(`payment_mode`, val);
            }}
            errorMessage={formik?.errors?.payment_mode}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            title={'Bank name'}
            required={true}
            data={allBank}
            value={formik.values?.bank_id}
            onChange={val => {
              formik.setFieldValue(`bank_id`, val);
              handleBankChange(val.value);
            }}
            errorMessage={formik?.errors?.bank_id}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            title={'Account number'}
            required={true}
            data={allAccount}
            value={formik.values?.account_id}
            onChange={val => {
              formik.setFieldValue(`account_id`, val);
            }}
            errorMessage={formik?.errors?.account_id}
          />
        </ScrollView>

        <View style={styles.inputContainer}>
          <View style={styles.twoItemView}>
            <>
              <View style={styles.leftView}>
                <NeumorphicTextInput
                  title={'remark'}
                  required={true}
                  width={WINDOW_WIDTH * 0.44}
                  value={formik.values.remark}
                  onChangeText={formik.handleChange(`remark`)}
                  errorMessage={formik?.errors?.remark}
                />
              </View>
              <View style={styles.rightView}>
                <NeumorphicTextInput
                  title={'transaction id'}
                  required={true}
                  width={WINDOW_WIDTH * 0.44}
                  value={formik.values.transaction_id}
                  onChangeText={formik.handleChange(`transaction_id`)}
                  errorMessage={formik?.errors?.transaction_id}
                />
              </View>
            </>
          </View>
        </View>

        <View style={{}}>
          {formik.values.transfer_data.map((item, index) => (
            <>
              <View style={styles.separatorHeading}>
                <SeparatorComponent
                  separatorColor={Colors().pending}
                  separatorHeight={1}
                  separatorWidth={WINDOW_WIDTH * 0.3}
                />
                <Text
                  style={[
                    styles.title,
                    { color: Colors().pending, fontSize: 16 },
                  ]}>
                  {` Old item `}
                </Text>
                <SeparatorComponent
                  separatorColor={Colors().pending}
                  separatorHeight={1}
                  separatorWidth={WINDOW_WIDTH * 0.3}
                />
              </View>
              {item?.transfer_fund?.map((itm, idx) => (
                <>
                  <CustomeCard
                    avatarImage={itm?.item_name?.image}
                    data={[
                      { key: 'item name', value: itm?.item_name?.label },
                      {
                        component: (
                          <View style={{ flexDirection: 'row' }}>
                            <Text
                              style={[
                                styles.title,
                                { color: Colors().pureBlack },
                              ]}>
                              user stock :{' '}
                            </Text>
                            <Badge
                              value={`${itm?.current_user_stock} `}
                              status="primary"
                            />
                          </View>
                        ),
                      },
                      {
                        key: 'Request price',
                        value: `₹ ${itm?.current_price}`,
                        keyColor: Colors().aprroved,
                      },
                      {
                        key: 'Approve price',
                        value: `₹ ${itm?.price}`,
                        keyColor: Colors().aprroved,
                      },
                      {
                        key: 'Fund amount',
                        value: `₹ ${itm?.fund_amount}`,
                        keyColor: Colors().aprroved,
                      },
                      {
                        component: (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              flex: 1,
                            }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={[
                                  styles.title,
                                  { color: Colors().pureBlack },
                                ]}>
                                Req. qty. :{' '}
                              </Text>
                              <Badge
                                value={`${itm?.request_quantity} `}
                                status="primary"
                              />
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={[
                                  styles.title,
                                  { color: Colors().pureBlack },
                                ]}>
                                Appr. qty. :{' '}
                              </Text>
                              <Badge
                                badgeStyle={{
                                  backgroundColor: Colors().pending,
                                }}
                                value={`${itm?.quantity} `}
                                status="primary"
                              />
                            </View>
                          </View>
                        ),
                      },
                      {
                        component: (
                          <View style={{ flexDirection: 'row' }}>
                            <Text
                              style={[
                                styles.title,
                                { color: Colors().pureBlack },
                              ]}>
                              Left Trans. Qty. :{' '}
                            </Text>
                            <Badge
                              value={
                                edit?.transfer_data &&
                                itm?.remaining_quantity == undefined
                                  ? `${edit?.transfer_data?.transfer_fund[idx].remaining_quantity} `
                                  : itm?.remaining_quantity != undefined
                                    ? `${itm?.remaining_quantity} `
                                    : `${itm?.quantity} `
                              }
                              status="error"
                            />
                          </View>
                        ),
                      },
                      ...(type !== 'update'
                        ? [
                            {
                              component: (
                                <>
                                  <View
                                    style={{
                                      flexWrap: 'wrap',
                                      flex: 1,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      style={[
                                        styles.title,
                                        { color: Colors().pureBlack },
                                      ]}>
                                      {'Transfer qty. : '}
                                    </Text>
                                    <IncreDecreComponent
                                      defaultValue={itm?.transfer_quantity || 0}
                                      MaxValue={
                                        edit?.transfer_data
                                          ? edit?.transfer_data?.transfer_fund[
                                              idx
                                            ].remaining_quantity
                                          : itm?.quantity
                                      }
                                      formik={formik}
                                      keyToSet={`transfer_data.${index}.transfer_fund.${idx}.transfer_quantity`}
                                      onChange={onIncreDecre}
                                    />
                                  </View>

                                  {(itm?.transfer_quantity == 0 ||
                                    !itm?.transfer_quantity) && (
                                    <View style={{ alignSelf: 'center' }}>
                                      <Icon
                                        name="asterisk"
                                        type={IconType.FontAwesome5}
                                        size={8}
                                        color={Colors().red}
                                      />
                                    </View>
                                  )}
                                </>
                              ),
                            },
                          ]
                        : []),
                    ]}
                    status={
                      itm?.item_name && type != 'update'
                        ? [
                            {
                              key: 'Transfer Fund Amount',

                              value: `₹ ${itm?.request_transfer_fund || 0}`,

                              color: Colors().pending,
                            },
                          ]
                        : null
                    }
                  />
                </>
              ))}
              <View style={{ flexDirection: 'row', marginLeft: 30 }}>
                <Text style={[styles.title, { color: Colors().purple }]}>
                  TOTAL Transfer Fund ₹{' '}
                  {formik.values.transfer_data[index].transfer_fund.reduce(
                    (total, itm) => total + +itm.request_transfer_fund,
                    0,
                  )}
                </Text>
              </View>

              {item?.new_transfer_fund.length > 0 && (
                <View style={styles.separatorHeading}>
                  <SeparatorComponent
                    separatorColor={Colors().pending}
                    separatorHeight={1}
                    separatorWidth={WINDOW_WIDTH * 0.3}
                  />
                  <Text
                    style={[
                      styles.title,
                      { color: Colors().pending, fontSize: 18 },
                    ]}>
                    {` New item `}
                  </Text>
                  <SeparatorComponent
                    separatorColor={Colors().pending}
                    separatorHeight={1}
                    separatorWidth={WINDOW_WIDTH * 0.3}
                  />
                </View>
              )}
              {item?.new_transfer_fund?.map((itm, idx) => (
                <>
                  <CustomeCard
                    avatarImage={itm?.item_image}
                    data={[
                      { key: 'item name', value: itm?.title?.label },

                      {
                        key: 'Request Price',
                        value: `₹ ${itm?.requested_rate}`,
                        keyColor: Colors().aprroved,
                      },
                      {
                        key: 'Approve price',
                        value: `₹ ${itm?.approved_rate}`,
                        keyColor: Colors().aprroved,
                      },
                      {
                        key: 'Fund amount',
                        value: `₹ ${itm?.fund_amount}`,
                        keyColor: Colors().aprroved,
                      },
                      {
                        component: (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              flex: 1,
                            }}>
                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={[
                                  styles.title,
                                  { color: Colors().pureBlack },
                                ]}>
                                Req. qty. :{' '}
                              </Text>
                              <Badge
                                value={`${itm?.requested_qty} `}
                                status="primary"
                              />
                            </View>

                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={[
                                  styles.title,
                                  { color: Colors().pureBlack },
                                ]}>
                                Appr. qty. :{' '}
                              </Text>
                              <View>
                                <Badge
                                  badgeStyle={{
                                    backgroundColor: Colors().pending,
                                  }}
                                  containerStyle={{
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                  }}
                                  value={`${itm?.approved_qty} `}
                                  status="primary"
                                />
                              </View>
                            </View>
                          </View>
                        ),
                      },
                      {
                        component: (
                          <View style={{ flexDirection: 'row' }}>
                            <Text
                              style={[
                                styles.title,
                                { color: Colors().pureBlack },
                              ]}>
                              Left Trans. Qty. :{' '}
                            </Text>
                            <Badge
                              badgeStyle={{}}
                              value={
                                edit?.transfer_data &&
                                itm?.remaining_quantity == undefined
                                  ? `${edit?.transfer_data?.new_transfer_fund[idx].remaining_quantity} `
                                  : itm?.remaining_quantity != undefined
                                    ? `${itm?.remaining_quantity} `
                                    : `${itm?.qty} `
                              }
                              status="error"
                            />
                          </View>
                        ),
                      },
                      ...(type !== 'update'
                        ? [
                            {
                              component: (
                                <>
                                  <View
                                    style={{
                                      flexWrap: 'wrap',
                                      flex: 1,
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                    }}>
                                    <Text
                                      style={[
                                        styles.title,
                                        { color: Colors().pureBlack },
                                      ]}>
                                      {'Transfer qty. : '}
                                    </Text>
                                    <IncreDecreComponent
                                      defaultValue={itm?.transfer_quantity || 0}
                                      MaxValue={
                                        edit?.transfer_data
                                          ? edit?.transfer_data
                                              ?.new_transfer_fund[idx]
                                              .remaining_quantity
                                          : itm?.approved_qty
                                      }
                                      formik={formik}
                                      keyToSet={`transfer_data.${index}.new_transfer_fund.${idx}.transfer_quantity`}
                                      onChange={onIncreDecre1}
                                    />
                                  </View>

                                  {(itm?.transfer_quantity == 0 ||
                                    !itm?.transfer_quantity) && (
                                    <View style={{ alignSelf: 'center' }}>
                                      <Icon
                                        name="asterisk"
                                        type={IconType.FontAwesome5}
                                        size={8}
                                        color={Colors().red}
                                      />
                                    </View>
                                  )}
                                </>
                              ),
                            },
                          ]
                        : []),
                    ]}
                    status={
                      type != 'update'
                        ? [
                            {
                              key: 'Transfer amount',

                              value: `₹ ${itm?.request_transfer_fund || 0}`,

                              color: Colors().pending,
                            },
                          ]
                        : null
                    }
                  />
                </>
              ))}
              {formik.values.transfer_data[index].new_transfer_fund.length >
                0 && (
                <View style={{ flexDirection: 'row', marginLeft: 30 }}>
                  <Text style={[styles.title, { color: Colors().purple }]}>
                    TOTAL Transfer AMOUNT ₹{' '}
                    {formik.values.transfer_data[
                      index
                    ].new_transfer_fund.reduce((total, itm) => {
                      const transferFundAmount = parseFloat(
                        itm.request_transfer_fund,
                      );
                      return isNaN(transferFundAmount)
                        ? total
                        : total + transferFundAmount;
                    }, 0)}
                  </Text>
                </View>
              )}
            </>
          ))}

          <View style={{ alignSelf: 'center', marginVertical: 30 }}>
            <NeumorphicButton
              title={'Transfer'}
              titleColor={Colors().purple}
              onPress={() => {
                formik.handleSubmit();
              }}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TransferFundRquestScreen;

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
    rowGap: 10,
  },
  bankCard: {
    margin: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 10,
  },

  separatorHeading: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginVertical: 10,
    flex: 1,
  },

  rightView: {
    flexDirection: 'column',
    flex: 1,
    rowGap: 8,
  },
  leftView: {
    flexDirection: 'column',
    rowGap: 8,
    flex: 1,
  },
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },

  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
