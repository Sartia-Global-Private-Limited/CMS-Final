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
import { getAllAreaMangerList } from '../../redux/slices/area manager/getAreaManagerListSlice';
import List from '../../component/List/List';

const AreaManagerListScreen = ({ navigation, route }) => {
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getAreaManagerList);
  const label = ScreensLabel();

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(
      getAllAreaMangerList({
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
          navigation.navigate('AreaManagerDetailScreen', {
            id: item?.area_manager_id,
          });
        }}>
        <CustomeCard
          allData={item}
          data={[
            {
              key: 'Area manager',
              value: item?.name ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'mobile',
              value: item?.mobile ?? '--',
            },
            {
              key: 'email',
              value: item?.email ?? '--',
            },
            {
              key: 'last balance',
              value: `₹ ${item?.balance}` ?? '--',
              keyColor: Colors().aprroved,
            },

            {
              key: 'total amt received',
              value: `₹ ${item?.total_received}` ?? '--',
              keyColor: Colors().aprroved,
            },
          ]}
          status={[
            {
              key: 'employee id',
              value: `${item?.employee_id}`,
              color: Colors().pending,
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getAllAreaMangerList({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={label.AREA_MANAGER} />
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

export default AreaManagerListScreen;
