import {View, SafeAreaView, Pressable} from 'react-native';
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
  allUserEnergyCompanyList,
  deleteUserEnergyCompany,
} from '../../../redux/slices/energyCompany/company/getAllUserEnergyCompanySlice';

const EnergyCompanyListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const [zoneId, setZoneId] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getAllECUserList);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    dispatch(
      allUserEnergyCompanyList({
        search: searchText,
        pageNo: pageNo,
        pageSize: pageSize,
      }),
    );
  }, [isFocused, searchText]);

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateEnegyCompanyScreen', {
          id: actionButton?.itemData?.energy_company_id,
        });
        break;

      case 'delete':
        setZoneId(actionButton?.itemData?.energy_company_id);
        setDeleteModalVisible(true);
        break;

      case 'allocate':
        navigation.navigate('AssignUserToEnergyCompanies', {
          ec_id: actionButton?.itemData?.energy_company_id,
          user_id: actionButton?.itemData?.user_id,
          type: 'ASSIGN USER',
        });
        break;

      case 'plus':
        navigation.navigate('AssignUserToEnergyCompanies', {
          ec_id: actionButton?.itemData?.energy_company_id,
          user_id: actionButton?.itemData?.user_id,
          type: 'ADD USER',
        });
        break;

      default:
        break;
    }
  };

  /* delete contact with id */
  const deleteZone = async zoneId => {
    const body = {energy_company_id: zoneId, delete_all: 1};
    try {
      const deleteResult = await dispatch(
        deleteUserEnergyCompany(body),
      ).unwrap();
      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        dispatch(
          allUserEnergyCompanyList({
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
      <Pressable
        onPress={() => {
          navigation.navigate('EnergyCompanyDetailsScreen', {
            id: item?.energy_company_id,
          });
        }}>
        <CustomeCard
          avatarImage={item?.logo}
          allData={item}
          data={[
            {
              key: 'Id',
              value: item?.energy_company_id ?? '--',
            },
            {
              key: 'Company  Name',
              value: item?.name ?? '--',
            },
          ]}
          status={[
            {
              key: 'Status',
              value: getStatus(item?.status),
              color: getStatusColor(item?.status),
            },
          ]}
          plusButton={true}
          editButton={true}
          deleteButton={true}
          allocateButton={true}
          action={handleAction}
        />
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`Energy Company Users`} />
      <SearchBar setSearchText={setSearchText} />

      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH}}>
        <List
          addAction={'AddUpdateEnegyCompanyScreen'}
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(allUserEnergyCompanyList({pageSize: 8, pageNo: pageNo}));
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

export default EnergyCompanyListScreen;
