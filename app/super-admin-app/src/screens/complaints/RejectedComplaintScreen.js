import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import SearchBar from '../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeHeader from '../../component/CustomeHeader';
import ScreensLabel from '../../constants/ScreensLabel';
import NeumorphicButton from '../../component/NeumorphicButton';
import {rejectedComplaintList} from '../../redux/slices/complaint/getRejectedComplaintListSlice';
import AlertModal from '../../component/AlertModal';
import {reactiveComplaintById} from '../../redux/slices/complaint/updateComplaintStatusSlice';
import Toast from 'react-native-toast-message';
import CustomeCard from '../../component/CustomeCard';
import List from '../../component/List/List';
import {ComplaintFilter} from './ComplaintsFilter';

const RejectedComplaintScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const getComplaintListData = useSelector(
    state => state.getRejectedComplaintList,
  );

  /*declare useState variable here */
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [outletId, setOutletId] = useState('');
  const [complaintId, setComplaintId] = useState('');
  const [salesAreaId, setSalesAreaId] = useState('');
  const [statusValue, setStatusValue] = useState('');
  const [regionalOfficeId, setRegionalOfficeId] = useState('');
  const [orderById, setOrderById] = useState('');
  const [complaintFor, setComplaintFor] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [reactiveModalVisible, setReactiveModalVisble] = useState(false);

  useEffect(() => {
    dispatch(
      rejectedComplaintList({
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

  /* reactive complaint  function with id */
  const reactiveComplaint = async complaintId => {
    try {
      const reactiveResult = await dispatch(
        reactiveComplaintById(complaintId),
      ).unwrap();

      if (reactiveResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: reactiveResult?.message,
          position: 'bottom',
        });
        setReactiveModalVisble(false), setComplaintId('');
        dispatch(rejectedComplaintList({pageSize: pageSize, pageNo: pageNo}));
      } else {
        Toast.show({
          type: 'info',
          text1: reactiveResult?.message,
          position: 'bottom',
        });
        setReactiveModalVisble(false), setComplaintId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setReactiveModalVisble(false), setComplaintId('');
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'reactive':
        setReactiveModalVisble(true),
          setComplaintId(actionButton?.itemData?.id);
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
              {key: 'COMPANY Name', value: item?.energy_company_name},
            ]}
            status={[
              {
                key: 'status',
                value: item?.status,
                color: getStatusColor(item?.status),
              },
            ]}
            reactiveButton={true}
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
      rejectedComplaintList({
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
      <CustomeHeader headerTitle={label.REJECTED_COMPLAINT} />
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

      {/* modal view for ACTION */}

      {reactiveModalVisible && (
        <AlertModal
          visible={reactiveModalVisible}
          iconName={'refresh-circle-outline'}
          icontype={IconType.Ionicons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO RE-ACTIVE THIS!!'}
          cancelBtnPress={() => setReactiveModalVisble(!reactiveModalVisible)}
          ConfirmBtnPress={() => reactiveComplaint(complaintId)}
        />
      )}
    </SafeAreaView>
  );
};

export default RejectedComplaintScreen;
