/*    ----------------Created Date :: 7 - Sep -2023   ----------------- */
import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import SearchBar from '../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import NeumorphicButton from '../../component/NeumorphicButton';
import {allocatedComplaintList} from '../../redux/slices/complaint/getAllocatedComplaintListSlice';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeCard from '../../component/CustomeCard';
import AlertModal from '../../component/AlertModal';
import NeumorphicDropDownList from '../../component/DropDownList';
import Toast from 'react-native-toast-message';
import {
  getAllEndUserAssigned,
  getAllMangerAssinged,
  getAllSupervisorAssigned,
  updateAllocateComplaintStatus,
} from '../../redux/slices/commonApi';
import {ComplaintFilter} from './ComplaintsFilter';
import List from '../../component/List/List';

const AllocatedComplaintScreenListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const getComplaintListData = useSelector(
    state => state.getAllocatedComplaintList,
  );

  /*declare useState variable here */
  const [allManager, setAllManager] = useState([]);
  const [allSupervisor, setAllSupervisor] = useState([]);
  const [allEndUser, setAllEndUser] = useState([]);
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
  const [complaintId, setComplaintId] = useState('');
  const [statuCode, setStatusCode] = useState('');
  const [updateModalVisible, setUpdateModalVisble] = useState(false);

  useEffect(() => {
    fetchAllManager();
    dispatch(
      allocatedComplaintList({
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

  const fetchAllSupervisor = async () => {
    try {
      const result = await dispatch(
        getAllSupervisorAssigned({id: managerId}),
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
        getAllEndUserAssigned({id: supervisorId}),
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

  const statusChangeData = [
    {
      label: 'Hold',
      value: 6,
    },
    {
      label: 'Resolve',
      value: 5,
    },
  ];

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'pending':
        return Colors().pending;
      case 'rejected':
        return Colors().rejected;
      case 'working':
        return Colors().working;
      case 'approved':
        return Colors().aprroved;
      case 'resolved':
        return Colors().resolved;
      default:
        return 'black';
    }
  }

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'cycle':
        setUpdateModalVisble(true), setComplaintId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
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
              {key: 'COMPLAINT TYPE', value: item?.complaint_type},
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
              {key: 'order by', value: item?.order_by_details},
              {key: 'manager', value: item?.area_manager_name},
              {key: 'Supervisor', value: item?.supervisor_name},
              {key: 'end user', value: item?.end_user_details_name},
              {key: 'COMPANY Name', value: item?.energy_company_name},
            ]}
            status={[
              {
                key: 'status',
                value: item?.status,
                color: getStatusColor(item?.status),
              },
            ]}
            changeStatusButton={true}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      allocatedComplaintList({
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

  // updating the status of complaint
  const changeComplaintStatus = async () => {
    const reqBody = {
      complaint_id: complaintId,
      status: statuCode,
    };
    const result = await dispatch(
      updateAllocateComplaintStatus(reqBody),
    ).unwrap();
    try {
      if (result?.status) {
        setUpdateModalVisble(false);
        setStatusCode('');
        Toast.show({
          type: 'success',
          text1: result?.message,
          position: 'bottom',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });
        setUpdateModalVisble(false);
        setStatusCode('');
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
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label.ALLOCATE_COMPLAINT} />
      <View style={{flexDirection: 'row'}}>
        <SearchBar
          searchWidth={WINDOW_WIDTH * 0.78}
          setSearchText={setSearchText}
        />
        <View style={{alignSelf: 'center'}}>
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
          <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
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

      <View style={{height: WINDOW_HEIGHT * 0.82, width: WINDOW_WIDTH}}>
        <List
          data={getComplaintListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateComplaintScreen'}
        />
      </View>
      {/* modal view for ACTION */}

      {updateModalVisible && (
        <AlertModal
          visible={updateModalVisible}
          iconName={'cycle'}
          icontype={IconType.Entypo}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO UPDATE STATUS!!!'}
          cancelBtnPress={() => {
            setUpdateModalVisble(!updateModalVisible), setStatusCode('');
          }}
          Component={
            <View style={{marginVertical: 10}}>
              <NeumorphicDropDownList
                width={WINDOW_WIDTH * 0.5}
                placeholder={'UPDATE STATUS'}
                data={statusChangeData}
                value={statuCode}
                onChange={val => {
                  setStatusCode(val.value);
                }}
              />
            </View>
          }
          ConfirmBtnPress={() => changeComplaintStatus()}
        />
      )}
    </SafeAreaView>
  );
};

export default AllocatedComplaintScreenListScreen;
