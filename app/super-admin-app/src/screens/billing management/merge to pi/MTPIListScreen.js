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
import {
  getMergeToPiFinalDiscardList,
  getReadyToMergePiList,
} from '../../../redux/slices/billing management/merge to pi/getMTPIListSlice';
import MTPIFilter from './MTPIFilter';
import {Badge} from '@rneui/themed';
import NeumorphicCheckbox from '../../../component/NeumorphicCheckbox';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {
  dicardMergedPerformaInvoice,
  mergedPerformaInvoice,
} from '../../../redux/slices/billing management/merge to pi/addUpadateMTPISlice';
import List from '../../../component/List/List';

const MTPIListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getMTPIList);

  /*declare useState variable here */
  const [discardVisible, setDiscardVisible] = useState(false);
  const [body, setBody] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
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
          getMergeToPiFinalDiscardList({
            status: getStatusCode(type),
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      }
      if (type == 'readytomergepi') {
        dispatch(
          getReadyToMergePiList({
            status: getStatusCode(type),
            pageSize: pageSize,
            pageNo: pageNo,
            RoId: roId,
            poId: poId,
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
        getMergeToPiFinalDiscardList({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'readytomergepi') {
      dispatch(
        getReadyToMergePiList({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
          RoId: roId,
          poId: poId,
          billingFromId: billingFromId,
          billingToId: billingToId,
        }),
      );
    }
  }, [roId, poId, billingFromId, billingToId]);

  // function for status code//
  const getStatusCode = status => {
    switch (status) {
      case 'discard':
        return 5;

      case 'final':
        return 4;
      case 'readytomergepi':
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
        setBody({
          id: actionButton?.itemData?.id,
          merged_pi_id: actionButton?.itemData?.merged_pi_id,
        });
        break;

      default:
        break;
    }
  };

  /*Function  for discarding the measurement*/
  const discardMergedPI = async () => {
    const result = await dispatch(dicardMergedPerformaInvoice(body)).unwrap();
    if (result?.status) {
      setDiscardVisible(false);
      setBody('');
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      navigation.navigate('MTPIToptab');
    } else {
      setDiscardVisible(false);
      setBody('');
      Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
    }
  };

  /*for merging performa invoice*/
  const mergePiFunction = async () => {
    const reqBody = {
      id: filterChekcBox.map(itm => itm?.id),
      po_number: poId,
      billing_to_ro_office: roId,
      billing_from: billingFromId,
      billing_to: billingToId,
      complaint_for: filterChekcBox[0]?.complaintFor,
      billing_from_state: filterChekcBox[0]?.billing_from_state_id,
      financial_year: filterChekcBox[0]?.financial_year,
    };

    const result = await dispatch(mergedPerformaInvoice(reqBody)).unwrap();
    if (result?.status) {
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      setFilterChekcBox([]);
      setCheckData([{}]);
      setPoId(''),
        setRoId(''),
        setBillingFromId(),
        setBillingToId(),
        navigation.navigate('MTPIToptab');
    } else {
      Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
      navigation.navigate('MTPIToptab');
    }
  };

  /* Button ui for merge pi*/
  const ListFooterComponent = () => (
    <View style={{alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.02}}>
      {poId &&
      roId &&
      billingFromId &&
      billingToId &&
      filterChekcBox?.length >= 2 ? (
        <NeumorphicButton
          title={'Merge pi'}
          btnBgColor={Colors().purple}
          titleColor={Colors().inputLightShadow}
          onPress={() => mergePiFunction()}
        />
      ) : null}
    </View>
  );

  /* flatlist render ui */
  const renderItem = ({item, index}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MTPIDetailScreen', {
              pi_Id: item?.id,
            });
          }}>
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

              ...(poId && roId && billingFromId && billingToId
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
                key: 'Bill no',
                value: item?.bill_no,
                color: Colors().skyBule,
              },
            ]}
            discardButton={type == 'final' ? true : false}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (type == 'final' || type == 'discard') {
      dispatch(
        getMergeToPiFinalDiscardList({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'readytomergepi') {
      dispatch(
        getReadyToMergePiList({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
          RoId: roId,
          poId: poId,
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
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      {/* Filter for componenet */}
      {type == 'readytomergepi' && (
        <MTPIFilter
          type={type}
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
            setDiscardVisible(!discardVisible), setBody('');
          }}
          ConfirmBtnPress={() => discardMergedPI()}
        />
      )}
    </SafeAreaView>
  );
};

export default MTPIListScreen;

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
