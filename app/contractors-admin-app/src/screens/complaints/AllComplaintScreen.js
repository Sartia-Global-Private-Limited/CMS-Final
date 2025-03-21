import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import SearchBar from '../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import ScreensLabel from '../../constants/ScreensLabel';
import NeumorphicButton from '../../component/NeumorphicButton';
import { allComplaintList } from '../../redux/slices/complaint/getAllComplaintListSlice';
import CustomeCard from '../../component/CustomeCard';
import { ComplaintFilter } from './ComplaintsFilter';
import {
  getAllEndUserAssigned,
  getAllMangerAssinged,
  getAllSupervisorAssigned,
} from '../../redux/slices/commonApi';
import NeumorphicDropDownList from '../../component/DropDownList';
import List from '../../component/List/List';

const AllComplaintScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const getComplaintListData = useSelector(state => state.getAllComplaintList);

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

  useEffect(() => {
    fetchAllManager();
    dispatch(
      allComplaintList({
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
    searchText,
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
      case 'Hold':
        return Colors().partial;
      default:
        return 'black';
    }
  }

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
                key: 'Complaint no.',
                value: item?.complaint_unique_id,
                keyColor: Colors().skyBule,
              },
              {
                key: 'Complaint Type',
                value: item?.complaint_type,
              },
              {
                key: 'Outlet',
                value: item.outlet && item?.outlet[0]?.outlet_name,
              },
              {
                key: 'Regional office',
                value:
                  item?.regionalOffice &&
                  item?.regionalOffice[0]?.regional_office_name,
              },
              {
                key: 'Sales Area',
                value:
                  item?.saleAreaDetails &&
                  item?.saleAreaDetails[0]?.sales_area_name,
              },
              {
                key: 'Order by',
                value: item?.order_by_details,
              },
              {
                key: 'Company Name',
                value: item?.energy_company_name,
              },
            ]}
            status={[
              {
                key: 'Status',
                value: item?.status,
                color: getStatusColor(item?.status),
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      allComplaintList({
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
      <CustomeHeader headerTitle={label.All_COMPLAINT} />
      <View style={{ flexDirection: 'row' }}>
        <SearchBar
          setSearchText={setSearchText}
          placeholderText={`${label.SEARCH}`}
          value={searchText}
          searchWidth={WINDOW_WIDTH * 0.775}
        />
        <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
          <NeumorphicButton
            title={label.RESET}
            fontSize={WINDOW_HEIGHT * 0.015}
            btnHeight={WINDOW_HEIGHT * 0.045}
            btnWidth={WINDOW_WIDTH * 0.16}
            btnBgColor={Colors().purple}
            titleColor={Colors().lightShadow}
            btnRadius={8}
            onPress={() => resetFunction()}
          />
        </View>
      </View>

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
        status={0}
        component={
          <View style={{ display: 'flex', flexDirection: 'row', gap: 10 }}>
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.053}
              width={WINDOW_WIDTH * 0.8}
              placeHolderTxt={'Manager'}
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
              placeHolderTxt={'SuperVisor'}
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
              placeHolderTxt={'End user'}
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

      <View style={{ height: WINDOW_HEIGHT * 0.825, width: WINDOW_WIDTH }}>
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
    </SafeAreaView>
  );
};

export default AllComplaintScreen;
