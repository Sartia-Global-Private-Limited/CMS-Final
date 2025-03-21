/*    ----------------Created Date :: 30- sep -2024   ----------------- */

import { View, SafeAreaView } from 'react-native';
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
import CustomeCard from '../../../component/CustomeCard';
import ScreensLabel from '../../../constants/ScreensLabel';
import { deleteSubCategoryById } from '../../../redux/slices/item master/subCategory/addUpdateSubCategorySlice';
import List from '../../../component/List/List';
import { getAllSubCategoryList } from '../../../redux/slices/item master/subCategory/getSubCategoryListSlice';

const SubCategoryList = ({ navigation }) => {
  /*declare hooks variable here */
  const label = ScreensLabel();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listData = useSelector(state => state.getSubCategoryList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [brandId, setBrandId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getAllSubCategoryList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 1:
        return Colors().aprroved;
      case 0:
        return Colors().red;

      default:
        return 'black';
    }
  }

  /*for getting the text of status*/
  function getStatusText(status) {
    switch (status) {
      case 1:
        return 'Active';

      case 0:
        return 'Inactive';

      default:
        break;
    }
  }

  /* delete Document category delete with id */
  const deleteBrand = async brandId => {
    try {
      const deleteResult = await dispatch(
        deleteSubCategoryById(brandId),
      ).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setBrandId('');

        dispatch(getAllSubCategoryList({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setBrandId('');
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
        navigation.navigate('AddUpdateSubCategory', {
          edit_id: actionButton?.itemData?.id,
        });
        break;

      case 'delete':
        setDeleteModalVisible(true), setBrandId(actionButton?.itemData?.id);
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
              key: 'Name',
              value: item?.name ?? '--',
              keyColor: Colors().skyBule,
            },
          ]}
          status={[
            {
              key: 'status',
              value: getStatusText(item?.status),
              color: getStatusColor(item?.status),
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
      getAllSubCategoryList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.SUBCATEGORY}`} />
      <SearchBar setSearchText={setSearchText} />
      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={listData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateSubCategory'}
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
          ConfirmBtnPress={() => deleteBrand(brandId)}
        />
      )}
    </SafeAreaView>
  );
};

export default SubCategoryList;
