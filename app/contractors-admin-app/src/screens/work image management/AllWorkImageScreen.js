import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import CustomeHeader from '../../component/CustomeHeader';
import SearchBar from '../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useDispatch, useSelector } from 'react-redux';
import AlertModal from '../../component/AlertModal';
import { getAllWorkImages } from '../../redux/slices/work-images-mangement/getAllWorkImageListSlice';
import {
  approveAndRejectWorkImage,
  deleteWorkImageById,
} from '../../redux/slices/work-images-mangement/addUpdateWorkImageSlice';
import Toast from 'react-native-toast-message';
import CustomeCard from '../../component/CustomeCard';
import List from '../../component/List/List';
import { useIsFocused } from '@react-navigation/native';

const AllWorkImageScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const listData = useSelector(state => state.getAllWorkImageList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [workImageId, setWorkImageId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getAllWorkImages({
        pageSize: pageSize,
        pageNo: pageNo,
        status: getStatusCode(type),
      }),
    );
  }, [searchText, type]);

  // function for status code//
  const getStatusCode = status => {
    switch (status) {
      case 'requested':
        return 1;
      case 'approved':
        return 2;
      case 'reject':
        return 3;
      case 'all':
        return '';

      default:
        break;
    }
  };

  /*function for getting status color */
  const getStatusColor = status => {
    switch (status) {
      case '1':
        return Colors().pending;
      case '2':
        return Colors().aprroved;
      case '3':
        return Colors().rejected;

      default:
        break;
    }
  };

  /*function for getting status text */
  const getStatusText = status => {
    switch (status) {
      case '1':
        return 'requested';
      case '2':
        return 'approved';
      case '3':
        return 'rejected';
      default:
        break;
    }
  };

  /*Function  for approve  outlet*/
  const approveOfWorkImage = async Id => {
    const result = await dispatch(
      approveAndRejectWorkImage({ id: Id, status: 2 }),
    ).unwrap();
    if (result?.status) {
      setApproveModalVisible(false);
      setWorkImageId('');
      dispatch(
        getAllWorkImages({
          pageSize: pageSize,
          pageNo: pageNo,
          status: getStatusCode(type),
        }),
      );
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setApproveModalVisible(false);
      setWorkImageId('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /*Function  for reject outlet*/
  const rejectOfWorkImage = async Id => {
    const result = await dispatch(
      approveAndRejectWorkImage({ id: Id, status: 3 }),
    ).unwrap();
    if (result?.status) {
      setRejectModalVisible(false);
      setWorkImageId('');
      dispatch(
        getAllWorkImages({
          pageSize: pageSize,
          pageNo: pageNo,
          status: getStatusCode(type),
        }),
      );
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setRejectModalVisible(false);
      setWorkImageId('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /* delete my company function with id */
  const deleteWork = async workId => {
    try {
      const deleteResult = await dispatch(deleteWorkImageById(workId)).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setWorkImageId('');

        dispatch(
          getAllWorkImages({
            pageSize: pageSize,
            pageNo: pageNo,
            status: getStatusCode(type),
          }),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setWorkImageId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateWorkImageScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      case 'delete':
        setDeleteModalVisible(true);
        setWorkImageId(actionButton?.itemData?.id);

        break;
      case 'reject':
        setRejectModalVisible(true);
        setWorkImageId(actionButton?.itemData?.id);

        break;
      case 'approve':
        setApproveModalVisible(true);
        setWorkImageId(actionButton?.itemData?.id);

        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('AddUpdateWorkImageScreen', {
            edit_id: item?.id,
            type: 'view',
          })
        }>
        <CustomeCard
          allData={item}
          data={[
            {
              key: 'COMPLAINT ID',
              value: item?.complaint_unique_id ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'COMPLAINT TYPE',
              value: item?.complaint_type_name ?? '--',
              keyColor: Colors().skyBule,
            },

            {
              key: 'IMAGE UPLOAD BY',
              value: item?.image_upload_by_name ?? '--',
            },
          ]}
          status={[
            {
              key: 'status',
              value: getStatusText(item?.status),
              color: getStatusColor(item?.status),
            },
          ]}
          editButton={item?.status == 1 || item?.status == 2 ? true : false}
          deleteButton={true}
          approveButton={item?.status == 1 ? true : false}
          rejectButton={item?.status == 1 || item?.status == 2 ? true : false}
          action={handleAction}
        />
      </TouchableOpacity>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getAllWorkImages({
        pageSize: pageSize,
        pageNo: pageNo,
        status: getStatusCode(type),
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${type} Work Images`} />
      <SearchBar setSearchText={setSearchText} />
      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={listData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateWorkImageScreen'}
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
          ConfirmBtnPress={() => deleteWork(workImageId)}
        />
      )}
      {approveModalVisible && (
        <AlertModal
          visible={approveModalVisible}
          iconName={'checkcircleo'}
          icontype={IconType.AntDesign}
          iconColor={Colors().aprroved}
          textToShow={'ARE YOU SURE YOU WANT TO APPROVE THIS!!'}
          cancelBtnPress={() => setApproveModalVisible(!approveModalVisible)}
          ConfirmBtnPress={() => approveOfWorkImage(workImageId)}
        />
      )}
      {rejectModalVisible && (
        <AlertModal
          visible={rejectModalVisible}
          iconName={'closecircleo'}
          icontype={IconType.AntDesign}
          iconColor={Colors().rejected}
          textToShow={'ARE YOU SURE YOU WANT TO REJECT THIS!!'}
          cancelBtnPress={() => setRejectModalVisible(!rejectModalVisible)}
          ConfirmBtnPress={() => {
            rejectOfWorkImage(workImageId);
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default AllWorkImageScreen;

const styles = StyleSheet.create({});
