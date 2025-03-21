/*    ----------------Created Date :: 14- June -2024   ----------------- */

import { View, SafeAreaView, TouchableOpacity, Switch } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import NeumorphCard from '../../../component/NeumorphCard';
import CustomeCard from '../../../component/CustomeCard';
import Toast from 'react-native-toast-message';
import { getPurchaseOrderList } from '../../../redux/slices/purchase & sale/purchase-order/getPurchaseOrderListSlice';
import {
  deletePOById,
  updatePOStatus,
} from '../../../redux/slices/purchase & sale/purchase-order/addUpdatePurchaseOrderSlice';
import List from '../../../component/List/List';

const PurchaseOrderListScreen = ({ navigation, route }) => {
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getPurchaseOrderList);

  /*declare useState variable here */
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [poId, setPoId] = useState('');
  const [poStatus, setPoStatus] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getPurchaseOrderList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /* delete PO  function with  po id */
  const deletePO = async () => {
    const deleteResult = await dispatch(deletePOById(poId)).unwrap();

    if (deleteResult?.status === true) {
      Toast.show({
        type: 'success',
        text1: deleteResult?.message,
        position: 'bottom',
      });

      setDeleteModalVisible(false), setPoId('');
      dispatch(getPurchaseOrderList({ pageSize: pageSize, pageNo: pageNo }));
    } else {
      Toast.show({
        type: 'error',
        text1: deleteResult?.message,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setPoId('');
    }
  };

  /* function for updating the status of PO*/
  const upateStatus = async () => {
    const reqBody = {
      po_id: poId,
      status: poStatus,
    };

    const result = await dispatch(updatePOStatus(reqBody)).unwrap();
    if (result?.status) {
      setStatusModalVisible(false);
      setPoStatus('');
      setPoId('');
      dispatch(
        getPurchaseOrderList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setStatusModalVisible(false);
      setPoStatus('');
      setPoId('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpatePurchaseOrderScreen', {
          edit_id: actionButton?.itemData?.id,
        });
        break;
      case 'delete':
        setDeleteModalVisible(true), setPoId(actionButton?.itemData?.id);
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
          navigation.navigate('PurchaseOrderDetailScreen', {
            poId: item?.id,
          })
        }>
        <CustomeCard
          allData={item}
          avatarImage={item?.image}
          data={[
            {
              key: 'po number',
              value: item?.po_number,
              keyColor: Colors().skyBule,
            },
            { key: 'PO DATE', value: item?.po_date },
            { key: 'Regional office', value: item?.regional_office_name },
            {
              key: 'Po limit',
              value: `₹ ${item?.limit}`,
              keyColor: Colors().aprroved,
            },
            {
              key: 'used limit',
              value: `₹ ${item?.used_po_amount}`,
              keyColor: Colors().pending,
            },
            {
              key: 'Remaining limit',
              value: `₹ ${item?.remaining_po_amount}`,
              keyColor: Colors().red,
            },
            { key: 'cr number', value: item?.cr_number },
            { key: 'cr date', value: item?.cr_date },
          ]}
          status={[
            {
              key: 'status',
              component: (
                <NeumorphCard>
                  <View style={{ padding: 5 }}>
                    <Switch
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor={
                        item?.po_status === '2' ? '#f5dd4b' : '#f4f3f4'
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={val => {
                        setStatusModalVisible(true);
                        setPoId(item?.id);
                        setPoStatus(val == true ? '2' : '1');
                      }}
                      value={item?.po_status === '2' ? true : false}
                    />
                  </View>
                </NeumorphCard>
              ),
            },
          ]}
          editButton={true}
          deleteButton={true}
          action={handleAction}
        />
      </TouchableOpacity>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getPurchaseOrderList({ pageSize: pageSize, pageNo: pageNo }));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{ height: WINDOW_HEIGHT * 0.82, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpatePurchaseOrderScreen'}
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
          ConfirmBtnPress={() => deletePO()}
        />
      )}

      {statusModalVisible && (
        <>
          <AlertModal
            visible={statusModalVisible}
            iconName={'circle-edit-outline'}
            icontype={IconType.MaterialCommunityIcons}
            iconColor={Colors().edit}
            textToShow={'ARE YOU SURE YOU WANT update the status!!'}
            cancelBtnPress={() => {
              setStatusModalVisible(!statusModalVisible),
                setPoId(''),
                setPoStatus('');
            }}
            ConfirmBtnPress={() => upateStatus()}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default PurchaseOrderListScreen;
