/*    ----------------Created Date :: 5 - Sep -2024   ----------------- */

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeHeader from '../../../component/CustomeHeader';
import Toast from 'react-native-toast-message';
import { getAllAccountList } from '../../../redux/slices/master-data-management/account-mangement/getAccountListSlice';
import AlertModal from '../../../component/AlertModal';
import { deleteAccountById } from '../../../redux/slices/master-data-management/account-mangement/addUpdateAccountSlice';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';

const AccountListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getAccountList);

  /*declare useState variable here */

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);

  const [accountId, setAccountId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getAllAccountList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /* delete Stock request  function with id */
  const deleteAccount = async () => {
    try {
      const deleteResult = await dispatch(
        deleteAccountById(accountId),
      ).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setAccountId('');
        dispatch(getAllAccountList({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setAccountId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setAccountId('');
    }
  };

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateAcoountScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      case 'delete':
        setDeleteModalVisible(true);
        setAccountId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles?.cardContainer}
        onPress={() =>
          navigation.navigate('AccountDetailScreen', {
            edit_id: item?.id,
          })
        }>
        <CustomeCard
          avatarImage={item?.logo}
          allData={item}
          data={[
            {
              key: 'Bank name',
              value: item?.bank_name ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'Holder Name',
              value: item?.account_holder_name ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'account number',
              component: (
                <Text
                  numberOfLines={2}
                  onPress={() => Linking.openURL(item?.website)}
                  ellipsizeMode="tail"
                  style={[styles.cardtext, { color: Colors().purple }]}>
                  {item?.account_number}
                </Text>
              ),
            },
            {
              key: 'branch',
              value: item?.branch ?? '--',
            },
          ]}
          status={[]}
          editButton={true}
          deleteButton={true}
          action={handleAction}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`Account Mangement `} />
      <View style={{ flexDirection: 'row' }}>
        <SearchBar setSearchText={setSearchText} />
      </View>
      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          addAction={'AddUpdateAcoountScreen'}
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(
              getAllAccountList({
                pageSize: pageSize,
                pageNo: pageNo,
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
          ConfirmBtnPress={() => deleteAccount()}
        />
      )}
    </SafeAreaView>
  );
};

export default AccountListScreen;

const styles = StyleSheet.create({
  cardContainer: {
    width: WINDOW_WIDTH,
    height: 'auto',
    alignSelf: 'center',
  },
  cardtext: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
