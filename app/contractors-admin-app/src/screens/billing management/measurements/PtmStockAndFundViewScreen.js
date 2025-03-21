/*    ----------------Created Date :: 29- June -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import CustomeCard from '../../../component/CustomeCard';
import CustomeHeader from '../../../component/CustomeHeader';
import ScreensLabel from '../../../constants/ScreensLabel';
import IconType from '../../../constants/IconType';
import { getStockFundMeasurementByComplaintId } from '../../../redux/slices/billing management/measurement/getStockFundForMeasurementDetailSlice';

const PtmStockAndFundViewScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const complaint_id = route?.params?.complaint_id;
  const type = route?.params?.type;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getStockFundForMeasurementDetail);

  const dataOfStock = ListData?.data?.dataSite;
  const dataOfFund = ListData?.data?.dataFund;

  /*declare useState variable here */
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getStockFundMeasurementByComplaintId(complaint_id));
  }, [complaint_id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getStockFundMeasurementByComplaintId(complaint_id));

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
  const renderItem = ({ item, index }) => {
    return (
      <View>
        <CustomeCard
          avatarImage={item?.item_image}
          data={[
            {
              key: 'item name',
              value: item?.item_name || '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'ITEM PRICE',
              value: `₹ ${item?.item_rate || 0}`,
              keyColor: Colors().aprroved,
            },

            {
              key: 'item qty',
              value: item?.item_qty || '--',
              keyColor: Colors().pending,
            },
            {
              key: 'approve qty',
              value: item?.approved_qty || '--',
              keyColor: Colors().pending,
            },
            {
              key: 'Total amount',
              value: `₹ ${item?.total_approved_amount || '----'}`,
              keyColor: Colors().red,
            },
          ]}
          status={[
            {
              key: 'data & time',
              value: item?.approved_at,
              color: Colors().pending,
            },
          ]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader
        headerTitle={type == 'fund' ? 'Fund detail' : 'stock detail'}
      />
      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <View>
          <Text
            style={[
              styles.title,
              {
                color: Colors().pureBlack,
                alignSelf: 'center',
                marginVertical: 10,
              },
            ]}>
            {type == 'fund'
              ? `Total Amount ₹ ${dataOfFund[0]?.total_office_amount || 0}`
              : `Total Amount ₹ ${dataOfStock[0]?.total_office_amount || 0}`}
          </Text>

          <FlatList
            data={
              type == 'fund'
                ? dataOfFund[0]?.itemDetails
                : dataOfStock[0]?.itemDetails
            }
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: WINDOW_HEIGHT * 0.2 }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyComponent}
          />
        </View>
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

export default PtmStockAndFundViewScreen;

const styles = StyleSheet.create({
  bankCard: {
    margin: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 10,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
