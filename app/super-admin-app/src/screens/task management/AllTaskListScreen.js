/*    ----------------Created Date :: 2- March -2024   ----------------- */
import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import SearchBar from '../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import SeparatorComponent from '../../component/SeparatorComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AlertModal from '../../component/AlertModal';
import CustomeHeader from '../../component/CustomeHeader';
import Toast from 'react-native-toast-message';
import {getAllTask} from '../../redux/slices/task-mangement/getAllTaskListSlice';
import moment from 'moment';
import {deleteTaskById} from '../../redux/slices/task-mangement/addUpdateTaskSlice';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeCard from '../../component/CustomeCard';
import List from '../../component/List/List';

const AllTaskListScreen = ({navigation, route}) => {
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getAllTaskList);
  const label = ScreensLabel();

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskId, setTaskId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getAllTask({search: searchText, pageSize: pageSize, pageNo: pageNo}),
    );
  }, [isFocused, searchText]);

  /* delete task with id */
  const deleteTask = async Id => {
    try {
      const deleteResult = await dispatch(deleteTaskById(Id)).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setTaskId('');
        dispatch(getAllTask({pageSize: pageSize, pageNo: pageNo}));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setTaskId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setTaskId('');
    }
  };

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'assign':
        return Colors().red;
      case 'in progress':
        return Colors().pending;
      case 'completed':
        return Colors().aprroved;

      default:
        return 'black';
    }
  }

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateTaskScreen', {
          edit_id: actionButton?.itemData?.id,
        });
        break;
      case 'delete':
        setDeleteModalVisible(true), setTaskId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('TaskDetailScreen', {
              id: item?.id,
              assign_to: item?.assign_to,
            })
          }>
          <CustomeCard
            allData={item}
            data={[
              {key: 'task category', value: item?.category_name},
              {key: 'task name', value: item?.title},
              {key: 'project name', value: item?.project_name},
              {key: 'Task assign', value: item?.assign_user_name},
              {
                key: 'start date',
                value: moment(item?.start_date).format('DD/MM/YYYY'),
                keyColor: Colors().aprroved,
              },
              {
                key: 'end date',
                value: moment(item?.end_date).format('DD/MM/YYYY'),
                keyColor: Colors().red,
              },
            ]}
            status={[
              {
                key: 'status',
                value: item?.status,
                color: getStatusColor(item?.status),
              },
            ]}
            editButton={true}
            deleteButton={true}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.TASK_ALL}`} />
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdateTaskScreen'}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(getAllTask({pageSize: pageSize, pageNo: pageNo}));
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
          ConfirmBtnPress={() => deleteTask(taskId)}
        />
      )}
    </SafeAreaView>
  );
};

export default AllTaskListScreen;
