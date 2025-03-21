/*    ----------------Created Date :: 23- April -2024   ----------------- */
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '@rneui/themed';
import CustomeCard from '../../../component/CustomeCard';
import {
  getApprovedSPList,
  getPendingSPList,
} from '../../../redux/slices/stock-punch-management/stock-punch/getStockPunchListSlice';
import ScreensLabel from '../../../constants/ScreensLabel';
import List from '../../../component/List/List';

const SPListingScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const typeOfExpensePunch = route?.params?.type;
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getStockPunchList);

  /*declare useState variable here */
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      if (typeOfExpensePunch == 'pending') {
        dispatch(getPendingSPList({ pageSize: pageSize, pageNo: pageNo }));
      }
      if (typeOfExpensePunch == 'checkAndApprove') {
        dispatch(getApprovedSPList({ pageSize: pageSize, pageNo: pageNo }));
      }
    });
    return unsubscribe;
  }, [typeOfExpensePunch, isFocused]);

  useEffect(() => {
    if (typeOfExpensePunch == 'pending') {
      dispatch(
        getPendingSPList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
    if (typeOfExpensePunch == 'checkAndApprove') {
      dispatch(
        getApprovedSPList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
  }, [searchText]);

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'approve':
        navigation.navigate('AddUpdateApproveStockPunchScreen', {
          complaintId: actionButton.itemData?.complaint_id,
          userId: actionButton.itemData?.user_id,
          type: 'approve',
        });
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SPDetailScreen', {
              complaintId: item?.complaint_id,
              userId: item?.user_id,
              type: typeOfExpensePunch,
            })
          }>
          <CustomeCard
            allData={item}
            avatarImage={item?.user_image}
            data={[
              {
                key: 'Employee Id',
                value: item?.employee_id,
                keyColor: Colors().skyBule,
              },
              {
                key: 'User Name',
                value: item?.user_name,
              },
              ...(typeOfExpensePunch === 'checkAndApprove'
                ? [
                    {
                      key: 'Total item',

                      component: (
                        <Badge
                          badgeStyle={{ borderRadius: 5 }}
                          value={`${item?.total_items} ITEM`}
                          status="primary"
                        />
                      ),
                    },
                  ]
                : []),
              ...(typeOfExpensePunch === 'checkAndApprove'
                ? [
                    {
                      key: 'Total transaction',
                      component: (
                        <Badge
                          value={`${item?.total_transactions}`}
                          status="primary"
                        />
                      ),
                    },
                  ]
                : []),
              {
                key: typeOfExpensePunch == 'pending' ? 'punch date' : 'date',
                value:
                  typeOfExpensePunch === 'pending'
                    ? item?.punch_at
                    : item?.approved_at,
              },
            ]}
            status={[
              {
                key: 'complaint No',
                value: item.complaint_unique_id,
                color: Colors().pending,
              },
            ]}
            approveButton={typeOfExpensePunch == 'pending' ? true : false}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (typeOfExpensePunch == 'pending') {
      dispatch(getPendingSPList({ pageSize: pageSize, pageNo: pageNo }));
    }
    if (typeOfExpensePunch == 'checkAndApprove') {
      dispatch(getApprovedSPList({ pageSize: pageSize, pageNo: pageNo }));
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <View style={{ flexDirection: 'row' }}>
        <SearchBar setSearchText={setSearchText} />
      </View>
      <View style={{ height: WINDOW_HEIGHT * 0.85, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateApproveStockPunchScreen'}
        />
      </View>
    </SafeAreaView>
  );
};

export default SPListingScreen;
