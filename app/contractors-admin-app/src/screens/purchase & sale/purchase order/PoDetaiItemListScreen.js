/*    ----------------Created Date :: 14- June -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import ScreensLabel from '../../../constants/ScreensLabel';
import CustomeCard from '../../../component/CustomeCard';
import {getPurchaseOrderDetailById} from '../../../redux/slices/purchase & sale/purchase-order/getPurchaseOrderDetailSlice';
import CustomeHeader from '../../../component/CustomeHeader';

const PoDetaiItemListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  const poId = route?.params?.poId;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getPurchaseOrderDetail);
  const {purchase_order_item} = ListData?.data?.data;

  /*declare useState variable here */
  const [refreshing, setRefreshing] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    dispatch(
      getPurchaseOrderDetailById({
        poId: poId,
        pageNo: pageNo,
        pageSize: pageSize,
      }),
    );
  }, [isFocused, poId]);

  /* function for pull down to refresh */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(
        getPurchaseOrderDetailById({
          poId: poId,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
      setRefreshing(false);
    }, 2000);
  }, []);

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <CustomeCard
          data={[
            {
              key: 'order line no',
              value: item?.OrderLineNumber,
              keyColor: Colors().skyBule,
            },
            {key: 'name', value: item?.Name},
            {key: 'HSN code', value: item?.HsnCode},
            {
              key: 'Rate',
              value: `₹ ${item?.Rate}`,
              keyColor: Colors().aprroved,
            },
            {
              key: 'quantity',
              value: item?.Qty,
            },
            {
              key: 'Amount',
              value: `	₹ ${item?.Amount}`,
              keyColor: Colors().red,
            },
            ...(item?.gst_type
              ? [{key: 'gst type', value: item?.gst_type}]
              : []),
            ...(item?.gst_percent
              ? [{key: 'gst %', value: item?.gst_percent}]
              : []),
            ...(item?.description
              ? [{key: 'description', value: item?.description}]
              : []),
          ]}
          status={[{key: 'unit', value: item?.Unit, color: Colors().pending}]}
        />
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = number => {
    setPageNo(number);
    dispatch(
      getPurchaseOrderDetailById({
        poId: poId,
        pageSize: pageSize,
        pageNo: number,
      }),
    );
  };
  /* if we got no data for flatlist*/
  const renderEmptyComponent = () => (
    // Render your empty component here<>
    <View
      style={{
        height: WINDOW_HEIGHT * 0.8,
      }}>
      <DataNotFound />
    </View>
  );

  /*pagination button UI*/
  const renderPaginationButtons = () => {
    const buttons = [];

    for (let i = 1; i <= purchase_order_item?.pageDetails?.totalPages; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageClick(i)}
          style={[
            styles.paginationButton,
            i === pageNo ? styles.activeButton : null,
          ]}>
          <Text style={{color: 'white'}}>{i}</Text>
        </TouchableOpacity>,
      );
    }

    return buttons;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.PO_DETAIL_ITEM_LIST}`} />

      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <>
          <FlatList
            data={purchase_order_item?.data}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 50}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyComponent}
          />
          {purchase_order_item?.pageDetails?.totalPages > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                marginTop: WINDOW_HEIGHT * 0.8,
                bottom: 10,
                alignSelf: 'center',
                position: 'absolute',
                backgroundColor: '',
                marginHorizontal: WINDOW_WIDTH * 0.01,

                columnGap: 20,
              }}>
              {renderPaginationButtons()}
            </ScrollView>
          )}
        </>
      ) : ListData?.isError ? (
        <InternalServer />
      ) : !ListData?.data?.status &&
        ListData?.data?.message === 'Data not found' ? (
        <>
          <DataNotFound />
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default PoDetaiItemListScreen;

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  paginationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  activeButton: {
    backgroundColor: '#22c55d',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
