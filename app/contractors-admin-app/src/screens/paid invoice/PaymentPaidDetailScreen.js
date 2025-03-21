/*    ----------------Created Date :: 3 - August -2024   ----------------- */
import {
  StyleSheet,
  View,
  SafeAreaView,
  RefreshControl,
  FlatList,
  Text,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import { useDispatch, useSelector } from 'react-redux';
import ScreensLabel from '../../constants/ScreensLabel';
import DataNotFound from '../../component/DataNotFound';
import CustomeCard from '../../component/CustomeCard';
import { getpaymentPaidDetailById } from '../../redux/slices/paid invoice/getPaymentPaidDetailSlice';
import { WINDOW_HEIGHT } from '../../utils/ScreenLayout';

const PaymentPaidDetailScreen = ({ navigation, route }) => {
  const id = route?.params?.id;
  const label = ScreensLabel();
  const [refreshing, setRefreshing] = useState(false);
  const ListData = useSelector(state => state.getPaymentPaidDetail);
  const dispatch = useDispatch();
  const all_Data = ListData?.data?.data?.[0] || {};

  useEffect(() => {
    dispatch(getpaymentPaidDetailById(id));
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getpaymentPaidDetailById(id));

      setRefreshing(false);
    }, 2000);
  }, []);

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <CustomeCard
          headerName={`inovice no : ${item?.invoice_number}`}
          data={[
            {
              key: 'measurement amt',
              value: `₹ ${item?.measurement_amount}` ?? '--',
              keyColor: Colors().aprroved,
            },
            {
              key: 'pay amt',
              value: `₹ ${item?.pay_amount}` ?? '--',
              keyColor: Colors().aprroved,
            },
            {
              key: 'deduction amt',
              value: `₹ ${item?.deduction}` ?? '--',
              keyColor: Colors().red,
            },

            {
              key: 'sales area name',
              value: item?.sales_area_details?.sales_area_name ?? '--',
            },

            {
              key: 'pv number',
              value: `${item?.pv_number}` ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'pv date',
              value: item?.pv_date ?? '--',
            },
          ]}
          status={[
            {
              key: 'complaint id',
              value: `${item?.complaint_unique_id}` ?? '--',
              color: Colors().pending,
            },
          ]}
        />
      </View>
    );
  };
  /* if we got no data for flatlist*/
  const renderEmptyComponent = () => (
    // Render your empty component here<>
    <View
      style={{
        height: WINDOW_HEIGHT * 0.6,
      }}>
      <DataNotFound />
    </View>
  );

  const ListHeaderComponent = () => (
    <View style={{}}>
      {/* card for complaint detail */}
      <CustomeCard
        headerName={'Payment DETAILS'}
        data={[
          {
            key: 'Payment unique id.',
            value: all_Data?.unique_id ?? '--',
            keyColor: Colors().skyBule,
          },
          {
            key: 'Manager name',
            value: all_Data?.manager_name ?? ' - - -',
          },

          {
            key: 'ro name',
            value: all_Data?.ro_name ?? '--',
          },
        ]}
        status={[
          {
            key: 'Payment amt.',
            value: `₹ ${all_Data?.amount}`,
            color: Colors().aprroved,
          },
        ]}
      />
      <View style={{ alignSelf: 'center' }}>
        <Text style={styles.allInvoice}>All Invoices</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.PAYMENT_PAID} ${label.DETAIL}`} />

      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <>
          <FlatList
            data={all_Data?.complaint_details}
            showsVerticalScrollIndicator={false}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 50 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={renderEmptyComponent}
          />
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

export default PaymentPaidDetailScreen;

const styles = StyleSheet.create({
  allInvoice: {
    fontFamily: Colors().fontFamilyBookMan,
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'uppercase',
    color: Colors().red,
  },
});
