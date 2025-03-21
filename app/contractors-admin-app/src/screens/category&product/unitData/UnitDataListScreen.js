import { StyleSheet, View, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import CustomeHeader from '../../../component/CustomeHeader';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../../constants/ScreensLabel';
import { getAllUnitData } from '../../../redux/slices/category&product/unitData/getUnitDataListSlice';
import { deleteUnitDataById } from '../../../redux/slices/category&product/unitData/addUpdateUnitDataSlice';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';

const UnitDataListScreen = ({ navigation, route }) => {
  /*declare hooks variable here */
  const label = ScreensLabel();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listData = useSelector(state => state.getUnitDataList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [unitDataId, setUnitDataId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getAllUnitData({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /* delete  unit data delete with id */
  const deleteUnitData = async unitDataId => {
    try {
      const deleteResult = await dispatch(
        deleteUnitDataById(unitDataId),
      ).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setUnitDataId('');

        dispatch(getAllUnitData({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setUnitDataId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateUnitData', {
          edit_id: actionButton?.itemData?.id,
        });
        break;
      case 'delete':
        setDeleteModalVisible(true), setUnitDataId(actionButton?.itemData?.id);
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
              key: 'name',
              value: item?.name ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'Short name',
              value: item?.short_name ?? '--',
            },
          ]}
          status={[
            {
              key: 'action',
              value: 'edit / delete',
              color: Colors().aprroved,
            },
          ]}
          editButton={true}
          deleteButton={true}
          action={handleAction}
        />
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getAllUnitData({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.ALL} ${label.UNIT_DATA}`} />
      <SearchBar setSearchText={setSearchText} />

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={listData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateUnitData'}
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
          ConfirmBtnPress={() => deleteUnitData(unitDataId)}
        />
      )}
    </SafeAreaView>
  );
};

export default UnitDataListScreen;
