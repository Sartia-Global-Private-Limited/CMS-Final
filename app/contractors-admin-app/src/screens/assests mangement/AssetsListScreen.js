/*    ----------------Created Date :: 19- Sep -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../component/CustomeCard';
import AlertModal from '../../component/AlertModal';
import IconType from '../../constants/IconType';
import Toast from 'react-native-toast-message';
import SearchBar from '../../component/SearchBar';
import { getAssestListWithCode } from '../../redux/slices/assest mangement/getAssestListSlice';
import {
  approveAndRejectAssests,
  assignAssests,
  deleteAssestById,
  updateStatusOfAssests,
} from '../../redux/slices/assest mangement/addUpdateAssestSlice';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import NeumorphicDropDownList from '../../component/DropDownList';
import { getAllUsers } from '../../redux/slices/commonApi';
import CustomeHeader from '../../component/CustomeHeader';
import List from '../../component/List/List';

const AssetsListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getAssestList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [sendToRepairModalVisible, setSendToRepairModalVisible] =
    useState(false);
  const [repairCompleteModalVisible, setRepairCompleteModalVisible] =
    useState(false);
  const [sendToScrapModalVisible, setSendToSrapModalVisible] = useState(false);
  const [allocateModalVisible, setAllocateModalVisible] = useState(false);
  const [assestId, setAssestId] = useState('');
  const [descriptionText, setDescriptionText] = useState('');
  const [userId, setUserId] = useState('');
  const [allUser, setAllUser] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getAssestListWithCode({
          status: getStatusCode(type),
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    });
    fetchUserData();
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    dispatch(
      getAssestListWithCode({
        status: getStatusCode(type),
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
    fetchUserData();
  }, [searchText]);

  /*function for fetching User list data*/
  const fetchUserData = async () => {
    try {
      const result = await dispatch(getAllUsers()).unwrap();
      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
          image: itm?.image,
        }));
        setAllUser(rData);
      } else {
        setAllUser([]);
      }
    } catch (error) {
      setAllUser([]);
    }
  };

  // function for status code//
  const getStatusCode = status => {
    switch (status) {
      case 'requested':
        return 1;
      case 'approved':
        return 2;
      case 'reject':
        return 3;
      case 'assigned':
        return 4;
      case 'repair':
        return 5;
      case 'scrap':
        return 6;
      case 'all':
        return '';

      default:
        break;
    }
  };

  /*function for getting status color */
  const getStatusColor = status => {
    switch (status) {
      case '1':
        return Colors().pending;
      case '2':
        return Colors().aprroved;
      case '3':
        return Colors().rejected;
      case '4':
        return Colors().resolved;
      case '5':
        return Colors().rejected;
      case '6':
        return Colors().red;

      default:
        break;
    }
  };

  /*function for getting status Text */
  const getStatusText = status => {
    switch (status) {
      case '1':
        return 'requested';
      case '2':
        return 'approved';
      case '3':
        return 'rejected';
      case '4':
        return 'assigned';
      case '5':
        return 'repair';
      case '6':
        return 'scrapped';

      default:
        break;
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateAssestScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      case 'delete':
        setDeleteModalVisible(true);
        setAssestId(actionButton?.itemData?.id);

        break;
      case 'reject':
        setRejectModalVisible(true);
        setAssestId(actionButton?.itemData?.id);

        break;
      case 'approve':
        setApproveModalVisible(true);
        setAssestId(actionButton?.itemData?.id);

        break;
      case 'tool':
        setSendToRepairModalVisible(true);
        setAssestId(actionButton?.itemData?.id);
        break;
      case 'doubleCheck':
        setRepairCompleteModalVisible(true);
        setAssestId(actionButton?.itemData?.id);
        break;
      case 'autoDelete':
        setSendToSrapModalVisible(true);
        setAssestId(actionButton?.itemData?.id);
        break;
      case 'allocate':
        setAllocateModalVisible(true);
        setAssestId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /*Function  for approve assest */
  const approveOfAssest = async assestId => {
    const result = await dispatch(
      approveAndRejectAssests({ status: 2, id: assestId }),
    ).unwrap();
    if (result?.status) {
      setApproveModalVisible(false);
      setAssestId('');
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setApproveModalVisible(false);
      setAssestId('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /*Function  for reject assest*/
  const rejectOfAssest = async assestId => {
    const result = await dispatch(
      approveAndRejectAssests({ status: 3, id: assestId }),
    ).unwrap();
    if (result?.status) {
      setRejectModalVisible(false);
      setAssestId('');
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setRejectModalVisible(false);
      setAssestId('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };
  /*Function  for sending assest to repair */
  const sendToRepairAssest = async assestId => {
    const reqBody = {
      id: assestId,
      status: '5',
      description: descriptionText,
    };
    const result = await dispatch(updateStatusOfAssests(reqBody)).unwrap();
    if (result?.status) {
      setSendToRepairModalVisible(false);
      setAssestId('');
      setDescriptionText('');

      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setRejectModalVisible(false);
      setAssestId('');
      setDescriptionText('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /*Function  for repair complete assest */
  const completeRepairAssest = async assestId => {
    const reqBody = {
      id: assestId,
      status: '2',
      description: descriptionText,
    };
    const result = await dispatch(updateStatusOfAssests(reqBody)).unwrap();
    if (result?.status) {
      setRepairCompleteModalVisible(false);
      setAssestId('');
      setDescriptionText('');

      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setRepairCompleteModalVisible(false);
      setAssestId('');
      setDescriptionText('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /*Function  for sendign  assest to scrap */
  const sendToScrapAssest = async assestId => {
    const reqBody = {
      id: assestId,
      status: '6',
      description: descriptionText,
    };
    const result = await dispatch(updateStatusOfAssests(reqBody)).unwrap();
    if (result?.status) {
      setSendToSrapModalVisible(false);
      setAssestId('');
      setDescriptionText('');

      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setSendToSrapModalVisible(false);
      setAssestId('');
      setDescriptionText('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /*Function  for assigning  assest to user */
  const assignAssestToUser = async assestId => {
    const reqBody = {
      asset_id: assestId,
      user_id: userId,
      notes: descriptionText,
    };
    const result = await dispatch(assignAssests(reqBody)).unwrap();
    if (result?.status) {
      setAllocateModalVisible(false);
      setAssestId('');
      setUserId('');
      setDescriptionText('');
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
    } else {
      setAllocateModalVisible(false);
      setAssestId('');
      setUserId('');
      setDescriptionText('');
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
    }
  };

  /* delete assests  with id */
  const deleteAssest = async assestId => {
    try {
      const deleteResult = await dispatch(deleteAssestById(assestId)).unwrap();
      if (deleteResult?.status) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setAssestId('');
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setAssestId('');
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
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AssestDetailScreen', {
              id: item?.id,
            });
          }}>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'name',
                value: item?.asset_name ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'Model no',
                value: item?.asset_model_number ?? '--',
              },
              {
                key: 'UIn no',
                value: item?.asset_uin_number ?? '--',
              },
              {
                key: 'price',
                value: `₹ ${item?.asset_price}` ?? '--',
                keyColor: Colors().aprroved,
              },

              {
                key: 'Purchase date',
                value: item?.asset_purchase_date ?? '--',
              },
            ]}
            status={[
              {
                key: 'status',
                value: getStatusText(item?.status),
                color: getStatusColor(item?.status),
              },
            ]}
            editButton={
              item?.status == '1' || item?.status == '2' || item?.status == '4'
                ? true
                : false
            }
            deleteButton={true}
            approveButton={item?.status == '1' ? true : false}
            rejectButton={
              item?.status == '1' || item?.status == '2' ? true : false
            }
            allocateButton={item?.status == '2' ? true : false}
            toolButton={item?.status == '4' ? true : false}
            doubleCheckButton={item?.status == '5' ? true : false}
            autoDeletButton={item?.status == '5' ? true : false}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getAssestListWithCode({
        status: getStatusCode(type),
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${type} Assets`} />
      {/*Seacrh componenet */}
      <SearchBar setSearchText={setSearchText} />

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateAssestScreen'}
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
          ConfirmBtnPress={() => deleteAssest(assestId)}
        />
      )}
      {approveModalVisible && (
        <AlertModal
          visible={approveModalVisible}
          iconName={'checkcircleo'}
          icontype={IconType.AntDesign}
          iconColor={Colors().aprroved}
          textToShow={'ARE YOU SURE YOU WANT TO APPROVE THIS!!'}
          cancelBtnPress={() => setApproveModalVisible(!approveModalVisible)}
          ConfirmBtnPress={() => approveOfAssest(assestId)}
        />
      )}
      {rejectModalVisible && (
        <AlertModal
          visible={rejectModalVisible}
          iconName={'closecircleo'}
          icontype={IconType.AntDesign}
          iconColor={Colors().rejected}
          textToShow={'ARE YOU SURE YOU WANT TO REJECT THIS!!'}
          cancelBtnPress={() => setRejectModalVisible(!rejectModalVisible)}
          ConfirmBtnPress={() => rejectOfAssest(assestId)}
        />
      )}
      {sendToRepairModalVisible && (
        <AlertModal
          visible={sendToRepairModalVisible}
          iconName={'tools'}
          icontype={IconType.Entypo}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO SEND TO REPAIR THIS!!'}
          cancelBtnPress={() => {
            setSendToRepairModalVisible(!sendToRepairModalVisible);
            setDescriptionText('');
          }}
          Component={
            <View style={{ marginBottom: 20 }}>
              <NeumorphicTextInput
                placeHolderTxt={'DESCRIPTION...'}
                placeHolderTxtColor={Colors().pureBlack}
                // width={WINDOW_WIDTH * 0.44}
                value={descriptionText}
                onChangeText={text => setDescriptionText(text)}
                style={[styles.inputText, { color: Colors().pureBlack }]}
              />
            </View>
          }
          ConfirmBtnPress={() => sendToRepairAssest(assestId)}
        />
      )}
      {repairCompleteModalVisible && (
        <AlertModal
          visible={repairCompleteModalVisible}
          iconName={'check-double'}
          icontype={IconType.FontAwesome5}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO COMPLETE REPAIR OF ASSEST!!'}
          cancelBtnPress={() => {
            setRepairCompleteModalVisible(!repairCompleteModalVisible);
            setDescriptionText('');
          }}
          Component={
            <View style={{ marginBottom: 20 }}>
              <NeumorphicTextInput
                placeHolderTxt={'DESCRIPTION...'}
                placeHolderTxtColor={Colors().pureBlack}
                // width={WINDOW_WIDTH * 0.44}
                value={descriptionText}
                onChangeText={text => setDescriptionText(text)}
                style={[styles.inputText, { color: Colors().pureBlack }]}
              />
            </View>
          }
          ConfirmBtnPress={() => completeRepairAssest(assestId)}
        />
      )}
      {sendToScrapModalVisible && (
        <AlertModal
          visible={sendToScrapModalVisible}
          iconName={'auto-delete'}
          icontype={IconType.MaterialIcons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO SEND THIS ASSEST TO SCRAP'}
          cancelBtnPress={() => {
            setSendToSrapModalVisible(!sendToScrapModalVisible);
            setDescriptionText('');
          }}
          Component={
            <View style={{ marginBottom: 20 }}>
              <NeumorphicTextInput
                placeHolderTxt={'DESCRIPTION...'}
                placeHolderTxtColor={Colors().pureBlack}
                // width={WINDOW_WIDTH * 0.44}
                value={descriptionText}
                onChangeText={text => setDescriptionText(text)}
                style={[styles.inputText, { color: Colors().pureBlack }]}
              />
            </View>
          }
          ConfirmBtnPress={() => sendToScrapAssest(assestId)}
        />
      )}
      {allocateModalVisible && (
        <AlertModal
          visible={allocateModalVisible}
          iconName={'account-edit-outline'}
          icontype={IconType.MaterialCommunityIcons}
          iconColor={Colors().aprroved}
          textToShow={'ARE YOU SURE YOU WANT TO ALLOCATE USER'}
          cancelBtnPress={() => {
            setAllocateModalVisible(!allocateModalVisible);
            setUserId('');
            setDescriptionText('');
          }}
          Component={
            <View style={{ gap: 10, marginBottom: 20 }}>
              <NeumorphicDropDownList
                placeholder={'sELECT USER ....'}
                data={allUser}
                value={userId}
                onChange={val => {
                  setUserId(val?.value);
                }}
              />
              {!userId && (
                <Text style={styles.errorMesage}>{'User is required'}</Text>
              )}

              <NeumorphicTextInput
                placeholder={'DESCRIPTION'}
                value={descriptionText}
                onChangeText={text => setDescriptionText(text)}
              />
            </View>
          }
          ConfirmBtnPress={() => userId && assignAssestToUser(assestId)}
        />
      )}
    </SafeAreaView>
  );
};

export default AssetsListScreen;

const styles = StyleSheet.create({
  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  errorMesage: {
    color: 'red',
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
