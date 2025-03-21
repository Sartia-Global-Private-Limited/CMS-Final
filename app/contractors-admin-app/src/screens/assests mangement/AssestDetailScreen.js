/*    ----------------Created Date :: 16- July -2024   ----------------- */
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

import moment from 'moment';
import { getAssestDetailById } from '../../redux/slices/assest mangement/getAssestDetailSlice';

const AssestDetailScreen = ({ navigation, route }) => {
  const id = route?.params?.id;

  const label = ScreensLabel();

  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);

  const ListData = useSelector(state => state.getAssestDetail);
  const dispatch = useDispatch();

  const all_Data = ListData?.data?.data || {};

  useEffect(() => {
    dispatch(getAssestDetailById(id));
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getAssestDetailById(id));

      setRefreshing(false);
    }, 2000);
  }, []);

  const menuData = ['timeline history'];

  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');

    setVisible(false);

    switch (valueToSend) {
      case 'timelinehistory':
        navigation.navigate('AssetsTimelineHistoryScreen', {
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
      case 'assigned':
        return Colors().aprroved;
      case 'not assigned':
        return Colors().red;

      default:
        break;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader
        headerTitle={`${label.ASSEST} ${label.DETAIL}`}
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

              {/* card for assest detail */}
              <CustomeCard
                headerName={'assest DETAILS'}
                avatarImage={all_Data?.asset_image}
                data={[
                  {
                    key: 'name',
                    value: all_Data?.asset_name ?? '--',
                  },
                  {
                    key: 'Model no',
                    value: all_Data?.asset_model_number ?? '--',
                  },
                  {
                    key: 'UIn no',
                    value: all_Data?.asset_uin_number ?? '--',
                  },
                  {
                    key: 'price',
                    value: `₹ ${all_Data?.asset_price}` ?? '--',
                    keyColor: Colors().aprroved,
                  },
                ]}
                status={[
                  {
                    key: 'status',
                    value: all_Data?.asset_assign_status,
                    color: getStatusColor(all_Data?.asset_assign_status),
                  },
                ]}
              />

              {/* card for warrant and garranty field*/}
              <CustomeCard
                headerName={`${
                  all_Data?.asset_warranty_guarantee_value == 1
                    ? 'WARRANTY'
                    : 'GUARANTEE'
                } detail`}
                data={[
                  {
                    key: 'purchase date',
                    value:
                      moment(all_Data?.asset_purchase_date).format(
                        'DD-MM-YYYY',
                      ) ?? '--',
                  },
                  {
                    key: 'start date',
                    value:
                      moment(
                        all_Data?.asset_warranty_guarantee_start_date,
                      ).format('DD-MM-YYYY') ?? '--',
                  },
                  {
                    key: 'end date',
                    value:
                      moment(
                        all_Data?.asset_warranty_guarantee_end_date,
                      ).format('DD-MM-YYYY') ?? '--',
                  },

                  {
                    key: 'supplier name',
                    value: all_Data?.supplier_name ?? '--',
                  },
                  {
                    key: 'created at',
                    value:
                      moment(all_Data?.asset_created_at).format('DD-MM-YYYY') ??
                      '--',
                  },
                ]}
              />

              {/*card for assign detail  field*/}
              {all_Data?.asset_assign_status == 'assigned' && (
                <CustomeCard
                  headerName={'assign detail'}
                  data={[
                    {
                      key: 'assign to',
                      value: all_Data?.asset_assign_to ?? '--',
                    },
                    {
                      key: 'assign by',
                      value: all_Data?.asset_assign_by ?? '--',
                    },
                    {
                      key: 'assign at',
                      value:
                        moment(all_Data?.asset_assign_at).format(
                          'DD-MM-YYYY',
                        ) ?? '--',
                    },
                  ]}
                />
              )}
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

export default AssestDetailScreen;

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
