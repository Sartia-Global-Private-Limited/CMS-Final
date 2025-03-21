/*    ----------------Created Date :: 15- June -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import AlertModal from '../../../component/AlertModal';
import IconType from '../../../constants/IconType';
import Toast from 'react-native-toast-message';
import { Badge } from '@rneui/themed';
import NeumorphicCheckbox from '../../../component/NeumorphicCheckbox';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {
  getInvoiceFinalDiscardList,
  getReadyToInvoiceList,
} from '../../../redux/slices/billing management/inovice/getInovoiceListSlice';
import InvoiceFilter from './InvoiceFilter';
import { discardInvoice } from '../../../redux/slices/billing management/inovice/addUpdateInvoiceSlice';
import List from '../../../component/List/List';

const InvoiceListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getInovoiceList);

  /*declare useState variable here */
  const [discardVisible, setDiscardVisible] = useState(false);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [piId, setPiId] = useState('');
  const [roId, setRoId] = useState('');
  const [poId, setPoId] = useState('');
  const [billingFromId, setBillingFromId] = useState('');
  const [billingToId, setBillingToId] = useState('');
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
      if (type == 'final' || type == 'discard') {
        dispatch(
          getInvoiceFinalDiscardList({
            status: getStatusCode(type),
            poId: poId,
            roId: roId,
            billingFromId: billingFromId,
            billingToId: billingToId,
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      }
      if (type == 'readytoinvoice') {
        dispatch(
          getReadyToInvoiceList({
            pageSize: pageSize,
            pageNo: pageNo,
            poId: poId,
            roId: roId,
            billingFromId: billingFromId,
            billingToId: billingToId,
          }),
        );
      }
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    if (type == 'final' || type == 'discard') {
      dispatch(
        getInvoiceFinalDiscardList({
          status: getStatusCode(type),
          poId: poId,
          roId: roId,
          billingFromId: billingFromId,
          billingToId: billingToId,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'readytoinvoice') {
      dispatch(
        getReadyToInvoiceList({
          pageSize: pageSize,
          pageNo: pageNo,
          poId: poId,
          roId: roId,
          billingFromId: billingFromId,
          billingToId: billingToId,
        }),
      );
    }
  }, [roId, poId, billingFromId, billingToId]);

  // function for status code//
  const getStatusCode = status => {
    switch (status) {
      case 'final':
        return 1;
      case 'discard':
        return 2;

      default:
        break;
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'discard':
        setDiscardVisible(true);

        setPiId(actionButton?.itemData?.id);
        break;
      case 'edit':
        navigation.navigate('AddUpdateInvoiceScreen', {
          edit_id: actionButton?.itemData?.id,
          type: type,
        });
        break;
      case 'plus':
        navigation.navigate('AddUpdateInvoiceScreen', {
          dataFromListing: {
            poId: actionButton?.itemData?.po_id,
            regionalOfficceId:
              actionButton?.itemData?.billing_to_ro_office?.ro_id,
            billingFromId: actionButton?.itemData?.billing_from?.company_id,
            billingToId: actionButton?.itemData?.billing_to?.company_id,
            measurements: [actionButton?.itemData?.id],

            complaint_for:
              actionButton?.itemData?.complaintDetails?.[0]?.complaint_for,
          },
          type: type,
        });
        break;

      default:
        break;
    }
  };

  /*Function  for discarding the Performa Invoice*/
  const discardOfInvoice = async () => {
    const result = await dispatch(discardInvoice(piId)).unwrap();
    if (result?.status) {
      setDiscardVisible(false);
      setPiId();
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      navigation.navigate('InvoiceTopTab');
    } else {
      setDiscardVisible(false);
      setPiId();
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /*for merging performa invoice*/
  const createPi = async () => {
    navigation.navigate('AddUpdateInvoiceScreen', {
      dataFromListing: {
        poId: poId,
        regionalOfficceId: roId,
        billingFromId: billingFromId,
        billingToId: billingToId,
        measurements: filterChekcBox.map(itm => itm?.id),

        complaint_for: filterChekcBox[0]?.complaintFor,
      },
      type: type,
    });
  };

  /* Button ui for create pi*/
  const ListFooterComponent = () => (
    <View style={{ alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.02 }}>
      {poId &&
      roId &&
      billingFromId &&
      billingToId &&
      filterChekcBox?.length >= 2 ? (
        <NeumorphicButton
          title={'Create pi'}
          btnBgColor={Colors().purple}
          titleColor={Colors().inputLightShadow}
          onPress={() => createPi()}
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
            if (type == 'readytoinvoice') {
              navigation.navigate('MTPIDetailScreen', {
                pi_Id: item?.id,
              });
            }
            if (type != 'readytoinvoice') {
              navigation.navigate('InovoiceDetailScreen', {
                pi_Id: item?.id,
              });
            }
          }}>
          {type == 'readytoinvoice' ? (
            <>
              <CustomeCard
                allData={item}
                data={[
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
                                  {itm?.complaint_unique_id}
                                </Text>
                              </View>
                            );
                          })}
                      </View>
                    ),
                  },
                  {
                    key: 'Pi date',
                    value: item?.created_at ?? '--',
                  },
                  {
                    key: 'Financial year',
                    value: item?.financial_year ?? '--',
                  },
                  {
                    key: 'Billing RO',
                    value: item?.billing_to_ro_office?.ro_name ?? '--',
                  },
                  {
                    key: 'Billing From',
                    value: item?.billing_from?.company_name ?? '--',
                  },
                  {
                    key: 'Billing To',
                    value: item?.billing_to?.company_name ?? '--',
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
                                    { color: Colors().pureBlack },
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
                    key: 'PO',
                    value: item?.po_number ?? '--',
                  },

                  ...(poId && roId && billingFromId && billingToId
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
                ]}
                status={[
                  {
                    key: 'Pi no',
                    value: item?.bill_no,
                    color: Colors().skyBule,
                  },
                ]}
                plusButton={
                  poId && roId && billingFromId && billingToId ? false : true
                }
                action={handleAction}
              />
            </>
          ) : (
            <>
              <CustomeCard
                allData={item}
                data={[
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
                                  {itm?.complaint_unique_id}
                                </Text>
                              </View>
                            );
                          })}
                      </View>
                    ),
                  },
                  {
                    key: 'invoice date',
                    value: item?.created_at ?? '--',
                  },
                  {
                    key: 'Financial year',
                    value: item?.financial_year ?? '--',
                  },
                  {
                    key: 'Billing RO',
                    value: item?.billing_to_ro_office?.ro_name ?? '--',
                  },

                  {
                    key: 'Billing from',
                    value: item?.billing_from?.company_name,
                  },
                  {
                    key: 'Billing to',
                    value: item?.billing_to?.company_name,
                  },
                  {
                    key: 'Pi bills',
                    component: (
                      <View style={{ flex: 1 }}>
                        {item?.pi_bill &&
                          item?.pi_bill?.map((itm, idx) => {
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
                                  {itm}
                                </Text>
                              </View>
                            );
                          })}
                      </View>
                    ),
                  },

                  {
                    key: 'PO',
                    value: item?.po_number ?? '--',
                  },
                ]}
                status={[
                  {
                    key: 'PI NUMBER',
                    value: item?.bill_no,
                    color: Colors().skyBule,
                  },
                ]}
                editButton={
                  type == 'final' || type == 'performainvoice' ? true : false
                }
                discardButton={type == 'final' ? true : false}
                action={handleAction}
              />
            </>
          )}
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (type == 'final' || type == 'discard') {
      dispatch(
        getInvoiceFinalDiscardList({
          status: getStatusCode(type),
          poId: poId,
          roId: roId,
          billingFromId: billingFromId,
          billingToId: billingToId,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'readytoinvoice') {
      dispatch(
        getReadyToInvoiceList({
          pageSize: pageSize,
          pageNo: pageNo,
          poId: poId,
          roId: roId,
          billingFromId: billingFromId,
          billingToId: billingToId,
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

      {type == 'readytoinvoice' && (
        <InvoiceFilter
          type={type}
          statusCode={getStatusCode(type)}
          poId={poId}
          setPoId={setPoId}
          roId={roId}
          setRoId={setRoId}
          billingFromId={billingFromId}
          setBillingFromId={setBillingFromId}
          billingToId={billingToId}
          setBillingToId={setBillingToId}
        />
      )}

      {!ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status &&
        poId &&
        roId &&
        billingFromId &&
        billingToId && (
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
      <View
        style={{
          height:
            type == 'readytoinvoice'
              ? WINDOW_HEIGHT * 0.8
              : WINDOW_HEIGHT * 0.92,
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

      {discardVisible && (
        <AlertModal
          visible={discardVisible}
          iconName={'ban'}
          icontype={IconType.FontAwesome}
          iconColor={Colors().partial}
          textToShow={'ARE YOU SURE YOU WANT TO DISCARD THIS!!'}
          cancelBtnPress={() => {
            setDiscardVisible(!discardVisible), setPiId('');
          }}
          ConfirmBtnPress={() => discardOfInvoice()}
        />
      )}
    </SafeAreaView>
  );
};

export default InvoiceListScreen;

const styles = StyleSheet.create({
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
