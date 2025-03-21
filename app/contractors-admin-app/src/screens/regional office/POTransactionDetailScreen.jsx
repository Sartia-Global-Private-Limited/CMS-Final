/*    ----------------Created Date :: 10- August -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ImageBackground,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../component/CustomeCard';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeHeader from '../../component/CustomeHeader';
import Images from '../../constants/Images';
import { getPoTransactionDetailById } from '../../redux/slices/regional office/getPoTransactionDetailSlice';
import List from '../../component/List/List';

const POTransactionDetailScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const id = route?.params?.id;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getPoTransactionDetail);
  const label = ScreensLabel();
  const getBalance = ListData?.data?.getBalance || {};

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(
      getPoTransactionDetailById({
        id: id,
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [searchText, isFocused, id]);

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'credit':
        return Colors().aprroved;
      case 'debit':
        return Colors().red;

      default:
        return 'black';
    }
  }

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <CustomeCard
          allData={item}
          data={[
            {
              key: 'balance',
              value: `₹ ${item?.balance}` ?? '--',
              keyColor: Colors().aprroved,
            },

            {
              key: 'Received amt',
              value: `₹ ${item?.amount_received}` ?? '--',
              keyColor: Colors().aprroved,
            },
            {
              key: 'transaction id',
              value: `${item?.transaction_id ?? '--'}`,
              keyColor: Colors().red,
            },
            {
              key: 'date',
              value: `${item?.date}` ?? '--',
              keyColor: Colors().pending,
            },
          ]}
          status={[
            {
              key: 'Payment mode',
              value: `${item?.status}`,
              color: getStatusColor(item?.status),
            },
          ]}
        />
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getPoTransactionDetailById({
        id: id,
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.TRANSACTION} ${label.DETAIL}`} />
      <ImageBackground
        source={Images.BANK_CARD}
        imageStyle={{ borderRadius: WINDOW_WIDTH * 0.03 }}
        style={styles.bankCard}>
        <Text style={[styles.title, { color: 'white', fontSize: 20 }]}>
          {getBalance?.regional_office_name
            ? getBalance?.regional_office_name
            : 'regional office'}
        </Text>

        <Text
          style={[
            styles.title,
            { color: 'white', fontSize: 22, alignSelf: 'center' },
          ]}>
          {getBalance?.po_number ? getBalance?.po_number : 'po number'}
        </Text>
        <View style={[styles.twoItemView, { justifyContent: 'space-between' }]}>
          <Text style={[styles.title, { color: 'white', maxWidth: '50%' }]}>
            {getBalance?.total_received_credit
              ? `Received : ₹ ${getBalance?.total_received_credit?.toFixed(2)}`
              : '-- -- --'}
          </Text>
          <Text
            style={[
              styles.title,
              { color: 'white', maxWidth: '50%', textAlign: 'center' },
            ]}>
            {getBalance?.balance
              ? `balance : ₹ ${getBalance?.balance}`
              : '-- -- --'}
          </Text>
        </View>
      </ImageBackground>

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={''}
        />
      </View>
    </SafeAreaView>
  );
};

export default POTransactionDetailScreen;

const styles = StyleSheet.create({
  bankCard: {
    margin: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 10,
  },
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
    flexShrink: 1,
  },
});
