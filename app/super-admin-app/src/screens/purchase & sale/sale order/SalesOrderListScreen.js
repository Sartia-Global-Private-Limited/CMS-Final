/*    ----------------Created Date :: 13- Sep -2024   ----------------- */

import {View, SafeAreaView, TouchableOpacity, Switch} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ScreensLabel from '../../../constants/ScreensLabel';
import AlertModal from '../../../component/AlertModal';
import NeumorphCard from '../../../component/NeumorphCard';
import CustomeCard from '../../../component/CustomeCard';
import Toast from 'react-native-toast-message';
import {getAllSalesOrderList} from '../../../redux/slices/purchase & sale/sale-order/getSaleOrderListSlice';
import {
  deleteSOById,
  updateSOStatus,
} from '../../../redux/slices/purchase & sale/sale-order/addUpdateSaleOrderSlice';
import List from '../../../component/List/List';

const SalesOrderListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getSaleOrderList);

  /*declare useState variable here */
  const [statusModalVisible, setStatusModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [soId, setSoId] = useState('');
  const [soStatus, setSoStatus] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getAllSalesOrderList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /* delete PO  function with  so id */
  const deletePO = async () => {
    const deleteResult = await dispatch(deleteSOById(soId)).unwrap();
    if (deleteResult?.status === true) {
      Toast.show({
        type: 'success',
        text1: deleteResult?.message,
        position: 'bottom',
      });

      setDeleteModalVisible(false), setSoId('');
      dispatch(getAllSalesOrderList({pageSize: pageSize, pageNo: pageNo}));
    } else {
      Toast.show({
        type: 'error',
        text1: deleteResult?.message,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setSoId('');
    }
  };

  /* function for updating the status of PO*/
  const upateStatus = async () => {
    const reqBody = {
      so_id: soId,
      status: soStatus,
    };

    const result = await dispatch(updateSOStatus(reqBody)).unwrap();
    if (result?.status) {
      setStatusModalVisible(false);
      setSoStatus('');
      setSoId('');
      dispatch(
        getAllSalesOrderList({
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
      setSoStatus('');
      setSoId('');
      Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpateSalesOrderScreen', {
          edit_id: actionButton?.itemData?.id,
        });
        break;
      case 'delete':
        setDeleteModalVisible(true), setSoId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={{flex: 1}}
        onPress={() =>
          navigation.navigate('SalesOrderDetailScreen', {
            soId: item?.id,
          })
        }>
        <CustomeCard
          allData={item}
          avatarImage={item?.image}
          data={[
            {
              key: 'so number',
              value: item?.so_number ?? '--',
              keyColor: Colors().skyBule,
            },
            {key: 'sO DATE', value: item?.so_date},
            {
              key: ' Regional office',
              value: item?.regional_office_name ?? '--',
            },
            {
              key: 'so limit',
              value: `₹ ${item?.limit}` ?? '--',
              keyColor: Colors().aprroved,
            },
            {
              key: 'used limit',
              value: `	₹ ${item?.used_so_amount}` ?? '--',
              keyColor: Colors().pending,
            },
            {
              key: 'Remaining limit',
              value: `₹ ${item?.remaining_so_amount}` ?? '--',
              keyColor: Colors().red,
            },
            {key: 'cr number', value: item?.cr_number} ?? '--',
            {key: 'cr date', value: item?.cr_date} ?? '--',
          ]}
          status={[
            {
              key: 'status',
              component: (
                <NeumorphCard>
                  <View style={{padding: 5}}>
                    <Switch
                      trackColor={{false: '#767577', true: '#81b0ff'}}
                      thumbColor={
                        item?.so_status === '2' ? '#f5dd4b' : '#f4f3f4'
                      }
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={val => {
                        setStatusModalVisible(true);
                        setSoId(item?.id);

                        setSoStatus(val == true ? '2' : '1');
                      }}
                      value={item?.so_status === '2' ? true : false}
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
    dispatch(getAllSalesOrderList({pageSize: pageSize, pageNo: pageNo}));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <SearchBar setSearchText={setSearchText} />
      <View style={{height: WINDOW_HEIGHT * 0.82, width: WINDOW_WIDTH}}>
        <List
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpateSalesOrderScreen'}
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
                setSoId(''),
                setSoStatus('');
            }}
            ConfirmBtnPress={() => upateStatus()}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default SalesOrderListScreen;
