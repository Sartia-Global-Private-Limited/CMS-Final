import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../component/CustomeCard';
import IconType from '../../constants/IconType';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeHeader from '../../component/CustomeHeader';
import { getAllEnergyTeamList } from '../../redux/slices/energy team/getEnergyTeamListSlice';
import EnergyTeamFilter from './EnergyTeamFilter';
import AlertModal from '../../component/AlertModal';
import { deleteEnergyTeamUserById } from '../../redux/slices/energy team/addUpdateEnergyTeamSlice';
import Toast from 'react-native-toast-message';
import List from '../../component/List/List';

const EnergyTeamListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getEnergyTeamList);
  const label = ScreensLabel();

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [contactId, setContactId] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getAllEnergyTeamList({
          id: companyId,
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    dispatch(
      getAllEnergyTeamList({
        id: companyId,
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [searchText, isFocused, companyId]);

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateEnergyTeamScreen', {
          edit_id: companyId,
          user_id: actionButton?.itemData?.user_id,
        });

        break;

      case 'delete':
        setContactId(actionButton?.itemData?.user_id);
        setDeleteModalVisible(true);

        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('EnergyCompanyDetailScreen', {
              id: item?.energy_company_id,
              userId: item?.user_id,
            });
          }}>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'user name',
                value: item?.username ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'mobile',
                value: item?.mobile ?? '--',
              },
              {
                key: 'email',
                value: item?.email ?? '--',
              },
              {
                key: 'country',
                value: item?.country ?? '--',
              },
              {
                key: 'city',
                value: item?.city ?? '--',
              },
              {
                key: 'pincode',
                value: item?.pin_code ?? '--',
              },
            ]}
            status={[
              {
                key: 'Action',
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

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getAllEnergyTeamList({
        id: companyId,
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  /* delete contact with id */
  const deleteContact = async contactId => {
    try {
      const deleteResult = await dispatch(
        deleteEnergyTeamUserById(contactId),
      ).unwrap();

      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setContactId('');
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setContactId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={label.ENERGY_TEAM} />
      <EnergyTeamFilter
        companyId={companyId}
        setCompanyId={setCompanyId}
        setSearchText={setSearchText}
      />

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateEnergyTeamScreen'}
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
          ConfirmBtnPress={() => deleteContact(contactId)}
        />
      )}
    </SafeAreaView>
  );
};

export default EnergyTeamListScreen;
