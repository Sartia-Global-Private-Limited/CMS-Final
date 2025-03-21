/*    ----------------Created Date :: 18- July -2024   ----------------- */
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT} from '../../../utils/ScreenLayout';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import CustomeHeader from '../../../component/CustomeHeader';
import CustomeCard from '../../../component/CustomeCard';
import ScreensLabel from '../../../constants/ScreensLabel';
import {getPaymentVoucherHistoryById} from '../../../redux/slices/billing management/payment received/getPaymentVoucherHistorySlice';

const PaymentVoucherHistory = ({navigation, route}) => {
  /* declare props constant variale*/
  const id = route?.params?.id;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const label = ScreensLabel();
  const ListData = useSelector(state => state.getPaymentVoucherHistory);

  /*declare useState variable here */
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getPaymentVoucherHistoryById(id));
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getPaymentVoucherHistoryById(id));

      setRefreshing(false);
    }, 2000);
  }, []);
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

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View style={{}}>
        <CustomeCard
          avatarImage={item?.item_images}
          data={[
            {
              key: 'Voucher no',
              value: item?.pv_number,
              keyColor: Colors().skyBule,
            },
            {
              key: 'voucher amount',
              value: `₹ ${item?.voucher_amount}`,
              keyColor: Colors().aprroved,
            },
            {
              key: 'Bill amount',
              value: `₹ ${item?.total_amount_received}`,
              keyColor: Colors().aprroved,
            },
            {
              key: 'received amount',
              value: `₹ ${item?.amount_received}`,
              keyColor: Colors().aprroved,
            },

            {
              key: 'Balance',
              value: `₹ ${item?.balance}`,
              keyColor: Colors().aprroved,
            },
          ]}
          status={[
            {
              key: 'voucher date',
              value: item?.voucher_date,
              color: Colors().pending,
            },
          ]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label.VOUCHER_HISTORY} />

      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <>
          <FlatList
            showsVerticalScrollIndicator={false}
            data={ListData?.data?.data}
            renderItem={renderItem}
            contentContainerStyle={{paddingBottom: 50}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
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

export default PaymentVoucherHistory;

const styles = StyleSheet.create({});
