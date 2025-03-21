/*    ----------------Created Date :: 5 - sep  -2024   ----------------- */
import {View, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import CustomeHeader from '../../../component/CustomeHeader';
import Toast from 'react-native-toast-message';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';
import {
  deleteOrderViaById,
  orderViaList,
} from '../../../redux/slices/order-via/orderViaSlice';

const OrderViaListScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.orderVia);

  /*declare useState variable here */

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [pageNo, setPageNo] = useState('');
  const [orderViaId, setOrderViaId] = useState('');

  useEffect(() => {
    dispatch(orderViaList());
    // getOrderList();
  }, [isFocused]);

  /* delete Stock request  function with id */
  const deleteOrderVia = async () => {
    try {
      const deleteResult = await dispatch(
        deleteOrderViaById(orderViaId),
      ).unwrap();

      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setOrderViaId('');
        dispatch(orderViaList());
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
        navigation.navigate('AddUpdateOrderViaScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      case 'delete':
        setOrderViaId(actionButton?.itemData?.id);
        setDeleteModalVisible(true);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <CustomeCard
        avatarImage={item?.logo}
        allData={item}
        data={[
          {
            key: 'oreder Via',
            value: item?.order_via ?? '--',
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
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`Order via`} />

      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdateOrderViaScreen'}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(orderViaList({pageSize: 8, pageNo: pageNo}));
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
          ConfirmBtnPress={() => deleteOrderVia()}
        />
      )}
    </SafeAreaView>
  );
};

export default OrderViaListScreen;
