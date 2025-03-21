import {View, SafeAreaView, Pressable} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeHeader from '../../../component/CustomeHeader';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';
import SearchBar from '../../../component/SearchBar';
import AlertModal from '../../../component/AlertModal';
import IconType from '../../../constants/IconType';
import {allAdminOutletsList} from '../../../redux/slices/energyCompany/outlets/getAdminOutletListSlice';
import Toast from 'react-native-toast-message';
import {
  approveAndRejectOutlet,
  deleteOutletById,
} from '../../../redux/slices/energyCompany/outlets/AddUpdateAdminOutlets';

const AdminOutletListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const status = route?.params?.type;
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.allAdminOutlets);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [outletId, setOutletId] = useState('');

  useEffect(() => {
    try {
      dispatch(
        allAdminOutletsList({
          search: searchText,
          pageNo: pageNo,
          pageSize: pageSize,
          status: status,
        }),
      );
    } catch (error) {
      console.log('error', error);
    }
  }, [isFocused, searchText]);

  function getStatusColor(action) {
    switch (action) {
      case 2:
        return Colors().rejected;
      case 1:
        return Colors().aprroved;
      default:
        return 'black';
    }
  }

  function getStatus(action) {
    switch (action) {
      case 2:
        return 'INACTIVE';
      case 1:
        return 'ACTIVE';
      default:
        return '';
    }
  }
  const HeaderTitle = action => {
    switch (action) {
      case 1:
        return 'REQUESTED';
      case 2:
        return 'APPROVED';
      case 3:
        return 'REJECTED';
      case '':
        return '360 View';
    }
  };

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
    try {
      const result = await dispatch(
        approveAndRejectOutlet({status: 2, id: outletId}),
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
        Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  /*Function  for reject outlet*/
  const rejectOfOutlet = async outletId => {
    const result = await dispatch(
      approveAndRejectOutlet({status: 3, id: outletId}),
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
      Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
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
  const renderItem = ({item}) => {
    return (
      <Pressable
        style={{}}
        onPress={() => {
          navigation.navigate('OutletDetailScreen', {
            edit_id: item?.id,
          });
        }}>
        <CustomeCard
          avatarImage={item?.logo}
          allData={item}
          data={[
            {
              key: 'Id',
              value: item?.id ?? '--',
            },
            {
              key: 'Outlet Name',
              value: item?.outlet_name ?? '--',
            },
            {
              key: 'District Name',
              value: item?.district_name ?? '--',
            },
            {
              key: 'Sales Area Name',
              value: item?.sales_area_name ?? '--',
            },
            {
              key: 'RO Name',
              value: item?.regional_office_name ?? '--',
            },
            {
              key: 'Zone Name',
              value: item?.zone_name ?? '--',
            },
            {
              key: 'EC Name',
              value: item?.energy_company_name ?? '--',
            },
          ]}
          status={[
            {
              key: 'Status',
              value: getStatus(item?.status),
              color: getStatusColor(item?.status),
            },
          ]}
          editButton={status == 3 ? false : true}
          deleteButton={status == 3 ? false : true}
          approveButton={status == 1 ? true : false}
          rejectButton={status == 3 ? false : true}
          action={handleAction}
        />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${HeaderTitle(status)} Outlets`} />
      <SearchBar setSearchText={setSearchText} />

      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdateOutletScreen'}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(
              allAdminOutletsList({
                search: searchText,
                pageNo: pageNo,
                pageSize: pageSize,
                status: status,
              }),
            );
          }}
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

export default AdminOutletListScreen;
