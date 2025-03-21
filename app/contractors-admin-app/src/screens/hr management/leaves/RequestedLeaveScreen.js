import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { Icon } from '@rneui/base';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import SearchBar from '../../../component/SearchBar';
import { getAllLeaveList } from '../../../redux/slices/hr-management/leave/getLeaveListSlice';
import AlertModal from '../../../component/AlertModal';
import { updateLeaveStatus } from '../../../redux/slices/hr-management/leave/addUpdateLeaveSlice';
import ScreensLabel from '../../../constants/ScreensLabel';
import Toast from 'react-native-toast-message';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';

const RequestedLeaveScreen = ({ navigation }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const getLeaveListData = useSelector(state => state.getLeaveList);

  /*declare useState variable here */
  const [status, setStatus] = useState('');
  const [empId, setEmpId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [alertModalVisible, setAlertModalVisible] = useState(false);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getAllLeaveList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /*function for giveing color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'pending':
        return Colors().pending;
      case 'approved':
        return Colors().aprroved;
      case 'rejected':
        return Colors().rejected;

      default:
        return Colors().black2;
    }
  }

  /*  function for updating leave status  */
  const updateLeave = async () => {
    const reqbody = {
      id: empId,
      status: status,
    };

    try {
      const updateResult = await dispatch(updateLeaveStatus(reqbody)).unwrap();

      if (updateResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: updateResult?.message,
          position: 'bottom',
        });

        setAlertModalVisible(false), setEmpId(''), setStatus('');
        dispatch(getAllLeaveList({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        Toast.show({
          type: 'error',
          text1: updateResult?.message,
          position: 'bottom',
        });

        setAlertModalVisible(false), setEmpId(''), setStatus('');
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: error, position: 'bottom' });

      setAlertModalVisible(false), setEmpId(''), setStatus('');
    }
  };

  /* flatlist render ui  for table view*/
  const renderItem = ({ item }) => {
    if (item?.status === 'pending') {
      return (
        <View>
          <TouchableOpacity
            style={{}}
            onPress={() =>
              navigation.navigate('LeaveDetailScreen', {
                leaveData: item,
              })
            }>
            <CustomeCard
              allData={item}
              avatarImage={item?.user_image}
              data={[
                { key: 'EMPLOYEE NAME', value: item?.applicant_name },
                { key: 'EMPLOYEE Id ', value: item?.id },
                {
                  component: (
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          { color: Colors().pureBlack },
                        ]}>
                        start date :{' '}
                      </Text>
                      <Icon
                        name="calendar"
                        type={IconType.AntDesign}
                        color={Colors().aprroved}
                        size={20}
                      />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          { marginLeft: 5, color: Colors().pureBlack },
                        ]}>
                        {moment(item?.start_date).format('DD/MM/YYYY')}
                      </Text>
                    </View>
                  ),
                },
                {
                  component: (
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          { color: Colors().pureBlack },
                        ]}>
                        end date :{' '}
                      </Text>
                      <Icon
                        name="calendar"
                        type={IconType.AntDesign}
                        color={Colors().red}
                        size={20}
                      />
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          { marginLeft: 5, color: Colors().pureBlack },
                        ]}>
                        {moment(item?.end_date).format('DD/MM/YYYY')}
                      </Text>
                    </View>
                  ),
                },
                ...(item?.total_days || item?.total_hours
                  ? [
                      {
                        key: 'Duration',
                        value: `${item?.total_days} days ${item?.total_hours} hours`,
                      },
                    ]
                  : []),
                ...(item?.leave_type
                  ? [{ key: 'leave type', value: item?.leave_type }]
                  : []),
              ]}
              status={[
                {
                  key: 'status',
                  value: item?.status,
                  color: getStatusColor(item?.status),
                },
              ]}
              rejectButton={true}
              approveButton={true}
              action={handleAction}
            />
          </TouchableOpacity>
        </View>
      );
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'reject':
        setAlertModalVisible(true),
          setEmpId(actionButton?.itemData?.id),
          setStatus('rejected');
        break;

      case 'approve':
        setAlertModalVisible(true),
          setEmpId(actionButton?.itemData?.id),
          setStatus('approved');
        break;

      default:
        break;
    }
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getAllLeaveList({ pageSize: pageSize, pageNo: pageNo }));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <SearchBar setSearchText={setSearchText} />
      <View style={{ height: WINDOW_HEIGHT * 0.85, width: WINDOW_WIDTH }}>
        <List
          data={getLeaveListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateLeaveScreen'}
        />
      </View>

      {alertModalVisible && (
        <AlertModal
          visible={alertModalVisible}
          iconName={status === 'approved' ? 'checkcircleo' : 'closecircleo'}
          icontype={IconType.AntDesign}
          iconColor={status === 'approved' ? Colors().aprroved : Colors().red}
          textToShow={`ARE YOU SURE YOU WANT TO ${
            status === 'approved' ? ' APPROVE' : 'REJECT'
          } THIS!!`}
          cancelBtnPress={() => setAlertModalVisible(!alertModalVisible)}
          ConfirmBtnPress={() => updateLeave()}
        />
      )}
    </SafeAreaView>
  );
};

export default RequestedLeaveScreen;

const styles = StyleSheet.create({
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
