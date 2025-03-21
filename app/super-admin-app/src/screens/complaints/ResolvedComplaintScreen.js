import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import SearchBar from '../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useDispatch, useSelector} from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import ScreensLabel from '../../constants/ScreensLabel';
import NeumorphicButton from '../../component/NeumorphicButton';
import {resolvedComplaintList} from '../../redux/slices/complaint/getResolvedComplaintListSlice';
import CustomeCard from '../../component/CustomeCard';
import {ComplaintFilter} from './ComplaintsFilter';
import List from '../../component/List/List';

const ResolvedComplaintScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const getComplaintListData = useSelector(
    state => state.getResolvedComplaintList,
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
      resolvedComplaintList({
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
      case 'edit':
        navigation.navigate('AddUpdateComplaintScreen', {
          complaint_id: actionButton?.itemData?.id,
        });
        break;
      case 'reactive':
        navigation.navigate('AddUpdateAllocateComplaintScreen', {
          complaint_id: actionButton?.itemData?.id,
          type: 'rework',
        });
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
                key: 'complaint no.',
                value: item?.complaint_unique_id,
                keyColor: Colors().skyBule,
              },
              {
                key: 'COMPLAINT TYPE',
                value: item?.complaint_type,
              },
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
                key: 'Sales Area',
                value:
                  item?.saleAreaDetails &&
                  item?.saleAreaDetails[0]?.sales_area_name,
              },
              {
                key: 'order by',
                value: item?.order_by_details,
              },
              {
                key: 'COMPANY Name',
                value: item?.energy_company_name,
              },
            ]}
            status={[
              {
                key: 'status',
                value: item?.status,
                color: getStatusColor(item?.status),
              },
            ]}
            reactiveButton={true}
            editButton={true}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      resolvedComplaintList({
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
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label.RESOLVED_COMPLAINT} />
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
        status={5}
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
    </SafeAreaView>
  );
};

export default ResolvedComplaintScreen;
