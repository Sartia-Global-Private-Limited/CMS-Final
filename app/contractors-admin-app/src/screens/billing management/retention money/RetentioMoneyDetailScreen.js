/*    ----------------Created Date :: 23- July -2024   ----------------- */
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import { useDispatch, useSelector } from 'react-redux';
import ScreensLabel from '../../../constants/ScreensLabel';
import DataNotFound from '../../../component/DataNotFound';
import CustomeCard from '../../../component/CustomeCard';

import moment from 'moment';
import { getRetentionMoneyDetailById } from '../../../redux/slices/billing management/retention money/getRetentionMoneyDetailSlice';

const RetentioMoneyDetailScreen = ({ navigation, route }) => {
  const id = route?.params?.id;
  const label = ScreensLabel();

  const [refreshing, setRefreshing] = useState(false);
  const ListData = useSelector(state => state.getRetentionMoneyDetail);
  const dispatch = useDispatch();

  const all_Data = ListData?.data?.data || {};

  useEffect(() => {
    dispatch(getRetentionMoneyDetailById(id));
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getRetentionMoneyDetailById(id));

      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.RETENTION_MONEY} ${label.DETAIL}`} />

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
              {/* card for Inovice  detail */}
              <CustomeCard
                headerName={'inovice DETAILS'}
                avatarImage={all_Data?.asset_image}
                data={[
                  {
                    key: 'Payment unique id',
                    value: all_Data?.payment_unique_id ?? '--',
                    keyColor: Colors().skyBule,
                  },
                  {
                    key: 'Inovice no',
                    value: all_Data?.invoice_number ?? '--',
                  },
                  {
                    key: 'Invocie date',
                    value:
                      moment(all_Data?.invoice_date).format('DD-MM-YYYY') ??
                      '--',
                  },
                  {
                    key: 'Pv no',
                    value: all_Data?.payment_voucher_number ?? '--',
                  },
                  {
                    key: 'net amount',
                    value: `₹ ${all_Data?.net_amount}` ?? '--',
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'Bill amount',
                    value: `₹ ${all_Data?.amount}` ?? '--',
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'amount received',
                    value: `₹ ${all_Data?.received_amount}` ?? '--',
                    keyColor: Colors().aprroved,
                  },
                ]}
              />

              {/* card for deduction detail */}
              <CustomeCard
                headerName={'deduction detail'}
                data={[
                  {
                    key: 'Tds amount',
                    value: `₹ ${all_Data?.tds_amount}` ?? '--',
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'Tds amount on gst',
                    value: `₹ ${all_Data?.tds_on_gst_amount}` ?? '--',
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'retention amount',
                    value: `₹ ${all_Data?.retention_amount}` ?? '--',
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'covid 19 amount',
                    value: `₹ ${all_Data?.covid19_amount_hold}` ?? '--',
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'LD amount',
                    value: `₹ ${all_Data?.ld_amount}` ?? '--',
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'other deduction',
                    value: `₹ ${all_Data?.other_deduction}` ?? '--',
                    keyColor: Colors().aprroved,
                  },
                  {
                    key: 'Hold amount',
                    value: `₹ ${all_Data?.hold_amount}` ?? '--',
                    keyColor: Colors().aprroved,
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

export default RetentioMoneyDetailScreen;

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
