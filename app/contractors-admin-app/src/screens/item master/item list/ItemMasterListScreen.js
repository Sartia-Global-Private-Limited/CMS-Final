/*    ----------------Created Date :: 19- Sep -2024   ----------------- */
import { View, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import AlertModal from '../../../component/AlertModal';
import IconType from '../../../constants/IconType';
import Toast from 'react-native-toast-message';
import SearchBar from '../../../component/SearchBar';
import { getItemMasterListWithCategory } from '../../../redux/slices/item master/item master/getItemMasterListSlice';
import { deleteItemMasterItemById } from '../../../redux/slices/item master/item master/addUpdateItemMasterListSlice';
import CustomeHeader from '../../../component/CustomeHeader';
import List from '../../../component/List/List';

const ItemMasterListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;
  const subtype = route?.params?.subtype;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getItemMasterList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [itemId, setItemId] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getItemMasterListWithCategory({
          category: getCategory(type),
          status: getStatus(subtype),
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    });

    return unsubscribe;
  }, [type, isFocused, subtype]);

  useEffect(() => {
    dispatch(
      getItemMasterListWithCategory({
        category: getCategory(type),
        status: getStatus(subtype),
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [searchText]);

  // function for category //
  const getCategory = status => {
    switch (status) {
      case 'fund':
        return 'fund';
        break;
      case 'stock':
        return 'stock';
        break;
      case 'all':
        return '';
        break;

      default:
        break;
    }
  };

  const getStatus = status => {
    switch (status) {
      case 'pending':
        return 0;
        break;

      case 'approved':
        return 1;
        break;

      case 'rejected':
        return 2;
        break;

      default:
        return;
        break;
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateItemMasterScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      case 'delete':
        setDeleteModalVisible(true);
        setItemId(actionButton?.itemData?.id);

        break;

      default:
        break;
    }
  };

  /* delete item with id */
  const deleteItem = async itemId => {
    try {
      const deleteResult = await dispatch(
        deleteItemMasterItemById(itemId),
      ).unwrap();

      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setItemId('');
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setItemId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <CustomeCard
          avatarImage={item?.image}
          allData={item}
          data={[
            {
              key: 'name',
              value: item?.name ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'Hsn code',
              value: item?.hsncode ?? '--',
            },
            {
              key: 'supplier name',
              value: item?.supplier_name ?? '--',
            },
            {
              key: 'unit',
              value: item?.unit_name ?? '--',
            },
          ]}
          status={[
            {
              key: 'unit',
              value: item?.unit_name ?? '--',
              color: Colors().pending,
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
      getItemMasterListWithCategory({
        category: getCategory(type),
        status: getStatus(subtype),
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      {type === 'all' && <CustomeHeader headerTitle={`All Items`} />}
      <SearchBar setSearchText={setSearchText} />

      <View
        style={{
          height: type === 'all' ? WINDOW_HEIGHT * 0.9 : WINDOW_HEIGHT * 0.85,
          width: WINDOW_WIDTH,
        }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateItemMasterScreen'}
        />
      </View>

      {deleteModalVisible && (
        <AlertModal
          visible={deleteModalVisible}
          iconName={'delete-circle-outline'}
          icontype={IconType.MaterialCommunityIcons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO DELETE THIS!!'}
          cancelBtnPress={() => setDeleteModalVisible(!deleteModalVisible)}
          ConfirmBtnPress={() => deleteItem(itemId)}
        />
      )}
    </SafeAreaView>
  );
};

export default ItemMasterListScreen;
