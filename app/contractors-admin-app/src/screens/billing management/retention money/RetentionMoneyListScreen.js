/*    ----------------Created Date :: 22- July -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import CustomeCard from '../../../component/CustomeCard';
import AlertModal from '../../../component/AlertModal';
import IconType from '../../../constants/IconType';
import Toast from 'react-native-toast-message';
import { Badge } from '@rneui/themed';
import NeumorphicCheckbox from '../../../component/NeumorphicCheckbox';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {
  getAllPaidBillInRetention,
  getAllRetention,
} from '../../../redux/slices/billing management/retention money/getRetentionMoneyListSlice';
import PaymentFilter from '../payment received/PaymentFilter';
import moment from 'moment';
import RetentionFilter from './RetentionFilter';
import {
  approvePayementRetentionByIds,
  rejectRetentionById,
} from '../../../redux/slices/billing management/retention money/addUpdateRetentionSlice';
import List from '../../../component/List/List';

const RetentionMoneyListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getRetentionMoney);

  /*declare useState variable here */
  const [refreshing, setRefreshing] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [retentionId, setRetentionId] = useState('');
  const [roId, setRoId] = useState('');
  const [poId, setPoId] = useState('');
  const [retention, setRetention] = useState('');
  const [loading, setLoading] = useState(false);
  const [pvNo, setPvNo] = useState('');
  const [checkData, setCheckData] = useState([{}]);
  const [filterChekcBox, setFilterChekcBox] = useState([]);

  /*for updating the checkbox*/
  const updateCheckDataAtIndex = (index, value) => {
    setCheckData(prevState => {
      const newState = [...prevState];
      newState[index] = value;
      return newState;
    });
  };

  useEffect(() => {
    const filteredData = checkData.filter(itm => itm?.chekedValue === true);
    setFilterChekcBox(filteredData);
  }, [checkData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      if (type == 'eligible' || type == 'process' || type == 'done') {
        dispatch(
          getAllRetention({
            status: getStatusCode(type),
            pageSize: pageSize,
            pageNo: pageNo,
            po: poId,
            ro: roId,
            retention: retention,
          }),
        );
      }
      if (type == 'allpaidbill') {
        dispatch(
          getAllPaidBillInRetention({
            pageSize: pageSize,
            pageNo: pageNo,
            pvNo: pvNo,
          }),
        );
      }
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    if (type == 'eligible' || type == 'process' || type == 'done') {
      dispatch(
        getAllRetention({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
          po: poId,
          ro: roId,
          retention: retention,
        }),
      );
    }
    if (type == 'allpaidbill') {
      dispatch(
        getAllPaidBillInRetention({
          pageSize: pageSize,
          pageNo: pageNo,
          pvNo: pvNo,
        }),
      );
    }
  }, [roId, poId, pvNo, retention]);

  // function for status code//
  const getStatusCode = status => {
    switch (status) {
      case 'eligible':
        return 1;
      case 'process':
        return 2;
      case 'done':
        return 3;

      default:
        break;
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'reject':
        setRejectModalVisible(true);

        setRetentionId(actionButton?.itemData?.id);
        break;
      case 'edit':
        const edit_id = actionButton?.itemData?.id;
        navigation.navigate('CreateRetentionScreen', { edit_id: edit_id });
        break;

      default:
        break;
    }
  };

  /*Function  for rejecting the retention money*/
  const rejectOfRetention = async () => {
    const result = await dispatch(rejectRetentionById(retentionId)).unwrap();
    if (result?.status) {
      setRejectModalVisible(false);
      setRetentionId();
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      navigation.navigate('RetentionMoneyTopTab');
    } else {
      setRejectModalVisible(false);
      setRetentionId();
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /*for merging  invoice*/
  const approveOfPayment = async () => {
    const reqBody = {
      ids: filterChekcBox.map(itm => itm?.id),
    };
    if (type == 'process') {
      navigation.navigate('ApporveRetentionMoneyScreen', reqBody);
    } else {
      setLoading(true);
      const result = await dispatch(
        approvePayementRetentionByIds(reqBody),
      ).unwrap();
      if (result?.status) {
        Toast.show({
          type: 'success',
          text1: result?.message,
          position: 'bottom',
        });
        setLoading(false);
        setFilterChekcBox([]);
        setCheckData([{}]);
        setPoId(''), setRoId(''), navigation.navigate('RetentionMoneyTopTab');
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });
        navigation.navigate('RetentionMoneyTopTab');
      }
    }
  };

  /* Button ui for create pi*/
  const ListFooterComponent = () => (
    <View style={{ alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.02 }}>
      {filterChekcBox?.length >= 1 ? (
        <NeumorphicButton
          title={'Approve retention'}
          loading={loading}
          btnBgColor={Colors().purple}
          titleColor={Colors().inputLightShadow}
          onPress={() => approveOfPayment()}
        />
      ) : null}
    </View>
  );

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity
          onPress={() => {
            if (type == 'allpaidbill') {
              navigation.navigate('PaymentReceivedDetailScreen', {
                id: item?.id,
              });
            }
            if (type != 'allpaidbill') {
              navigation.navigate('RetentioMoneyDetailScreen', {
                id: item?.id,
              });
            }
          }}>
          {type == 'allpaidbill' ? (
            <CustomeCard
              allData={item}
              data={[
                {
                  key: 'PAYMENT UNIQUE ID',
                  value: item?.payment_unique_id ?? '--',
                  keyColor: Colors().skyBule,
                },
                {
                  key: 'INVOICE NUMBER',
                  value: item?.invoice_number ?? '--',
                },
                {
                  key: 'INVOICE DATE',
                  value:
                    moment(item?.invoice_date).format('DD-MM-YYYY') ?? '--',
                },
                {
                  key: 'PV NUMBER',
                  value: item?.pv_number ?? '--',
                },
                {
                  key: 'RECIEVED AMOUNT',
                  value: `₹ ${item?.amount_received}` ?? '--',
                  keyColor: Colors().aprroved,
                },
              ]}
              status={[
                {
                  key: 'status',
                  value: 'Ready to retention',
                  color: Colors().edit,
                },
              ]}
            />
          ) : (
            <CustomeCard
              allData={item}
              data={[
                ...(type !== 'done' && roId && poId
                  ? [
                      {
                        component: (
                          <View style={{ flex: 1 }}>
                            <View
                              style={{
                                alignSelf: 'flex-end',
                                position: 'absolute',
                              }}>
                              <NeumorphicCheckbox
                                isChecked={checkData[index]?.chekedValue}
                                onChange={val =>
                                  updateCheckDataAtIndex(
                                    index,
                                    (val = {
                                      chekedValue: val,
                                      complaintFor:
                                        item?.complaintDetails[0]
                                          ?.complaint_for,
                                      id: item?.id,
                                      billing_from_state_id:
                                        item?.billing_from_state_id,
                                      financial_year: item?.financial_year,
                                    }),
                                  )
                                }
                              />
                            </View>
                          </View>
                        ),
                      },
                    ]
                  : []),
                {
                  key: 'bill date',
                  value: item?.invoice_date ?? '--',
                },
                {
                  key: 'complaint id',
                  component: (
                    <View style={{ flex: 1 }}>
                      {item?.complaintDetails &&
                        item?.complaintDetails?.map((itm, idx) => {
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                columnGap: 10,
                                flex: 1,
                              }}>
                              <Badge value={idx + 1} />
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().skyBule },
                                ]}>
                                {itm?.complaint_id}
                              </Text>
                            </View>
                          );
                        })}
                    </View>
                  ),
                },
                {
                  key: 'complaint type',
                  component: (
                    <View style={{ flex: 1 }}>
                      {item?.complaintDetails &&
                        item?.complaintDetails?.map((itm, idx) => {
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                columnGap: 10,
                                flex: 1,
                              }}>
                              <Badge value={idx + 1} />
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().skyBule },
                                ]}>
                                {itm?.complaint_type_name}
                              </Text>
                            </View>
                          );
                        })}
                    </View>
                  ),
                },

                {
                  key: 'outlet name',
                  component: (
                    <View style={{ flex: 1 }}>
                      {item?.outletDetails &&
                        item?.outletDetails?.map((itm, idx) => {
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                columnGap: 10,
                                flex: 1,
                              }}>
                              <Badge value={idx + 1} />
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().skyBule },
                                ]}>
                                {itm?.outlet_name}
                              </Text>
                            </View>
                          );
                        })}
                    </View>
                  ),
                },

                {
                  key: 'outlet code',
                  component: (
                    <View style={{ flex: 1 }}>
                      {item?.outletDetails &&
                        item?.outletDetails?.map((itm, idx) => {
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                columnGap: 10,
                                flex: 1,
                              }}>
                              <Badge value={idx + 1} />
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().skyBule },
                                ]}>
                                {itm?.outlet_unique_id}
                              </Text>
                            </View>
                          );
                        })}
                    </View>
                  ),
                },
                {
                  key: 'Sales area',
                  component: (
                    <View style={{ flex: 1 }}>
                      {item?.salesAreaDetails &&
                        item?.salesAreaDetails?.map((itm, idx) => {
                          return (
                            <View
                              style={{
                                flexDirection: 'row',
                                columnGap: 10,
                                flex: 1,
                              }}>
                              <Badge value={idx + 1} />
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().skyBule },
                                ]}>
                                {itm?.sales_area_name}
                              </Text>
                            </View>
                          );
                        })}
                    </View>
                  ),
                },
                {
                  key: 'Ro',
                  value: item?.ro_name ?? '--',
                },
                {
                  key: 'po number',
                  value: item?.po_number ?? '--',
                },
                {
                  key: 'callup number',
                  value: item?.callup_number ?? '--',
                },
                {
                  key: 'Voucher no',
                  value: item?.pv_number ?? '--',
                },

                {
                  key: 'vouhcer date',
                  value: item?.pv_date ?? '--',
                },
                {
                  key: 'Voucher amt',
                  value: `₹ ${item?.pv_amount}` ?? '--',
                  keyColor: Colors().aprroved,
                },
              ]}
              status={[
                {
                  key: 'Invoice NUMBER',
                  value: item?.invoice_no,
                  color: Colors().skyBule,
                },
              ]}
              rejectButton={type == 'process' ? true : false}
              editButton={type == 'eligible' ? true : false}
              action={handleAction}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (type == 'eligible' || type == 'process' || type == 'done') {
      dispatch(
        getAllRetention({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
          po: poId,
          ro: roId,
          retention: retention,
        }),
      );
    }
    if (type == 'allpaidbill') {
      dispatch(
        getAllPaidBillInRetention({
          pageSize: pageSize,
          pageNo: pageNo,
          pvNo: pvNo,
        }),
      );
    }
  };

  function areAllIdsPresent(listedData, allData) {
    // Check if listedData is empty
    if (listedData.length === 0) {
      return false;
    }

    const listedIds = listedData.map(item => item.id);
    const allIds = allData.map(item => item.id);
    return allIds.every(id => listedIds.includes(id));
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      {/* Filter for componenet */}

      {type == 'allpaidbill' && (
        <PaymentFilter statusCode={3} pvNo={pvNo} setPvNo={setPvNo} />
      )}
      {type !== 'allpaidbill' && (
        <RetentionFilter
          statusCode={getStatusCode(type)}
          po={poId}
          setPo={setPoId}
          ro={roId}
          setRo={setRoId}
          retention={retention}
          setRetention={setRetention}
        />
      )}

      {!ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status &&
        type !== 'allpaidbill' &&
        type !== 'done' &&
        roId &&
        poId && (
          <View
            style={{
              alignSelf: 'flex-end',
              flexDirection: 'row',
              marginRight: 15,
            }}>
            <Text
              style={[
                styles.cardHeadingTxt,
                { color: Colors().purple, fontSize: 15, marginRight: 20 },
              ]}>
              Select All
            </Text>
            <NeumorphicCheckbox
              isChecked={areAllIdsPresent(filterChekcBox, ListData?.data?.data)}
              onChange={e => {
                ListData?.data?.data?.map((itm, idx) => {
                  const body = {
                    chekedValue: e,
                    complaintFor: itm?.complaintDetails[0]?.complaint_for,
                    id: itm?.id,
                    billing_from_state_id: itm?.billing_from_state_id,
                    financial_year: itm?.financial_year,
                  };
                  updateCheckDataAtIndex(idx, (val = body));
                });
              }}
            />
          </View>
        )}
      <View style={{ height: WINDOW_HEIGHT * 0.8, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={''}
          ListFooterComponent={ListFooterComponent}
        />
      </View>

      {rejectModalVisible && (
        <AlertModal
          visible={rejectModalVisible}
          iconName={'closecircleo'}
          icontype={IconType.AntDesign}
          iconColor={Colors().rejected}
          textToShow={'ARE YOU SURE YOU WANT TO REJECT THIS!!'}
          cancelBtnPress={() => setRejectModalVisible(!rejectModalVisible)}
          ConfirmBtnPress={() => rejectOfRetention()}
        />
      )}
    </SafeAreaView>
  );
};

export default RetentionMoneyListScreen;

const styles = StyleSheet.create({
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
