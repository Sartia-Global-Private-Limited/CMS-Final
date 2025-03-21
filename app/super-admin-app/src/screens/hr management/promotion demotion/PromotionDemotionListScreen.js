import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import SearchBar from '../../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {getPromotionDemotionList} from '../../../redux/slices/hr-management/promotion-demotion/getPromotioDemotionSlice';
import List from '../../../component/List/List';
import CustomeCard from '../../../component/CustomeCard';

const PromotionDemotionListScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const geListData = useSelector(state => state.getPromotioDemotion);

  /*declare useState variable here */
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getPromotionDemotionList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [searchText, isFocused]);

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdatePromotionDemotionScreen', {
          edit_id: actionButton?.itemData?.id,
        });
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{flex: 1}}
        onPress={() =>
          navigation.navigate('PromotionDemotionDetailScreens', {
            allData: item,
          })
        }>
        <CustomeCard
          allData={item}
          data={[
            {
              key: 'PURPOSE',
              value: item?.purpose ?? '--',
            },
            {
              key: 'REASON',
              value: item?.reason ?? '--',
            },
            {
              key: 'CHANGED SALARY',
              value: item?.change_in_salary ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'CHANGED SALARY TYPE',
              value: item?.change_in_salary_type ?? '--',
              keyColor: Colors().skyBule,
            },
          ]}
          status={[
            {
              key: 'CHANGED SALARY VALUE',
              value:
                item?.change_in_salary_type == 'percentage'
                  ? ` ${item?.change_in_salary_value} % `
                  : `₹ ${item?.change_in_salary_value} ` ?? '--',
            },
          ]}
          editButton={true}
          action={handleAction}
        />
      </TouchableOpacity>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getPromotionDemotionList({pageSize: pageSize, pageNo: pageNo}));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`PROMOTION DEMOTION`} />
      <SearchBar setSearchText={setSearchText} />
      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          data={geListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdatePromotionDemotionScreen'}
        />
      </View>
    </SafeAreaView>
  );
};

export default PromotionDemotionListScreen;
