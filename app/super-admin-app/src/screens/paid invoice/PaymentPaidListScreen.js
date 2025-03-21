import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeCard from '../../component/CustomeCard';
import AlertModal from '../../component/AlertModal';
import IconType from '../../constants/IconType';
import Toast from 'react-native-toast-message';
import NeumorphicCheckbox from '../../component/NeumorphicCheckbox';
import NeumorphicButton from '../../component/NeumorphicButton';
import {rejectRetentionById} from '../../redux/slices/billing management/retention money/addUpdateRetentionSlice';
import {
  getAllPaidBillInPaymentPaid,
  getAllPaymentPaidWithStatusCode,
} from '../../redux/slices/paid invoice/getPaymentPaidListSlice';
import PaymentPaidFilter from './PaymentPaidFilter';
import Images from '../../constants/Images';
import {
  addPaymentPaymentPaid,
  resendOtpPaymentPaid,
} from '../../redux/slices/paid invoice/addUpadatePaymentPaidSlice';
import List from '../../component/List/List';

const PaymentPaidListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getPaymentPaidList);

  /*declare useState variable here */
  const [rejectModalVisible, setRejectModalVisible] = useState(false);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [retentionId, setRetentionId] = useState('');
  const [roId, setRoId] = useState('');
  const [areaManagerId, setAreaManagerId] = useState('');
  const [loading, setLoading] = useState(false);
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
      if (type == 'process' || type == 'done') {
        dispatch(
          getAllPaymentPaidWithStatusCode({
            status: getStatusCode(type),
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      }
      if (type == 'all') {
        dispatch(
          getAllPaidBillInPaymentPaid({
            pageSize: pageSize,
            pageNo: pageNo,
            roId: roId,
            areaManagerId: areaManagerId,
          }),
        );
      }
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    if (type == 'process' || type == 'done') {
      dispatch(
        getAllPaymentPaidWithStatusCode({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'all') {
      dispatch(
        getAllPaidBillInPaymentPaid({
          pageSize: pageSize,
          pageNo: pageNo,
          roId: roId,
          areaManagerId: areaManagerId,
        }),
      );
    }
  }, [roId, areaManagerId]);

  // function for status code//
  const getStatusCode = status => {
    switch (status) {
      case 'process':
        return 1;
      case 'done':
        return 2;

      default:
        break;
    }
  };

  function areAllIdsPresent(listedData, allData) {
    // Check if listedData is empty
    if (listedData.length === 0) {
      return false;
    }

    const listedIds = listedData.map(item => item.complaint_id);

    const allIds = allData.map(item => item.complaint_id);

    return allIds.every(id => listedIds.includes(id));
  }

  /*function  for getting total of approve qty and amount of approved item*/
  const getTotal = (data, key) => {
    let total = 0;
    data.forEach(element => {
      total += parseFloat(element[key]) || 0;
    });

    return total.toFixed(2);
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'cycle':
        const reqBody = {
          id: actionButton?.itemData?.id,
          ro_id: actionButton?.itemData?.ro_id,
          manager_id: actionButton?.itemData?.manager_id,
        };
        reSendOtp(reqBody);
        break;
      case 'feedback':
        navigation.navigate('PaymentPaidOtpVerifyScreen', {
          id: actionButton?.itemData?.id,
          ro_id: actionButton?.itemData?.ro_id,
          manager_id: actionButton?.itemData?.manager_id,
          amount: actionButton?.itemData?.amount,
        });
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
      navigation.navigate('PaidInvoiceTopTab');
    } else {
      setRejectModalVisible(false);
      setRetentionId();
      Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
    }
  };

  /*for resending otp */
  const reSendOtp = async reqBody => {
    const result = await dispatch(resendOtpPaymentPaid(reqBody)).unwrap();
    if (result?.status) {
      Toast.show({
        type: 'success',
        position: 'bottom',
        text1: result?.message,
      });
    } else {
      Toast.show({type: 'error', position: 'bottom', text1: result?.message});
    }
  };

  /*for merging  invoice*/
  const approveOfPayment = async () => {
    const reqBody = {
      manager_id: areaManagerId,
      ro_id: roId,
      paid_payment: (
        getTotal(filterChekcBox, 'measurement_amount') -
        getTotal(filterChekcBox, 'deduction')
      ).toFixed(2),
      payment_data: filterChekcBox.map(itm => itm),
    };

    setLoading(true);
    const result = await dispatch(addPaymentPaymentPaid(reqBody)).unwrap();
    if (result?.status) {
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      setLoading(false);
      setFilterChekcBox([]);
      setCheckData([{}]);
      setRoId(''), navigation.navigate('PaidInvoiceTopTab');
    } else {
      setLoading(false);
      Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
      navigation.navigate('PaidInvoiceTopTab');
    }
  };

  /* Button ui for create pi*/
  const ListFooterComponent = () => (
    <View style={{alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.02}}>
      {filterChekcBox?.length >= 1 ? (
        <NeumorphicButton
          title={'Create Payment'}
          loading={loading}
          btnBgColor={Colors().purple}
          titleColor={Colors().inputLightShadow}
          onPress={() => approveOfPayment()}
        />
      ) : null}
    </View>
  );

  /* flatlist render ui */
  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          disabled={type == 'all'}
          onPress={() => {
            navigation.navigate('PaymentPaidDetailScreen', {
              id: item?.id,
            });
          }}>
          {type !== 'all' ? (
            <CustomeCard
              allData={item}
              data={[
                {
                  key: 'PAYMENT UNIQUE ID',
                  value: item?.unique_id ?? '--',
                  keyColor: Colors().skyBule,
                },
                {
                  key: 'Manager name',
                  value: item?.manager_name ?? '--',
                },

                {
                  key: 'ro name',
                  value: item?.ro_name ?? '--',
                },
                ...(type == 'done'
                  ? [
                      {
                        key: 'received amt',
                        value: `₹ ${item?.paid_amount}` ?? '--',
                        keyColor: Colors().aprroved,
                      },
                    ]
                  : []),
                ...(type == 'done'
                  ? [
                      {
                        key: 'Payment mode',
                        value: `${item?.payment_mode}` ?? '--',
                      },
                    ]
                  : []),
                ...(type == 'done'
                  ? [
                      {
                        key: 'otp',
                        value: `${item?.otp}` ?? '--',
                        keyColor: Colors().pending,
                      },
                    ]
                  : []),
              ]}
              status={[
                {
                  key: 'amount',
                  value: `₹ ${item?.amount}` ?? '--',
                  color: Colors().aprroved,
                },
              ]}
              feedbackButton={type == 'process' ? true : false}
              changeStatusButton={type == 'process' ? true : false}
              action={handleAction}
            />
          ) : (
            <CustomeCard
              allData={item}
              data={[
                ...(type == 'all' && roId && areaManagerId
                  ? [
                      {
                        component: (
                          <View style={{flex: 1}}>
                            <View
                              style={{
                                alignSelf: 'flex-end',
                                position: 'absolute',
                              }}>
                              <NeumorphicCheckbox
                                isChecked={checkData[index]?.chekedValue}
                                onChange={val => {
                                  updateCheckDataAtIndex(
                                    index,
                                    (val = {
                                      chekedValue: val,
                                      billNumber: item?.invoice_no,
                                      bill_date: item?.invoice_date,
                                      complaint_id: item?.complaint_id,
                                      measurement_id: item?.measurement_id,
                                      pv_number: item?.payment_voucher_number,
                                      pv_date: item?.payment_voucher_date,
                                      deduction: item?.deduction,
                                      measurement_amount:
                                        item?.measurement_amount,
                                    }),
                                  );
                                }}
                              />
                            </View>
                          </View>
                        ),
                      },
                    ]
                  : []),
                {
                  key: 'bill no',
                  value: item?.invoice_no ?? '--',
                  keyColor: Colors().skyBule,
                },
                {
                  key: 'bill date',
                  value: item?.invoice_date ?? '--',
                },

                {
                  key: 'measurement amt',
                  value: `₹ ${item?.measurement_amount}` ?? '--',
                  keyColor: Colors().aprroved,
                },

                {
                  key: 'complaint no',
                  value: item?.complaint_unique_id ?? '--',
                  keyColor: Colors().skyBule,
                },
                {
                  key: 'po number',
                  value: item?.po_number ?? '--',
                },
                {
                  key: 'po date',
                  value: item?.po_date ?? '--',
                },
                {
                  key: 'area manager',
                  value: item?.area_manager_detail?.user_name ?? '--',
                },

                {
                  key: 'Regional office',
                  value: item?.ro_name ?? '--',
                },
                {
                  key: 'salea area',
                  value: item?.sales_area_name ?? '--',
                },
                {
                  key: 'Pv no',
                  value: item?.pv_number ?? '--',
                },
                {
                  key: 'pv date',
                  value: item?.payment_voucher_date ?? '--',
                },
              ]}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (type == 'process' || type == 'done') {
      dispatch(
        getAllPaymentPaidWithStatusCode({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'all') {
      dispatch(
        getAllPaidBillInPaymentPaid({
          pageSize: pageSize,
          pageNo: pageNo,
          roId: roId,
          areaManagerId: areaManagerId,
        }),
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      {/* Filter for componenet */}
      {type == 'all' && (
        <PaymentPaidFilter
          statusCode={getStatusCode(type)}
          roId={roId}
          setRoId={setRoId}
          areaManagerId={areaManagerId}
          setAreaManagerId={setAreaManagerId}
        />
      )}
      {type == 'all' && roId && areaManagerId && (
        <ImageBackground
          source={Images.BANK_CARD}
          imageStyle={{borderRadius: WINDOW_WIDTH * 0.03}}
          style={styles.bankCard}>
          {[
            {
              key: 'measurement amt :',
              value: getTotal(filterChekcBox, 'measurement_amount'),
            },
            {
              key: 'dedution amt :',
              value: getTotal(filterChekcBox, 'deduction'),
            },
            {
              key: 'Final amt :',
              value: (
                getTotal(filterChekcBox, 'measurement_amount') -
                getTotal(filterChekcBox, 'deduction')
              ).toFixed(2),
            },
          ].map(itm => (
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.title, {color: 'white', fontSize: 16}]}>
                {itm?.key}
              </Text>
              <Text style={[styles.title, {color: 'white', fontSize: 16}]}>
                ₹ {itm?.value}
              </Text>
            </View>
          ))}
        </ImageBackground>
      )}

      {!ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status &&
        type == 'all' &&
        roId &&
        areaManagerId && (
          <View
            style={{
              alignSelf: 'flex-end',
              flexDirection: 'row',
              marginRight: 15,
            }}>
            <Text
              style={[
                styles.cardHeadingTxt,
                {color: Colors().purple, fontSize: 15, marginRight: 20},
              ]}>
              Select All
            </Text>
            <NeumorphicCheckbox
              isChecked={areAllIdsPresent(filterChekcBox, ListData?.data?.data)}
              onChange={e => {
                ListData?.data?.data?.map((itm, idx) => {
                  const body = {
                    chekedValue: e,
                    billNumber: itm?.invoice_no,
                    bill_date: itm?.invoice_date,
                    complaint_id: itm?.complaint_id,
                    measurement_id: itm?.measurement_id,
                    pv_number: itm?.payment_voucher_number,
                    pv_date: itm?.payment_voucher_date,
                    deduction: itm?.deduction,
                    measurement_amount: itm?.measurement_amount,
                  };
                  updateCheckDataAtIndex(idx, (val = body));
                });
              }}
            />
          </View>
        )}

      <View style={{height: WINDOW_HEIGHT * 0.825, width: WINDOW_WIDTH}}>
        <List
          data={ListData}
          permissions={{view: true}}
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

export default PaymentPaidListScreen;

const styles = StyleSheet.create({
  bankCard: {
    margin: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 6,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
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
