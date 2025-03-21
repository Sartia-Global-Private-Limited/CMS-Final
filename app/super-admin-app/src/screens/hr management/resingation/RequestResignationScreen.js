/*    ----------------Created Date :: 12- Sep -2024    ----------------- */

import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import {getPendingResignationList} from '../../../redux/slices/hr-management/resignation/getPendingResignationSlice';
import moment from 'moment';
import {updateResignationStatus} from '../../../redux/slices/hr-management/resignation/addUpdateResignationSlice';
import List from '../../../component/List/List';
import CustomeCard from '../../../component/CustomeCard';

const RequestResignationScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const pendignResignatioData = useSelector(
    state => state.getPendingResignation,
  );

  /*declare useState variable here */
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [resignationId, setResignationId] = useState('');

  useEffect(() => {
    dispatch(getPendingResignationList());
  }, [isFocused]);

  /*  function for updating laon status  with id */
  const updateLoanStatuFunction = async (resignationId, statusId) => {
    try {
      const updateResult = await dispatch(
        updateResignationStatus({resignationId, statusId}),
      ).unwrap();

      if (updateResult?.status === true) {
        ToastAndroid.show(updateResult?.message, ToastAndroid.LONG);
        setRejectModalVisible(false), setResignationId('');
        setApproveModalVisible(false), setResignationId('');
        dispatch(getPendingResignationList());
      } else {
        ToastAndroid.show(updateResult?.message, ToastAndroid.LONG);
        setRejectModalVisible(false), setResignationId('');
        setApproveModalVisible(false), setResignationId('');
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setRejectModalVisible(false), setResignationId('');
      setApproveModalVisible(false), setResignationId('');
    }
  };

  /*function for giveing color of status*/
  function getStatusColor(action) {
    switch (action) {
      case '0':
        return Colors().pending;
      case '1':
        return Colors().aprroved;
      case '2':
        return Colors().rejected;

      default:
        return Colors().black2;
    }
  }

  /*function for giveing text of status*/
  function getStatusText(action) {
    switch (action) {
      case '0':
        return 'pending';
      case '1':
        return 'approved';
      case '2':
        return 'rejected';
      default:
        return 'black';
    }
  }

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateResignationScreen', {
          editData: actionButton?.itemData,
        });
        break;

      case 'reject':
        setRejectModalVisible(true),
          setResignationId(actionButton?.itemData?.id);
        break;

      case 'approve':
        setApproveModalVisible(true),
          setResignationId(actionButton?.itemData?.id);
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
          navigation.navigate('ResignationDetailScreen', {
            resignationData: item,
          })
        }>
        <CustomeCard
          avatarImage={item?.image}
          allData={item}
          data={[
            {
              key: 'employee name',
              value: item?.user_name ?? '--',
            },
            {
              key: 'RESIGNATION DATE',
              value:
                `${moment(item?.resignation_date).format('DD/MM/YYYY')}` ??
                '--',
            },
            {
              key: 'LAST DAY OF WORK',
              value:
                `${moment(item?.last_working_day).format('DD/MM/YYYY dddd')}` ??
                '--',
            },
          ]}
          status={[
            {
              key: 'Status',
              value: getStatusText(item?.resignation_status),
              color: getStatusColor(item?.resignation_status),
            },
          ]}
          action={handleAction}
          editButton={true}
          approveButton={true}
          rejectButton={true}
        />
      </TouchableOpacity>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getPendingResignationList({pageSize: pageSize, pageNo: pageNo}));
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <View style={{height: WINDOW_HEIGHT * 0.92, width: WINDOW_WIDTH}}>
        <List
          data={pendignResignatioData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateResignationScreen'}
        />
      </View>

      {/* modal view for ACTION */}
      {rejectModalVisible && (
        <AlertModal
          visible={rejectModalVisible}
          iconName={'closecircleo'}
          icontype={IconType.AntDesign}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO REJECT THIS!!'}
          cancelBtnPress={() => setRejectModalVisible(!rejectModalVisible)}
          ConfirmBtnPress={() => updateLoanStatuFunction(resignationId, 2)}
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
          ConfirmBtnPress={() => updateLoanStatuFunction(resignationId, 1)}
        />
      )}
    </SafeAreaView>
  );
};

export default RequestResignationScreen;
