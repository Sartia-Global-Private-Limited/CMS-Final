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
import {useDispatch, useSelector} from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import ScreensLabel from '../../../constants/ScreensLabel';
import {Badge} from '@rneui/themed';
import NeumorphicCheckbox from '../../../component/NeumorphicCheckbox';
import NeumorphicButton from '../../../component/NeumorphicButton';
import SearchBar from '../../../component/SearchBar';
import CustomeHeader from '../../../component/CustomeHeader';
import {getAllPaymentList} from '../../../redux/slices/billing management/payment update/getPaymentUpdateListSlice';
import moment from 'moment';
import List from '../../../component/List/List';

const PaymentUpdateListScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const ListData = useSelector(state => state.getPaymentUpdateList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
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
    dispatch(
      getAllPaymentList({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [searchText]);

  /*for create of  payment */
  const createOfPayment = async () => {
    const reqBody = {
      id: filterChekcBox.map(itm => itm?.id),
    };
    navigation.navigate('AddUpdatePayment', {reqBody: reqBody});
  };

  /* Button ui for create pi*/
  const ListFooterComponent = () => (
    <View style={{alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.02}}>
      <NeumorphicButton
        title={'Create payment'}
        btnBgColor={Colors().purple}
        titleColor={Colors().inputLightShadow}
        onPress={() => createOfPayment()}
      />
    </View>
  );

  /* flatlist render ui */
  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('MTIDetailScreen', {
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
                key: 'invoice date',
                value: moment(item?.invoice_date).format('DD-MM-YYYY') ?? '--',
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
                  <View style={{flex: 1}}>
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
                                {color: Colors().skyBule},
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
                              complaintFor:
                                item?.complaintDetails[0]?.complaint_for,
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
            ]}
            status={[
              {
                key: 'Invoice NUMBER',
                value: item?.bill_no,
                color: Colors().skyBule,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getAllPaymentList({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
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
      <View style={{marginBottom: 1}}>
        <CustomeHeader headerTitle={label.PAYMENT} />
      </View>
      {/*Seacrh componenet */}
      <SearchBar setSearchText={setSearchText} />

      {!ListData?.isLoading && !ListData?.isError && ListData?.data?.status && (
        <View
          style={{
            alignSelf: 'flex-end',
            flexDirection: 'row',
            marginRight: 15,
            alignItems: 'center',
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

      <View style={{height: WINDOW_HEIGHT * 0.875, width: WINDOW_WIDTH}}>
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
    </SafeAreaView>
  );
};

export default PaymentUpdateListScreen;

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
