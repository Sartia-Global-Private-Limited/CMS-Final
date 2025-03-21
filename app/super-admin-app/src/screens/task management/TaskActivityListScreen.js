/*    ----------------Created Date :: 12 - August -2024   ----------------- */

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import CustomeHeader from '../../component/CustomeHeader';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import DataNotFound from '../../component/DataNotFound';
import moment from 'moment';
import ImageViewer from '../../component/ImageViewer';
import {Image} from 'react-native';
import {apiBaseUrl} from '../../../config';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeCard from '../../component/CustomeCard';
import {getTaskDetailById} from '../../redux/slices/task-mangement/getTaskDetailSlice';

const TaskActivityListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.edit_id;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const label = ScreensLabel();
  const listData = useSelector(state => state.getTaskDetail);

  /*declare useState variable here */

  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getTaskDetailById(edit_id));
  }, [isFocused, edit_id]);

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <CustomeCard
          avatarImage={item?.user_image}
          data={[
            {
              key: 'user name',
              value: item?.user_name,
              keyColor: Colors().skyBule,
            },
            {key: 'remark', value: item?.remark},

            {
              key: 'attachement',
              component: (
                <View style={[styles.userNameView, {columnGap: 10}]}>
                  <TouchableOpacity
                    onPress={() => {
                      setImageModalVisible(true);
                      setImageUri(`${apiBaseUrl}${item?.attachment}`);
                    }}>
                    <Image
                      source={{
                        uri: `${apiBaseUrl}${item?.attachment}`,
                      }}
                      style={[styles.Image, {marginTop: 10}]}
                    />
                  </TouchableOpacity>
                </View>
              ),
            },
          ]}
          status={[
            {
              key: 'date',
              value: `${moment(item?.created_at).format('DD/MM/YYYY hh:mm A')}`,
              color: Colors().pending,
            },
          ]}
        />
      </View>
    );
  };
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getTaskDetailById(edit_id));
      setRefreshing(false);
    }, 2000);
  }, []);

  /*pagination button click funtion*/
  const handlePageClick = number => {
    setPageNo(number);

    dispatch(getTaskDetailById(edit_id));
  };
  /* if we got no data for flatlist*/
  const renderEmptyComponent = () => (
    // Render your empty component here<>
    <View
      style={{
        height: WINDOW_HEIGHT * 0.6,
      }}>
      <DataNotFound />
    </View>
  );

  /*pagination button UI*/
  const renderPaginationButtons = () => {
    const buttons = [];

    for (let i = 1; i <= listData?.data?.pageDetails?.totalPages; i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageClick(i)}
          style={[
            styles.paginationButton,
            i === pageNo ? styles.activeButton : null,
          ]}>
          <Text style={{color: 'white'}}>{i}</Text>
        </TouchableOpacity>,
      );
    }

    return buttons;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.TASK_COMMENT}`} />

      {listData?.isLoading ? (
        <Loader />
      ) : !listData?.isLoading &&
        !listData?.isError &&
        listData?.data?.status ? (
        <>
          <FlatList
            data={listData?.data?.data?.comments}
            renderItem={renderItem}
            keyExtractor={item => item.task_comments_id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{paddingBottom: 50}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyComponent}
          />
          {listData?.data?.pageDetails?.totalPages > 1 && (
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

          {/*view for modal of upate */}
          {imageModalVisible && (
            <ImageViewer
              visible={imageModalVisible}
              imageUri={imageUri}
              cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
              downloadBtnPress={true}
            />
          )}
        </>
      ) : listData?.isError ? (
        <InternalServer />
      ) : !listData?.data?.status &&
        listData?.data?.message === 'Data not found' ? (
        <>
          <DataNotFound />
        </>
      ) : (
        <InternalServer />
      )}
    </SafeAreaView>
  );
};

export default TaskActivityListScreen;

const styles = StyleSheet.create({
  paginationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  activeButton: {
    backgroundColor: '#22c55d',
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  Image: {
    height: WINDOW_HEIGHT * 0.05,
    width: WINDOW_WIDTH * 0.18,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  userNameView: {flex: 1, flexDirection: 'row', flexWrap: 'wrap'},
});
