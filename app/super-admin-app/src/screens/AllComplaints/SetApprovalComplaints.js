import {
  View,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ScreensLabel from '../../constants/ScreensLabel';
import NeumorphicButton from '../../component/NeumorphicButton';
import CustomeCard from '../../component/CustomeCard';
import List from '../../component/List/List';
import {getAllAdminComplaints} from '../../redux/slices/adminComplaint/getAllAdminComplaintListSlice';
import moment from 'moment';
import NeumorphicDropDownList from '../../component/DropDownList';
import {
  getApprovelMemberList,
  postApprovelMemberList,
} from '../../services/authApi';
import Toast from 'react-native-toast-message';
import {getAllNotApprovedComplaints} from '../../redux/slices/adminComplaint/getNotApprovedComplaintListSlice';
import CustomeHeader from '../../component/CustomeHeader';

const SetApprovalComplaints = ({navigation, route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getNotApprovedComplaint);
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [regionalOfficeId, setRegionalOfficeId] = useState(0);
  const [roleId, setRoleId] = useState(0);
  const [customeDate, setcustomeDate] = useState('');
  const [allRoles, setAllRoles] = useState([]);
  const [checkData, setCheckData] = useState([{}]);
  const [filterChekcBox, setFilterChekcBox] = useState([]);

  const sdata = {
    custom_date: customeDate,
    regional_id: regionalOfficeId,
    zone_id: roleId,
  };

  useEffect(() => {
    const filteredData = checkData.filter(itm => itm?.chekedValue === true);
    setFilterChekcBox(filteredData);
  }, [checkData]);

  useEffect(() => {
    getApprovalRoles();
  }, []);

  const getApprovalRoles = async () => {
    try {
      const res = await getApprovelMemberList();
      if (res.status) {
        const rdata = res?.data?.map(i => ({label: i?.name, value: i?.id}));
        setAllRoles(rdata);
      } else {
        setAllRoles([]);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getAllNotApprovedComplaints({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    });
    return unsubscribe;
  }, [searchText, isFocused, regionalOfficeId, roleId, type]);

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 1:
        return Colors().pending;
      case 4:
        return Colors().rejected;
      case 5:
        return Colors().purple;
      case 3:
        return Colors().aprroved;
      case 'resolved':
        return Colors().resolved;
      case 'Hold':
        return Colors().partial;
      default:
        return 'black';
    }
  }

  /* for getting color of status*/
  function getStatusText(action) {
    switch (action) {
      case 1:
        return 'Pending';
      case 4:
        return 'Rejected';
      case 5:
        return 'New Complaint';
      case 3:
        return 'Approved';
      case 'resolved':
        return Colors().resolved;
      case 'Hold':
        return Colors().partial;
      default:
        return 'black';
    }
  }

  /*for updating the checkbox*/
  const updateCheckDataAtIndex = (index, value) => {
    setCheckData(prevState => {
      const newState = [...prevState];
      newState[index] = value;
      return newState;
    });
  };

  /* flatlist render ui */
  const renderItem = ({item, index}) => {
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
                key: 'Company Name',
                value: item?.ec_name,
              },
              {
                key: 'Complaint Type',
                value: item?.complaint_type_name,
              },
              {
                key: 'Date',
                value: moment(item?.complaint_create_date).format('DD/MM/YYYY'),
              },
            ]}
            status={[
              {
                key: 'Status',
                value: getStatusText(item?.status),
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
      getAllAdminComplaints({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
        body: sdata,
        type: type,
      }),
    );
  };

  const ListFooterComponent = () => (
    <View style={{alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.02}}>
      {
        <NeumorphicButton
          title={'Submit'}
          btnBgColor={Colors().purple}
          titleColor={Colors().inputLightShadow}
          onPress={() => {}}
        />
      }
    </View>
  );

  function areAllIdsPresent(listedData, allData) {
    // Check if listedData is empty
    if (listedData.length === 0) {
      return false;
    }
    const listedIds = listedData.map(item => item.id);
    const allIds = allData.map(item => item.id);
    return allIds.every(id => listedIds.includes(id));
  }

  const setApprovalOwner = async () => {
    const body = {
      complaint_list: [],
      role_id: roleId,
    };
    try {
      const res = await postApprovelMemberList(body);
      if (res.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
      } else {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={'Set Approval'} />
      <View
        style={{
          flexDirection: 'row',
          alignSelf: 'center',
          justifyContent: 'center',
          gap: 5,
          marginTop: 5,
        }}>
        <NeumorphicDropDownList
          height={WINDOW_HEIGHT * 0.052}
          placeHolderTxt={'Role Name'}
          value={roleId}
          title={'Select Role'}
          data={allRoles}
          onCancle={() => {
            setRoleId('');
          }}
          onChange={e => {
            setRoleId(e ? e.value : '');
          }}
        />
      </View>

      <View style={{padding: 10}}>
        <Text style={{color: Colors().gray2, fontSize: 16, fontWeight: '300'}}>
          ⓘ Select the role you want to allow for complaint approval.
        </Text>
      </View>
      <View
        style={{marginTop: 10, alignItems: 'center', justifyContent: 'center'}}>
        <NeumorphicButton
          title={label.SUBMIT}
          fontSize={WINDOW_HEIGHT * 0.015}
          btnHeight={WINDOW_HEIGHT * 0.045}
          btnWidth={WINDOW_WIDTH * 0.45}
          btnBgColor={Colors().purple}
          titleColor={Colors().lightShadow}
          btnRadius={8}
          onPress={() => setApprovalOwner()}
        />
      </View>

      {/* {!ListData?.isLoading && !ListData?.isError && ListData?.data?.status && (
        <View
          style={{
            alignSelf: 'flex-end',
            flexDirection: 'row',
            marginRight: 15,
          }}>
          <Text
            style={[
              styles.cardHeadingTxt,
              {color: Colors().purple, fontSize: 15, marginRight: 20},
            ]}>
            Select All
          </Text>
          <NeumorphicCheckbox
            isChecked={areAllIdsPresent(filterChekcBox, ListData?.data?.data)}
            onChange={e => {
              ListData?.data?.data?.map((itm, idx) => {
                //   const body = {
                //     chekedValue: e,
                //     complaintFor: itm?.complaintDetails[0]?.complaint_for,
                //     id: itm?.id,
                //     billing_from_state_id: itm?.billing_from_state_id,
                //     financial_year: itm?.financial_year,
                //   };
                //   updateCheckDataAtIndex(idx, (val = body));
              });
            }}
          />
        </View>
      )} */}

      {/* <View style={{height: WINDOW_HEIGHT * 0.87, width: WINDOW_WIDTH}}>
        <List
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          //   ListFooterComponent={ListFooterComponent}
          addAction={'AddUpdateComplaintScreen'}
        />
      </View> */}
    </SafeAreaView>
  );
};

export default SetApprovalComplaints;

const styles = StyleSheet.create({
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
