import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import {useDispatch, useSelector} from 'react-redux';
import ScreensLabel from '../../../constants/ScreensLabel';
import DataNotFound from '../../../component/DataNotFound';
import CustomeCard from '../../../component/CustomeCard';
import {Menu, MenuItem} from 'react-native-material-menu';
import {Badge} from '@rneui/themed';
import {getInvoiceDetailById} from '../../../redux/slices/billing management/inovice/getInvoiceDetailSlice';

const InovoiceDetailScreen = ({navigation, route}) => {
  const pi_Id = route?.params?.pi_Id;
  const label = ScreensLabel();
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const ListData = useSelector(state => state.getInvoiceDetail);
  const dispatch = useDispatch();
  const all_Data = ListData?.data?.data?.[0] || {};
  const {
    bill_no,
    billing_from,
    billing_from_state,
    billing_to,
    billing_to_ro_office,
    callup_number,
    financial_year,
    pi_bill,
    po_details,
    outletDetails,
    complaintDetails,
  } = all_Data;

  useEffect(() => {
    dispatch(getInvoiceDetailById(pi_Id));
  }, [pi_Id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getInvoiceDetailById(pi_Id));

      setRefreshing(false);
    }, 2000);
  }, []);

  const hideMenu = (val, idx) => {
    const valueToSend = val?.split(' ').join('');

    setVisible(false);

    switch (valueToSend) {
      case pi_bill[idx]:
        navigation.navigate('InvoiceDetailItemListScreen', {
          pi_Id: pi_Id,
          piNo: valueToSend,
        });
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={`${label.INVOICE} ${label.DETAIL}`}
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'dots-three-vertical'}
        rightIcontype={IconType.Entypo}
        rightIconPress={() => setVisible(!visible)}
      />

      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={{}}>
              <View style={{alignSelf: 'flex-end'}}>
                <Menu
                  visible={visible}
                  onRequestClose={() => setVisible(false)}
                  style={{}}>
                  {pi_bill?.map((itm, idx) => (
                    <MenuItem
                      style={{
                        backgroundColor: Colors().cardBackground,
                      }}
                      textStyle={
                        [styles.cardtext, {color: Colors().purple}] // Otherwise, use the default text style
                      }
                      onPress={() => {
                        hideMenu(itm, idx);
                      }}>
                      {itm}
                    </MenuItem>
                  ))}
                </Menu>
              </View>

              {/* card for complaint detail */}
              <CustomeCard
                headerName={'DETAILS'}
                data={[
                  {
                    key: 'call up number',
                    value: callup_number,
                  },
                  {
                    key: 'Financial year',
                    value: financial_year,
                  },
                  {
                    key: 'PO number',
                    value: po_details?.po_number,
                  },

                  {
                    key: 'outlet name',
                    component: (
                      <View style={{flex: 1}}>
                        {outletDetails &&
                          outletDetails?.map((itm, idx) => {
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
                                  {itm?.outlet_name}
                                </Text>
                              </View>
                            );
                          })}
                      </View>
                    ),
                  },

                  {
                    key: 'complaint id',
                    component: (
                      <View style={{flex: 1}}>
                        {complaintDetails &&
                          complaintDetails?.[0]?.map((itm, idx) => {
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
                ]}
              />

              {/* card for Billing detail */}
              <CustomeCard
                headerName={'Billing DETAILS'}
                data={[
                  {key: 'Bill no', value: bill_no, keyColor: Colors().red},
                  {
                    key: 'Pi bills',
                    component: (
                      <View style={{flex: 1}}>
                        {pi_bill &&
                          pi_bill?.map((itm, idx) => {
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
                    key: 'BILL FROM ',
                    value: billing_from?.company_name || '----',
                  },
                  {
                    key: 'BILLING FROM STATE',
                    value: billing_from_state?.name || '----',
                  },
                  {
                    key: 'BILLING TO',
                    value: billing_to?.company_name || '----',
                  },
                  {
                    key: 'BILLING TO RO',
                    value: billing_to_ro_office?.regional_office_name || '----',
                  },
                ]}
              />
            </View>
          </ScrollView>
        </>
      ) : ListData?.isError ? (
        <InternalServer />
      ) : !ListData?.data?.status &&
        ListData?.data?.message == 'Data not found' ? (
        <>
          <DataNotFound />
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default InovoiceDetailScreen;

const styles = StyleSheet.create({
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
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
