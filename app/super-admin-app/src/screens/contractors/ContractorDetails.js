import {Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import Toast from 'react-native-toast-message';
import AlertModal from '../../component/AlertModal';
import {useIsFocused} from '@react-navigation/native';
import {
  deleteContractorUserById,
  getContractorDetailById,
} from '../../redux/slices/contractor/getAllContractorListSlice';
import CustomeCard from '../../component/CustomeCard';
import moment from 'moment';
import Button from '../../component/Button';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import NeumorphCard from '../../component/NeumorphCard';
import DataNotFound from '../../component/DataNotFound';

const ContractorDetails = ({navigation, route}) => {
  /* declare props constant variale*/
  const dispatch = useDispatch();
  const item = route?.params?.item;
  const isFocused = useIsFocused();
  const [itemData, setItemData] = useState({});
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [orderViaId, setOrderViaId] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getContractorDetails();
  }, [isFocused]);

  const getContractorDetails = async () => {
    try {
      const res = await dispatch(
        getContractorDetailById({id: item?.admin_id, type: 'Contractor'}),
      ).unwrap();

      if (res.status) {
        setItemData(res?.data);
      } else {
        setItemData({});
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const deleteContractor = async () => {
    try {
      const deleteResult = await dispatch(
        deleteContractorUserById(orderViaId),
      ).unwrap();

      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setOrderViaId('');
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setOrderViaId('');
      }
    } catch (error) {
      console.log('error', error);
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setOrderViaId('');
    }
  };

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateContractUsersScreen', {
          item: actionButton?.itemData,
          contractor_id: actionButton?.itemData?.admin_id,
        });
        break;

      case 'delete':
        setOrderViaId(actionButton?.itemData?.admin_id);
        setDeleteModalVisible(true);
        break;

      default:
        break;
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader headerTitle={'Client Details'} />
      <ScrollView>
        <CustomeCard
          avatarImage={itemData?.image}
          allData={itemData}
          data={[
            {
              key: 'Name',
              value: itemData?.name ?? '--',
            },
            {
              key: 'Email',
              value: itemData?.email ?? '--',
            },
            {
              key: 'Contact No.',
              value: itemData?.contact_no ?? '--',
            },
            {
              key: 'Alternate No.',
              value: itemData?.alt_number ?? '--',
            },
            {
              key: 'Address',
              value:
                `${itemData?.address_1}, ${itemData?.city},${itemData?.pin_code} ` ??
                '--',
            },
            {
              key: 'Country',
              value: `${itemData?.country}` ?? '--',
            },
            {
              key: 'Plan',
              value:
                `${itemData?.plan_name} ( ₹ ${itemData?.plan_price} / ${itemData?.plan_duration})` ??
                '--',
            },
            {
              key: 'Plan Expire Date',
              value:
                moment(itemData?.plan_expire_date).format('DD/MM/YYYY') ?? '--',
            },
          ]}
          status={[
            {
              key: 'Status',
              value: itemData?.status == 1 ? 'Active' : 'INACTIVE',
              color:
                itemData?.status == 1 ? Colors().aprroved : Colors().rejected,
            },
          ]}
        />
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: WINDOW_WIDTH * 0.95,
          }}>
          <Text style={{color: Colors().purple, fontSize: 16, padding: 10}}>
            Client Users
          </Text>

          <View>
            <NeumorphCard>
              <Button
                onPress={() => {
                  navigation.navigate('AddUpdateContractUsersScreen', {
                    contractor_id: item?.admin_id,
                  });
                }}
                btnStyle={{margin: 5, width: 50}}
                textstyle={{
                  fontSize: 15,
                  color: Colors().pureBlack,
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: 0,
                }}
                title={'+ Add'}
              />
            </NeumorphCard>
          </View>
        </View>
        <ScrollView style={{height: 'auto'}}>
          {item && item?.users?.length > 0 ? (
            item?.users?.map(i => (
              <View>
                <CustomeCard
                  avatarImage={i?.image}
                  allData={i}
                  data={[
                    {
                      key: 'Name',
                      value: i?.name ?? '--',
                    },
                    {
                      key: 'Email',
                      value: i?.email ?? '--',
                    },
                    {
                      key: 'Contact No.',
                      value: i?.contact_no ?? '--',
                    },
                  ]}
                  status={[
                    {
                      key: 'Status',
                      value: i?.status == 1 ? 'Active' : 'INACTIVE',
                      color:
                        i?.status == 1 ? Colors().aprroved : Colors().rejected,
                    },
                  ]}
                  editButton={true}
                  deleteButton={true}
                  action={handleAction}
                />
              </View>
            ))
          ) : (
            <View style={{width: WINDOW_WIDTH, height: WINDOW_HEIGHT * 0.5}}>
              <DataNotFound />
            </View>
          )}
          {deleteModalVisible && (
            <AlertModal
              visible={deleteModalVisible}
              iconName={'delete-circle-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().red}
              textToShow={'ARE YOU SURE YOU WANT TO DELETE THIS!!'}
              cancelBtnPress={() => setDeleteModalVisible(!deleteModalVisible)}
              ConfirmBtnPress={() => deleteContractor()}
            />
          )}
        </ScrollView>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ContractorDetails;
