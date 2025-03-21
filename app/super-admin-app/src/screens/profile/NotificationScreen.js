import {
  ActivityIndicator,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import ScreensLabel from '../../constants/ScreensLabel';
import IconType from '../../constants/IconType';
import {useDispatch} from 'react-redux';
import {getAllNotificationList} from '../../redux/slices/profile/getNotificationSlice';
import Toast from 'react-native-toast-message';
import CustomeCard from '../../component/CustomeCard';
import {Icon} from '@rneui/themed';

const NotificationScreen = ({navigation}) => {
  const label = ScreensLabel();
  const dispatch = useDispatch();

  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPage, setTotalPage] = useState('');
  const [isLoadMore, setIsLoadMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const INITIAL_PAGE = 1;
  {
  }
  useEffect(() => {
    fetchAllNotification();
  }, [pageNo]);

  const handleEndReached = () => {
    if (pageNo < totalPage) {
      setPageNo(pageNo + 1);
    }
  };
  // function for fetching all notification//
  const fetchAllNotification = async () => {
    setIsLoadMore(true);
    const result = await dispatch(
      getAllNotificationList({
        search: search,
        pageNo: pageNo,
        pageSize: pageSize,
      }),
    ).unwrap();

    if (result?.status) {
      setData([...data, ...result?.data]);
      setTotalPage(result?.pageDetails?.totalPages);

      setIsLoadMore(false);
      setRefreshing(false);
    } else {
      setData([]);
      setIsLoadMore(false);
      setRefreshing(false);
      Toast.show({type: 'error', position: 'bottom', text1: result?.message});
    }
  };

  // Flatlist ui
  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <CustomeCard
          avatarImage={item?.image}
          data={[
            {
              component: (
                <Text
                  style={[
                    styles.title,
                    {color: Colors().aprroved, fontSize: 16},
                  ]}>
                  {item?.name}
                </Text>
              ),
            },
            {
              component: (
                <Text style={[styles.title, {color: Colors().pureBlack}]}>
                  {`( ${item?.title} )`}
                </Text>
              ),
            },
            {
              component: (
                <Text style={[styles.cardtext, {color: Colors().pureBlack}]}>
                  {item?.message}
                </Text>
              ),
            },
            {
              component: (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    flex: 1,
                    justifyContent: 'space-evenly',
                  }}>
                  <Icon
                    name="time-outline"
                    type={IconType.Ionicons}
                    color={Colors().orange}
                    size={20}
                  />
                  <Text style={[styles.cardtext, {color: Colors().pureBlack}]}>
                    {item?.created_at}
                  </Text>
                </View>
              ),
            },
          ]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={label.MESSAGE} />
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item?.id.toString()}
        onEndReached={handleEndReached}
        // refreshControl={
        //   <RefreshControl
        //     refreshing={refreshing}
        //     onRefresh={() => {
        //       setPageNo(1), setRefreshing(true);
        //     }}
        //   />
        // }
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          isLoadMore ? <ActivityIndicator size="large" /> : null
        }></FlatList>
    </SafeAreaView>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  cardtext: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
