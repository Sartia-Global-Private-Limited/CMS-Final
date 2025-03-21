import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  Pressable,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import {useDispatch, useSelector} from 'react-redux';
import SearchBar from '../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {
  deleteRolesForSuperAdmin,
  getAllRolesForSuperAdmin,
} from '../../redux/slices/allRolesSlice';
import moment from 'moment';
import List from '../../component/List/List';
import CustomeCard from '../../component/CustomeCard';
import Toast from 'react-native-toast-message';
import AlertModal from '../../component/AlertModal';
import ScreensLabel from '../../constants/ScreensLabel';

const AllRolesScreen = ({navigation, route}) => {
  const label = ScreensLabel();
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [roleId, setRoleId] = useState('');
  const [pageSize, setPageSize] = useState(8);

  const headerTitle = route?.params?.title;
  //   const company_id = route?.params?.company_id;
  const allRoles = useSelector(state => state.allRoles);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllRolesForSuperAdmin({pageSize: pageSize, pageNo: pageNo}));
  }, []);

  const deleteRoles = async () => {
    try {
      const deleteResult = await dispatch(
        deleteRolesForSuperAdmin(roleId),
      ).unwrap();
      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setRoleId('');
        dispatch(
          getAllRolesForSuperAdmin({pageSize: pageSize, pageNo: pageNo}),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setRoleId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setRoleId('');
    }
  };

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateRoleScreen', {
          item: actionButton?.itemData,
        });

        break;

      case 'delete':
        setDeleteModalVisible(true),
          setRoleId(actionButton?.itemData?.company_id);
        break;

      default:
        break;
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ViewPermissionsScreen', {
            id: item?.id,
          });
        }}>
        <CustomeCard
          allData={item}
          data={[
            {
              key: 'Id',
              value: item?.id ?? '--',
            },
            {
              key: 'Roles',
              value: item?.name ?? '--',
            },
            {
              key: 'Date',
              value: moment(item?.created_at).format('DD/MM/YYYY') ?? '--',
            },
          ]}
          status={[{key: 'Action', value: ''}]}
          editButton={true}
          deleteButton={true}
          action={handleAction}
        />
      </TouchableOpacity>
    );
  };

  const handlePageClick = () => {
    dispatch(
      getAllRolesForSuperAdmin({
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label?.ALL_ROLES} />
      <SearchBar setSearchText={setSearchText} />
      <View style={{width: WINDOW_WIDTH, height: WINDOW_HEIGHT * 0.9}}>
        <List
          data={allRoles}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateRoleScreen'}
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
          ConfirmBtnPress={() => {
            deleteRoles();
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default AllRolesScreen;

const styles = StyleSheet.create({
  shadow: {
    shadowOpacity: 1, // <- and this or yours opacity
    shadowRadius: 8,
    borderRadius: 10,
    backgroundColor: Colors().cardBackground,
    width: WINDOW_WIDTH * 0.9,
    height: WINDOW_HEIGHT * 0.15,
  },
  cardContainer: {
    flex: 1,
    // backgroundColor: 'red',
    paddingHorizontal: WINDOW_WIDTH * 0.05,
    paddingVertical: WINDOW_HEIGHT * 0.01,
  },
  cardHeadingTxt: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
  },
  cardtext: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    flexShrink: 1,
    marginLeft: 2,
  },
});
