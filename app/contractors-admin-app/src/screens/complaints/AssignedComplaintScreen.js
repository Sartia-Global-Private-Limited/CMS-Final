/*    ----------------Created Date :: 14 - Feb -2023   ----------------- */
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import SearchBar from '../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import {
  approveComplaintById,
  rejectAssignedComplaintById,
} from '../../redux/slices/complaint/updateComplaintStatusSlice';
import ScreensLabel from '../../constants/ScreensLabel';
import AlertModal from '../../component/AlertModal';
import { useFormik } from 'formik';
import NeumorphicButton from '../../component/NeumorphicButton';
import { assignComplaintList } from '../../redux/slices/complaint/getAssignComplaintListSlice';
import CustomeCard from '../../component/CustomeCard';
import { ComplaintFilter } from './ComplaintsFilter';
import {
  getAllEndUserAssigned,
  getAllMangerAssinged,
  getAllSupervisorAssigned,
} from '../../redux/slices/commonApi';
import NeumorphicDropDownList from '../../component/DropDownList';
import List from '../../component/List/List';

const AssignedComplaintScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const getComplaintListData = useSelector(
    state => state.getAssignComplaintList,
  );

  /*declare useState variable here */
  const [allManager, setAllManager] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [allEndUser, setAllEndUser] = useState([]);
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [outletId, setOutletId] = useState('');
  const [salesAreaId, setSalesAreaId] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [regionalOfficeId, setRegionalOfficeId] = useState('');
  const [orderById, setOrderById] = useState('');
  const [managerId, setManagerId] = useState('');
  const [supervisorId, setSupervisorId] = useState('');
  const [endUserId, setEndUserId] = useState('');
  const [complaintFor, setComplaintFor] = useState('');
  const [companyId, setCompanyId] = useState('');

  useEffect(() => {
    fetchAllManager();
    dispatch(
      assignComplaintList({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
        sales_area_id: salesAreaId,
        outlet_id: outletId,
        regional_office_id: regionalOfficeId,
        order_by_id: orderById,
        area_manager_id: managerId,
        supervisor_id: supervisorId,
        end_user_id: endUserId,
        company_id: companyId,
        complaint_for: complaintFor,
      }),
    );
  }, [
    isFocused,
    salesAreaId,
    outletId,
    regionalOfficeId,
    orderById,
    managerId,
    supervisorId,
    endUserId,
    companyId,
    complaintFor,
    searchText,
  ]);

  useEffect(() => {
    fetchAllSupervisor();
  }, [managerId]);

  useEffect(() => {
    fetchAllEndUser();
  }, [supervisorId]);

  const fetchAllManager = async () => {
    try {
      const result = await dispatch(getAllMangerAssinged()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllManager(rData);
      } else {
        setAllManager([]);
      }
    } catch (error) {
      setAllManager([]);
    }
  };

  /*function for fetching all supervisor  data*/
  const fetchAllSupervisor = async () => {
    try {
      const result = await dispatch(
        getAllSupervisorAssigned({ id: managerId }),
      ).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllSupervisor(rData);
      } else {
        setAllSupervisor([]);
      }
    } catch (error) {
      setAllSupervisor([]);
    }
  };

  /*function for fetching all end user  data*/
  const fetchAllEndUser = async () => {
    try {
      const result = await dispatch(
        getAllEndUserAssigned({ id: supervisorId }),
      ).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllEndUser(rData);
      } else {
        setAllEndUser([]);
      }
    } catch (error) {
      setAllEndUser([]);
    }
  };

  const formik = useFormik({
    initialValues: {
      remark: '',
    },
  });

  /*for resetting all filter*/
  const resetFunction = () => {
    setOutletId('');
    setOrderById('');
    setRegionalOfficeId('');
    setSalesAreaId('');
    setSearchText('');
    setManagerId('');
    setCompanyId('');
    setComplaintFor('');
    setEndUserId('');
    setSupervisorId('');
  };

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case false:
        return Colors().rejected;
      case true:
        return Colors().aprroved;

      default:
        return 'black';
    }
  }

  /*for getting the text of status*/
  function getStatusText(status) {
    switch (status) {
      case true:
        return 'assigned';

      case false:
        return 'un-assigned';

      default:
        break;
    }
  }

  /* rejectComplaint  function with id */
  const rejectComplaint = async complaintId => {
    const reqbody = {
      id: complaintId,
      remark: formik.values.remark,
      status: 4,
    };

    try {
      const rejectResult = await dispatch(
        rejectAssignedComplaintById(reqbody),
      ).unwrap();

      if (rejectResult?.status === true) {
        ToastAndroid.show(rejectResult?.message, ToastAndroid.LONG);
        setRejectModalVisible(false), setComplaintId('');
        dispatch(assignComplaintList({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        ToastAndroid.show(rejectResult?.message, ToastAndroid.LONG);
        setRejectModalVisible(false), setComplaintId('');
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setRejectModalVisible(false), setComplaintId('');
    }
  };

  /* approved  function with id */
  const approveComplaint = async complaintId => {
    const reqbody = {
      complaint_id: complaintId,
    };
    try {
      const rejectResult = await dispatch(
        approveComplaintById(reqbody),
      ).unwrap();

      if (rejectResult?.status === true) {
        ToastAndroid.show(rejectResult?.message, ToastAndroid.LONG);
        setApproveModalVisible(false), setComplaintId('');
        dispatch(assignComplaintList({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        ToastAndroid.show(rejectResult?.message, ToastAndroid.LONG);
        setApproveModalVisible(false), setComplaintId('');
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setApproveModalVisible(false), setComplaintId('');
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateComplaintScreen', {
          complaint_id: actionButton?.itemData?.id,
        });
        break;
      case 'reject':
        setRejectModalVisible(true), setComplaintId(actionButton?.itemData?.id);
        break;
      case 'allocate':
        navigation.navigate('AddUpdateAllocateComplaintScreen', {
          complaint_id: actionButton?.itemData?.id,
          type: 'allocate',
        });
        break;
      case 'editallocate':
        navigation.navigate('AddUpdateAllocateComplaintScreen', {
          complaint_id: actionButton?.itemData?.id,
          type: 'update',
        });
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ComplaintDetailScreen', {
              complaint_id: item?.id,
            })
          }>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'complaint NO',
                value: item?.complaint_unique_id,
                keyColor: Colors().skyBule,
              },
              { key: 'COMPLAINT TYPE', value: item?.complaint_type },
              {
                key: 'OUTLET',
                value: item.outlet && item?.outlet[0]?.outlet_name,
              },
              {
                key: 'Regional office',
                value:
                  item?.regionalOffice &&
                  item?.regionalOffice[0]?.regional_office_name,
              },
              {
                key: 'sales area',
                value:
                  item?.saleAreaDetails &&
                  item?.saleAreaDetails[0]?.sales_area_name,
              },
              { key: 'order by ', value: item?.order_by_details },
              { key: 'Manager', value: item?.area_manager_name },
              { key: 'supervisor', value: item?.supervisor_name },
              { key: 'end user', value: item?.end_user_details_name },
              { key: 'COMPANY Name', value: item?.energy_company_name },
            ]}
            status={[
              {
                key: 'status',
                value: getStatusText(item?.isComplaintAssigned),
                color: getStatusColor(item?.isComplaintAssigned),
              },
            ]}
            editButton={true}
            rejectButton={true}
            allocateButton={true}
            editAllocateButton={true}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = number => {
    setPageNo(number);
    dispatch(
      assignComplaintList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
        sales_area_id: salesAreaId,
        outlet_id: outletId,
        regional_office_id: regionalOfficeId,
        order_by_id: orderById,
        area_manager_id: managerId,
        supervisor_id: supervisorId,
        end_user_id: endUserId,
        company_id: companyId,
        complaint_for: complaintFor,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <View style={{ flexDirection: 'row' }}>
        <SearchBar
          searchWidth={WINDOW_WIDTH * 0.78}
          setSearchText={setSearchText}
        />
        <View style={{ alignSelf: 'center' }}>
          <NeumorphicButton
            title={label.RESET}
            fontSize={WINDOW_HEIGHT * 0.015}
            btnHeight={WINDOW_HEIGHT * 0.05}
            btnWidth={WINDOW_WIDTH * 0.16}
            btnBgColor={Colors().purple}
            titleColor={Colors().lightShadow}
            btnRadius={8}
            onPress={() => resetFunction()}
          />
        </View>
      </View>
      {/* filter component  */}
      <ComplaintFilter
        setSalesAreaId={setSalesAreaId}
        salesAreaId={salesAreaId}
        setCompanyId={setCompanyId}
        companyId={companyId}
        setComplaintFor={setComplaintFor}
        complaintFor={complaintFor}
        setOutletId={setOutletId}
        outletId={outletId}
        setRegionalOfficeId={setRegionalOfficeId}
        regionalOfficeId={regionalOfficeId}
        setOrderById={setOrderById}
        orderById={orderById}
        setStatusValue={setStatusValue}
        statusValue={statusValue}
        status={3}
        component={
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.053}
              width={WINDOW_WIDTH * 0.8}
              title={'Manager'}
              data={allManager}
              value={managerId}
              onChange={val => {
                setManagerId(val.value);
              }}
              onCancle={() => setManagerId('')}
            />

            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.053}
              width={WINDOW_WIDTH * 0.8}
              title={'SuperVisor'}
              data={allSupervisor}
              value={supervisorId}
              onCancle={() => setSupervisorId('')}
              onChange={val => {
                setSupervisorId(val.value);
              }}
            />

            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.053}
              width={WINDOW_WIDTH * 0.8}
              title={'End user'}
              data={allEndUser}
              value={endUserId}
              onCancle={() => setEndUserId('')}
              onChange={val => {
                setEndUserId(val.value);
              }}
            />
          </View>
        }
      />

      <View style={{ height: WINDOW_HEIGHT * 0.82, width: WINDOW_WIDTH }}>
        <List
          data={getComplaintListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateComplaintScreen'}
        />
      </View>

      {rejectModalVisible && (
        <AlertModal
          visible={rejectModalVisible}
          iconName={'closecircleo'}
          icontype={IconType.AntDesign}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO REJECT THIS!!'}
          cancelBtnPress={() => setRejectModalVisible(!rejectModalVisible)}
          ConfirmBtnPress={() => rejectComplaint(complaintId)}
          remarkText={formik.values.remark}
          onRemarkChange={formik.handleChange('remark')}
          errorMesage={formik.values.remark ? '' : 'Remark is required'}
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
          ConfirmBtnPress={() => approveComplaint(complaintId)}
        />
      )}
    </SafeAreaView>
  );
};

export default AssignedComplaintScreen;
