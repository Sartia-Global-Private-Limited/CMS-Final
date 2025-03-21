/*    ----------------Created Date :: 13- Sep -2024    ----------------- */
import { Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import NeumorphCard from '../../../component/NeumorphCard';
import CustomeHeader from '../../../component/CustomeHeader';
import { getEmpLogsList } from '../../../redux/slices/hr-management/logs/getLogsListSlice';
import moment from 'moment';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';

const EmpLogsListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const LogListData = useSelector(state => state.getLogsList);

  /*declare useState variable here */
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    dispatch(
      getEmpLogsList({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [isFocused, searchText]);

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('EmpLogDetailScreen', {
            logId: item?.id,
          })
        }>
        <CustomeCard
          avatarImage={item?.image}
          allData={item}
          data={[
            {
              key: 'employee name',
              value: item?.user_name ?? '--',
            },
            {
              key: 'DESCRIPTION',
              value: item?.action ?? '--',
            },
          ]}
          status={[
            {
              key: 'ACTIVITY TIME',
              component: (
                <NeumorphCard>
                  <View style={{ padding: 5, flexDirection: 'row' }}>
                    <Text style={{ color: Colors().pending }}>
                      {moment(item?.created_at).format('DD-MM-YYYY')} ||{' '}
                    </Text>
                    <Text style={{ color: Colors().aprroved }}>
                      {moment(item?.created_at).format('dddd')} ||{' '}
                    </Text>
                    <Text style={{ color: Colors().red }}>
                      {moment(item?.created_at).format('hh:mm A')}
                    </Text>
                  </View>
                </NeumorphCard>
              ),
            },
          ]}
        />
      </TouchableOpacity>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getEmpLogsList({ pageSize: pageSize, pageNo: pageNo }));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={'EMPLOYEES logs'} />
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={LogListData}
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

export default EmpLogsListScreen;
