import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import moment from 'moment';
import AlertModal from '../../../component/AlertModal';
import IconType from '../../../constants/IconType';
import Toast from 'react-native-toast-message';
import {
  geActiveLoanList,
  getClosedLoanList,
  getPendingLoanList,
  getRejectedLoanList,
} from '../../../redux/slices/hr-management/loan/getLoanListSlice';
import {updateLoanStatus} from '../../../redux/slices/hr-management/loan/addUpdateLoanSlice';
import List from '../../../component/List/List';

const LoanListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getLoanList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [closeModalVisible, setCloseModalVisible] = useState(false);
  const [loanId, setLoanId] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      if (type == 'pending') {
        dispatch(getPendingLoanList());
      }
      if (type == 'active') {
        dispatch(geActiveLoanList());
      }
      if (type == 'reject') {
        dispatch(getRejectedLoanList());
      }
      if (type == 'closed') {
        dispatch(getClosedLoanList());
      }
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    if (type == 'pending') {
      dispatch(getPendingLoanList());
    }
    if (type == 'active') {
      dispatch(geActiveLoanList());
    }
    if (type == 'reject') {
      dispatch(getRejectedLoanList());
    }
    if (type == 'closed') {
      dispatch(getClosedLoanList());
    }
  }, []);

  /*function for giveing color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'pending':
        return Colors().pending;
      case 'active':
        return Colors().aprroved;
      case 'reject':
        return Colors().rejected;
      case 'closed':
        return Colors().red;

      default:
        return Colors().black2;
    }
  }

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateLoanScreen', {
          editData: actionButton?.itemData,
        });
        break;
      case 'reject':
        setRejectModalVisible(true), setLoanId(actionButton?.itemData?.id);
        break;
      case 'approve':
        setApproveModalVisible(true), setLoanId(actionButton?.itemData?.id);
        break;

      case 'discard':
        setCloseModalVisible(true), setLoanId(actionButton?.itemData?.id);
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
          navigation.navigate('LoandDetailScreen', {
            loanData: item,
          })
        }>
        <CustomeCard
          avatarImage={item?.image}
          allData={item}
          data={[
            {key: 'employee name', value: item?.name ?? '--'},
            {key: 'loan type', value: item?.loan_type ?? '--'},
            {key: 'LOAn term ', value: item?.loan_term ?? '--'},
            {
              key: 'LOAN amount',
              value: `₹ ${item?.loan_amount}` ?? '--',
              keyColor: Colors().aprroved,
            },
            ...(type !== 'pending'
              ? [
                  {
                    key: `${type} date`,
                    value: `${moment(item?.loan_status_changed_date).format(
                      'DD/MM/YYYY hh:mm A',
                    )}
                    `,
                  },
                ]
              : []),
            ...(type !== 'pending'
              ? [
                  {
                    key: `${type} by`,
                    value: item?.loan_status_changed_by,
                  },
                ]
              : []),
          ]}
          status={[
            {
              key: 'status',
              value: item?.status,
              color: getStatusColor(item?.status),
            },
          ]}
          editButton={type == 'pending'}
          rejectButton={type == 'pending'}
          approveButton={type == 'pending'}
          discardButton={type == 'active'}
          action={handleAction}
        />
      </TouchableOpacity>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (type == 'pending') {
      dispatch(getPendingLoanList());
    }
    if (type == 'active') {
      dispatch(geActiveLoanList());
    }
    if (type == 'reject') {
      dispatch(getRejectedLoanList());
    }
    if (type == 'closed') {
      dispatch(getClosedLoanList());
    }
  };

  /*  function for updating laon status  with id */
  const updateLoanStatuFunction = async (loanid, status) => {
    const sData = {
      id: loanid,
      status: status,
    };

    try {
      const updateResult = await dispatch(updateLoanStatus(sData)).unwrap();
      if (updateResult?.status === true) {
        Toast.show({
          type: 'success',
          position: 'bottom',
          text1: updateResult?.message,
        });
        setRejectModalVisible(false);
        setApproveModalVisible(false);
        setCloseModalVisible(false);
        setLoanId('');
        // dispatch(getPendingLoanList());
      } else {
        Toast.show({
          type: 'error',
          position: 'bottom',
          text1: updateResult?.message,
        });
        setRejectModalVisible(false);
        setApproveModalVisible(false);
        setCloseModalVisible(false);
        setLoanId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        position: 'bottom',
        text1: updateResult?.message,
      });
      setRejectModalVisible(false);
      setApproveModalVisible(false);
      setCloseModalVisible(false);
      setLoanId('');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <View style={{height: WINDOW_HEIGHT * 0.92, width: WINDOW_WIDTH}}>
        <List
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateLoanScreen'}
        />
      </View>

      {closeModalVisible && (
        <AlertModal
          visible={closeModalVisible}
          iconName={'prohibited'}
          icontype={IconType.Foundation}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO CLOSE THIS!!'}
          cancelBtnPress={() => setCloseModalVisible(!closeModalVisible)}
          ConfirmBtnPress={() => updateLoanStatuFunction(loanId, 'closed')}
        />
      )}

      {rejectModalVisible && (
        <AlertModal
          visible={rejectModalVisible}
          iconName={'closecircleo'}
          icontype={IconType.AntDesign}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO REJECT THIS!!'}
          cancelBtnPress={() => setRejectModalVisible(!rejectModalVisible)}
          ConfirmBtnPress={() => updateLoanStatuFunction(loanId, 'reject')}
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
          ConfirmBtnPress={() => updateLoanStatuFunction(loanId, 'active')}
        />
      )}
    </SafeAreaView>
  );
};

export default LoanListScreen;
