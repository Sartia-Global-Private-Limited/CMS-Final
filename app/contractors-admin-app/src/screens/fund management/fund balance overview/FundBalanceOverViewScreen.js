/*    ----------------Created Date :: 28- March -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { Avatar, CheckBox } from '@rneui/base';
import ScreensLabel from '../../../constants/ScreensLabel';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import { apiBaseUrl } from '../../../../config';
import NeumorphCard from '../../../component/NeumorphCard';
import CustomeHeader from '../../../component/CustomeHeader';
import Toast from 'react-native-toast-message';
import Images from '../../../constants/Images';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { useFormik } from 'formik';
import NeumorphicDropDownList from '../../../component/DropDownList';
import {
  getAllBank,
  getAllManger,
  getAllSupervisorByMangaerId,
  getAllUsers,
} from '../../../redux/slices/commonApi';
import { getAllFreeUserList } from '../../../redux/slices/allocate/allocateComplaintSlice';
import { getBankBalanceByBankId } from '../../../redux/slices/fund-management/fund balance overview/getBankBalanceListSlice';
import { getBankBalanceByEmpId } from '../../../redux/slices/fund-management/fund balance overview/getEmpBalanceListSlice';

const FundBalanceOverViewScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getBankBalanceList);
  const ListData2 = useSelector(state => state.getEmpBalanceList);

  /*declare useState variable here */

  const [allOffice, setAllOffice] = useState([]);
  const [allManger, setAllManager] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [allEndUser, setAllEndUser] = useState([]);
  const [allBank, setAllBank] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const formik = useFormik({
    initialValues: {
      fund_balance_for: '1',
      bank_id: '',
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
        getBankBalanceByBankId({
          bankId: formik.values.bank_id,
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
    if (formik.values.fund_balance_for == '2') {
      dispatch(
        getBankBalanceByEmpId({
          empId: formik.values.end_user_id,
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
  }, [
    formik.values.bank_id,
    searchText,
    formik.values.fund_balance_for,
    formik.values.end_user_id,
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

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'current':
        return Colors().pending;
      case 'savings':
        return Colors().aprroved;

      default:
        return 'black';
    }
  }

  /* if we got no data for flatlist*/
  const renderEmptyComponent = () => (
    // Render your empty component here<>
    <View
      style={{
        height: WINDOW_HEIGHT * 0.6,
      }}>
      <DataNotFound />
    </View>
  );

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
                <View>
                  <NeuomorphAvatar gap={4}>
                    <Avatar
                      size={50}
                      rounded
                      source={{
                        uri: item?.logo
                          ? `${apiBaseUrl}${item?.logo}`
                          : `${
                              Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                .uri
                            }`,
                      }}
                    />
                  </NeuomorphAvatar>
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Account No. :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().skyBule }]}>
                      {item?.account_number}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Holder name :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.account_holder_name}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      IFSC CODE:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.ifsc_code}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Branch:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.branch}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Balance:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      ₹ {item?.last_balance ? item?.last_balance : 0}
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
                  account type :{' '}
                </Text>
                <NeumorphCard>
                  <View style={{ padding: 5 }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        { color: getStatusColor(item?.account_type) },
                      ]}>
                      {item?.account_type}
                    </Text>
                  </View>
                </NeumorphCard>
              </View>
              <View style={styles.actionView2}></View>
            </View>
          </NeumorphCard>
        </TouchableOpacity>
      </View>
    );
  };
  /* flatlist render ui */
  const renderItem2 = ({ item }) => {
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
                <View>
                  <NeuomorphAvatar gap={4}>
                    <Avatar
                      size={50}
                      rounded
                      source={{
                        uri: item?.image
                          ? `${apiBaseUrl}${item?.image}`
                          : `${
                              Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                .uri
                            }`,
                      }}
                    />
                  </NeuomorphAvatar>
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      employee id :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().skyBule }]}>
                      {item?.employee_id}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      name :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.name}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      email:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.email}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Mobile :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.mobile}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Balance:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      ₹ {item?.balance ? item?.balance : 0}
                    </Text>
                  </View>
                </View>
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
        getBankBalanceByBankId({
          bankId: formik.values.bank_id,
          pageSize: pageSize,
          pageNo: number,
        }),
      );
    }
    if (formik.values.fund_balance_for == '2') {
      dispatch(
        getBankBalanceByEmpId({
          empId: formik.values.end_user_id,
          pageSize: pageSize,
          pageNo: number,
        }),
      );
    }
  };

  /*pagination button UI*/
  const renderPaginationButtons = () => {
    const buttons = [];

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

    return buttons;
  };

  const COMPANY_TYPE = [
    { label: 'BANK', value: '1' },
    { label: 'EMPLOYEE', value: '2' },
  ];

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={label.FUND_BALANCE_OVERVIEW} />

      <View>
        <Text
          style={[
            styles.title,
            { marginLeft: 10, marginTop: 5, color: Colors().pureBlack },
          ]}>
          balance overview FOR :--
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
                  fetchMangerData();
                  fetchUserData();
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
              placeHolderTxt={'office'}
              data={allOffice}
              // value={item?.office_users_id}

              disable={formik.values.manager_id}
              onChange={val => {
                formik.setFieldValue(`end_user_id`, val.value);
                formik.setFieldValue(`office_id`, val.value);
              }}
            />

            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'Manager'}
              data={allManger}
              // value={item?.area_manager_id}

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
              placeHolderTxt={'supervisor'}
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
              placeHolderTxt={'end user'}
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

      {formik.values.fund_balance_for === '1' && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            columnGap: 10,
            alignItems: 'center',
            height: 60,
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: 10,
            }}>
            <SearchBar
              searchWidth={WINDOW_WIDTH * 0.78}
              setSearchText={setSearchText}
            />
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'bank'}
              data={allBank}
              onChange={val => {
                formik.setFieldValue(`bank_id`, val.value);
              }}
            />
          </View>
        </ScrollView>
      )}

      {formik.values.fund_balance_for == '1' && (
        <>
          {ListData?.isLoading ? (
            <Loader />
          ) : !ListData?.isLoading &&
            !ListData?.isError &&
            ListData?.data?.status ? (
            <>
              <FlatList
                data={ListData?.data?.data}
                renderItem={renderItem}
                keyExtractor={item => item?.id?.toString()}
                contentContainerStyle={{ paddingBottom: 50, paddingTop: 10 }}
                ListEmptyComponent={renderEmptyComponent}
              />
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
            <InternalServer />
          ) : !formik.values.bank_id ||
            (!ListData?.data?.status &&
              ListData?.data?.message == 'Data not found') ? (
            <>
              <DataNotFound />
              {/* View for floating button */}
            </>
          ) : (
            <InternalServer></InternalServer>
          )}
        </>
      )}

      {formik.values.fund_balance_for == '2' && (
        <>
          {ListData2?.isLoading ? (
            <Loader />
          ) : !ListData2?.isLoading &&
            !ListData2?.isError &&
            ListData2?.data?.status ? (
            <>
              <FlatList
                data={ListData2?.data?.data}
                renderItem={renderItem2}
                // keyExtractor={item => item.id.toString()}
                contentContainerStyle={{ paddingBottom: 50 }}
                ListEmptyComponent={renderEmptyComponent}
              />
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
            <InternalServer />
          ) : !ListData2?.data?.status &&
            ListData2?.data?.message == 'Data not found' ? (
            <>
              <DataNotFound />
              {/* View for floating button */}
            </>
          ) : (
            <InternalServer></InternalServer>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default FundBalanceOverViewScreen;

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 5,
    marginHorizontal: 10,
    backgroundColor: 'green',
  },
  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  selectedTextStyle: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
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
});
