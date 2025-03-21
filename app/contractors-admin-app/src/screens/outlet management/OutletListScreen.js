/*    ----------------Created Date :: 19- Sep -2024   ----------------- */
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
import { getOutletListWithCode } from '../../redux/slices/outlet management/getOutletListSlice';
import {
  approveAndRejectOutlet,
  deleteOutletById,
} from '../../redux/slices/outlet management/addUpdateOutletSlice';
import CustomeHeader from '../../component/CustomeHeader';
import List from '../../component/List/List';

const OutletListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getOutletList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [outletId, setOutletId] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getOutletListWithCode({
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
      getOutletListWithCode({
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
      case 1:
        return Colors().pending;
      case 2:
        return Colors().aprroved;
      case 3:
        return Colors().rejected;

      default:
        break;
    }
  };

  /*function for getting status text */
  const getStatusText = status => {
    switch (status) {
      case 1:
        return 'requested';
      case 2:
        return 'approved';
      case 3:
        return 'rejected';

      default:
        break;
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateOutletScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      case 'delete':
        setDeleteModalVisible(true);
        setOutletId(actionButton?.itemData?.id);

        break;
      case 'reject':
        setRejectModalVisible(true);
        setOutletId(actionButton?.itemData?.id);

        break;
      case 'approve':
        setApproveModalVisible(true);
        setOutletId(actionButton?.itemData?.id);

        break;

      default:
        break;
    }
  };

  /*Function  for approve  outlet*/
  const approveOfOutlet = async outletId => {
    const result = await dispatch(
      approveAndRejectOutlet({ status: 2, id: outletId }),
    ).unwrap();
    if (result?.status) {
      setApproveModalVisible(false);
      setOutletId('');
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setApproveModalVisible(false);
      setOutletId('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /*Function  for reject outlet*/
  const rejectOfOutlet = async outletId => {
    const result = await dispatch(
      approveAndRejectOutlet({ status: 3, id: outletId }),
    ).unwrap();
    if (result?.status) {
      setRejectModalVisible(false);
      setOutletId('');
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setRejectModalVisible(false);
      setOutletId('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /* delete outlet with id */
  const deleteOutlet = async outletId => {
    try {
      const deleteResult = await dispatch(deleteOutletById(outletId)).unwrap();

      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setOutletId('');
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setOutletId('');
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
            navigation.navigate('OutletDetailScreen', { edit_id: item?.id });
          }}>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'Outlet unique id',
                value: item?.outlet_unique_id ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'Outlet name',
                value: item?.outlet_name ?? '--',
                keyColor: Colors().skyBule,
              },

              {
                key: 'energy company',
                value: item?.energy_company_name ?? '--',
              },
              {
                key: 'zone',
                value: item?.zone_name ?? '--',
              },
              {
                key: 'Regional office',
                value: item?.regional_office_name ?? '--',
              },
              {
                key: 'Sales Area',
                value: item?.sales_area_name ?? '--',
              },
              {
                key: 'District',
                value: item?.district_name ?? '--',
              },
              {
                key: 'outlet category',
                value: item?.outlet_category ?? '--',
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
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getOutletListWithCode({
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
      <CustomeHeader headerTitle={`${type} Outlets`} />
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
          addAction={'AddUpdateOutletScreen'}
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
          ConfirmBtnPress={() => deleteOutlet(outletId)}
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
          ConfirmBtnPress={() => approveOfOutlet(outletId)}
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
          ConfirmBtnPress={() => rejectOfOutlet(outletId)}
        />
      )}
    </SafeAreaView>
  );
};

export default OutletListScreen;
