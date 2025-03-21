/*    ----------------Created Date :: 20- April -2024   ----------------- */
import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT} from '../../../utils/ScreenLayout';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import CustomeHeader from '../../../component/CustomeHeader';
import {Badge} from '@rneui/themed';
import {
  getApproveExpensePunchDetailById,
  getExpensePunchDetailById,
} from '../../../redux/slices/expense-management/expense-punch/getExpensePunchDetailSlice';
import CustomeCard from '../../../component/CustomeCard';
import ScreensLabel from '../../../constants/ScreensLabel';

const ExpensePunchItemHistory = ({navigation, route}) => {
  /* declare props constant variale*/
  const complaintId = route?.params?.complaintId;
  const userId = route?.params?.userId;
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const label = ScreensLabel();
  const ListData = useSelector(state => state.getExpensePunchDetail);

  /*declare useState variable here */
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (type == 'pending') {
      dispatch(getExpensePunchDetailById({complaintId, userId}));
    }
    if (type == 'checkAndApprove') {
      dispatch(getApproveExpensePunchDetailById({complaintId, userId}));
    }
  }, [complaintId, userId, refreshing]);

  /*pull down to refresh funciton*/
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
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
            {key: 'item', value: item?.item_name},
            {
              key: 'price',
              value: `₹ ${item?.item_price}`,
              keyColor: Colors().aprroved,
            },
            {
              key: type == 'pending' ? 'quantity' : 'punch quantity',
              // value: item?.item_name,
              component: (
                <>
                  <Badge
                    badgeStyle={{borderRadius: 5}}
                    value={
                      type == 'pending'
                        ? `${item?.item_qty} ITEM`
                        : `${item?.item_punch_qty} ITEM`
                    }
                    status="primary"
                  />
                </>
              ),
            },
            ...(type === 'checkAndApprove'
              ? [
                  {
                    key: 'approve qty',
                    component: (
                      <>
                        <Badge
                          badgeStyle={{borderRadius: 5}}
                          value={`${item?.item_approved_qty} ITEM`}
                          status="primary"
                        />
                      </>
                    ),
                  },
                ]
              : []),
            ...(type === 'checkAndApprove'
              ? [
                  {
                    key: 'Transaction id',
                    value: item?.transaction_id,
                  },
                ]
              : []),
            ...(type === 'checkAndApprove'
              ? [
                  {
                    key: 'approve date & time',
                    value: item?.approved_at,
                    keyColor: Colors().pending,
                  },
                ]
              : []),
            {
              key: 'Total',
              value: `₹ ${item?.total_Amount}`,
              keyColor: Colors().aprroved,
            },
          ]}
          status={[
            {
              key: 'punch date & time',
              value: item?.punch_at,
              color: Colors().pending,
            },
          ]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label.EXPENSE_ITEM_HISTORY} />

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

export default ExpensePunchItemHistory;

const styles = StyleSheet.create({});
