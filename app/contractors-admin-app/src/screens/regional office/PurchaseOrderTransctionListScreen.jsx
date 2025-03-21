/*    ---------Created Date :: 12- Sep -2024   ---------*/
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../component/CustomeCard';
import SearchBar from '../../component/SearchBar';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeHeader from '../../component/CustomeHeader';
import { getAllPoTransactionList } from '../../redux/slices/regional office/getPoTransactionListSlice';
import List from '../../component/List/List';

const PurchaseOrderTransctionListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getPoTransactionList);
  const label = ScreensLabel();

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(
      getAllPoTransactionList({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [searchText, isFocused]);

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={index}
        onPress={() => {
          navigation.navigate('POTransactionDetailScreen', {
            id: item?.ro_id,
          });
        }}>
        <CustomeCard
          allData={item}
          data={[
            {
              key: 'Regional office',
              value: item?.regional_office_name ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'PO Number',
              value: item?.po_number ?? '--',
              keyColor: Colors().skyBule,
            },

            {
              key: 'total in amt',
              value: `₹ ${(+item?.total_received_credit ?? 0).toFixed(2)}`,
              keyColor: Colors().aprroved,
            },
            {
              key: 'total pay amt',
              value: `₹ ${(+item?.total_received_non_credit ?? 0).toFixed(2)}`,
              keyColor: Colors().aprroved,
            },
          ]}
          status={[
            {
              key: 'Balance',
              value: `₹ ${item?.balance ?? '0.00'}`,
              color: Colors().pending,
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  const handlePageClick = () => {
    dispatch(
      getAllPoTransactionList({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`P.O. ${label.TRANSACTION}S`} />

      {/*Seacrh componenet */}
      <SearchBar setSearchText={setSearchText} />

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

export default PurchaseOrderTransctionListScreen;
