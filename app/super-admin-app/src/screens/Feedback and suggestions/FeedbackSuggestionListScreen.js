import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import CustomeHeader from '../../component/CustomeHeader';
import SearchBar from '../../component/SearchBar';
import {WINDOW_HEIGHT} from '../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AlertModal from '../../component/AlertModal';
import Toast from 'react-native-toast-message';
import CustomeCard from '../../component/CustomeCard';
import ScreensLabel from '../../constants/ScreensLabel';
import {getAllFeedbackList} from '../../redux/slices/feedback suggestion/getFeedbackListSlice';
import {deleteFeedbackById} from '../../redux/slices/feedback suggestion/addUpateFeedbackSlice';
import List from '../../component/List/List';
import moment from 'moment';

const FeedbackSuggestionListScreen = ({navigation, route}) => {
  /*declare hooks variable here */
  const label = ScreensLabel();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listData = useSelector(state => state.getFeedbackList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [feedbackId, setFeedbackId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getAllFeedbackList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'Feedback':
        return Colors().aprroved;
      case 'Suggestion':
        return Colors().red;

      default:
        return 'black';
    }
  }

  /* delete  feedback  with id */
  const deleteFeedback = async feedbackId => {
    try {
      const deleteResult = await dispatch(
        deleteFeedbackById(feedbackId),
      ).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setFeedbackId('');
        dispatch(getAllFeedbackList({pageSize: pageSize, pageNo: pageNo}));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setFeedbackId('');
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
      case 'feedback':
        navigation.navigate('AddResponseScreen', {
          edit_id: actionButton?.itemData?.id,
        });
        break;
      case 'delete':
        setDeleteModalVisible(true), setFeedbackId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('FeedbackSuggestionDetailScreen', {
              id: item?.id,
            });
          }}>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'User Name',
                value: item?.created_by?.name ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'title',
                value: item?.title ?? '--',
              },
              {
                key: 'Created At',
                value: moment(item?.created_at).format('DD-MM-YYYY') ?? '--',
              },
              {
                key: 'description',
                value: item?.description ?? '--',
              },
            ]}
            status={[
              {
                key: 'status',
                value: item?.status,
                color: getStatusColor(item?.status),
              },
            ]}
            feedbackButton={true}
            deleteButton={true}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.FEEDBACK_AND_SUGGESTION}`} />
      <SearchBar setSearchText={setSearchText} />
      <View style={{height: WINDOW_HEIGHT * 0.9}}>
        <List
          addAction={'AddUpdateFeedbackSuggestionScreen'}
          data={listData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(
              getAllFeedbackList({
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
          ConfirmBtnPress={() => deleteFeedback(feedbackId)}
        />
      )}
    </SafeAreaView>
  );
};

export default FeedbackSuggestionListScreen;
