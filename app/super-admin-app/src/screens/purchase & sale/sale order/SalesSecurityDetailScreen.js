/*    ----------------Created Date :: 5- August -2024   ----------------- */
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

import moment from 'moment';
import {getSaleSecurityDetailById} from '../../../redux/slices/purchase & sale/sale-order/getSaleSecurityDetailSlice';

const SalesSecurityDetailScreen = ({navigation, route}) => {
  const securityId = route?.params?.id;

  const label = ScreensLabel();

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshing, setRefreshing] = useState(false);
  const ListData = useSelector(state => state.getSaleSecurityDetail);
  const dispatch = useDispatch();

  const all_Data = ListData?.data?.data || {};

  useEffect(() => {
    dispatch(
      getSaleSecurityDetailById({
        securityId: securityId,
        pageNo: pageNo,
        pageSize: pageSize,
      }),
    );
  }, [securityId]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(
        getSaleSecurityDetailById({
          securityId: securityId,
          pageNo: pageNo,
          pageSize,
        }),
      );

      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.SECURITY} ${label.DETAIL}`} />

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
              {/* card for complaint detail */}
              <CustomeCard
                headerName={'Security DETAILS'}
                data={[
                  {
                    key: 'so no.',
                    value: all_Data?.so_number ?? '--',
                  },
                  {
                    key: 'RO name',
                    value: all_Data?.regional_office_name ?? ' - - -',
                  },
                  {
                    key: 'tender date',
                    value:
                      moment(all_Data?.tender_date).format('DD-MM-YYYY') ??
                      '--',
                  },
                  {
                    key: 'tender no.',
                    value: all_Data?.tender_number ?? '--',
                  },
                  {
                    key: 'deposit date',
                    value: all_Data?.security_deposit_date,
                  },

                  {
                    key: 'deposit amt.',
                    value: `₹ ${all_Data?.security_deposit_amount}`,
                    keyColor: Colors().aprroved,
                  },
                  {key: 'bank name', value: all_Data?.bank_name},
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

export default SalesSecurityDetailScreen;

const styles = StyleSheet.create({});
