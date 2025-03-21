/*    ----------------Created Date :: 9- Sep -2024   ----------------- */
import { View, SafeAreaView, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import SiteFundInspectionFilter from './SiteFundInspectionFilter';
import {
  getApprovedSiteFundInspection,
  getPartialSiteFundInspection,
  getPendingSiteFundInspection,
} from '../../../redux/slices/site-inspection/site-fund-inspection/getSiteFundInspectionListSlice';
import List from '../../../component/List/List';

const SiteFundInspectionListingScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getSiteFundInspectionList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [roId, setRoId] = useState('');
  const [saId, setSaId] = useState('');
  const [outletId, setOutletId] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      if (type == 'pending') {
        dispatch(
          getPendingSiteFundInspection({
            pageSize: pageSize,
            pageNo: pageNo,
            outletId: outletId,
            RoId: roId,
            SaId: saId,
          }),
        );
      }
      if (type == 'partial') {
        dispatch(
          getPartialSiteFundInspection({
            pageSize: pageSize,
            pageNo: pageNo,
            outletId: outletId,
            RoId: roId,
            SaId: saId,
          }),
        );
      }
      if (type == 'approved') {
        dispatch(
          getApprovedSiteFundInspection({
            pageSize: pageSize,
            pageNo: pageNo,
            outletId: outletId,
            RoId: roId,
            SaId: saId,
          }),
        );
      }
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    if (type == 'pending') {
      dispatch(
        getPendingSiteFundInspection({
          pageSize: pageSize,
          pageNo: pageNo,
          outletId: outletId,
          RoId: roId,
          SaId: saId,
          search: searchText,
        }),
      );
    }
    if (type == 'partial') {
      dispatch(
        getPartialSiteFundInspection({
          pageSize: pageSize,
          pageNo: pageNo,
          outletId: outletId,
          RoId: roId,
          SaId: saId,
        }),
      );
    }
    if (type == 'approved') {
      dispatch(
        getApprovedSiteFundInspection({
          pageSize: pageSize,
          pageNo: pageNo,
          outletId: outletId,
          RoId: roId,
          SaId: saId,
          search: searchText,
        }),
      );
    }
  }, [roId, saId, outletId, searchText]);

  // function for getting text of status//
  const getStatusText = status => {
    switch (status) {
      case '0':
        return 'Pending';
      case '1':
        return 'Partial';
      case '2':
        return 'Approved';

      default:
        break;
    }
  };

  // function for getting color of status//
  const getStatusColor = status => {
    switch (status) {
      case '0':
        return Colors().pending;
      case '1':
        return Colors().partial;
      case '2':
        return Colors().aprroved;

      default:
        break;
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'approve':
        navigation.navigate('SiteFundInspectionDetailScreen', {
          outletId: actionButton?.itemData?.outlet[0]?.id,
          month: actionButton?.itemData?.month,
          type: type,
          purpose: 'approve',
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
            navigation.navigate('SiteFundInspectionDetailScreen', {
              outletId: item?.outlet[0]?.id,
              month: item?.month,
              type: type,
              purpose: 'view',
            })
          }>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'outlet id',
                value: item?.outlet[0]?.outlet_unique_id || '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'outlet name',
                value: item?.outlet[0]?.outlet_name || '--',
              },
              {
                key: 'Regional office',
                value: item?.regionalOffice[0]?.regional_office_name || '--',
              },
              {
                key: 'Sales Area',
                value: item?.saleAreaDetails[0]?.sales_area_name || '--',
              },
              {
                key: 'Total amount',
                value: `₹ ${item?.total_amount}`,
                keyColor: Colors().aprroved,
              },

              ...(type === 'pending'
                ? [
                    {
                      key: 'Date',
                      value: item?.month || '--',
                    },
                  ]
                : []),
            ]}
            status={[
              {
                key: 'status',
                value: getStatusText(item?.status),
                color: getStatusColor(item?.status),
              },
            ]}
            approveButton={
              type == 'pending' || type == 'partial' ? true : false
            }
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (type == 'pending') {
      dispatch(
        getPendingSiteFundInspection({ pageSize: pageSize, pageNo: pageNo }),
      );
    }
    if (type == 'partial') {
      dispatch(
        getPartialSiteFundInspection({ pageSize: pageSize, pageNo: pageNo }),
      );
    }
    if (type == 'approved') {
      dispatch(
        getApprovedSiteFundInspection({
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <View style={{ flexDirection: 'row' }}>
        {/* Filter for componenet */}
        <SiteFundInspectionFilter
          type={type}
          roId={roId}
          setRoId={setRoId}
          saId={saId}
          setSaId={setSaId}
          outletId={outletId}
          setOutletId={setOutletId}
          setSearchText={setSearchText}
        />
      </View>

      <View style={{ height: WINDOW_HEIGHT * 0.82, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={''}
        />
      </View>
    </SafeAreaView>
  );
};

export default SiteFundInspectionListingScreen;
