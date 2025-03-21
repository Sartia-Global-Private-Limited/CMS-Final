/*    ----------------Created Date :: 21- Sep -2024   ----------------- */

import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import CustomeHeader from '../../component/CustomeHeader';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AlertModal from '../../component/AlertModal';
import Toast from 'react-native-toast-message';
import SearchBar from '../../component/SearchBar';
import { getAllEnergyCompanyList } from '../../redux/slices/earthing testing/addUpdateETSlice';
import CustomeCard from '../../component/CustomeCard';
import NeumorphicDropDownList from '../../component/DropDownList';
import { getSurveyList } from '../../redux/slices/survey/getAllSurveyListSlice';
import List from '../../component/List/List';
import {
  assignSurveyToEnergyCompany,
  updateSurveyStatus,
} from '../../redux/slices/survey/addUpdateSurveySlice';

const SurveyListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const listData = useSelector(state => state.getSurveyList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [allocatedModalVisible, setAllocatedModalVisible] = useState(false);
  const [itemId, setItemId] = useState('');
  const [allCompanies, setAllCompanies] = useState(null);
  const [CompanyId, setCompanyId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getSurveyList({
        pageSize: pageSize,
        pageNo: pageNo,
        status: getStatusCode(type),
      }),
    );
    getAllEnergyCompanies();
  }, [isFocused]);

  const getAllEnergyCompanies = async () => {
    const res = await dispatch(getAllEnergyCompanyList({})).unwrap();
    if (res.status) {
      const data = res?.data?.map(itm => ({
        label: itm?.name,
        value: itm?.energy_company_id,
      }));
      setAllCompanies(data);
    }
  };

  /*search function*/
  const searchFunction = searchvalue => {
    dispatch(getSurveyList({ search: searchvalue }));
  };

  const onSearchCancel = () => {
    dispatch(
      getSurveyList({
        pageSize: pageSize,
        pageNo: pageNo,
        status: getStatusCode(type),
      }),
    );
  };

  //Get Statuscode for the Api
  const getStatusCode = status => {
    switch (status) {
      case 'requested':
        return 1;
      case 'approved':
        return 2;
      case 'reject':
        return 3;
      case 'allocated':
        return 4;
      case 'all':
        return '';

      default:
        break;
    }
  };

  /*function for getting status color */
  const getStatusColor = status => {
    switch (status) {
      case 1:
        return Colors().pending;
      case 2:
        return Colors().aprroved;
      case 3:
        return Colors().rejected;
      case 4:
        return Colors().partial;

      default:
        break;
    }
  };

  /*function for getting status text */
  const getStatusText = status => {
    switch (status) {
      case 1:
        return 'requested';
      case 2:
        return 'approved';
      case 3:
        return 'rejected';
      case 4:
        return 'allocated';
      default:
        break;
    }
  };

  /* delete Document category delete with id */
  const surveyStatusUpdate = async ({ id, status }) => {
    const reqBody = {
      survey_id: id,
      status: status,
    };
    try {
      const res = await dispatch(updateSurveyStatus(reqBody)).unwrap();
      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setApproveModalVisible(false), setItemId('');
        setRejectModalVisible(false);
        dispatch(
          getSurveyList({
            pageSize: pageSize,
            pageNo: pageNo,
            status: getStatusCode(type),
          }),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: approveResult?.message,
          position: 'bottom',
        });
        setRejectModalVisible(false);
        setApproveModalVisible(false), setItemId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  const AssignEnergyCompanyStatus = async ({ id }) => {
    const reqBody = {
      survey_id: id,
      assign_to: CompanyId,
    };
    try {
      const approveResult = await dispatch(
        assignSurveyToEnergyCompany(reqBody),
      ).unwrap();

      if (approveResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: approveResult?.message,
          position: 'bottom',
        });
        setAllocatedModalVisible(false), setItemId('');
        dispatch(
          getSurveyList({
            pageSize: pageSize,
            pageNo: pageNo,
            status: getStatusCode(type),
          }),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: approveResult?.message,
          position: 'bottom',
        });
        setAllocatedModalVisible(false), setItemId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  const deleteWork = async workId => {
    try {
      const deleteResult = await dispatch(deleteWorkImageById(workId)).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });

        setDeleteModalVisible(false), setItemId('');

        dispatch(
          getAllWorkImages({
            pageSize: pageSize,
            pageNo: pageNo,
            status: getStatusCode(type),
          }),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setItemId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
    }
  };

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateETScreen', {
          edit_id: actionButton?.itemData?.survey_id,
        });

        break;
      case 'delete':
        setDeleteModalVisible(true);
        setItemId(actionButton?.itemData?.survey_id);

        break;
      case 'reject':
        setRejectModalVisible(true);
        setItemId(actionButton?.itemData?.survey_id);

        break;
      case 'approve':
        setApproveModalVisible(true),
          setItemId(actionButton?.itemData?.survey_id);
        break;

      case 'allocate':
        setAllocatedModalVisible(true),
          setItemId(actionButton?.itemData?.survey_id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        disabled={type == 'allocated' ? false : true}
        onPress={() => {
          navigation.navigate('SurveyResponseForm', { id: item?.survey_id });
        }}>
        <CustomeCard
          allData={item}
          data={[
            {
              key: 'Survey Id',
              value: item?.survey_id ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'Survey Name',
              value: item?.title ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'Date',
              value: item?.created_at ?? '--',
            },
          ]}
          status={[
            {
              key: 'status',
              value: getStatusText(item?.status),
              color: getStatusColor(item?.status),
            },
          ]}
          deleteButton={false}
          allocateButton={item?.status == 2}
          approveButton={item?.status == 1 ? true : false}
          rejectButton={item?.status == 1 || item?.status == 2 ? true : false}
          action={handleAction}
        />
      </TouchableOpacity>
    );
  };

  const handlePageClick = () => {
    dispatch(
      getSurveyList({
        pageSize: pageSize,
        pageNo: pageNo,
        status: getStatusCode(type),
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${type || ''} Survey`} />
      <SearchBar setSearchText={setSearchText} />
      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={listData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddSurvey'}
        />
      </View>

      {/*view for modal of upate */}

      {deleteModalVisible && (
        <AlertModal
          visible={deleteModalVisible}
          iconName={'delete-circle-outline'}
          icontype={IconType.MaterialCommunityIcons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO DELETE THIS!!'}
          cancelBtnPress={() => setDeleteModalVisible(!deleteModalVisible)}
          ConfirmBtnPress={() => deleteWork(itemId)}
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
          ConfirmBtnPress={() => surveyStatusUpdate({ id: itemId, status: 2 })}
        />
      )}

      {allocatedModalVisible && (
        <AlertModal
          visible={allocatedModalVisible}
          iconName={'closecircleo'}
          icontype={IconType.AntDesign}
          iconColor={Colors().aprroved}
          textToShow={'ARE YOU SURE YOU WANT TO ASSIGN THIS!!'}
          cancelBtnPress={() =>
            setAllocatedModalVisible(!allocatedModalVisible)
          }
          ConfirmBtnPress={() => {
            AssignEnergyCompanyStatus({ id: itemId });
          }}
          Component={
            <View style={{ marginBottom: 10, flex: 1 }}>
              <NeumorphicDropDownList
                width={WINDOW_WIDTH * 0.8}
                title={'Select Energy Company'}
                required={true}
                data={allCompanies || []}
                value={CompanyId}
                onChange={val => {
                  setCompanyId(val?.value);
                }}
              />
            </View>
          }
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
          ConfirmBtnPress={() => {
            surveyStatusUpdate({ id: itemId, status: 3 });
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default SurveyListScreen;
