/*    ----------------Created Date :: 19- Sep -2024   ----------------- */

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
import { getCategory } from '../../../redux/slices/category&product/category/getCategoryListSlice';
import { deleteCategoryById } from '../../../redux/slices/category&product/category/addUpdateCategorySlice';
import CustomeCard from '../../../component/CustomeCard';
import ScreensLabel from '../../../constants/ScreensLabel';
import List from '../../../component/List/List';

const CategoryListScreen = ({ navigation, route }) => {
  /*declare hooks variable here */
  const label = ScreensLabel();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listData = useSelector(state => state.getCategoryList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getCategory({ pageSize: pageSize, pageNo: pageNo, search: searchText }),
    );
  }, [isFocused, searchText]);

  function getStatusColor(action) {
    switch (action) {
      case '1':
        return Colors().aprroved;
      case '0':
        return Colors().red;

      default:
        return 'black';
    }
  }

  function getStatusText(status) {
    switch (status) {
      case '1':
        return 'Active';

      case '0':
        return 'Inactive';

      default:
        break;
    }
  }

  /* delete Document category delete with id */
  const deleteCategory = async categoryId => {
    try {
      const deleteResult = await dispatch(
        deleteCategoryById(categoryId),
      ).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setCategoryId('');

        dispatch(getCategory({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setCategoryId('');
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
        navigation.navigate('AddUpdateCategory', {
          edit_id: actionButton?.itemData?.id,
        });
        break;
      case 'delete':
        setDeleteModalVisible(true), setCategoryId(actionButton?.itemData?.id);
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
              key: 'category name',
              value: item?.category_name ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'Created by',
              value: item?.created_by_name ?? '--',
            },
          ]}
          status={[
            {
              key: 'action',
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
      getCategory({ pageSize: pageSize, pageNo: pageNo, search: searchText }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.ALL} ${label.CATEGORY}`} />
      <SearchBar setSearchText={setSearchText} />

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={listData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateCategory'}
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
          ConfirmBtnPress={() => deleteCategory(categoryId)}
        />
      )}
    </SafeAreaView>
  );
};

export default CategoryListScreen;
