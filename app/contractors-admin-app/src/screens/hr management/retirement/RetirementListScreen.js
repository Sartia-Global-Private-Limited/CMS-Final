/*    ----------------Created Date :: 13- Sep -2024   ----------------- */
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import CustomeHeader from '../../../component/CustomeHeader';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import { getRetirementList } from '../../../redux/slices/hr-management/retirement/getRetirementListSlice';
import moment from 'moment';
import { deleteRetirementById } from '../../../redux/slices/hr-management/retirement/addUpdateRetirementSlice';
import List from '../../../component/List/List';
import CustomeCard from '../../../component/CustomeCard';

const RetirementListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const geListData = useSelector(state => state.getRetirementList);

  /*declare useState variable here */

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [retirementId, setRetirementId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getRetirementList({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [isFocused, searchText]);

  /* delete retirement function with id */
  const deleteRetirementFunction = async retirementId => {
    try {
      const deleteResult = await dispatch(
        deleteRetirementById(retirementId),
      ).unwrap();

      if (deleteResult?.status === true) {
        ToastAndroid.show(deleteResult?.message, ToastAndroid.LONG);
        setDeleteModalVisible(false), setRetirementId('');

        dispatch(getRetirementList({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        ToastAndroid.show(deleteResult?.message, ToastAndroid.LONG);
        setDeleteModalVisible(false), setRetirementId('');
      }
    } catch (error) {
      setDeleteModalVisible(false), setRetirementId('');
    }
  };

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateRetirementScreen', {
          retirement_id: actionButton?.itemData?.id,
        });
        break;

      case 'delete':
        setDeleteModalVisible(true), setRetirementId(item?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          navigation.navigate('RetirementDetailScreen', {
            retirement_id: item?.id,
          })
        }>
        <CustomeCard
          avatarImage={item?.image}
          allData={item}
          data={[
            {
              key: 'user name',
              value: item?.name ?? '--',
            },
            {
              key: 'RETIREMENT DATE',
              value:
                `${moment(item?.retirement_date).format('DD/MM/YYYY')}` ?? '--',
            },
            {
              key: 'PENSION DURATION',
              value: item?.pension_duration ?? '--',
            },
            {
              key: 'COMMUTE PERCENTAGE',
              value: item?.commute_percentage ?? '--',
            },
          ]}
          status={[
            {
              key: 'PENSION AMOUNT',
              value: `₹ ${item?.pension_amount}`,
              color: Colors().aprroved,
            },
          ]}
          action={handleAction}
          editButton={true}
          deleteButton={true}
        />
      </TouchableOpacity>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getRetirementList({ pageSize: pageSize, pageNo: pageNo }));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`ALl retirement`} />
      <SearchBar setSearchText={setSearchText} />

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={geListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateRetirementScreen'}
        />
      </View>

      {/* modal view for ACTION */}
      {deleteModalVisible && (
        <AlertModal
          visible={deleteModalVisible}
          iconName={'delete-circle-outline'}
          icontype={IconType.MaterialCommunityIcons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO DELETE THIS!!'}
          cancelBtnPress={() => setDeleteModalVisible(!deleteModalVisible)}
          ConfirmBtnPress={() => deleteRetirementFunction(retirementId)}
        />
      )}
    </SafeAreaView>
  );
};

export default RetirementListScreen;
