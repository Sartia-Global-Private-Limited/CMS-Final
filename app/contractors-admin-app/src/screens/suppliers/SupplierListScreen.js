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
import { getSupplierListWithCode } from '../../redux/slices/suppliers/getSupplierListSlice';
import SearchBar from '../../component/SearchBar';
import {
  approveAndRejectSuppliers,
  deleteSupplierById,
} from '../../redux/slices/suppliers/addUpdateSupplier';
import CustomeHeader from '../../component/CustomeHeader';
import List from '../../component/List/List';

const SupplierListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getSupplierList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [supplierId, setSupplierId] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getSupplierListWithCode({
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
      getSupplierListWithCode({
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
      case 'request':
        return Colors().pending;
      case 'approved':
        return Colors().aprroved;
      case 'rejected':
        return Colors().rejected;

      default:
        break;
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateSuplierScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      case 'delete':
        setDeleteModalVisible(true);
        setSupplierId(actionButton?.itemData?.id);

        break;
      case 'reject':
        setRejectModalVisible(true);
        setSupplierId(actionButton?.itemData?.id);

        break;
      case 'approve':
        setApproveModalVisible(true);
        setSupplierId(actionButton?.itemData?.id);

        break;

      default:
        break;
    }
  };

  /*Function  for approve  suppliers*/
  const approveOfSuppliers = async supplierId => {
    const result = await dispatch(
      approveAndRejectSuppliers({ status: 2, id: supplierId }),
    ).unwrap();
    if (result?.status) {
      setApproveModalVisible(false);
      setSupplierId('');
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setApproveModalVisible(false);
      setSupplierId('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /*Function  for reject suppliers*/
  const rejectOfSuppliers = async supplierId => {
    const result = await dispatch(
      approveAndRejectSuppliers({ status: 3, id: supplierId }),
    ).unwrap();
    if (result?.status) {
      setRejectModalVisible(false);
      setSupplierId('');
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setRejectModalVisible(false);
      setSupplierId('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /* delete supplier  with id */
  const deleteSupplier = async supplierId => {
    try {
      const deleteResult = await dispatch(
        deleteSupplierById(supplierId),
      ).unwrap();

      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setSupplierId('');
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setSupplierId('');
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
            navigation.navigate('SupplierDetailScreen', { edit_id: item?.id });
          }}>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'Supplier name',
                value: item?.supplier_name ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'owner name',
                value: item?.owner_name ?? '--',
              },
              {
                key: 'cashier name',
                value: item?.cashier_name ?? '--',
              },
              {
                key: 'bank name',
                value: item?.bank_name ?? '--',
              },

              {
                key: 'Account no',
                value: item?.account_number,
              },
              ...(type != 'requested'
                ? [
                    {
                      key: 'supplier code',
                      value: item?.supplier_code ?? '----',
                    },
                  ]
                : []),
            ]}
            status={[
              {
                key: 'status',
                value: item?.status,
                color: getStatusColor(item?.status),
              },
            ]}
            editButton={
              item?.status == 'request' || item?.status == 'approved'
                ? true
                : false
            }
            deleteButton={true}
            approveButton={item?.status == 'request' ? true : false}
            rejectButton={
              item?.status == 'request' || item?.status == 'approved'
                ? true
                : false
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
      getSupplierListWithCode({
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
      <CustomeHeader headerTitle={`${type} Suppliers`} />
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
          addAction={getStatusCode(type) == '' && 'AddUpdateSuplierScreen'}
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
          ConfirmBtnPress={() => deleteSupplier(supplierId)}
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
          ConfirmBtnPress={() => approveOfSuppliers(supplierId)}
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
          ConfirmBtnPress={() => rejectOfSuppliers(supplierId)}
        />
      )}
    </SafeAreaView>
  );
};

export default SupplierListScreen;
