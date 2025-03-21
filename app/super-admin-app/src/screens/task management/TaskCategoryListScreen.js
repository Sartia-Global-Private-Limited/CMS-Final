/*   ----------------Updated On :: 6- sep -2024   ----------------- */

import { View, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../component/CustomeCard';
import ScreensLabel from '../../constants/ScreensLabel';
import IconType from '../../constants/IconType';
import SearchBar from '../../component/SearchBar';
import CustomeHeader from '../../component/CustomeHeader';
import moment from 'moment';
import { getAllTaskCategory } from '../../redux/slices/task-mangement/getTaskCategoryListSlice';
import AlertModal from '../../component/AlertModal';
import Toast from 'react-native-toast-message';
import { deleteTaskCategorytById } from '../../redux/slices/task-mangement/addUpdateTaskCategorySlice';
import List from '../../component/List/List';

const TaskCategoryListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/

  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getTaskCategoryList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [taskCategoryId, setTaskCategoryId] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(
      getAllTaskCategory({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [searchText, isFocused]);

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateTaskCategoryScreen', {
          edit_id: actionButton?.itemData?.id,
        });
        break;
      case 'delete':
        setDeleteModalVisible(true),
          setTaskCategoryId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 1:
        return Colors().aprroved;
      case 0:
        return Colors().red;

      default:
        return 'black';
    }
  }

  /*for getting the text of status*/
  function getStatusText(status) {
    switch (status) {
      case 1:
        return 'Active';

      case 0:
        return 'Inactive';

      default:
        break;
    }
  }

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <CustomeCard
          allData={item}
          data={[
            {
              key: 'Task category',
              value: item?.name ?? '--',
            },
            {
              key: 'created date',
              value: moment(item?.created_at).format('DD-MM-YYYY') ?? '--',
            },
          ]}
          status={[
            {
              key: 'status',
              value: getStatusText(item?.status),
              color: getStatusColor(item?.status),
            },
          ]}
          editButton={true}
          deleteButton={true}
          action={handleAction}
        />
      </View>
    );
  };

  /* delete task category delete with id */
  const deleteTaskCategory = async taskCategoryId => {
    const deleteResult = await dispatch(
      deleteTaskCategorytById(taskCategoryId),
    ).unwrap();

    if (deleteResult?.status === true) {
      Toast.show({
        type: 'success',
        text1: deleteResult?.message,
        position: 'bottom',
      });

      setDeleteModalVisible(false), setTaskCategoryId('');

      dispatch(getAllTaskCategory({ pageSize: pageSize, pageNo: pageNo }));
    } else {
      Toast.show({
        type: 'error',
        text1: deleteResult?.message,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setTaskCategoryId('');
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <View style={{ marginBottom: 1 }}>
        <CustomeHeader headerTitle={label.TASK_CATEGORY} />
      </View>
      {/*Seacrh componenet */}
      <SearchBar setSearchText={setSearchText} />
      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          addAction={'AddUpdateTaskCategoryScreen'}
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(
              getAllTaskCategory({ pageSize: pageSize, pageNo: pageNo }),
            );
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
          ConfirmBtnPress={() => deleteTaskCategory(taskCategoryId)}
        />
      )}
    </SafeAreaView>
  );
};

export default TaskCategoryListScreen;
