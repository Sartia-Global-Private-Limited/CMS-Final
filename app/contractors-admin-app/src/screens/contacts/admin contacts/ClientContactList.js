import { View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import SearchBar from '../../../component/SearchBar';
import CustomeHeader from '../../../component/CustomeHeader';
import List from '../../../component/List/List';
import { getClientContact } from '../../../redux/slices/contacts/admin contacts/getAdminContactListSlice';

const ClientContactList = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getAdminContactList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getClientContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
          type: 'client',
        }),
      );
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    dispatch(
      getClientContact({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
        type: 'client',
      }),
    );
  }, [searchText]);

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity
          // disabled={type !== 'company'}
          disabled={true}
          onPress={() => {
            navigation.navigate('ContactDetailScreen', {
              id: item?.id,
            });
          }}>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'Sr. No.',
                value: index + 1 ?? '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'Name',
                value: item?.client_name ?? '--',
                keyColor: Colors().pureBlack,
              },

              {
                key: 'email',
                value: item?.email ?? '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'Contact Number',
                value: item?.mobile ?? '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'Address',
                value: item?.address ?? '--',
                keyColor: Colors().pureBlack,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getClientContact({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
        type: 'client',
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      {/*Seacrh componenet */}
      <CustomeHeader headerTitle={`Client Contacts`} />
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

export default ClientContactList;
