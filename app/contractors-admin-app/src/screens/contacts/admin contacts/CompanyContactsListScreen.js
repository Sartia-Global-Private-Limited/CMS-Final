import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import AlertModal from '../../../component/AlertModal';
import IconType from '../../../constants/IconType';
import Toast from 'react-native-toast-message';
import SearchBar from '../../../component/SearchBar';
import CustomeHeader from '../../../component/CustomeHeader';
import List from '../../../component/List/List';
import {getAdminCompanyContact} from '../../../redux/slices/contacts/admin contacts/getAdminContactListSlice';
import {deleteContactById} from '../../../redux/slices/contacts/admin contacts/addUpdateAdminContacts';

const CompanyContactsListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getAdminContactList);

  /*declare useState variable here */
  const [ModalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [contactId, setContactId] = useState('');
  const [userType, setUserType] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getAdminCompanyContact({
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
      getAdminCompanyContact({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [searchText]);

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateContactScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      case 'delete':
        setContactId(actionButton?.itemData?.id);
        setDeleteModalVisible(true);
        break;

      default:
        break;
    }
  };

  const deleteOrderVia = async () => {
    try {
      const deleteResult = await dispatch(
        deleteContactById(contactId),
      ).unwrap();

      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setContactId('');
        dispatch(
          getAdminCompanyContact({
            search: searchText,
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setContactId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setContactId('');
    }
  };

  /* flatlist render ui */
  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          // disabled={type !== 'company'}
          disabled={true}
          onPress={() => {
            navigation.navigate('ContactDetailScreen', {
              id: item?.id,
            });
          }}>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'name',
                value: `${item?.first_name} ${item?.last_name}` ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'Contact Unique Id',
                value: item?.contact_unique_id ?? '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'Company Name',
                value: item?.company_name ?? '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'Company Type Name',
                value: item?.company_type_name ?? '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'Position',
                value: item?.position ?? '--',
                keyColor: Colors().pureBlack,
              },
            ]}
            status={[
              {
                key: 'Status',
                value: item?.status == 1 ? 'Active' : 'InActive',
                color:
                  item?.status == 1 ? Colors().aprroved : Colors().rejected,
              },
            ]}
            deleteButton={true}
            editButton={true}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getAdminCompanyContact({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      {/*Seacrh componenet */}
      <CustomeHeader headerTitle={`Company Contact`} />
      <SearchBar setSearchText={setSearchText} />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={''}
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
          ConfirmBtnPress={() => deleteOrderVia()}
        />
      )}
    </SafeAreaView>
  );
};

export default CompanyContactsListScreen;
