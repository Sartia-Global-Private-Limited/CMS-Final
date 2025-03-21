/*    ----------------Created Date :: 5 - sep  -2024   ----------------- */

import { View, SafeAreaView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import SeparatorComponent from '../../component/SeparatorComponent';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import CustomeCard from '../../component/CustomeCard';
import List from '../../component/List/List';
import {
  getNotificationCountLogged,
  notificationList,
} from '../../redux/slices/notifications/notificationsSlice';
import moment from 'moment';
import Button from '../../component/Button';
import Toast from 'react-native-toast-message';

const NotificationsListScreen = ({}) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.notification);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [search, setSearchText] = useState('');

  useEffect(() => {
    dispatch(
      notificationList({ pageNo: pageNo, pageSize: pageSize, search: search }),
    );
  }, [isFocused, search]);

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <CustomeCard
        avatarImage={item?.image}
        allData={item}
        data={[
          {
            key: 'title',
            value: item?.title ?? '--',
          },
          {
            key: '',
            value: item?.message ?? '--',
          },
        ]}
        status={[
          {
            key: 'time',
            value: `🕗 ${moment(item?.created_at).calendar()}`,
            color: Colors().gray2,
          },
        ]}
      />
    );
  };

  const handleMarkAllRead = async () => {
    try {
      setLoading(true);
      const res = await dispatch(getNotificationCountLogged()).unwrap();
      if (res.status) {
        setLoading(false);
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`Notifications`} />
      {loading && (
        <View
          style={{
            position: 'absolute',
            width: WINDOW_WIDTH,
            zIndex: 1,
            height: WINDOW_HEIGHT,
            backgroundColor: 'rgba(150,150,150,0.5)',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size={'large'} color={Colors().resolved} />
        </View>
      )}
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />
      <View style={{ height: WINDOW_HEIGHT * 0.975, width: WINDOW_WIDTH }}>
        <Button
          onPress={() => {
            handleMarkAllRead();
          }}
          title={'Mark All As Read'}
          btnStyle={{ width: 150, height: 40, alignSelf: 'flex-end' }}
          textstyle={{ color: Colors().resolved }}
        />

        <List
          addAction={''}
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(notificationList({ pageSize: pageSize, pageNo: pageNo }));
          }}
        />
      </View>
    </SafeAreaView>
  );
};

export default NotificationsListScreen;
