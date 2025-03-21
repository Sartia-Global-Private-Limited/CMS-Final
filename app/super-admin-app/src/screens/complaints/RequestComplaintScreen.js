import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import SearchBar from '../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  rejectComplaintById,
  approveComplaintById,
} from '../../redux/slices/complaint/updateComplaintStatusSlice';
import {requestComplaintList} from '../../redux/slices/complaint/getRequestComplaintListSlice';
import AlertModal from '../../component/AlertModal';
import CustomeHeader from '../../component/CustomeHeader';
import ScreensLabel from '../../constants/ScreensLabel';
import {useFormik} from 'formik';
import NeumorphicButton from '../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import CustomeCard from '../../component/CustomeCard';
import {ComplaintFilter} from './ComplaintsFilter';
import List from '../../component/List/List';

const RequestComplaintScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const getComplaintListData = useSelector(
    state => state.getRequestComplaintList,
  );

  /*declare useState variable here */
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
  const [complaintFor, setComplaintFor] = useState('');
  const [companyId, setCompanyId] = useState('');

  useEffect(() => {
    dispatch(
      requestComplaintList({
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

  /* rejectComplaint  function with id */
  const rejectComplaint = async complaintId => {
    const reqbody = {
      id: complaintId,
      remark: formik?.values?.remark,
      status: 4,
    };

    try {
      const rejectResult = await dispatch(
        rejectComplaintById(reqbody),
      ).unwrap();

      if (rejectResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: rejectResult?.message,
          position: 'bottom',
        });
        setRejectModalVisible(false), setComplaintId('');
        dispatch(requestComplaintList({pageSize: pageSize, pageNo: pageNo}));
      } else {
        Toast.show({
          type: 'info',
          text1: rejectResult?.message,
          position: 'bottom',
        });
        setRejectModalVisible(false), setComplaintId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
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
        Toast.show({
          type: 'success',
          text1: rejectResult?.message,
          position: 'bottom',
        });
        setApproveModalVisible(false), setComplaintId('');
        dispatch(requestComplaintList({pageSize: pageSize, pageNo: pageNo}));
      } else {
        Toast.show({
          type: 'info',
          text1: rejectResult?.message,
          position: 'bottom',
        });
        setApproveModalVisible(false), setComplaintId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
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
      case 'approve':
        setApproveModalVisible(true),
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
          style={{}}
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
                key: 'Regional Office',
                value:
                  item?.regionalOffice &&
                  item?.regionalOffice[0]?.regional_office_name,
              },
              {
                key: 'Sales Area',
                value:
                  item?.regionalOffice &&
                  item?.regionalOffice[0]?.regional_office_name,
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
            approveButton={true}
            editButton={true}
            rejectButton={true}
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      requestComplaintList({
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
      <CustomeHeader headerTitle={label.REQUEST_COMPLAINT} />
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
        status={1}
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
      {rejectModalVisible && (
        <AlertModal
          visible={rejectModalVisible}
          iconName={'closecircleo'}
          icontype={IconType.AntDesign}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO REJECT THIS!!'}
          cancelBtnPress={() => {
            setRejectModalVisible(!rejectModalVisible),
              formik.setFieldValue(`remark`, '');
          }}
          ConfirmBtnPress={() => {
            rejectComplaint(complaintId), formik.setFieldValue(`remark`, '');
          }}
          remarkText={formik?.values?.remark}
          onRemarkChange={formik.handleChange('remark')}
          errorMesage={formik?.values?.remark ? '' : 'Remark is required'}
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

export default RequestComplaintScreen;
