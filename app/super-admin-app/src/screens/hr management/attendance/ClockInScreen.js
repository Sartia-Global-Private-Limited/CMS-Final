import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import FloatingAddButton from '../../../component/FloatingAddButton';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import {getClockedInUserList} from '../../../redux/slices/hr-management/attendance/getClockInSlice';
import CustomeCard from '../../../component/CustomeCard';
import {updateAttendanceStatus} from '../../../redux/slices/hr-management/attendance/addUpdateAttendanceSlice';
import Toast from 'react-native-toast-message';

const ClockInScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const clockedInUserListData = useSelector(state => state.getClockIn);

  /*declare useState variable here */

  useEffect(() => {
    dispatch(getClockedInUserList());
  }, [isFocused]);

  /* function for pull down to refresh */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getClockedInUserList());

      setRefreshing(false);
    }, 2000);
  }, []);

  /* update attendance  function with  emp id */
  const updateAttendance = async empId => {
    const reqbody = {
      id: empId,
      type: 'clock out',
    };

    try {
      const result = await dispatch(updateAttendanceStatus(reqbody)).unwrap();

      if (result?.status) {
        Toast.show({
          type: 'success',
          text1: result?.message,
          position: 'bottom',
        });

        dispatch(getClockedInUserList());
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'clockout':
        updateAttendance(actionButton?.itemData?.id);
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
          allData={item}
          avatarImage={item?.user_image}
          data={[
            {key: 'EMPLOYEE NAME', value: item?.user_name},
            {key: 'date', value: item?.date},
          ]}
          status={[
            {
              key: 'time',
              value: item?.status,
              color: Colors().pending,
            },
          ]}
          clockOutButton={true}
          action={handleAction}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      {clockedInUserListData?.isLoading ? (
        <Loader />
      ) : !clockedInUserListData?.isLoading &&
        !clockedInUserListData?.isError &&
        clockedInUserListData?.data?.status ? (
        <>
          <FlatList
            data={clockedInUserListData?.data?.data}
            renderItem={renderItem}
            keyExtractor={(_, index) => {
              return index.toString();
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{paddingBottom: 50}}
          />

          {/* View for floating button */}
          <View
            style={{
              marginTop: WINDOW_HEIGHT * 0.65,
              marginLeft: WINDOW_WIDTH * 0.8,
              position: 'absolute',
            }}>
            <FloatingAddButton
              backgroundColor={Colors().purple}
              onPress={() => {
                navigation.navigate('AddUpdateAttendanceScreen', {});
              }}></FloatingAddButton>
          </View>
        </>
      ) : clockedInUserListData?.isError ? (
        <InternalServer />
      ) : !clockedInUserListData?.data?.status &&
        clockedInUserListData?.data?.message === 'Data not found' ? (
        <>
          <DataNotFound />
          {/* View for floating button */}
          <View
            style={{
              marginTop: WINDOW_HEIGHT * 0.65,
              marginLeft: WINDOW_WIDTH * 0.8,
              position: 'absolute',
            }}>
            <FloatingAddButton
              backgroundColor={Colors().purple}
              onPress={() => {
                navigation.navigate('AddUpdateAttendanceScreen', {});
              }}></FloatingAddButton>
          </View>
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default ClockInScreen;

const styles = StyleSheet.create({});
