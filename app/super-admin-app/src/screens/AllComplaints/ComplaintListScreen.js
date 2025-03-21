import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import SearchBar from '../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ScreensLabel from '../../constants/ScreensLabel';
import NeumorphicButton from '../../component/NeumorphicButton';
import CustomeCard from '../../component/CustomeCard';
import {ComplaintFilter} from './ComplaintsFilter';
import List from '../../component/List/List';
import {getAllAdminComplaints} from '../../redux/slices/adminComplaint/getAllAdminComplaintListSlice';
import moment from 'moment';
import NeumorphDatePicker from '../../component/NeumorphDatePicker';
import {postApprovelMemberList} from '../../services/authApi';

const ComplaintListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getAdminComplaint);
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [regionalOfficeId, setRegionalOfficeId] = useState(0);
  const [zoneId, setZoneId] = useState(0);
  const [customeDate, setcustomeDate] = useState('');
  const [openPurchaseDate, setOpenPurchaseDate] = useState(false);

  const sdata = {
    custom_date: customeDate,
    regional_id: regionalOfficeId,
    zone_id: zoneId,
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getAllAdminComplaints({
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
          body: sdata,
          type: type,
        }),
      );
    });
    return unsubscribe;
  }, [searchText, isFocused, regionalOfficeId, zoneId, type]);

  /*for resetting all filter*/
  const resetFunction = () => {
    setRegionalOfficeId('');
    setZoneId('');
    setcustomeDate('');
  };

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
                key: 'Zone Name',
                value:
                  item?.zones &&
                  item?.zones?.length > 0 &&
                  item?.zones[0]?.zone_name,
              },
              {
                key: 'Regional Office Name',
                value:
                  item?.regionalOffices &&
                  item?.regionalOffices?.length > 0 &&
                  item?.regionalOffices[0]?.regional_office_name,
              },
              ...(item?.status === 3
                ? [
                    {
                      key: 'Approved By',
                      value: item?.status_changed_by_name,
                    },
                    {
                      key: 'Approved On',
                      value: moment(item?.status_changed_on).format(
                        'DD/MM/YYYY',
                      ),
                    },
                  ]
                : []),
              ...(item?.status === 4
                ? [
                    {
                      key: 'Rejected By',
                      value: item?.status_changed_by_name,
                    },
                    {
                      key: 'Rejected On',
                      value: moment(item?.status_changed_on).format(
                        'DD/MM/YYYY',
                      ),
                    },
                  ]
                : []),
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <View style={{flexDirection: 'row'}}>
        <SearchBar
          setSearchText={setSearchText}
          placeholderText={`${label.SEARCH}`}
          value={searchText}
          searchWidth={WINDOW_WIDTH * 0.775}
        />

        <View style={{alignSelf: 'center', justifyContent: 'center'}}>
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
        setRegionalOfficeId={setRegionalOfficeId}
        regionalOfficeId={regionalOfficeId}
        setZoneId={setZoneId}
        zoneId={zoneId}
        component={
          <NeumorphDatePicker
            height={40}
            width={WINDOW_WIDTH * 0.85}
            withoutShadow={false}
            iconPress={() => setOpenPurchaseDate(!openPurchaseDate)}
            valueOfDate={customeDate}
            modal
            open={openPurchaseDate}
            date={new Date()}
            mode="date"
            onConfirm={date => {
              let newdate = moment(date).format('DD/MM/YYYY');
              setcustomeDate(newdate);
              setOpenPurchaseDate(false);
            }}
            onCancel={() => {
              setOpenPurchaseDate(false);
            }}
          />
        }
      />

      <View style={{height: WINDOW_HEIGHT * 0.8, width: WINDOW_WIDTH}}>
        <List
          data={ListData}
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

export default ComplaintListScreen;
