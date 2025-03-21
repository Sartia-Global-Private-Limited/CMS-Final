import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import AlertModal from '../../../component/AlertModal';
import IconType from '../../../constants/IconType';
import Toast from 'react-native-toast-message';
import {
  getClientContact,
  getCompanyContact,
  getDealerContact,
  getSupplierContact,
} from '../../../redux/slices/contacts/all contact/getContactListSlice';
import SearchBar from '../../../component/SearchBar';
import CustomeHeader from '../../../component/CustomeHeader';
import List from '../../../component/List/List';
import moment from 'moment';

const ContactListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getContactList);

  /*declare useState variable here */
  const [ModalVisible, setModalVisible] = useState(false);
  const [actionType, setActionType] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [contactId, setContactId] = useState('');
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      if (type == 'company') {
        dispatch(
          getCompanyContact({
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      }
      if (type == 'dealer') {
        dispatch(
          getDealerContact({
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      }
      if (type == 'super-admin') {
        dispatch(
          getSupplierContact({
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      }
      if (type == 'contractor') {
        dispatch(
          getClientContact({
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      }
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    if (type == 'company') {
      dispatch(
        getCompanyContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'dealer') {
      dispatch(
        getDealerContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'super-admin') {
      dispatch(
        getSupplierContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'contractor') {
      dispatch(
        getClientContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
  }, [searchText]);

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'reject':
        setActionType('reject');
        setModalVisible(true);
        setContactId(actionButton?.itemData?.admin_id);
        setUserType(actionButton?.itemData?.user_type);

        break;
      case 'approve':
        setActionType('approve');
        setModalVisible(true);
        setContactId(actionButton?.itemData?.admin_id);
        setUserType(actionButton?.itemData?.user_type);
        break;

      default:
        break;
    }
  };

  /* delete contact with id */
  const updateStatus = async (contactId, status, user_type) => {
    const body = {
      admin_id: contactId,
      status: status,
      user_type: user_type,
    };

    try {
      const deleteResult = await dispatch(changeContactStatus(body)).unwrap();
      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setModalVisible(false), setContactId('');
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setModalVisible(false), setContactId('');
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
  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          disabled={type !== 'company'}
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
                value: item?.name ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'email',
                value: typeof item?.email == 'string' ? item?.email : '--',
              },
              {
                key: 'Mobile',
                value: item?.contact_no ?? '--',
              },
              {
                key: 'Requested Date',
                value:
                  moment(item?.requested_date).format(
                    'DD/MM/YYYY || hh:mm:a',
                  ) ?? '--',
              },
            ]}
            status={[{key: ' ', value: ''}]}
            approveButton={true}
            rejectButton={true}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (type == 'company') {
      dispatch(
        getCompanyContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'dealer') {
      dispatch(
        getDealerContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'contractor') {
      dispatch(
        getClientContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      {/*Seacrh componenet */}
      <CustomeHeader headerTitle={`${type} Contact`} />
      <SearchBar setSearchText={setSearchText} />

      <View style={{height: WINDOW_HEIGHT * 0.92, width: WINDOW_WIDTH}}>
        <List
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={type == 'company' && 'AddUpdateContactScreen'}
        />
      </View>

      {ModalVisible && (
        <AlertModal
          visible={ModalVisible}
          iconName={actionType == 'reject' ? 'x-circle' : 'checkcircleo'}
          icontype={
            actionType == 'reject' ? IconType.Feather : IconType.AntDesign
          }
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO REJECT THIS!!'}
          cancelBtnPress={() => setModalVisible(!ModalVisible)}
          ConfirmBtnPress={() => {
            updateStatus(
              contactId,
              (status = actionType == 'reject' ? 0 : 1),
              userType,
            );
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default ContactListScreen;
const styles = StyleSheet.create({
  bankCard: {
    margin: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 6,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
