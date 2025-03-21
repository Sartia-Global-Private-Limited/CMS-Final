/*    ----------------Created Date :: 13- sep -2024   ----------------- */
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../component/CustomeCard';
import AlertModal from '../../component/AlertModal';
import IconType from '../../constants/IconType';
import Toast from 'react-native-toast-message';
import SearchBar from '../../component/SearchBar';
import { getQuotationListWithCode } from '../../redux/slices/work-quotation/getWorkQuotationListSlice';
import {
  approveAndRejectWorkQuotation,
  deleteQuotationById,
} from '../../redux/slices/work-quotation/addUpdateQuotationSlice';
import CustomeHeader from '../../component/CustomeHeader';
import List from '../../component/List/List';

const WorkQuotationListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getWorkQuotationList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [quotationId, setQuotationId] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getQuotationListWithCode({
          status: getStatusCode(type),
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
      getQuotationListWithCode({
        status: getStatusCode(type),
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [searchText]);

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

  /*function for getting status Text */
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

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateWorkQuotationScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      case 'delete':
        setDeleteModalVisible(true);
        setQuotationId(actionButton?.itemData?.id);

        break;
      case 'reject':
        setRejectModalVisible(true);
        setQuotationId(actionButton?.itemData?.id);

        break;
      case 'approve':
        setApproveModalVisible(true);
        setQuotationId(actionButton?.itemData?.id);

        break;

      default:
        break;
    }
  };

  /*Function  for approve quotation */
  const approveOfQuotation = async quotationId => {
    const result = await dispatch(
      approveAndRejectWorkQuotation({ status: 2, id: quotationId }),
    ).unwrap();
    if (result?.status) {
      setApproveModalVisible(false);
      setQuotationId('');
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setApproveModalVisible(false);
      setQuotationId('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /*Function  for reject quotation*/
  const rejectOfQuotation = async quotationId => {
    const result = await dispatch(
      approveAndRejectWorkQuotation({ status: 3, id: quotationId }),
    ).unwrap();
    if (result?.status) {
      setRejectModalVisible(false);
      setQuotationId('');
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setRejectModalVisible(false);
      setQuotationId('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /* delete quoutation  with id */
  const deleteQuotation = async quotationId => {
    try {
      const deleteResult = await dispatch(
        deleteQuotationById(quotationId),
      ).unwrap();

      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setQuotationId('');
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setQuotationId('');
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
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('QuotationDetailScreen', {
              id: item?.id,
            });
          }}>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'quotation date',
                value: item?.quotation_dates ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'quotation no',
                value: item?.quotations_number ?? '--',
              },
              {
                key: 'Regional office',
                value: item?.regional_office_name ?? '--',
              },
              {
                key: 'sales area',
                value: item?.sales_area_name ?? '--',
              },

              {
                key: 'Outlet name',
                value: item?.outlet_name ?? '--',
              },

              {
                key: 'po',
                value: item?.po_name ?? '--',
              },

              {
                key: 'complaint type',
                value: item?.complaint_type ?? '--',
              },
            ]}
            status={[
              {
                key: 'status',
                value: getStatusText(item?.status),
                color: getStatusColor(item?.status),
              },
            ]}
            editButton={
              item?.status == '1' || item?.status == '2' ? true : false
            }
            deleteButton={true}
            approveButton={item?.status == '1' ? true : false}
            rejectButton={
              item?.status == '1' || item?.status == '2' ? true : false
            }
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getQuotationListWithCode({
        status: getStatusCode(type),
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${type} Quotation`} />
      <SearchBar setSearchText={setSearchText} />
      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={
            getStatusCode(type) == '' && 'AddUpdateWorkQuotationScreen'
          }
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
          ConfirmBtnPress={() => deleteQuotation(quotationId)}
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
          ConfirmBtnPress={() => approveOfQuotation(quotationId)}
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
          ConfirmBtnPress={() => rejectOfQuotation(quotationId)}
        />
      )}
    </SafeAreaView>
  );
};

export default WorkQuotationListScreen;
