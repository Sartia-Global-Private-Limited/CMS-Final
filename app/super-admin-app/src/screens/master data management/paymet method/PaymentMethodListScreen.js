/*    ----------------Created Date :: 7- March -2024   ----------------- */
import {StyleSheet, View, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import CustomeHeader from '../../../component/CustomeHeader';
import Toast from 'react-native-toast-message';
import {getAllPayMethodList} from '../../../redux/slices/master-data-management/payment-method/getPayMethodListSlice';
import {deletePayMethodById} from '../../../redux/slices/master-data-management/payment-method/addUpdatePayMethodSlice';
import List from '../../../component/List/List';
import CustomeCard from '../../../component/CustomeCard';

const PaymentMethodListScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getPayMethodList);

  /*declare useState variable here */

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [payMethodId, setPayMethodId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(getAllPayMethodList({pageSize: pageSize, pageNo: pageNo}));
  }, [isFocused]);

  /*search function*/
  const searchFunction = searchvalue => {
    dispatch(getAllPayMethodList({search: searchvalue}));
  };

  const onSearchCancel = () => {
    dispatch(getAllPayMethodList({pageSize: pageSize, pageNo: pageNo}));
  };

  /* delete Stock request  function with id */
  const deletePayMethod = async () => {
    try {
      const deleteResult = await dispatch(
        deletePayMethodById(payMethodId),
      ).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setPayMethodId('');
        dispatch(getAllPayMethodList({pageSize: pageSize, pageNo: pageNo}));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setPayMethodId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setPayMethodId('');
    }
  };

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case '1':
        return Colors().aprroved;
      case '0':
        return Colors().red;

      default:
        return 'black';
    }
  }

  /*for getting the text of status*/
  function getStatusText(status) {
    switch (status) {
      case '1':
        return 'Active';

      case '0':
        return 'In active';

      default:
        break;
    }
  }

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdatePaymentMethodScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      case 'delete':
        setDeleteModalVisible(true);
        setPayMethodId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <CustomeCard
          avatarImage={item?.logo}
          allData={item}
          data={[
            {
              key: 'method',
              value: item?.method ?? '--',
              keyColor: Colors().skyBule,
            },
          ]}
          status={[
            {
              key: 'status',
              value: getStatusText(item?.status),
              color: getStatusColor(item?.status),
            },
          ]}
          editButton={true}
          deleteButton={true}
          action={handleAction}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`All payment method`} />
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdatePaymentMethodScreen'}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(
              getAllPayMethodList({
                pageSize: pageSize,
                pageNo: pageNo,
              }),
            );
          }}
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
          ConfirmBtnPress={() => deletePayMethod()}
        />
      )}
    </SafeAreaView>
  );
};

export default PaymentMethodListScreen;

const styles = StyleSheet.create({});
