import {
  StyleSheet,
  View,
  SafeAreaView,
  FlatList,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {updateAttendanceStatus} from '../../../redux/slices/hr-management/attendance/addUpdateAttendanceSlice';
import FloatingAddButton from '../../../component/FloatingAddButton';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import {getClockedOutUsertList} from '../../../redux/slices/hr-management/attendance/getClockOutSlice';
import CustomeCard from '../../../component/CustomeCard';
import Toast from 'react-native-toast-message';

const ClockOutScreen = ({navigation, route}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const [refreshing, setRefreshing] = useState(false);
  const clockedOutListData = useSelector(state => state.getClockOut);

  /*declare useState variable here */
  useEffect(() => {
    dispatch(getClockedOutUsertList());
  }, [isFocused]);

  /* function for pull down to refresh */
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getClockedOutUsertList());

      setRefreshing(false);
    }, 2000);
  }, []);

  /* updaate attendance  function with  emp id */
  const updateAttendance = async empId => {
    const reqbody = {
      id: empId,
      type: 'clock in',
    };

    try {
      const result = await dispatch(updateAttendanceStatus(reqbody)).unwrap();

      if (result?.status) {
        dispatch(getClockedOutUsertList());
        Toast.show({
          type: 'success',
          text1: result?.message,
          position: 'bottom',
        });
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
      case 'clockin':
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
          clockInButton={true}
          action={handleAction}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      {clockedOutListData?.isLoading ? (
        <Loader />
      ) : !clockedOutListData?.isLoading &&
        !clockedOutListData?.isError &&
        clockedOutListData?.data?.status ? (
        <>
          <FlatList
            data={clockedOutListData?.data?.data}
            renderItem={renderItem}
            keyExtractor={(_, index) => {
              return index.toString();
            }}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            contentContainerStyle={{paddingBottom: 50}}
          />
          {clockedOutListData?.data?.pageDetails?.totalPages > 1 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                marginTop: WINDOW_HEIGHT * 0.8,
                bottom: 10,
                alignSelf: 'center',
                position: 'absolute',
                backgroundColor: '',
                marginHorizontal: WINDOW_WIDTH * 0.01,

                columnGap: 20,
              }}>
              {renderPaginationButtons()}
            </ScrollView>
          )}

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
      ) : clockedOutListData?.isError ? (
        <InternalServer />
      ) : !clockedOutListData?.data?.status &&
        clockedOutListData?.data?.message === 'Data not found' ? (
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

export default ClockOutScreen;

const styles = StyleSheet.create({});
