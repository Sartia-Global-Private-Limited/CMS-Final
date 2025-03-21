/*    ----------------Created Date :: 5 - Oct  -2024   ----------------- */
import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import SeparatorComponent from '../../component/SeparatorComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import CustomeCard from '../../component/CustomeCard';
import List from '../../component/List/List';
import SearchBar from '../../component/SearchBar';
import {
  allContractorList,
  deleteContractorById,
} from '../../redux/slices/contractor/getAllContractorListSlice';
import AlertModal from '../../component/AlertModal';
import IconType from '../../constants/IconType';
import Toast from 'react-native-toast-message';

const AllContractorList = ({navigation, route}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.allContractor);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [orderViaId, setOrderViaId] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(
      allContractorList({
        search: searchText,
        pageNo: pageNo,
        pageSize: pageSize,
      }),
    );
  }, [isFocused, searchText]);

  const deleteContractor = async () => {
    try {
      const deleteResult = await dispatch(
        deleteContractorById(orderViaId),
      ).unwrap();

      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setOrderViaId('');
        dispatch(
          allContractorList({
            search: searchText,
            pageNo: pageNo,
            pageSize: pageSize,
          }),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setOrderViaId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setOrderViaId('');
    }
  };

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateContractorForm', {
          item: actionButton?.itemData,
        });
        break;
      case 'delete':
        setOrderViaId(actionButton?.itemData?.admin_id);
        setDeleteModalVisible(true);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ContractorDetails', {
            item: item,
          });
        }}>
        <CustomeCard
          avatarImage={item?.image}
          allData={item}
          data={[
            {
              key: 'Name',
              value: item?.name ?? '--',
            },
            {
              key: 'Email',
              value: item?.email ?? '--',
            },
            {
              key: 'Contact No.',
              value: item?.contact_no ?? '--',
            },
          ]}
          status={[
            {
              key: 'Status',
              value: item?.status == 1 ? 'Active' : 'INACTIVE',
              color: item?.status == 1 ? Colors().aprroved : Colors().rejected,
            },
          ]}
          editButton={true}
          deleteButton={true}
          action={handleAction}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={'Clint List'} />
      <SearchBar setSearchText={setSearchText} />

      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdateContractorForm'}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(allContractorList({pageSize: 8, pageNo: pageNo}));
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
          ConfirmBtnPress={() => deleteContractor()}
        />
      )}
    </SafeAreaView>
  );
};

export default AllContractorList;
