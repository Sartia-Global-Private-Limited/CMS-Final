/*    ---------Created Date :: 12- Sep -2024   ---------*/

import { View, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import SearchBar from '../../../component/SearchBar';
import ScreensLabel from '../../../constants/ScreensLabel';
import CustomeHeader from '../../../component/CustomeHeader';
import { getAllAreaMangerRatioOverview } from '../../../redux/slices/settings/area manager ratio overview/getAreaManagerRatioOverviewListSlice';
import List from '../../../component/List/List';

const AreaManagerOverviewListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getAreaManagerRatioOverviewList);
  const label = ScreensLabel();

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getAllAreaMangerRatioOverview({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    dispatch(
      getAllAreaMangerRatioOverview({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [searchText, isFocused]);

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateAreaManagerOverviewScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <CustomeCard
          allData={item}
          data={[
            {
              key: 'Area manager',
              value: item?.manager_name ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'Manager ratio',
              value: item?.manager_ratio ?? '--',
              keyColor: Colors().aprroved,
            },
            {
              key: 'Company ratio',
              value: item?.company_ratio ?? '--',
              keyColor: Colors().rejected,
            },
          ]}
          status={[
            {
              key: 'action',
              value: 'edit',
              color: Colors().aprroved,
            },
          ]}
          editButton={true}
          action={handleAction}
        />
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getAllAreaMangerRatioOverview({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={label.AREA_MANAGER_RATIO_OVERVIEW} />
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
          addAction={'AddUpdateAreaManagerOverviewScreen'}
        />
      </View>
    </SafeAreaView>
  );
};

export default AreaManagerOverviewListScreen;
