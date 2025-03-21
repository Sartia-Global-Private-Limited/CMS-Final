/*    ----------------Created Date :: 29- March -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { CheckBox } from '@rneui/base';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import NeumorphCard from '../../../component/NeumorphCard';
import CustomeHeader from '../../../component/CustomeHeader';
import Toast from 'react-native-toast-message';
import Images from '../../../constants/Images';
import { useFormik } from 'formik';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {
  getAllAccount,
  getAllBank,
  getAllManger,
  getAllSupervisorByMangaerId,
  getAllUsers,
} from '../../../redux/slices/commonApi';
import { getAllFreeUserList } from '../../../redux/slices/allocate/allocateComplaintSlice';
import { getBankBalanceByBankId } from '../../../redux/slices/fund-management/fund balance overview/getBankBalanceListSlice';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import moment from 'moment';
import { Menu, MenuItem } from 'react-native-material-menu';
import { Icon } from '@rneui/themed';
import { getBankFundTransactionByAccountId } from '../../../redux/slices/fund-management/fund-transactions/getBankFundTransactionsListSlice';
import { getEmpFundTransactionByEmpId } from '../../../redux/slices/fund-management/fund-transactions/getEmpFundTransactionListSlice';
import ScreensLabel from '../../../constants/ScreensLabel';

const ViewFundTransctionScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getBankFundTransactionsList);
  const ListData2 = useSelector(state => state.getEmpFundTransactionList);

  /*declare useState variable here */

  const [allOffice, setAllOffice] = useState([]);
  const [allManger, setAllManager] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [allEndUser, setAllEndUser] = useState([]);
  const [allBank, setAllBank] = useState([]);
  const [allAccount, setAllAccount] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [openFromDate, setOpenFromDate] = useState(false);
  const [openToDate, setOpenToDate] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [visible, setVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('last 12 Months');

  const filterArray = [
    'today',
    'yesterday',
    'this Week',
    'last Week',
    'this Month',
    'last Month',
    'this Quarter',
    'last Quarter',
    'last 6 Months',
    'last 12 Months',
  ];

  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');

    setVisible(false);
    if (val !== undefined) {
      setSelectedMenuItem(val);
      formik.setFieldValue(`date`, valueToSend);
    }
  };

  const showMenu = () => setVisible(true);

  const formik = useFormik({
    initialValues: {
      fund_balance_for: '1',
      bank_id: '',
      account_id: '',
      start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end_date: new Date(),
      date: 'last12Months',
      office_id: '',
      manager_id: '',
      supervisor_id: '',
      enduser_id: '',
      end_user_id: '',
    },
  });

  useEffect(() => {
    if (formik.values.fund_balance_for == '1') {
      fetchAllBank();
      dispatch(
        getBankFundTransactionByAccountId({
          accountId: formik.values.account_id.id,
          date: formik.values.date,
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
    if (formik.values.fund_balance_for == '2') {
      fetchMangerData();
      fetchUserData();
      dispatch(
        getEmpFundTransactionByEmpId({
          empId: formik.values.end_user_id,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
  }, [
    formik.values.account_id,
    searchText,
    formik.values.fund_balance_for,
    formik.values.end_user_id,
    formik.values.date,
    searchText,
    isFocused,
  ]);

  /*function for fetching Manger list data*/
  const fetchMangerData = async () => {
    try {
      const result = await dispatch(getAllManger()).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
          image: itm?.image,
        }));

        setAllManager(rData);
      } else {
        setAllManager([]);
      }
    } catch (error) {
      setAllManager([]);
    }
  };
  /*function for fetching User list data*/
  const fetchUserData = async () => {
    try {
      const result = await dispatch(getAllUsers()).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
          image: itm?.image,
        }));
        setAllOffice(rData);
      } else {
        setAllOffice([]);
      }
    } catch (error) {
      setAllOffice([]);
    }
  };

  /*function for fetching supervisor list data*/
  const hadleTeamMangerChange = async managerId => {
    setAllEndUser([]);
    try {
      const result = await dispatch(
        getAllSupervisorByMangaerId({ managerId }),
      ).unwrap();
      if (result.status) {
        const rData = result?.data.map(itm => {
          return {
            label: itm?.name,
            value: itm?.id,
            image: itm?.image,
          };
        });

        setAllSupervisor(rData);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setAllSupervisor([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });

      setAllSupervisor([]);
    }
  };

  /*function for fetching free end user list data*/
  const hadleSupervisorChange = async superVisorId => {
    try {
      const result = await dispatch(getAllFreeUserList(superVisorId)).unwrap();
      if (result.status) {
        const rData = result?.data.map(itm => {
          return {
            label: itm?.name,
            value: itm?.id,
            image: itm?.image,
          };
        });

        setAllEndUser(rData);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });

        setAllEndUser([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });

      setAllEndUser([]);
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
            label: itm?.account_holder_name,
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

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity style={styles.cardContainer}>
          <NeumorphCard
            darkShadowColor={Colors().darkShadow} // <- set this
            lightShadowColor={Colors().lightShadow} // <- this
          >
            <View
              style={{
                margin: WINDOW_WIDTH * 0.03,
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 10,
                }}>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      description :{' '}
                    </Text>

                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.description}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      UPDATED BALANCE :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().purple }]}>
                      ₹
                      {formik.values.fund_balance_for == '1'
                        ? item?.last_balance
                        : item?.balance}
                    </Text>
                  </View>
                  {item?.transaction_id && (
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          { color: Colors().pureBlack },
                        ]}>
                        Transaction id:{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          { color: Colors().pureBlack },
                        ]}>
                        {item?.transaction_id}
                      </Text>
                    </View>
                  )}

                  {formik.values.fund_balance_for == '2' && (
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          { color: Colors().pureBlack },
                        ]}>
                        status:{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[styles.cardtext, { color: Colors().aprroved }]}>
                        {item?.status}
                      </Text>
                    </View>
                  )}

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      date :{' '}
                    </Text>

                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {formik.values.fund_balance_for == '1'
                        ? moment(item?.date).format('DD-MM-YYYY')
                        : item.transaction_date}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.actionView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { color: Colors().pureBlack },
                  ]}>
                  Transaction :{' '}
                </Text>
                <NeumorphCard>
                  <View style={{ padding: 5 }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        {
                          color: getStatusColor1(
                            formik.values.fund_balance_for == '1'
                              ? item?.status
                              : item?.transaction_type,
                          ),
                        },
                      ]}>
                      {(formik.values.fund_balance_for == '1'
                        ? item.status
                        : item?.transaction_type) == 'credit'
                        ? '+'
                        : '-'}{' '}
                      ₹{' '}
                      {formik.values.fund_balance_for == '1'
                        ? item?.transaction
                        : item?.amount}
                    </Text>
                  </View>
                </NeumorphCard>
              </View>
              <View style={styles.actionView2}>
                <NeumorphCard>
                  <View style={{ padding: 5 }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        {
                          color: getStatusColor1(
                            formik.values.fund_balance_for == '1'
                              ? item?.status
                              : item?.transaction_type,
                          ),
                        },
                      ]}>
                      {formik.values.fund_balance_for == '1'
                        ? item?.status
                        : item?.transaction_type}
                      ed
                    </Text>
                  </View>
                </NeumorphCard>
              </View>
            </View>
          </NeumorphCard>
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = number => {
    setPageNo(number);

    if (formik.values.fund_balance_for == '1') {
      dispatch(
        getBankFundTransactionByAccountId({
          accountId: formik.values.account_id.id,
          date: formik.values.date,
          pageSize: pageSize,
          pageNo: number,
          search: searchText,
        }),
      );
    }
    if (formik.values.fund_balance_for == '2') {
      dispatch(
        getEmpFundTransactionByEmpId({
          empId: formik.values.end_user_id,
          pageSize: pageSize,
          pageNo: number,
        }),
      );
    }
  };

  const dateChangeFunction = yeardifference => {
    formik.setFieldValue(`date`, yeardifference);
  };
  if (formik.values.fund_balance_for == '2' && ListData2?.data?.data) {
    const { role_name, employee_id, username } = ListData2?.data?.data[0];
    var singleObjectWithCommonDetails = { role_name, employee_id, username };
    // setSingleObject(singleObjectWithCommonDetails);
  }

  /*pagination button UI*/
  const renderPaginationButtons = () => {
    const buttons = [];
    if (formik.values.fund_balance_for == '1') {
      for (let i = 1; i <= ListData?.data?.pageDetails?.totalPages; i++) {
        buttons.push(
          <TouchableOpacity
            key={i}
            onPress={() => handlePageClick(i)}
            style={[
              styles.paginationButton,
              i === pageNo ? styles.activeButton : null,
            ]}>
            <Text style={{ color: 'white' }}>{i}</Text>
          </TouchableOpacity>,
        );
      }
    }

    if (formik.values.fund_balance_for == '2') {
      for (let i = 1; i <= ListData2?.data?.pageDetails?.totalPages; i++) {
        buttons.push(
          <TouchableOpacity
            key={i}
            onPress={() => handlePageClick(i)}
            style={[
              styles.paginationButton,
              i === pageNo ? styles.activeButton : null,
            ]}>
            <Text style={{ color: 'white' }}>{i}</Text>
          </TouchableOpacity>,
        );
      }
    }

    return buttons;
  };

  const COMPANY_TYPE = [
    { label: 'BANK', value: '1' },
    { label: 'EMPLOYEE', value: '2' },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={label.FUND_TRANSACTIONS} />
      <ScrollView contentContainerStyle={{}}>
        <View>
          <Text
            style={[
              styles.title,
              { marginLeft: 10, marginTop: 5, color: Colors().pureBlack },
            ]}>
            Transaction FOR :--
          </Text>
        </View>

        <View
          style={{
            flexDirection: 'row',

            flexWrap: 'wrap',
            justifyContent: 'space-between',
          }}>
          {COMPANY_TYPE.map((radioButton, index) => (
            <>
              <CheckBox
                key={index}
                textStyle={{
                  fontFamily: Colors().fontFamilyBookMan,
                  color: Colors().gray,
                  fontWeight: '500',
                }}
                containerStyle={{
                  backgroundColor: Colors().screenBackground,
                  padding: 0,
                }}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-o"
                title={radioButton.label}
                //   disabled={edit_id ? true : false}
                checked={formik.values.fund_balance_for === radioButton.value}
                onPress={() => {
                  formik.resetForm();
                  if (radioButton.value == 2) {
                    formik.setFieldValue(`bank_id`, '');
                    setSearchText('');
                  }
                  // setComplaintFor(radioButton.value);
                  formik.setFieldValue('fund_balance_for', radioButton.value);
                }}
                checkedColor={Colors().aprroved}
              />
            </>
          ))}
        </View>

        {formik.values.fund_balance_for == '1' && (
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
                {formik.values?.account_id
                  ? formik.values?.account_id.account_type
                  : 'account type'}
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
                ? formik.values?.account_id?.account_number
                : 'Account Number'}
            </Text>

            <Text style={[styles.title, { color: 'white' }]}>
              Branch :{' '}
              {formik.values?.account_id
                ? formik.values?.account_id?.branch
                : '----'}
            </Text>

            <View
              style={[styles.twoItemView, { justifyContent: 'space-between' }]}>
              <Text style={[styles.title, { color: 'white', maxWidth: '50%' }]}>
                IFSC :
                {formik.values?.account_id
                  ? formik.values?.account_id?.ifsc_code
                  : '----'}
              </Text>
              <Text style={[styles.title, { color: 'white', maxWidth: '50%' }]}>
                balance: ₹{' '}
                {formik.values?.account_id
                  ? formik.values?.account_id?.balance
                  : '0000'}
              </Text>
            </View>
          </ImageBackground>
        )}
        {formik.values.fund_balance_for === '1' && (
          <View style={[styles.inputContainer]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              // style={styles.inputContainer}
              contentContainerStyle={{ columnGap: 10 }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                }}>
                <NeumorphicDropDownList
                  height={WINDOW_HEIGHT * 0.05}
                  width={WINDOW_WIDTH * 0.75}
                  placeHolderTxt={'bank'}
                  data={allBank}
                  value={formik.values.bank_id}
                  //   disable={edit_id}
                  onChange={val => {
                    formik.setFieldValue(`bank_id`, val);
                    handleBankChange(val.value);
                  }}
                />

                <NeumorphicDropDownList
                  height={WINDOW_HEIGHT * 0.05}
                  width={WINDOW_WIDTH * 0.75}
                  placeHolderTxt={'account'}
                  data={allAccount}
                  value={formik.values.account_id}
                  //   disable={edit_id}
                  onChange={val => {
                    formik.setFieldValue(`account_id`, val);
                  }}
                />

                <SearchBar
                  searchWidth={WINDOW_WIDTH * 0.78}
                  setSearchText={setSearchText}
                />
              </View>
            </ScrollView>
          </View>
        )}

        {formik.values.fund_balance_for === '1' && (
          <View style={[styles.inputContainer]}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ columnGap: 10 }}>
              <NeumorphDatePicker
                height={WINDOW_HEIGHT * 0.05}
                width={WINDOW_WIDTH * 0.5}
                title={'from'}
                iconPress={() => setOpenFromDate(!openFromDate)}
                valueOfDate={moment(formik.values.start_date).format(
                  'DD/MM/YYYY',
                )}
                modal
                open={openFromDate}
                date={new Date()}
                mode="date"
                onConfirm={date => {
                  formik.setFieldValue(`start_date`, date);
                  dateChangeFunction(
                    `${moment(date).format('YYYY')}-${moment(
                      formik.values.end_date,
                    ).format('YYYY')}`,
                  );

                  setOpenFromDate(false);
                }}
                onCancel={() => {
                  setOpenFromDate(false);
                }}></NeumorphDatePicker>

              <NeumorphDatePicker
                height={WINDOW_HEIGHT * 0.05}
                width={WINDOW_WIDTH * 0.5}
                title={'to'}
                iconPress={() => setOpenToDate(!openToDate)}
                valueOfDate={moment(formik.values.end_date).format(
                  'DD/MM/YYYY',
                )}
                modal
                open={openToDate}
                date={new Date()}
                mode="date"
                onConfirm={date => {
                  formik.setFieldValue(`end_date`, moment(date).format('YYYY'));
                  dateChangeFunction(
                    `${moment(formik.values.start_date).format(
                      'YYYY',
                    )}-${moment(date).format('YYYY')}`,
                  );

                  setOpenToDate(false);
                }}
                onCancel={() => {
                  setOpenToDate(false);
                }}></NeumorphDatePicker>
            </ScrollView>
          </View>
        )}

        {formik.values.fund_balance_for == '1' && (
          <View style={styles.actionView}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={[
                  styles.cardHeadingTxt,
                  { fontSize: 15, color: Colors().purple },
                ]}>
                All transaction history :{' '}
              </Text>
            </View>

            <View style={styles.actionView2}>
              <Menu
                visible={visible}
                anchor={
                  <Icon
                    name="dots-three-vertical"
                    type={IconType.Entypo}
                    color={Colors().edit}
                    style={styles.actionIcon}
                    onPress={showMenu}
                  />
                }
                onRequestClose={hideMenu}>
                {filterArray.map(itm => (
                  <MenuItem
                    style={{ backgroundColor: Colors().cardBackground }}
                    disabled={selectedMenuItem == itm}
                    textStyle={
                      selectedMenuItem === itm // If the menu item is disabled
                        ? [styles.cardtext, { color: 'red' }] // Apply red color
                        : [styles.cardtext, { color: Colors().pureBlack }] // Otherwise, use the default text style
                    }
                    onPress={() => {
                      hideMenu(itm);
                    }}>
                    {itm}
                  </MenuItem>
                ))}

                {/* <MenuItem onPress={hideMenu}>Menu item 2</MenuItem>
                  <MenuItem disabled>Disabled item</MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={hideMenu}>Menu item 4</MenuItem> */}
              </Menu>
            </View>
          </View>
        )}

        {formik.values.fund_balance_for == '1' && (
          <>
            {ListData?.isLoading ? (
              <View style={styles.transactionNoFound}>
                <Loader />
              </View>
            ) : !ListData?.isLoading &&
              !ListData?.isError &&
              ListData?.data?.status ? (
              <>
                {ListData?.data?.data.map(item => renderItem({ item }))}

                {ListData?.data?.pageDetails?.totalPages > 1 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                      marginTop: WINDOW_HEIGHT * 0.8,
                      bottom: 10,
                      alignSelf: 'center',
                      position: 'absolute',
                      backgroundColor: '',
                      marginHorizontal: WINDOW_WIDTH * 0.01,

                      columnGap: 20,
                    }}>
                    {renderPaginationButtons()}
                  </ScrollView>
                )}
              </>
            ) : ListData?.isError ? (
              <View style={styles.transactionNoFound}>
                <InternalServer />
              </View>
            ) : !formik.values.account_id ||
              (!ListData?.data?.status &&
                ListData?.data?.message == 'Data not found') ? (
              <View style={styles.transactionNoFound}>
                <DataNotFound />
              </View>
            ) : (
              <View style={styles.transactionNoFound}>
                <InternalServer></InternalServer>
              </View>
            )}
          </>
        )}

        {formik.values.fund_balance_for === '2' && (
          <View style={styles.inputContainer}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              // style={styles.inputContainer}
              contentContainerStyle={{ columnGap: 10 }}>
              <NeumorphicDropDownList
                height={WINDOW_HEIGHT * 0.05}
                width={WINDOW_WIDTH * 0.75}
                title={'office'}
                data={allOffice}
                value={formik.values?.office_id}
                disable={formik.values.manager_id}
                onChange={val => {
                  formik.setFieldValue(`end_user_id`, val.value);
                  formik.setFieldValue(`office_id`, val.value);
                }}
              />

              <NeumorphicDropDownList
                height={WINDOW_HEIGHT * 0.05}
                width={WINDOW_WIDTH * 0.75}
                title={'Manager'}
                data={allManger}
                value={formik.values?.manager_id}
                disable={formik.values.office_id}
                onChange={val => {
                  formik.setFieldValue(`end_user_id`, val.value);
                  formik.setFieldValue(`manager_id`, val.value);
                  hadleTeamMangerChange(val.value);
                }}
              />

              <NeumorphicDropDownList
                height={WINDOW_HEIGHT * 0.05}
                width={WINDOW_WIDTH * 0.75}
                title={'Supervisor'}
                data={allSupervisor}
                //   value={item?.supervisor_id}

                disable={formik.values.office_id}
                onChange={val => {
                  formik.setFieldValue(`end_user_id`, val.value);
                  hadleSupervisorChange(val.value);
                }}
              />

              <NeumorphicDropDownList
                height={WINDOW_HEIGHT * 0.05}
                width={WINDOW_WIDTH * 0.75}
                title={'End user'}
                data={allEndUser}
                // value={item?.end_users_id}

                disable={formik.values.office_id}
                onChange={val => {
                  formik.setFieldValue(`end_user_id`, val.value);
                }}
              />
            </ScrollView>
          </View>
        )}

        {formik.values.fund_balance_for == '2' && (
          <ImageBackground
            source={Images.BANK_CARD}
            imageStyle={{ borderRadius: WINDOW_WIDTH * 0.03 }}
            style={styles.bankCard}>
            <Text style={[styles.title, { color: 'white', fontSize: 20 }]}>
              {singleObjectWithCommonDetails?.username
                ? singleObjectWithCommonDetails?.username
                : 'Account Holder name'}
            </Text>
            <View
              style={[styles.twoItemView, { justifyContent: 'space-between' }]}>
              <Text style={[styles.title, { color: 'white', maxWidth: '50%' }]}>
                {singleObjectWithCommonDetails?.role_name
                  ? singleObjectWithCommonDetails?.role_name
                  : 'role name'}
              </Text>
              <Text style={[styles.title, { color: 'white', maxWidth: '50%' }]}>
                {singleObjectWithCommonDetails?.employee_id
                  ? singleObjectWithCommonDetails?.employee_id
                  : '-- -- --'}
              </Text>
            </View>

            <Text
              style={[
                styles.title,
                { color: 'white', fontSize: 22, alignSelf: 'center' },
              ]}>
              {singleObjectWithCommonDetails?.employee_id
                ? singleObjectWithCommonDetails?.employee_id
                : 'Employee id'}
            </Text>
          </ImageBackground>
        )}

        {formik.values.fund_balance_for == '2' && (
          <>
            {ListData2?.isLoading ? (
              <View style={styles.transactionNoFound}>
                <Loader />
              </View>
            ) : !ListData2?.isLoading &&
              !ListData2?.isError &&
              ListData2?.data?.status ? (
              <>
                {ListData2?.data?.data.map(item => renderItem({ item }))}
                {ListData2?.data?.pageDetails?.totalPages > 1 && (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{
                      marginTop: WINDOW_HEIGHT * 0.8,
                      bottom: 10,
                      alignSelf: 'center',
                      position: 'absolute',
                      backgroundColor: '',
                      marginHorizontal: WINDOW_WIDTH * 0.01,

                      columnGap: 20,
                    }}>
                    {renderPaginationButtons()}
                  </ScrollView>
                )}
              </>
            ) : ListData2?.isError ? (
              <View style={styles.transactionNoFound}>
                <InternalServer />
              </View>
            ) : !formik.values.end_user_id ||
              (!ListData2?.data?.status &&
                ListData2?.data?.message == 'Data not found') ? (
              <>
                <View style={styles.transactionNoFound}>
                  <DataNotFound />
                </View>
              </>
            ) : (
              <View style={styles.transactionNoFound}>
                <InternalServer></InternalServer>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewFundTransctionScreen;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: WINDOW_WIDTH * 0.04,
    rowGap: 10,
  },

  bankCard: {
    margin: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 10,
  },
  transactionNoFound: {
    height: WINDOW_HEIGHT * 0.4,
    width: WINDOW_WIDTH * 0.95,
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
  cardContainer: {
    width: WINDOW_WIDTH * 0.95,
    marginBottom: 15,
    height: 'auto',
    alignSelf: 'center',
  },
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },

  paginationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  activeButton: {
    backgroundColor: '#22c55d',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  actionView: {
    margin: WINDOW_WIDTH * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
});
