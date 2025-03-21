/*    ----------------Created Date :: 13- Sep -2024   ----------------- */
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
import Toast from 'react-native-toast-message';
import NeumorphicCheckbox from '../../../component/NeumorphicCheckbox';
import NeumorphicButton from '../../../component/NeumorphicButton';
import moment from 'moment';
import ScreensLabel from '../../../constants/ScreensLabel';
import { getAllSecurityList } from '../../../redux/slices/purchase & sale/purchase-order/getSecurityDepositListSlice';
import SearchBar from '../../../component/SearchBar';
import SecurityFilter from './SecurityFilter';
import { approvePurchaseOrderByIds } from '../../../redux/slices/purchase & sale/purchase-order/addUpdateSecuritySlice';
import List from '../../../component/List/List';

const SecurityDepositListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getSecurityDepositList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [securityId, setSecurityId] = useState('');
  const [roId, setRoId] = useState('');
  const [poId, setPoId] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
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
      if (
        type == 'deposit' ||
        type == 'eligible' ||
        type == 'process' ||
        type == 'paid'
      ) {
        dispatch(
          getAllSecurityList({
            search: searchText,
            pageSize: pageSize,
            pageNo: pageNo,
            status: getStatusCode(type),
            poStatus: getPoStatusCode(type),
            roId: roId,
            poId: poId,
            securityId: securityId,
          }),
        );
      }
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    if (
      type == 'deposit' ||
      type == 'eligible' ||
      type == 'process' ||
      type == 'paid'
    ) {
      dispatch(
        getAllSecurityList({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
          status: getStatusCode(type),
          poStatus: getPoStatusCode(type),
          roId: roId,
          poId: poId,
          securityId: securityId,
        }),
      );
    }
  }, [roId, poId, securityId, searchText]);

  // function for status code//
  const getStatusCode = status => {
    switch (status) {
      case 'deposit':
        return '';
      case 'eligible':
        return 1;
      case 'process':
        return 2;
      case 'paid':
        return 3;

      default:
        break;
    }
  };

  // function for po status code//
  const getPoStatusCode = status => {
    switch (status) {
      case 'deposit':
        return 1;
      case 'eligible':
        return 2;
      case 'process':
        return 2;
      case 'paid':
        return 2;

      default:
        break;
    }
  };

  // function for status text//
  const getStatusTextColor = status => {
    switch (status) {
      case 'deposit':
        return Colors().rejected;
      case 'eligible':
        return Colors().edit;
      case 'process':
        return Colors().pending;
      case 'paid':
        return Colors().resolved;

      default:
        break;
    }
  };

  /*for approve of purchase order*/
  const approveOfPurchaseOrder = async () => {
    const reqBody = {
      po_ids: filterChekcBox.map(itm => itm?.id),
    };
    if (type == 'process') {
      navigation.navigate('CreateSecurityScreen', reqBody);
    } else {
      setLoading(true);
      const result = await dispatch(
        approvePurchaseOrderByIds(reqBody),
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
        setPoId(''), setRoId(''), navigation.navigate('PurchaseOrderTopTab');
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });
        navigation.navigate('PurchaseOrderTopTab');
      }
    }
  };

  /* Button ui for create pi*/
  const ListFooterComponent = () => (
    <View style={{ alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.02 }}>
      {filterChekcBox?.length >= 1 && roId ? (
        <NeumorphicButton
          title={'Approve'}
          loading={loading}
          btnBgColor={Colors().purple}
          titleColor={Colors().inputLightShadow}
          onPress={() => approveOfPurchaseOrder()}
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
            if (type != 'purchase_order') {
              navigation.navigate('SecurityDetailScreen', {
                id: item?.id,
              });
            }
          }}>
          <CustomeCard
            allData={item}
            data={[
              ...((type == 'process' || type == 'eligible') && roId
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

                                    id: item?.id,
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
              ...(type == 'process' || type == 'paid'
                ? [
                    {
                      key: 'securtiy unique id',
                      value: item?.security_unique_id,
                      keyColor: Colors().skyBule,
                    },
                  ]
                : []),
              {
                key: 'pO number',
                value: item?.po_number ?? '--',
              },

              {
                key: 'Tender date',
                value: moment(item?.tender_date).format('DD-MM-YYYY') ?? '--',
              },
              {
                key: 'Tender number',
                value: item?.tender_number ?? '--',
              },
              {
                key: 'deposit date',
                value:
                  moment(item?.security_deposit_date).format('DD-MM-YYYY') ??
                  '--',
              },
              {
                key: 'deposit amt',
                value: `₹ ${item?.security_deposit_amount}` ?? '--',
                keyColor: Colors().aprroved,
              },

              {
                key: 'regional office',
                value: item?.regional_office_name ?? '--',
              },
              ...(type == 'paid'
                ? [
                    {
                      key: 'reference no.',
                      value: item?.payment_reference_number ?? '--',
                    },
                  ]
                : []),
              ...(type == 'paid'
                ? [
                    {
                      key: 'payment date.',
                      value: moment(item?.date).format('DD-MM-YYYY') ?? '--',
                    },
                  ]
                : []),
            ]}
            status={[
              {
                key: 'status',
                value: type,
                color: getStatusTextColor(type),
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (
      type == 'deposit' ||
      type == 'eligible' ||
      type == 'process' ||
      type == 'paid'
    ) {
      dispatch(
        getAllSecurityList({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
          status: getStatusCode(type),
          poStatus: getPoStatusCode(type),
          roId: roId,
          poId: poId,
          securityId: securityId,
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
  /*search function*/
  const searchFunction = () => {
    dispatch(
      getAllSecurityList({
        search: searchText,
        pageSize: pageSize,
        pageNo: number,
        status: getStatusCode(type),
        poStatus: getPoStatusCode(type),
        roId: roId,
        poId: poId,
        securityId: securityId,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <SearchBar setSearchText={setSearchText} />

      {/* Filter for componenet */}
      {(type == 'process' || type == 'eligible') && (
        <SecurityFilter
          statusCode={getStatusCode(type)}
          po={poId}
          setPo={setPoId}
          ro={roId}
          setRo={setRoId}
          securityId={securityId}
          setSecurityId={setSecurityId}
        />
      )}

      {!ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status &&
        (type == 'process' || type == 'eligible') &&
        roId && (
          <View
            style={{
              alignSelf: 'flex-end',
              flexDirection: 'row',
              margin: 5,
              marginRight: 20,
              alignItems: 'center',
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

                    id: itm?.id,
                  };

                  updateCheckDataAtIndex(idx, (val = body));
                });
              }}
            />
          </View>
        )}

      <View style={{ height: WINDOW_HEIGHT * 0.82, width: WINDOW_WIDTH }}>
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

export default SecurityDepositListScreen;

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
