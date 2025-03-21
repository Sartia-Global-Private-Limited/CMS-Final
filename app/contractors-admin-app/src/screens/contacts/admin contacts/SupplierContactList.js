import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import SearchBar from '../../../component/SearchBar';
import CustomeHeader from '../../../component/CustomeHeader';
import List from '../../../component/List/List';
import { getSupplierContact } from '../../../redux/slices/contacts/admin contacts/getAdminContactListSlice';

const SupplierContactList = ({ navigation, route }) => {
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
        getSupplierContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
          status: 2,
        }),
      );
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    dispatch(
      getSupplierContact({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
        status: 2,
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
                value: item?.supplier_name ?? '--',
                keyColor: Colors().pureBlack,
              },

              {
                key: 'supplier code',
                value: item?.supplier_code ?? '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'city',
                value:
                  item?.supplier_addresses?.length > 0
                    ? item?.supplier_addresses[0]?.city
                    : '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'pincode',
                value:
                  item?.supplier_addresses?.length > 0
                    ? item?.supplier_addresses[0]?.pin_code
                    : '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'state',
                value:
                  item?.supplier_addresses?.length > 0
                    ? item?.supplier_addresses[0]?.state
                    : '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'landmark',
                value:
                  item?.supplier_addresses?.length > 0
                    ? item?.supplier_addresses[0]?.landmark
                    : '--',
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
      getSupplierContact({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
        status: 2,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      {/*Seacrh componenet */}
      <CustomeHeader headerTitle={`Supplier Contacts`} />
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

export default SupplierContactList;
