/*    ----------------Created Date :: 19- Sep -2024   ----------------- */

import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import Toast from 'react-native-toast-message';
import CustomeCard from '../../../component/CustomeCard';
import { getAllBulkMessage } from '../../../redux/slices/contacts/all message/getBulkMessageListSlice';
import { deleteBulkMessageById } from '../../../redux/slices/contacts/all message/addUpdateBulkMessageSlice';
import List from '../../../component/List/List';

const AllBulkMessageListScreen = ({ navigation, route }) => {
  const type = route?.params?.type;
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listData = useSelector(state => state.getBulkMessageList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [messageId, setMessageId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getAllBulkMessage({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
          upcoming: type == 'upcoming' && true,
          status: type == 'upcoming' && 0,
        }),
      );
    });
    return unsubscribe;
  }, [isFocused, type]);

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 0:
        return Colors().red;
      case 1:
        return Colors().aprroved;

      default:
        return 'black';
    }
  }

  /*for getting the text of status*/
  function getStatusText(status) {
    switch (status) {
      case 0:
        return 'not sent';

      case 1:
        return 'sent';

      default:
        break;
    }
  }

  /* delete  message with id */
  const deleteMessage = async messageId => {
    try {
      const deleteResult = await dispatch(
        deleteBulkMessageById(messageId),
      ).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setMessageId('');
        dispatch(
          getAllBulkMessage({
            pageSize: pageSize,
            pageNo: pageNo,
            upcoming: type === 'upcoming' && true,
          }),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setMessageId('');
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
        navigation.navigate('CreateUpdateBulkMessageScreen', {
          edit_id: actionButton?.itemData?.id,
          reqBody: actionButton?.itemData?.users.map(itm => {
            return {
              id: itm?.id,
              value: itm?.name,
            };
          }),
        });
        break;
      case 'delete':
        setDeleteModalVisible(true), setMessageId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('BulkMessageDetailScreen', {
              id: item?.id,
            });
          }}>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'title',
                value: item?.title ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'message',
                value: item?.message ?? '--',
              },
              {
                key: 'date',
                value: item?.date ?? '--',
              },
            ]}
            status={[
              {
                key: 'status',
                value: getStatusText(item?.status),
                color: getStatusColor(item?.status),
              },
            ]}
            editButton={item?.status == 0 ? true : false}
            deleteButton={true}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getAllBulkMessage({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
        upcoming: type == 'upcoming' && true,
        status: type == 'upcoming' && 0,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <SearchBar setSearchText={setSearchText} />

      <View style={{ height: WINDOW_HEIGHT * 0.82, width: WINDOW_WIDTH }}>
        <List
          data={listData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={''}
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
          ConfirmBtnPress={() => deleteMessage(messageId)}
        />
      )}
    </SafeAreaView>
  );
};

export default AllBulkMessageListScreen;
