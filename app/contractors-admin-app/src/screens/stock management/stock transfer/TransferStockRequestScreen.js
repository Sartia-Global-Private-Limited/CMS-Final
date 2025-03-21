/*    ----------------Created Date :: 9 -April -2024   ----------------- */
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
import { transferStockRequestSchema } from '../../../utils/FormSchema';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../../component/DropDownList';
import { Icon } from '@rneui/base';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {
  getAllAccount,
  getAllBank,
  getAllPaymentMethod,
  getItemMasterDropDown,
  getPreviousBalanceForStock,
} from '../../../redux/slices/commonApi';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { Avatar, Badge } from '@rneui/themed';
import Images from '../../../constants/Images';
import { apiBaseUrl } from '../../../../config';
import SeparatorComponent from '../../../component/SeparatorComponent';
import { selectUser } from '../../../redux/slices/authSlice';

import { getStockRequestDetailById } from '../../../redux/slices/stock-management/stock-request/getStockRequestDetailSlice';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import moment from 'moment';
import {
  addStockTransfer,
  updateStockTransferBillAndDate,
} from '../../../redux/slices/stock-management/stock-transfer/changeStockTransferStatusSlice';
import ScreensLabel from '../../../constants/ScreensLabel';
import CustomeCard from '../../../component/CustomeCard';
import IncreDecreComponent from '../../../component/IncreDecreComponent';

const TransferStockRequestScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser);

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const [loading, setLoading] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [allPayMethod, setAllPayMethod] = useState([]);
  const [allBank, setAllBank] = useState([]);
  const [allAccount, setAllAccount] = useState([]);
  const [previousBalance, setPreviousBalance] = useState('');
  const [allItem, setAllItem] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [edit, setEdit] = useState({});
  const [approvedData, setApprovedData] = useState({});

  useEffect(() => {
    fetchPreviousBalance();
    fetchAllPayMethod();
    fetchAllBank();
    fetchItemData();

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
      bill_date: '',
      bill_number: '',
      transfer_data: [
        {
          request_stock: approvedData?.request_stock || [],
          new_request_stock: approvedData?.new_request_stock || [],
        },
      ],
    },
    validationSchema: type != 'update' && transferStockRequestSchema,

    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      id: edit_id,
      remark: values?.remark,
      payment_mode: values.payment_mode.label,
      bill_date: values?.bill_date
        ? moment(values.bill_date).format('YYYY-MM-DD')
        : '',
      bill_number: values.bill_number,
      transaction_id: values.transaction_id,
      account_id: values.account_id.value,
      transfer_data: values.transfer_data,
    };

    try {
      setLoading(true);

      const res =
        type != 'update'
          ? await dispatch(addStockTransfer(sData)).unwrap()
          : await dispatch(updateStockTransferBillAndDate(sData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
        resetForm();
        navigation.navigate('StockTransferTopTab');
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        resetForm();
        setLoading(false);

        setUpdateModalVisible(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      resetForm();
      setLoading(false);

      setUpdateModalVisible(false);
    }
  };

  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(
      getStockRequestDetailById(edit_id),
    ).unwrap();

    if (fetchResult?.status) {
      const newobj = { ...fetchResult.data?.approved_data }; //this is converting array to object
      setApprovedData(newobj['0']);
      setEdit(fetchResult.data);
    } else {
      setApprovedData([]);
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

  /*function for fetching item data*/
  const fetchItemData = async () => {
    try {
      const result = await dispatch(getItemMasterDropDown()).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
          unique_id: itm?.unique_id,
          rate: itm?.rate,
          hsncode: itm?.hsncode,
          description: itm?.description,
          image: itm?.image,
        }));

        setAllItem(rData);
      } else {
        setUserData([]);
      }
    } catch (error) {
      setAllItem([]);
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
      const result = await dispatch(
        getPreviousBalanceForStock(user.id),
      ).unwrap();

      if (result.status) {
        setPreviousBalance(result?.data);
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

  /*function  for getting total of Some key*/
  const getTotal = (data, key) => {
    let total = 0;
    data.forEach(element => {
      total += parseFloat(element[key]) || 0;
    });

    return total;
  };
  // Function to calculate the Final Amount
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

  /*Ui of dropdown list*/
  const renderDropDown = item => {
    return (
      <View
        style={[
          styles.listView,
          { backgroundColor: Colors().inputLightShadow },
        ]}>
        {item?.image !== undefined && (
          <NeuomorphAvatar gap={4}>
            <Avatar
              size={30}
              rounded
              source={{
                uri: item?.image
                  ? `${apiBaseUrl}${item?.image}`
                  : `${Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri}`,
              }}
            />
          </NeuomorphAvatar>
        )}

        {item?.label && (
          <Text
            numberOfLines={1}
            style={[
              styles.inputText,
              { marginLeft: 10, color: Colors().pureBlack },
            ]}>
            {item.label}
          </Text>
        )}
      </View>
    );
  };

  const onIncreDecre = ({ returnValue, formik, keyToSet }) => {
    formik.setFieldValue(keyToSet, returnValue);
    let str = keyToSet;
    let parts = str.split('.');
    let index = parts[1]; // Get the first index
    let idx = parts[3]; // Get the second index

    multipliedPrice(
      returnValue, //change value
      formik.values.transfer_data[index]?.request_stock[idx]?.approve_price, // itm.current_item_price, //fixed value
      `transfer_data.${index}.request_stock.${idx}.total_transfer_amount`,
      formik.setFieldValue,
    );
    if (edit?.transfer_stocks) {
      formik.setFieldValue(
        `transfer_data.${index}.request_stock.${idx}.remaining_quantity`,
        parseInt(edit?.transfer_stocks?.request_stock[idx].remaining_quantity) -
          parseInt(returnValue),
      );
    }

    if (!edit?.transfer_stocks) {
      formik.setFieldValue(
        `transfer_data.${index}.request_stock.${idx}.remaining_quantity`,
        parseInt(
          formik.values.transfer_data[index]?.request_stock[idx]
            ?.approve_quantity || 0,
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
      formik.values.transfer_data[index]?.new_request_stock[idx]?.approved_rate, // itm.current_item_price, //fixed value
      `transfer_data.${index}.new_request_stock.${idx}.total_transfer_amount`,
      formik.setFieldValue,
    );
    if (edit?.transfer_stocks) {
      formik.setFieldValue(
        `transfer_data.${index}.new_request_stock.${idx}.remaining_quantity`,
        parseInt(
          edit?.transfer_stocks?.new_request_stock[idx].remaining_quantity,
        ) - parseInt(returnValue),
      );
    }

    if (!edit?.transfer_stocks) {
      formik.setFieldValue(
        `transfer_data.${index}.new_request_stock.${idx}.remaining_quantity`,
        parseInt(
          formik.values.transfer_data[index]?.new_request_stock[idx]
            ?.approved_qty || 0,
        ) - parseInt(returnValue),
      );
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        // height: WINDOW_HEIGHT,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={label.TRANSFER_STOCK} />
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
              Limit: ₹ {edit?.requested_for_credit_limit}
            </Text>
            <Text style={[styles.title, { color: 'white', maxWidth: '50%' }]}>
              balance: ₹{' '}
              {formik.values?.account_id
                ? formik.values?.account_id?.balance
                : '0000'}
            </Text>
          </View>
        </ImageBackground>

        {type != 'update' && (
          <View style={{ marginHorizontal: WINDOW_WIDTH * 0.03 }}>
            <Text
              style={[
                styles.title,
                {
                  color: Colors().pending,
                  alignSelf: 'center',
                },
              ]}>
              FINAL Transfer AMOUNT ₹{' '}
              {getFinal(
                formik.values.transfer_data,
                'total_transfer_amount',
                'total_transfer_amount',
              )}
            </Text>
          </View>
        )}

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
                    color: Colors().pureBlack,
                    alignSelf: 'center',
                    marginHorizontal: 10,
                    textAlign: 'center',
                  },
                ]}>
                {user?.name} ({user?.employee_id} self)
              </Text>
            </>
          </View>
        </View>

        {type != 'update' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              columnGap: 10,
              padding: WINDOW_WIDTH * 0.01,
            }}>
            <View style={{ rowGap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.title, { color: Colors().pureBlack }]}>
                  Payment mode{' '}
                </Text>
                <Icon
                  name="asterisk"
                  type={IconType.FontAwesome5}
                  size={8}
                  color={Colors().red}
                />
              </View>
              <NeumorphicDropDownList
                width={WINDOW_WIDTH * 0.75}
                RightIconName="caretdown"
                RightIconType={IconType.AntDesign}
                placeholder={'select...'}
                data={allPayMethod}
                labelField={'label'}
                valueField={'value'}
                value={formik.values?.payment_mode}
                renderItem={renderDropDown}
                search={false}
                placeholderStyle={[
                  styles.inputText,
                  { color: Colors().pureBlack },
                ]}
                selectedTextStyle={[
                  styles.selectedTextStyle,
                  { color: Colors().pureBlack },
                ]}
                style={[styles.inputText, { color: Colors().pureBlack }]}
                containerStyle={{
                  backgroundColor: Colors().inputLightShadow,
                }}
                onChange={val => {
                  formik.setFieldValue(`payment_mode`, val);
                }}
              />
              {formik.touched.payment_mode && formik.errors.payment_mode && (
                <Text style={styles.errorMesage}>
                  {formik.errors.payment_mode}
                </Text>
              )}
            </View>

            <View style={{ rowGap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.title, { color: Colors().pureBlack }]}>
                  Bank name{' '}
                </Text>
                <Icon
                  name="asterisk"
                  type={IconType.FontAwesome5}
                  size={8}
                  color={Colors().red}
                />
              </View>
              <NeumorphicDropDownList
                width={WINDOW_WIDTH * 0.75}
                RightIconName="caretdown"
                RightIconType={IconType.AntDesign}
                placeholder={'select...'}
                data={allBank}
                labelField={'label'}
                valueField={'value'}
                value={formik.values?.bank_id}
                renderItem={renderDropDown}
                search={false}
                placeholderStyle={[
                  styles.inputText,
                  { color: Colors().pureBlack },
                ]}
                selectedTextStyle={[
                  styles.selectedTextStyle,
                  { color: Colors().pureBlack },
                ]}
                style={[styles.inputText, { color: Colors().pureBlack }]}
                containerStyle={{
                  backgroundColor: Colors().inputLightShadow,
                }}
                onChange={val => {
                  formik.setFieldValue(`bank_id`, val);
                  handleBankChange(val.value);
                }}
              />
              {formik.touched.bank_id && formik.errors.bank_id && (
                <Text style={styles.errorMesage}>{formik.errors.bank_id}</Text>
              )}
            </View>

            <View style={{ rowGap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.title, { color: Colors().pureBlack }]}>
                  Account Number{' '}
                </Text>
                <Icon
                  name="asterisk"
                  type={IconType.FontAwesome5}
                  size={8}
                  color={Colors().red}
                />
              </View>
              <NeumorphicDropDownList
                width={WINDOW_WIDTH * 0.75}
                RightIconName="caretdown"
                RightIconType={IconType.AntDesign}
                placeholder={'select...'}
                data={allAccount}
                labelField={'label'}
                valueField={'value'}
                value={formik.values?.account_id}
                renderItem={renderDropDown}
                search={false}
                placeholderStyle={[
                  styles.inputText,
                  { color: Colors().pureBlack },
                ]}
                selectedTextStyle={[
                  styles.selectedTextStyle,
                  { color: Colors().pureBlack },
                ]}
                style={[styles.inputText, { color: Colors().pureBlack }]}
                containerStyle={{
                  backgroundColor: Colors().inputLightShadow,
                }}
                onChange={val => {
                  formik.setFieldValue(`account_id`, val);
                }}
              />
              {formik.touched.account_id && formik.errors.account_id && (
                <Text style={styles.errorMesage}>
                  {formik.errors.account_id}
                </Text>
              )}
            </View>
          </ScrollView>
        )}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            columnGap: 10,
            padding: WINDOW_WIDTH * 0.01,
          }}>
          {type != 'update' && (
            <View style={{ rowGap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.title, { color: Colors().pureBlack }]}>
                  Remark{' '}
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
                height={WINDOW_HEIGHT * 0.06}
                width={WINDOW_WIDTH * 0.75}
                value={formik.values.remark}
                onChangeText={formik.handleChange(`remark`)}
                style={[styles.inputText, { color: Colors().pureBlack }]}
              />
              {formik.touched.remark && formik.errors.remark && (
                <Text style={styles.errorMesage}>{formik.errors.remark}</Text>
              )}
            </View>
          )}
          {type != 'update' && (
            <View style={{ rowGap: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={[styles.title, { color: Colors().pureBlack }]}>
                  Transction id{' '}
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
                height={WINDOW_HEIGHT * 0.06}
                width={WINDOW_WIDTH * 0.75}
                value={formik.values.transaction_id}
                onChangeText={formik.handleChange(`transaction_id`)}
                style={[styles.inputText, { color: Colors().pureBlack }]}
              />
              {formik.touched.transaction_id &&
                formik.errors.transaction_id && (
                  <Text style={styles.errorMesage}>
                    {formik.errors.transaction_id}
                  </Text>
                )}
            </View>
          )}

          <View style={{ rowGap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.title, { color: Colors().pureBlack }]}>
                Bill Number{' '}
              </Text>
            </View>
            <NeumorphicTextInput
              placeHolderTxt={'TYPE...'}
              placeHolderTxtColor={Colors().pureBlack}
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              value={formik.values.bill_number}
              onChangeText={formik.handleChange(`bill_number`)}
              style={[styles.inputText, { color: Colors().pureBlack }]}
            />
          </View>
          <View style={{ rowGap: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={[styles.title, { color: Colors().pureBlack }]}>
                Bill Date{' '}
              </Text>
            </View>
            <NeumorphDatePicker
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.42}
              iconPress={() => setOpenToDate(!openToDate)}
              valueOfDate={
                formik.values.bill_date
                  ? moment(formik.values.bill_date).format('DD/MM/YYYY')
                  : formik.values.bill_date
              }
              modal
              open={openToDate}
              date={new Date()}
              mode="date"
              onConfirm={date => {
                formik.setFieldValue(`bill_date`, date);

                setOpenToDate(false);
              }}
              onCancel={() => {
                setOpenToDate(false);
              }}></NeumorphDatePicker>
          </View>
        </ScrollView>

        <View style={{}}>
          {formik.values.transfer_data.map((item, index) => (
            <>
              <View style={styles.separatorHeading}>
                <SeparatorComponent
                  separatorColor={Colors().pending}
                  separatorHeight={1}
                  separatorWidth={WINDOW_WIDTH * 0.35}
                />
                <Text style={[styles.title, { color: Colors().pending }]}>
                  {`old item`}
                </Text>
                <SeparatorComponent
                  separatorColor={Colors().pending}
                  separatorHeight={1}
                  separatorWidth={WINDOW_WIDTH * 0.35}
                />
              </View>
              {item?.request_stock?.map((itm, idx) => (
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
                              value={`${itm?.prev_user_stock} `}
                              status="primary"
                            />
                          </View>
                        ),
                      },
                      {
                        key: 'current price',
                        value: `₹ ${itm?.current_item_price}`,
                        keyColor: Colors().aprroved,
                      },
                      {
                        key: 'Approve price',
                        value: `₹ ${itm?.approve_price}`,
                        keyColor: Colors().aprroved,
                      },
                      {
                        key: 'stock amount',
                        value: `₹ ${itm?.total_price}`,
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
                                value={`${itm?.approve_quantity} `}
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
                                edit?.transfer_stocks &&
                                itm?.remaining_quantity == undefined
                                  ? `${edit?.transfer_stocks?.request_stock[idx].remaining_quantity} `
                                  : itm?.remaining_quantity != undefined
                                    ? `${itm?.remaining_quantity} `
                                    : `${itm?.approve_quantity} `
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
                                        styles.cardHeadingTxt,
                                        { color: Colors().pureBlack },
                                      ]}>
                                      {'Transfer qty. : '}
                                    </Text>
                                    <IncreDecreComponent
                                      defaultValue={itm.transfer_qty || 0}
                                      MaxValue={
                                        edit?.transfer_stocks
                                          ? edit?.transfer_stocks
                                              ?.request_stock[idx]
                                              .remaining_quantity
                                          : itm?.approve_quantity
                                      }
                                      formik={formik}
                                      keyToSet={`transfer_data.${index}.request_stock.${idx}.transfer_qty`}
                                      onChange={onIncreDecre}
                                    />
                                  </View>

                                  {(itm?.transfer_qty == 0 ||
                                    !itm?.transfer_qty) && (
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

                              value: `₹ ${itm?.total_transfer_amount || 0}`,

                              color: Colors().pending,
                            },
                          ]
                        : null
                    }
                  />
                </>
              ))}
              {type != 'update' && (
                <View style={{ flexDirection: 'row', marginLeft: 30 }}>
                  <Text style={[styles.title, { color: Colors().purple }]}>
                    TOTAL Transfer Fund ₹{' '}
                    {getTotal(
                      formik.values.transfer_data[index].request_stock,
                      'total_transfer_amount',
                    )}
                  </Text>
                </View>
              )}
              {item?.new_request_stock.length > 0 && (
                <View style={styles.separatorHeading}>
                  <SeparatorComponent
                    separatorColor={Colors().pending}
                    separatorHeight={1}
                    separatorWidth={WINDOW_WIDTH * 0.35}
                  />
                  <Text style={[styles.title, { color: Colors().pending }]}>
                    {`New item`}
                  </Text>
                  <SeparatorComponent
                    separatorColor={Colors().pending}
                    separatorHeight={1}
                    separatorWidth={WINDOW_WIDTH * 0.35}
                  />
                </View>
              )}

              {item?.new_request_stock?.map((itm, idx) => (
                <>
                  <CustomeCard
                    avatarImage={itm?.item_image}
                    data={[
                      { key: 'item name', value: itm?.title?.label },

                      {
                        key: 'Request Rate',
                        value: `₹ ${itm?.requested_rate}`,
                        keyColor: Colors().aprroved,
                      },
                      {
                        key: 'Approve price',
                        value: `₹ ${itm?.approved_rate}`,
                        keyColor: Colors().aprroved,
                      },
                      {
                        key: 'stock amount',
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
                                edit?.transfer_stocks &&
                                itm?.remaining_quantity == undefined
                                  ? `${edit?.transfer_stocks?.new_request_stock[idx].remaining_quantity} `
                                  : itm?.remaining_quantity != undefined
                                    ? `${itm?.remaining_quantity} `
                                    : `${itm?.approved_qty} `
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
                                        styles.cardHeadingTxt,
                                        { color: Colors().pureBlack },
                                      ]}>
                                      {'Transfer qty. : '}
                                    </Text>
                                    <IncreDecreComponent
                                      defaultValue={itm.transfer_qty || 0}
                                      MaxValue={
                                        edit?.transfer_stocks
                                          ? edit?.transfer_stocks
                                              ?.new_request_stock[idx]
                                              .remaining_quantity
                                          : itm?.approved_qty
                                      }
                                      formik={formik}
                                      keyToSet={`transfer_data.${index}.new_request_stock.${idx}.transfer_qty`}
                                      onChange={onIncreDecre1}
                                    />
                                  </View>

                                  {(itm?.transfer_qty == 0 ||
                                    !itm?.transfer_qty) && (
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

                              value: `₹ ${itm?.total_transfer_amount || 0}`,

                              color: Colors().pending,
                            },
                          ]
                        : null
                    }
                  />
                </>
              ))}
              {formik.values.transfer_data[index].new_request_stock.length >
                0 &&
                type != 'update' && (
                  <View style={{ flexDirection: 'row', marginLeft: 30 }}>
                    <Text style={[styles.title, { color: Colors().purple }]}>
                      TOTAL Transfer AMOUNT ₹{' '}
                      {getTotal(
                        formik.values.transfer_data[index].new_request_stock,
                        'total_transfer_amount',
                      )}
                    </Text>
                  </View>
                )}
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

          <View style={{ alignSelf: 'center', marginVertical: 30 }}>
            <NeumorphicButton
              title={type == 'update' ? 'update' : 'Transfer'}
              titleColor={Colors().purple}
              onPress={() => {
                type == 'update'
                  ? setUpdateModalVisible(true)
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

export default TransferStockRequestScreen;

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
  cardHeadingTxt: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  separatorHeading: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    marginTop: 10,
    flex: 1,
  },
  createSkillView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomColor: Colors().gray,
    borderBottomWidth: 2,
    marginHorizontal: 8,
  },
  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  userNameView: { flex: 1, flexDirection: 'row', flexWrap: 'wrap' },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 3,
  },
  selectedTextStyle: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
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
  errorMesage: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
