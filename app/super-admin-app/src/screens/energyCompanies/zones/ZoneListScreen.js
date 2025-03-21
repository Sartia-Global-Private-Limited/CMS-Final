import {View, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeHeader from '../../../component/CustomeHeader';
import CustomeCard from '../../../component/CustomeCard';
import List from '../../../component/List/List';
import SearchBar from '../../../component/SearchBar';
import {
  allZoneList,
  deleteZoneById,
} from '../../../redux/slices/energyCompany/zones/getAllZoneListSlice';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import IconType from '../../../constants/IconType';

const ZoneListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const [zoneId, setZoneId] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.allZone);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(
      allZoneList({
        search: searchText,
        pageNo: pageNo,
        pageSize: pageSize,
      }),
    );
  }, [isFocused, searchText]);

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateZoneScreen', {
          item: actionButton?.itemData,
        });

        break;

      case 'delete':
        setZoneId(actionButton?.itemData?.zone_id);
        setDeleteModalVisible(true);
        break;

      default:
        break;
    }
  };

  /* delete contact with id */
  const deleteZone = async zoneId => {
    try {
      const deleteResult = await dispatch(deleteZoneById(zoneId)).unwrap();
      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        dispatch(
          allZoneList({
            search: searchText,
            pageNo: pageNo,
            pageSize: pageSize,
          }),
        );
        setDeleteModalVisible(false), setZoneId('');
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setZoneId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <CustomeCard
        avatarImage={item?.logo}
        allData={item}
        data={[
          {
            key: 'Zone Id',
            value: item?.zone_id ?? '--',
          },
          {
            key: 'Zone Name',
            value: item?.zone_name ?? '--',
          },
          {
            key: 'Zone Description',
            value: item?.zone_description ?? '--',
          },
          {
            key: 'EC Name',
            value: item?.ec_name ?? '--',
          },
        ]}
        status={[
          {
            key: 'Date',
            value: '',
          },
        ]}
        editButton={true}
        deleteButton={true}
        action={handleAction}
      />
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`All Zones`} />
      <SearchBar setSearchText={setSearchText} />

      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdateZoneScreen'}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(allZoneList({pageSize: 8, pageNo: pageNo}));
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
          ConfirmBtnPress={() => deleteZone(zoneId)}
        />
      )}
    </SafeAreaView>
  );
};

export default ZoneListScreen;
