/*    ----------------Created Date :: 11- July -2024   ----------------- */
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import { useDispatch, useSelector } from 'react-redux';
import ScreensLabel from '../../constants/ScreensLabel';
import DataNotFound from '../../component/DataNotFound';
import CustomeCard from '../../component/CustomeCard';
import { Menu, MenuItem } from 'react-native-material-menu';
import { getQuotationDetailById } from '../../redux/slices/work-quotation/getQuotationDetailSlice';
import moment from 'moment';

const QuotationDetailScreen = ({ navigation, route }) => {
  const id = route?.params?.id;

  const label = ScreensLabel();

  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);

  const ListData = useSelector(state => state.getQuotationDetail);
  const dispatch = useDispatch();

  const all_Data = ListData?.data?.data?.[0] || {};

  useEffect(() => {
    dispatch(getQuotationDetailById(id));
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getQuotationDetailById(id));

      setRefreshing(false);
    }, 2000);
  }, []);

  const menuData = ['Item list'];

  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');

    setVisible(false);

    switch (valueToSend) {
      case 'Itemlist':
        navigation.navigate('QuotationDetailItemListScreen', {
          id: id,
        });
        break;

      default:
        break;
    }
  };

  /*function for getting status color */
  const getStatusColor = status => {
    switch (status) {
      case '1':
        return Colors().pending;
      case '2':
        return Colors().aprroved;
      case '3':
        return Colors().rejected;

      default:
        break;
    }
  };

  /*function for getting status Text */
  const getStatusText = status => {
    switch (status) {
      case '1':
        return 'requested';
      case '2':
        return 'approved';
      case '3':
        return 'rejected';

      default:
        break;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader
        headerTitle={`${label.WORK_QUOTATION} ${label.DETAIL}`}
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
              <View style={{ alignSelf: 'flex-end' }}>
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
                        [styles.cardtext, { color: Colors().pureBlack }] // Otherwise, use the default text style
                      }
                      onPress={() => {
                        hideMenu(itm);
                      }}>
                      {itm}
                    </MenuItem>
                  ))}
                </Menu>
              </View>

              {/* card for company detail */}
              <CustomeCard
                headerName={'Company DETAILS'}
                data={[
                  {
                    key: 'company from',
                    value: all_Data?.company_from_name ?? '--',
                    keyColor: Colors().skyBule,
                  },
                  {
                    key: 'Company from state',
                    value: all_Data?.state_name ?? '--',
                  },
                  {
                    key: 'Company to',
                    value: all_Data?.company_to_name ?? '--',
                  },
                  {
                    key: 'Company to RO',
                    value: all_Data?.company_to_regional_office_name ?? '--',
                  },
                  {
                    key: 'Quotation date',
                    value: all_Data?.quotation_date ?? '--',
                  },
                  {
                    key: 'Quotation no',
                    value: all_Data?.quotations_number ?? '--',
                    keyColor: Colors().skyBule,
                  },
                ]}
              />

              {/* card for other detail */}
              <CustomeCard
                headerName={'DETAILS'}
                data={[
                  {
                    key: 'RO name',
                    value: all_Data?.regional_office_name ?? '--',
                  },
                  {
                    key: 'Sales Area',
                    value: all_Data?.sales_area_name ?? '--',
                  },
                  {
                    key: 'Outlet',
                    value: all_Data?.outlet_name ?? '--',
                  },
                  {
                    key: 'PO NO',
                    value: all_Data?.po_number ?? '--',
                  },
                  {
                    key: 'Created by',
                    value: all_Data?.created_by_name ?? '--',
                  },
                  {
                    key: 'updated by',
                    value: all_Data?.updated_by_name ?? '--',
                  },
                ]}
                status={[
                  {
                    key: 'status',
                    value: getStatusText(all_Data?.status),
                    color: getStatusColor(all_Data?.status),
                  },
                ]}
              />

              {/* card for external field*/}
              <CustomeCard
                headerName={'EXTERNAL  field'}
                data={[
                  {
                    key: 'Created at',
                    value:
                      moment(all_Data?.created_at).format('DD-MM-YYYY') ?? '--',
                  },
                  {
                    key: 'Complaint type',
                    value: all_Data?.complaint_type_name ?? '--',
                  },
                  {
                    key: 'Remark',
                    value: all_Data?.remark ?? '--',
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

export default QuotationDetailScreen;

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
