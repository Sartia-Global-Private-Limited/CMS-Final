/*    ----------------Created Date :: 10- August -2024   ----------------- */

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../component/CustomeCard';
import Toast from 'react-native-toast-message';
import NeumorphicCheckbox from '../../component/NeumorphicCheckbox';
import NeumorphicButton from '../../component/NeumorphicButton';
import RegionalOfficeFilter from './RegionalOfficeFilter';
import Images from '../../constants/Images';
import {
  getAllRegionalOffice,
  getRegionalOfficeWithStatusCode,
} from '../../redux/slices/regional office/getRegionalOfficeListSlice';
import { addPaymentRegionalOffice } from '../../redux/slices/regional office/addUpdateRegionalOfficeSlice';
import List from '../../component/List/List';

const RegionalOfficeListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getRegionalOfficeList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [roId, setRoId] = useState('');
  const [poId, setPoId] = useState('');
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
          getRegionalOfficeWithStatusCode({
            status: getStatusCode(type),
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      }
      if (type == 'all') {
        dispatch(
          getAllRegionalOffice({
            pageSize: pageSize,
            pageNo: pageNo,
            roId: roId,
            poId: poId,
          }),
        );
      }
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    if (type == 'process' || type == 'done') {
      dispatch(
        getRegionalOfficeWithStatusCode({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'all') {
      dispatch(
        getAllRegionalOffice({
          pageSize: pageSize,
          pageNo: pageNo,
          roId: roId,
          poId: poId,
        }),
      );
    }
  }, [roId, poId]);

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
      total +=
        parseFloat(
          key == 'deduction' ? element[key]?.deduction : element[key],
        ) || 0;
    });

    return total.toFixed(2);
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('CreateRegionalOfficePayment', {
          id: actionButton?.itemData?.id,
          ro_id: actionButton?.itemData?.ro_id,
          amount: actionButton?.itemData?.amount,
        });
        break;

      default:
        break;
    }
  };

  /*for create of payment*/
  const approveOfPayment = async () => {
    const reqBody = {
      po_id: poId,
      ro_id: roId,
      paid_payment: (
        getTotal(filterChekcBox, 'measurement_amount') -
        getTotal(filterChekcBox, 'deduction')
      ).toFixed(2),
      payment_data: filterChekcBox.map(itm => {
        return {
          billNumber: itm?.billNumber,
          bill_date: itm?.bill_date,
          complaint_id: itm?.complaint_id,
          measurement_id: itm?.measurement_id,
          pv_number: itm?.pv_number,
          pv_date: itm?.pv_date,
          deduction: itm?.deduction?.deduction?.toFixed(2),
        };
      }),
    };

    setLoading(true);
    const result = await dispatch(addPaymentRegionalOffice(reqBody)).unwrap();
    if (result?.status) {
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      setLoading(false);
      setFilterChekcBox([]);
      setCheckData([{}]);
      setRoId(''), navigation.navigate('RegionalOfficeTopTab');
    } else {
      setLoading(false);
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
      navigation.navigate('RegionalOfficeTopTab');
    }
  };

  /* Button ui for create pi*/
  const ListFooterComponent = () => (
    <View style={{ alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.02 }}>
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
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity
          disabled={type == 'all'}
          onPress={() => {
            navigation.navigate('RegionalOfficeDetailScreen', {
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
                  key: 'po no',
                  value: item?.po_details?.po_number ?? '--',
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
              ]}
              status={[
                {
                  key: 'amount',
                  value: `₹ ${item?.amount}` ?? '--',
                  color: Colors().aprroved,
                },
              ]}
              editButton={type == 'process'}
              action={handleAction}
            />
          ) : (
            <CustomeCard
              allData={item}
              data={[
                ...(type == 'all' && roId && poId
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
        getRegionalOfficeWithStatusCode({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'all') {
      dispatch(
        getAllRegionalOffice({
          pageSize: pageSize,
          pageNo: pageNo,
          roId: roId,
          poId: poId,
        }),
      );
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      {/* Filter for componenet */}
      {type == 'all' && (
        <RegionalOfficeFilter
          statusCode={getStatusCode(type)}
          roId={roId}
          setRoId={setRoId}
          poId={poId}
          setPoId={setPoId}
        />
      )}
      {type == 'all' && roId && poId && (
        <ImageBackground
          source={Images.BANK_CARD}
          imageStyle={{ borderRadius: WINDOW_WIDTH * 0.03 }}
          style={styles.bankCard}>
          {[
            {
              key: 'measurement amt :',
              value: getTotal(filterChekcBox, 'measurement_amount'),
            },
            {
              key: 'deduction amt :',
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
              style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={[styles.title, { color: 'white', fontSize: 16 }]}>
                {itm?.key}
              </Text>
              <Text style={[styles.title, { color: 'white', fontSize: 16 }]}>
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
      <View
        style={{
          height: type == 'all' ? WINDOW_HEIGHT * 0.8 : WINDOW_HEIGHT * 0.92,
          width: WINDOW_WIDTH,
        }}>
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
    </SafeAreaView>
  );
};

export default RegionalOfficeListScreen;

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
