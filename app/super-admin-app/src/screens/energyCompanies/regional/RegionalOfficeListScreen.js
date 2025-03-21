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
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import IconType from '../../../constants/IconType';
import {
  allRegionalOfficeList,
  deleteRegionalOfficeById,
} from '../../../redux/slices/energyCompany/regionalOffice/getAllRegionalOfficeListSlice';

const RegionalOfficeListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const [zoneId, setZoneId] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.allRegionalOffice);

  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(
      allRegionalOfficeList({
        search: searchText,
        pageNo: pageNo,
        pageSize: pageSize,
      }),
    );
  }, [isFocused, searchText]);

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateRegionalOfficeScreen', {
          item: actionButton?.itemData,
        });

        break;

      case 'delete':
        setZoneId(actionButton?.itemData?.ro_id);
        setDeleteModalVisible(true);
        break;

      default:
        break;
    }
  };

  /* delete contact with id */
  const deleteZone = async zoneId => {
    try {
      const deleteResult = await dispatch(
        deleteRegionalOfficeById(zoneId),
      ).unwrap();
      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        dispatch(
          allRegionalOfficeList({
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
  function getStatusColor(action) {
    switch (action) {
      case 0:
        return Colors().rejected;
      case 1:
        return Colors().aprroved;
      default:
        return 'black';
    }
  }
  function getStatus(action) {
    switch (action) {
      case 0:
        return 'INACTIVE';
      case 1:
        return 'ACTIVE';
      default:
        return '';
    }
  }

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <CustomeCard
        avatarImage={item?.logo}
        allData={item}
        data={[
          {
            key: 'RO Id',
            value: item?.ro_id ?? '--',
          },
          {
            key: 'RO Name',
            value: item?.regional_office_name ?? '--',
          },
          {
            key: 'Zone Name',
            value: item?.zone_name ?? '--',
          },
          {
            key: 'Code',
            value: item?.code ?? '--',
          },
          {
            key: 'Address',
            value: item?.address_1 ?? '--',
          },
          {
            key: 'EC Name',
            value: item?.ec_name ?? '--',
          },
        ]}
        status={[
          {
            key: 'Status',
            value: getStatus(item?.status),
            color: getStatusColor(item?.status),
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
      <CustomeHeader headerTitle={`All Regional Offices`} />
      <SearchBar setSearchText={setSearchText} />

      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdateRegionalOfficeScreen'}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(allRegionalOfficeList({pageSize: 8, pageNo: pageNo}));
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

export default RegionalOfficeListScreen;
