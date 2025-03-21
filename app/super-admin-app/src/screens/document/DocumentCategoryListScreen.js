import {View, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import CustomeHeader from '../../component/CustomeHeader';
import SearchBar from '../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AlertModal from '../../component/AlertModal';
import Toast from 'react-native-toast-message';
import {getDocCategory} from '../../redux/slices/document/getDocCategoryListSlice';
import {deleteDocCategoryById} from '../../redux/slices/document/addUpdateDocCategorySlice';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeCard from '../../component/CustomeCard';
import List from '../../component/List/List';

const DocumentCategoryListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listData = useSelector(state => state.getDocCategoryList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [categoryId, setCategoryId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getDocCategory({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [isFocused, searchText]);

  /* delete Document category delete with id */
  const deleteDocCategory = async categoryId => {
    try {
      const deleteResult = await dispatch(
        deleteDocCategoryById(categoryId),
      ).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setCategoryId('');

        dispatch(getDocCategory({pageSize: pageSize, pageNo: pageNo}));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setCategoryId('');
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
      case 'edit':
        navigation.navigate('AddUpdateDocumentCategory', {
          edit_id: actionButton?.itemData?.id,
        });

        break;

      case 'delete':
        setDeleteModalVisible(true), setCategoryId(actionButton?.itemData?.id);

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
          data={[
            {key: 'category', value: item?.category},
            {key: 'title', value: item?.title},
            {key: 'description', value: item?.description},
          ]}
          status={[{key: 'action'}]}
          editButton={true}
          deleteButton={true}
          action={handleAction}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.DOCUMENT_CATEGORY}`} />
      <SearchBar setSearchText={setSearchText} />
      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdateDocumentCategory'}
          data={listData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(getDocCategory({pageSize: pageSize, pageNo: pageNo}));
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
          ConfirmBtnPress={() => deleteDocCategory(categoryId)}
        />
      )}
    </SafeAreaView>
  );
};

export default DocumentCategoryListScreen;
