import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
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
import {getMeasurementByComplaintId} from '../../../redux/slices/billing management/measurement/getMeasurementDetailSlice';

const ViewPTMDetailScreen = ({navigation, route}) => {
  const complaint_id = route?.params?.complaint_id;
  const label = ScreensLabel();

  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);

  const ListData = useSelector(state => state.getMeasurementDetail);
  const dispatch = useDispatch();

  const all_Data = ListData?.data?.data?.[0] || {};
  const {po_details} = ListData?.data?.data?.[0] || {};

  useEffect(() => {
    dispatch(getMeasurementByComplaintId(complaint_id));
  }, [complaint_id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getMeasurementByComplaintId(complaint_id));

      setRefreshing(false);
    }, 2000);
  }, []);

  const menuData = [
    'Item list',
    'View hard copy',
    'View fund detail',
    'View stock details',
  ];

  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');

    setVisible(false);

    switch (valueToSend) {
      case 'Itemlist':
        navigation.navigate('PtmDetailItemlListScreen', {
          complaint_id: complaint_id,
        });
        break;
      case 'Viewhardcopy':
        navigation.navigate('ViewMeasurementDetailScreen', {
          complaint_id: complaint_id,
        });
        break;
      case 'Viewfunddetail':
        navigation.navigate('PtmStockAndFundViewScreen', {
          complaint_id: complaint_id,
          type: 'fund',
        });
        break;
      case 'Viewstockdetails':
        navigation.navigate('PtmStockAndFundViewScreen', {
          complaint_id: complaint_id,
          type: 'stock',
        });
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={`${label.PTM} ${label.DETAIL}`}
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
                headerName={'MEASUREMENT DETAILS'}
                data={[
                  {
                    key: 'compplaint id',
                    value: all_Data?.complaint_type_name,
                    keyColor: Colors().skyBule,
                  },
                  {
                    key: 'MEasurement date',
                    value: all_Data?.measurement_date,
                  },
                  {
                    key: 'Finanncial year',
                    value: all_Data?.financial_year,
                  },
                  {
                    key: 'PO TYPE',
                    value: all_Data?.po_number,
                  },
                  {
                    key: 'outlet name',
                    value: all_Data?.outlet_name,
                  },
                  {
                    key: 'Regional office name',
                    value: all_Data?.regional_office_name,
                  },
                  {
                    key: 'Sales Area',
                    value: all_Data?.sales_area_name,
                  },
                ]}
              />

              {/* card for PO detail */}
              <CustomeCard
                headerName={'PO DETAILS'}
                data={[
                  {
                    key: 'po number',
                    value: po_details?.po_number,
                  },
                  {
                    key: 'Po date',
                    value: po_details?.po_date,
                  },
                  {
                    key: 'PO limit',
                    value: `₹ ${po_details?.po_limit || 0}`,
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'PO used amount',
                    value: `₹ ${po_details?.po_amount || 0}`,
                    keyColor: Colors().pending,
                  },
                  {
                    key: 'Po remaining amount',
                    value: `₹ ${po_details?.po_limit - po_details?.po_amount}`,
                    keyColor: Colors().red,
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

export default ViewPTMDetailScreen;

const styles = StyleSheet.create({
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
