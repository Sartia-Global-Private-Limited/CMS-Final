/*    ----------------Created Date :: 17- June -2024   ----------------- */
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
import {getMergedPIDetailById} from '../../../redux/slices/billing management/merge to pi/getMergedPIDetailSlice';
import {Badge} from '@rneui/themed';

const MTPIDetailScreen = ({navigation, route}) => {
  const pi_Id = route?.params?.pi_Id;
  const label = ScreensLabel();

  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);

  const ListData = useSelector(state => state.getMergedPIDetail);
  const dispatch = useDispatch();

  const all_Data = ListData?.data?.data || {};

  useEffect(() => {
    dispatch(getMergedPIDetailById(pi_Id));
  }, [pi_Id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getMergedPIDetailById(pi_Id));

      setRefreshing(false);
    }, 2000);
  }, []);

  const menuData = ['Item list'];

  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');

    setVisible(false);

    switch (valueToSend) {
      case 'Itemlist':
        navigation.navigate('MTPIDetailItemListScreen', {
          pi_Id: pi_Id,
        });
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={`${label.MERGED_PI} ${label.DETAIL}`}
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
                  {menuData.map(itm => (
                    <MenuItem
                      style={{
                        backgroundColor: Colors().cardBackground,
                      }}
                      textStyle={
                        [styles.cardtext, {color: Colors().pureBlack}] // Otherwise, use the default text style
                      }
                      onPress={() => {
                        hideMenu(itm);
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
                    key: 'Financial year',
                    value: all_Data?.financial_year,
                  },
                  {
                    key: 'PO number',
                    value: all_Data?.po_number,
                  },
                  {
                    key: 'Regional office',
                    value: all_Data?.regional_office_name,
                  },
                  {
                    key: 'outlet name',
                    component: (
                      <View style={{flex: 1}}>
                        {all_Data?.outletDetails &&
                          all_Data?.outletDetails?.map((itm, idx) => {
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
                        {all_Data?.complaintDetails &&
                          all_Data?.complaintDetails?.map((itm, idx) => {
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

              {/* card for PO detail */}
              <CustomeCard
                headerName={'Billing DETAILS'}
                data={[
                  {
                    key: 'Pi NO',
                    value: all_Data?.bill_no,
                    keyColor: Colors().skyBule,
                  },
                  {
                    key: 'BILL FROM ',
                    value: all_Data?.billing_from?.company_name || '----',
                  },
                  {
                    key: 'BILLING FROM STATE',
                    value: all_Data?.billing_from_state || '----',
                  },
                  {
                    key: 'BILLING TO',
                    value: all_Data?.billing_to?.company_name || '----',
                  },
                  {
                    key: 'BILLING TO RO OFFICE',
                    value: all_Data?.billing_to_ro_office?.ro_name || '----',
                  },
                ]}
              />

              {/* card for extenal field*/}
              <CustomeCard
                headerName={'external field'}
                data={[
                  {key: 'created by', value: all_Data?.created_by_name},
                  {key: 'work', value: all_Data?.work || '----'},
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

export default MTPIDetailScreen;

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
