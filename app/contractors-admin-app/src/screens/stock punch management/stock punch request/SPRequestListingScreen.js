/*    ----------------Created Date :: 9- sep -2024   ----------------- */
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useDispatch, useSelector } from 'react-redux';
import CustomeHeader from '../../../component/CustomeHeader';
import { Badge } from '@rneui/themed';
import moment from 'moment';
import { getAllSPList } from '../../../redux/slices/stock-punch-management/stock-punch-request/getSPRequestListSlice';
import CustomeCard from '../../../component/CustomeCard';
import ScreensLabel from '../../../constants/ScreensLabel';
import List from '../../../component/List/List';

const SPRequestListingScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const ListData = useSelector(state => state.getSPRequestList);

  /*declare useState variable here */
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    dispatch(
      getAllSPList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [searchText]);

  const keyHasValue = value => {
    if (value) {
      return value;
    } else {
      return '----';
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SPRequestDetailScreen', {
              edit_id: item?.id,
            })
          }>
          <CustomeCard
            avatarImage={item?.image}
            data={[
              {
                key: 'unique id',
                value: keyHasValue(item?.employee_id),
                keyColor: Colors().skyBule,
              },
              { key: 'name', value: item?.name },
              {
                key: 'Total complaint',
                component: (
                  <Badge value={`${item?.totalPunch}`} status="primary" />
                ),
              },
              {
                key: 'Total amount',
                value: `₹ ${keyHasValue(item?.totalSum)}`,
                keyColor: Colors().aprroved,
              },
              {
                key: 'Transfer amount',
                value: `₹ ${keyHasValue(item?.total_stock_amount)}`,
                keyColor: Colors().aprroved,
              },
              {
                key: 'Balance',
                value: `₹ ${keyHasValue(item?.balance)}`,
                keyColor: Colors().aprroved,
              },
            ]}
            status={[
              {
                key: 'requested month',
                value: moment(item?.month, 'YY-MM').format('MMMM YYYY'),
                color: Colors().pending,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getAllSPList({ pageSize: pageSize, pageNo: pageNo }));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={label.SP_REQUEST} />
      <View style={{ flexDirection: 'row' }}>
        <SearchBar setSearchText={setSearchText} />
      </View>

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={''}
          // SPRequestDetailScreen for View The item Details
        />
      </View>
    </SafeAreaView>
  );
};

export default SPRequestListingScreen;
