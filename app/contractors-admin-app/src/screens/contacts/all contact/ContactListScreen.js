/*    ----------------Created Date :: 19- Sep -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import AlertModal from '../../../component/AlertModal';
import IconType from '../../../constants/IconType';
import Toast from 'react-native-toast-message';
import NeumorphicCheckbox from '../../../component/NeumorphicCheckbox';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {
  getClientContact,
  getCompanyContact,
  getDealerContact,
  getSupplierContact,
} from '../../../redux/slices/contacts/all contact/getContactListSlice';
import SearchBar from '../../../component/SearchBar';
import { deleteContactById } from '../../../redux/slices/contacts/all contact/addUpdateCompanyContactSlice';
import CustomeHeader from '../../../component/CustomeHeader';
import List from '../../../component/List/List';

const ContactListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getContactList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [contactId, setContactId] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkData, setCheckData] = useState([{}]);
  const [filterChekcBox, setFilterChekcBox] = useState([]);

  /*for updating the checkbox*/
  const updateCheckDataAtIndex = (index, value) => {
    setCheckData(prevState => {
      const newState = [...prevState];
      newState[index] = value;
      return newState;
    });
  };

  useEffect(() => {
    const filteredData = checkData.filter(itm => itm?.chekedValue === true);
    setFilterChekcBox(filteredData);
  }, [checkData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      if (type == 'company') {
        dispatch(
          getCompanyContact({
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      }
      if (type == 'dealer') {
        dispatch(
          getDealerContact({
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      }
      if (type == 'supplier') {
        dispatch(
          getSupplierContact({
            pageSize: pageSize,
            pageNo: pageNo,
          }),
        );
      }
      if (type == 'vendor') {
        dispatch(
          getClientContact({
            pageSize: pageSize,
            pageNo: pageNo,
            type: 'vendor',
          }),
        );
      }
      if (type == 'client') {
        dispatch(
          getClientContact({
            pageSize: pageSize,
            pageNo: pageNo,
            type: 'client',
          }),
        );
      }
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    if (type == 'company') {
      dispatch(
        getCompanyContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'dealer') {
      dispatch(
        getDealerContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'supplier') {
      dispatch(
        getSupplierContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'client') {
      dispatch(
        getClientContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
  }, [searchText]);

  function areAllIdsPresent(listedData, allData) {
    // Check if listedData is empty
    if (listedData.length === 0) {
      return false;
    }

    const listedIds = listedData.map(item => item.id);

    const allIds = allData.map(item => item.id);

    return allIds.every(id => listedIds.includes(id));
  }

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'delete':
        setContactId(actionButton?.itemData?.id);
        setDeleteModalVisible(true);

        break;
      case 'edit':
        navigation.navigate('AddUpdateContactScreen', {
          edit_id: actionButton?.itemData?.id,
        });
        break;

      default:
        break;
    }
  };

  /* delete contact with id */
  const deleteContact = async contactId => {
    try {
      const deleteResult = await dispatch(
        deleteContactById(contactId),
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

  /*for send message*/
  const sendMessages = async () => {
    const reqBody = {
      data: filterChekcBox.map(itm => itm),
    };
    setLoading(true);
    setLoading(false);
    setFilterChekcBox([]);
    setCheckData([{}]);
    navigation.navigate('CreateUpdateBulkMessageScreen', {
      reqBody: reqBody?.data,
    });
  };

  /* Button ui for create pi*/
  const ListFooterComponent = () => (
    <View style={{ alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.02 }}>
      {filterChekcBox?.length >= 1 ? (
        <NeumorphicButton
          title={'send messages'}
          loading={loading}
          btnBgColor={Colors().purple}
          titleColor={Colors().inputLightShadow}
          onPress={() => sendMessages()}
        />
      ) : null}
    </View>
  );

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case '1':
        return Colors().aprroved;
      case '0':
        return Colors().red;

      default:
        return 'black';
    }
  }

  /*for getting the text of status*/
  function getStatusText(status) {
    switch (status) {
      case '1':
        return 'Active';

      case '0':
        return 'inactive';

      default:
        break;
    }
  }

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity
          disabled={type !== 'company'}
          onPress={() => {
            navigation.navigate('ContactDetailScreen', {
              id: item?.id,
            });
          }}>
          {type == 'company' && (
            <CustomeCard
              allData={item}
              data={[
                {
                  component: (
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          position: 'absolute',
                        }}>
                        <NeumorphicCheckbox
                          isChecked={checkData[index]?.chekedValue}
                          onChange={val => {
                            updateCheckDataAtIndex(
                              index,
                              (val = {
                                chekedValue: val,
                                id: item?.id,
                                value: Array.isArray(item.email)
                                  ? item?.email?.[0]?.email
                                  : item?.email,
                              }),
                            );
                          }}
                        />
                      </View>
                    </View>
                  ),
                },

                {
                  key: 'name',
                  value: `${item?.first_name} ${item?.last_name}` ?? '--',
                  keyColor: Colors().skyBule,
                },
                {
                  key: 'company id',
                  value: item?.contact_unique_id ?? '--',
                },
                {
                  key: 'company name',
                  value: item?.company_name ?? '--',
                },
                {
                  key: 'company type',
                  value: item?.company_type_name ?? '--',
                },
                {
                  key: 'position',
                  value: item?.position ?? '--',
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
          )}

          {type == 'dealer' && (
            <CustomeCard
              data={[
                {
                  component: (
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          position: 'absolute',
                        }}>
                        <NeumorphicCheckbox
                          isChecked={checkData[index]?.chekedValue}
                          onChange={val => {
                            updateCheckDataAtIndex(
                              index,
                              (val = {
                                chekedValue: val,
                                id: item?.id,
                                value: Array.isArray(item.email)
                                  ? item?.email?.[0]?.email
                                  : item?.email,
                              }),
                            );
                          }}
                        />
                      </View>
                    </View>
                  ),
                },

                {
                  key: 'name',
                  value: `${item?.dealer_name}` ?? '--',
                  keyColor: Colors().skyBule,
                },
                {
                  key: 'email',
                  value: typeof item?.email == 'string' ? item?.email : '--',
                },
                {
                  key: 'address',
                  value: item?.address ?? '--',
                },
                {
                  key: 'mobile',
                  value: item?.mobile ?? '--',
                },
              ]}
              status={[
                {
                  key: 'status',
                  value: item?.status == '1' ? 'inactive' : 'active',
                  color: item?.status == '1' ? Colors().red : Colors().aprroved,
                },
              ]}
            />
          )}
          {type == 'supplier' && (
            <CustomeCard
              allData={item}
              data={[
                {
                  component: (
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          position: 'absolute',
                        }}>
                        <NeumorphicCheckbox
                          isChecked={checkData[index]?.chekedValue}
                          onChange={val => {
                            updateCheckDataAtIndex(
                              index,
                              (val = {
                                chekedValue: val,
                                id: item?.id,
                                value: item?.ifsc_code,
                              }),
                            );
                          }}
                        />
                      </View>
                    </View>
                  ),
                },

                {
                  key: 'name',
                  value: item?.supplier_name ?? '--',
                  keyColor: Colors().skyBule,
                },
                {
                  key: 'supplier code',
                  value: item?.supplier_code ?? '--',
                },
                {
                  key: 'city',
                  value: item?.supplier_addresses?.[0]?.city,
                },
                {
                  key: 'pincode',
                  value: item?.supplier_addresses?.[0]?.pin_code,
                },
                {
                  key: 'state',
                  value: item?.supplier_addresses?.[0]?.state,
                },
                {
                  key: 'landmark',
                  value: item?.supplier_addresses?.[0]?.landmark,
                },
              ]}
              status={[
                {
                  key: 'status',
                  value: getStatusText(item?.status),
                  color: getStatusColor(item?.status),
                },
              ]}
            />
          )}
          {type == 'client' && (
            <CustomeCard
              allData={item}
              data={[
                {
                  component: (
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          alignSelf: 'flex-end',
                          position: 'absolute',
                        }}>
                        <NeumorphicCheckbox
                          isChecked={checkData[index]?.chekedValue}
                          onChange={val => {
                            updateCheckDataAtIndex(
                              index,
                              (val = {
                                chekedValue: val,
                                id: item?.id,
                                value: Array.isArray(item.email)
                                  ? item?.email?.[0]?.email
                                  : item?.email,
                              }),
                            );
                          }}
                        />
                      </View>
                    </View>
                  ),
                },

                {
                  key: 'name',
                  value: item?.client_name ?? '--',
                  keyColor: Colors().skyBule,
                },
                {
                  key: 'email',
                  value: typeof item?.email == 'string' ? item?.email : '--',
                },
                {
                  key: 'address',
                  value: item?.address ?? '--',
                },
                {
                  key: 'Mobile',
                  value: item?.mobile ?? '--',
                },
              ]}
              status={[
                {
                  key: 'status',
                  value: item?.status == '1' ? 'Active' : 'inactive',
                  color: item?.status == '1' ? Colors().aprroved : Colors().red,
                },
              ]}
            />
          )}
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (type == 'company') {
      dispatch(
        getCompanyContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'dealer') {
      dispatch(
        getDealerContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'supplier') {
      dispatch(
        getSupplierContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (type == 'client') {
      dispatch(
        getClientContact({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      {/*Seacrh componenet */}
      <CustomeHeader headerTitle={`${type} Contact`} />
      <SearchBar setSearchText={setSearchText} />
      {!ListData?.isLoading && !ListData?.isError && ListData?.data?.status ? (
        <View
          style={{
            alignSelf: 'flex-end',
            flexDirection: 'row',
            marginRight: 15,
            marginTop: 5,
            alignItems: 'center',
          }}>
          <Text
            style={[
              styles.cardHeadingTxt,
              {
                color: Colors().purple,
                fontSize: 15,
                marginRight: 10,
              },
            ]}>
            Select All
          </Text>
          <NeumorphicCheckbox
            isChecked={areAllIdsPresent(filterChekcBox, ListData?.data?.data)}
            onChange={e => {
              ListData?.data?.data?.map((itm, idx) => {
                const body = {
                  chekedValue: e,

                  id: itm?.id,
                  value: Array.isArray(itm.email)
                    ? itm?.email?.[0]?.email
                    : itm?.email,
                };

                updateCheckDataAtIndex(idx, (val = body));
              });
            }}
          />
        </View>
      ) : (
        ''
      )}

      <View style={{ height: WINDOW_HEIGHT * 0.87, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={type == 'company' && 'AddUpdateContactScreen'}
          ListFooterComponent={ListFooterComponent}
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

export default ContactListScreen;
const styles = StyleSheet.create({
  bankCard: {
    margin: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 6,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
