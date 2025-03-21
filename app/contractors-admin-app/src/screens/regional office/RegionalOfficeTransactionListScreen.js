/*    ----------------Created Date :: 10- August -2024   ----------------- */
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
import { getAllRoTransactionList } from '../../redux/slices/regional office/getRoTransactionListSlice';
import List from '../../component/List/List';

const RegionalOfficeTransactionListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getRoTransactionList);
  const label = ScreensLabel();

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(
      getAllRoTransactionList({
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
          navigation.navigate('ROTransactionDetailScreen', {
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
              key: 'total in amt',
              value: `₹ ${item?.total_received_credit?.toFixed(2) ?? '0.00'}`,
              keyColor: Colors().aprroved,
            },
            {
              key: 'total pay amt',
              value: `₹ ${
                item?.total_received_non_credit?.toFixed(2) ?? '0.00'
              }`,
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
      getAllRoTransactionList({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`R.O. ${label.TRANSACTION}S`} />

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

export default RegionalOfficeTransactionListScreen;
