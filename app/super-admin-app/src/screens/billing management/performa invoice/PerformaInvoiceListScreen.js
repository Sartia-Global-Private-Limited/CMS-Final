import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import AlertModal from '../../../component/AlertModal';
import IconType from '../../../constants/IconType';
import Toast from 'react-native-toast-message';
import {Badge} from '@rneui/themed';
import NeumorphicCheckbox from '../../../component/NeumorphicCheckbox';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {
  getPiFinalDiscardList,
  getReadyToPiList,
} from '../../../redux/slices/billing management/performa invoice/getPerformaInvoiceListSlice';
import {discardPerformaInvoice} from '../../../redux/slices/billing management/performa invoice/addUpdatePerformaInvoiceSlice';
import PerformaInvoiceFilter from './PerformaInvoiceFilter';
import List from '../../../component/List/List';

const PerformaInvoiceListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getPerformaInvoiceList);

  /*declare useState variable here */
  const [discardVisible, setDiscardVisible] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [piId, setPiId] = useState('');
  const [roId, setRoId] = useState('');
  const [poId, setPoId] = useState('');
  const [billNumber, setBillNumber] = useState('');
  const [financialYearId, setFinancialYearId] = useState('');
  const [orderById, setOrderById] = useState('');
  const [salesAreaId, setSalesAreaId] = useState('');
  const [outletAreaId, setOutletAreaId] = useState('');
  const [complaintTypeId, setComplaintTypeId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [areaManagerId, setAreaManagerId] = useState('');
  const [complaintFor, setComplaintFor] = useState('');
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
      if (type == 'final' || type == 'discard' || type == 'performainvoice') {
        dispatch(
          getPiFinalDiscardList({
            status: getStatusCode(type),
            poId: poId.value,
            roId: roId.value,
            billNumber: billNumber.value,
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      }
      if (type == 'readytopi') {
        dispatch(
          getReadyToPiList({
            status: getStatusCode(type),
            pageSize: pageSize,
            pageNo: pageNo,
            poId: poId.value,
            roId: roId.value,
            companyId: companyId.value,
            complaintFor: complaintFor,
          }),
        );
      }
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    if (type == 'final' || type == 'discard' || type == 'performainvoice') {
      dispatch(
        getPiFinalDiscardList({
          status: getStatusCode(type),
          poId: poId.value,
          roId: roId.value,
          billNumber: billNumber.value,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'readytopi') {
      dispatch(
        getReadyToPiList({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
          poId: poId.value,
          roId: roId.value,
          companyId: companyId.value,
          complaintFor: complaintFor,
        }),
      );
    }
  }, [roId, poId, billNumber, companyId, complaintFor]);

  // function for status code//
  const getStatusCode = status => {
    switch (status) {
      case 'performainvoice':
        return 1;

      case 'final':
        return 2;
      case 'discard':
        return 3;
      case 'readytopi':
        return 5;

      default:
        break;
    }
  };

  // function for getting color of status//
  const getStatusColor = status => {
    switch (status) {
      case 'HardCopy / PTM':
        return Colors().orange;
      case 'Resolved':
        return Colors().aprroved;
      case 'p t m':
        return Colors().edit;
      case 'Draft':
        return Colors().aprroved;
      case 'Discard':
        return Colors().partial;
      case 'Pending To PI':
        return Colors().pending;
      case 'Ready To PI':
        return Colors().skyBule;
      case 'Pending to PI':
        return Colors().pending;
      case 'Ready to PI':
        return Colors().skyBule;

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
        navigation.navigate('AddUpdatePIScreen', {
          edit_id: actionButton?.itemData?.id,
          type: type,
        });
        break;
      case 'plus':
        navigation.navigate('AddUpdatePIScreen', {
          dataFromListing: {
            regionalOfficceId: {
              name: actionButton?.itemData?.regional_office_name,
              id: actionButton?.itemData?.ro_office_id,
            },
            measurements: [actionButton?.itemData?.id],
            poId: {
              id: actionButton?.itemData?.po_id,
              name: actionButton?.itemData?.po_number,
            },
            companyDetails: {
              name: actionButton?.itemData?.company_details?.name,
              id: actionButton?.itemData?.company_details?.id,
              complaint_for: actionButton?.itemData?.complaint_for,
            },
          },
          type: type,
        });
        break;

      default:
        break;
    }
  };

  /*Function  for discarding the Performa Invoice*/
  const discardPI = async () => {
    const result = await dispatch(discardPerformaInvoice(piId)).unwrap();
    if (result?.status) {
      setDiscardVisible(false);
      setPiId();
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      navigation.navigate('PerformaInvoiceTopTab');
    } else {
      setDiscardVisible(false);
      setPiId();
      Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
    }
  };

  /*for merging performa invoice*/
  const createPi = async () => {
    navigation.navigate('AddUpdatePIScreen', {
      dataFromListing: {
        regionalOfficceId: {
          name: roId.label,
          id: roId.value,
        },
        measurements: filterChekcBox.map(itm => itm?.id),
        poId: {
          id: poId.value,
          name: poId.label,
        },
        companyDetails: {
          name: companyId.label,
          id: companyId.value,
          complaint_for: complaintFor,
        },
      },
      type: type,
    });
  };

  /* Button ui for create pi*/
  const ListFooterComponent = () => (
    <View style={{alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.02}}>
      {poId && roId && companyId && filterChekcBox?.length >= 2 ? (
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
  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          onPress={() => {
            if (type == 'readytopi') {
              navigation.navigate('ViewPTMDetailScreen', {
                complaint_id: item?.id,
              });
            }
            if (type != 'readytopi') {
              navigation.navigate('PerfromaInvoiceDetailScreen', {
                pi_Id: item?.id,
              });
            }
          }}>
          {type == 'readytopi' ? (
            <>
              <CustomeCard
                allData={item}
                data={[
                  {
                    key: 'Complaint id',
                    value: item?.complaint_unique_id || '--',
                    keyColor: Colors().skyBule,
                  },
                  {
                    key: 'Complaint type',
                    value: item?.complaint_type_name ?? '--',
                  },
                  {
                    key: 'outlet name',
                    value: item?.outlet_name ?? '--',
                  },
                  {
                    key: 'Regional office',
                    value: item?.regional_office_name ?? '--',
                  },
                  {
                    key: 'Sales Area',
                    value: item?.sales_area_name ?? '--',
                  },

                  {
                    key: 'Po Number',
                    value: item?.po_number ?? '--',
                  },

                  {
                    key: 'ordery by',
                    value: item?.order_by_name ?? '--',
                  },

                  {
                    key: 'Measurement amount',
                    value: item?.measurement_amount ?? 0,
                    keyColor: Colors().aprroved,
                  },

                  {
                    key: 'Measurement Date',
                    value: item?.measurement_date ?? '--',
                    keyColor: Colors().pending,
                  },

                  {
                    key: 'PO Amount',
                    value: item?.po_limit ?? '--',
                    keyColor: Colors().aprroved,
                  },
                  ...(poId && roId && companyId
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
                                  onChange={val =>
                                    updateCheckDataAtIndex(
                                      index,
                                      (val = {
                                        chekedValue: val,
                                        complaintFor: item?.complaint_for,
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
                    key: 'status',
                    value: item?.status,

                    color: getStatusColor(item?.status),
                  },
                ]}
                plusButton={poId && roId && companyId ? false : true}
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
                      <View style={{flex: 1}}>
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
                                    {color: Colors().skyBule},
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
                    key: 'Bill date',
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
                    key: 'outlet name',
                    component: (
                      <View style={{flex: 1}}>
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
                                    {color: Colors().pureBlack},
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
    if (type == 'final' || type == 'discard' || type == 'performainvoice') {
      dispatch(
        getPiFinalDiscardList({
          status: getStatusCode(type),
          poId: poId?.value,
          roId: roId?.value,
          billNumber: billNumber.value,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'readytopi') {
      dispatch(
        getReadyToPiList({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
          poId: poId?.value,
          roId: roId?.value,
          companyId: companyId?.value,
          complaintFor: complaintFor,
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
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      {/* Filter for componenet */}

      <PerformaInvoiceFilter
        type={type}
        statusCode={getStatusCode(type)}
        poId={poId}
        setPoId={setPoId}
        roId={roId}
        setRoId={setRoId}
        companyId={companyId}
        setCompanyId={setCompanyId}
        complaintFor={complaintFor}
        setComplaintFor={setComplaintFor}
        billNumber={billNumber}
        setBillNumber={setBillNumber}
        setAreaManagerId={setAreaManagerId}
        areaManagerId={areaManagerId}
        setSalesAreaId={setSalesAreaId}
        salesAreaId={salesAreaId}
        setOrderById={setOrderById}
        orderById={orderById}
        setFinancialYearId={setFinancialYearId}
        financialYearId={financialYearId}
        setOutletAreaId={setOutletAreaId}
        outletAreaId={outletAreaId}
        setComplaintTypeId={setComplaintTypeId}
        complaintTypeId={complaintTypeId}
      />

      {!ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status &&
        poId &&
        roId &&
        companyId && (
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
                    complaintFor: itm?.complaint_for,
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
      <View style={{height: WINDOW_HEIGHT * 0.8, width: WINDOW_WIDTH}}>
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
          ConfirmBtnPress={() => discardPI()}
        />
      )}
    </SafeAreaView>
  );
};

export default PerformaInvoiceListScreen;

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
