/*    ----------------Created Date :: 7- sep -2023   ----------------- */
import { StyleSheet, View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import SearchBar from '../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import ScreensLabel from '../../constants/ScreensLabel';
import NeumorphicButton from '../../component/NeumorphicButton';
import { approvedComplaintList } from '../../redux/slices/complaint/getAllApprovedComplaintListSlice';
import CustomeCard from '../../component/CustomeCard';
import { ComplaintFilter } from './ComplaintsFilter';
import List from '../../component/List/List';

const AllApprovedComplaintScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const getComplaintListData = useSelector(
    state => state.getAllApprovedComplaintList,
  );

  /*declare useState variable here */
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [outletId, setOutletId] = useState('');
  const [salesAreaId, setSalesAreaId] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [regionalOfficeId, setRegionalOfficeId] = useState('');
  const [orderById, setOrderById] = useState('');
  const [complaintFor, setComplaintFor] = useState('');
  const [companyId, setCompanyId] = useState('');

  useEffect(() => {
    dispatch(
      approvedComplaintList({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
        sales_area_id: salesAreaId,
        outlet_id: outletId,
        regional_office_id: regionalOfficeId,
        order_by_id: orderById,
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
    companyId,
    complaintFor,
    searchText,
  ]);

  /*for resetting all filter*/
  const resetFunction = () => {
    setOutletId('');
    setOrderById('');
    setRegionalOfficeId('');
    setSalesAreaId('');
    setSearchText('');
    setCompanyId('');
    setComplaintFor('');
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

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateComplaintScreen', {
          complaint_id: actionButton?.itemData?.id,
        });
        break;

      case 'allocate':
        navigation.navigate('AddUpdateAllocateComplaintScreen', {
          complaint_id: actionButton?.itemData?.id,
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
                key: 'complaint no.',
                value: item?.complaint_unique_id,
                keyColor: Colors().skyBule,
              },
              { key: 'COMPLAINT TYPE', value: item?.complaint_type },
              {
                key: 'OUTLET ',
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
              { key: 'order by', value: item?.order_by_details },
              { key: 'COMPANY Name ', value: item?.energy_company_name },
            ]}
            status={[
              {
                key: 'status',
                value: getStatusText(item?.isComplaintAssigned),
                color: getStatusColor(item?.isComplaintAssigned),
              },
            ]}
            editButton={true}
            allocateButton={true}
            editAllocateButton={item?.isComplaintAssigned ? true : false}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      approvedComplaintList({
        pageSize: pageSize,
        pageNo: pageNo,
        sales_area_id: salesAreaId,
        outlet_id: outletId,
        regional_office_id: regionalOfficeId,
        order_by_id: orderById,
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
        status={4}
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
    </SafeAreaView>
  );
};

export default AllApprovedComplaintScreen;

const styles = StyleSheet.create({
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  paginationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  activeButton: {
    backgroundColor: '#22c55d',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
