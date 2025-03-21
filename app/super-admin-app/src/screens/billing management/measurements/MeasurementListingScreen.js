import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import MeasurementFilter from './MeasurementFilter';
import {
  getMeasurementListOfAllComplaintAndPTM,
  getMeasurementListOfDraftDiscardFinalReadyToPi,
} from '../../../redux/slices/billing management/measurement/getMeasurementListSlice';
import AlertModal from '../../../component/AlertModal';
import IconType from '../../../constants/IconType';
import {
  discardMeasurementById,
  reactiveMeasurementById,
} from '../../../redux/slices/billing management/measurement/addUpdateMeasurementSlice';
import Toast from 'react-native-toast-message';
import List from '../../../component/List/List';

const MeasurementListingScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getMeasurementList);

  /*declare useState variable here */
  const [discardVisible, setDiscardVisible] = useState(false);
  const [reactiveVisible, setReactiveVisible] = useState(false);
  const [body, setBody] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [roId, setRoId] = useState('');
  const [saId, setSaId] = useState('');
  const [outletId, setOutletId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [orderById, setOrderById] = useState('');
  const [statusId, setStatusId] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      if (type == 'allcomplaint' || type == 'ptm') {
        dispatch(
          getMeasurementListOfAllComplaintAndPTM({
            status: getStatusCode(type),
            pageSize: pageSize,
            pageNo: pageNo,
            outletId: outletId,
            RoId: roId,
            SaId: saId,
            OrderById: orderById,
            companyId: companyId,
          }),
        );
      }
      if (
        type == 'draft' ||
        type == 'discard' ||
        type == 'final' ||
        type == 'readytopi'
      ) {
        dispatch(
          getMeasurementListOfDraftDiscardFinalReadyToPi({
            status: getStatusCode(type),
            pageSize: pageSize,
            pageNo: pageNo,
            outletId: outletId,
            RoId: roId,
            SaId: saId,
            OrderById: orderById,
            companyId: companyId,
          }),
        );
      }
    });
    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    if (type == 'allcomplaint' || type == 'ptm') {
      dispatch(
        getMeasurementListOfAllComplaintAndPTM({
          status: statusId || getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
          outletId: outletId,
          RoId: roId,
          SaId: saId,
          OrderById: orderById,
          companyId: companyId,
        }),
      );
    }
    if (
      type == 'draft' ||
      type == 'discard' ||
      type == 'final' ||
      type == 'readytopi'
    ) {
      dispatch(
        getMeasurementListOfDraftDiscardFinalReadyToPi({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
          outletId: outletId,
          RoId: roId,
          SaId: saId,
          companyId: companyId,
          OrderById: orderById,
        }),
      );
    }
  }, [roId, saId, outletId, orderById, statusId]);

  // function for getting color of status//
  const getStatusColor = status => {
    switch (status) {
      case 'HardCopy / PTM':
        return Colors().orange;
      case 'HardCopy-PTM':
        return Colors().orange;
      case 'Resolved':
        return Colors().aprroved;
      case 'p t m':
        return Colors().edit;
      case 'Draft':
        return Colors().aprroved;
      case 'Discard':
        return Colors().partial;
      case 'Pending To PI':
        return Colors().pending;
      case 'Ready To PI':
        return Colors().skyBule;
      case 'Pending to PI':
        return Colors().pending;
      case 'Ready to PI':
        return Colors().skyBule;

      default:
        break;
    }
  };
  // function for status code//
  const getStatusCode = status => {
    switch (status) {
      case 'allcomplaint':
        return '';
      case 'ptm':
        return 1;
      case 'discard':
        return 2;
      case 'draft':
        return 3;
      case 'final':
        return 4;
      case 'readytopi':
        return 5;

      default:
        break;
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'attachment':
        navigation.navigate('AddUpdateMeasurementAttachement', {
          complaintId: actionButton?.itemData?.id,
        });
        break;
      case 'timeline':
        navigation.navigate('ViewMeasurementTimelineScreen', {
          id: actionButton?.itemData?.id,
        });
        break;
      case 'edit':
        if (type == 'ptm') {
          navigation.navigate('AddUpdateMeasurementScreen', {
            complaint_id: actionButton?.itemData?.id,
            type: type,
          });
        } else {
          navigation.navigate('AddUpdateMeasurementScreen', {
            complaint_id: actionButton?.itemData?.complaint_id,
            edit_id: actionButton?.itemData?.id,
            type: type,
          });
        }

        break;
      case 'discard':
        setDiscardVisible(true);
        setBody({
          complaint_id: actionButton?.itemData?.complaint_id,
          id: actionButton?.itemData?.id,
          measurement_amount: actionButton?.itemData?.measurement_amount,
          po_id: actionButton?.itemData?.po_id,
        });
        break;
      case 'reactive':
        setReactiveVisible(true);
        setBody({
          complaint_id: actionButton?.itemData?.complaint_id,
          id: actionButton?.itemData?.id,
          measurement_amount: actionButton?.itemData?.measurement_amount,
          po_id: actionButton?.itemData?.po_id,
        });
        break;

      default:
        break;
    }
  };

  /*Function  for discarding the measurement*/
  const discardMeasurement = async () => {
    const result = await dispatch(discardMeasurementById(body)).unwrap();
    if (result?.status) {
      setDiscardVisible(false);
      setBody('');
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      navigation.navigate('MeasurementTopTab');
    } else {
      setDiscardVisible(false);
      setBody('');
      Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
    }
  };

  /*Function for reactive the measurement*/
  const reactiveMeasurement = async () => {
    const result = await dispatch(reactiveMeasurementById(body)).unwrap();

    if (result?.status) {
      setReactiveVisible(false);
      setBody('');
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      navigation.navigate('MeasurementTopTab');
    } else {
      setReactiveVisible(false);
      setBody('');
      Toast.show({
        type: 'error',
        text1: result?.message,
        position: 'bottom',
      });
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() => {
            if (type == 'allcomplaint' || type == 'ptm') {
              navigation.navigate('ViewMeasurementDetailScreen', {
                complaint_id: item?.id,
              });
            }
            if (
              type == 'draft' ||
              type == 'discard' ||
              type == 'final' ||
              type == 'readytopi'
            ) {
              navigation.navigate('ViewPTMDetailScreen', {
                complaint_id: item?.id,
              });
            }
          }}>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'Complaint id',
                value: item?.complaint_unique_id || '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'Complaint type',
                value:
                  type === 'allcomplaint' || type === 'ptm'
                    ? item?.complaint_type ?? '--'
                    : item?.complaint_type_name ?? '--',
              },
              {
                key: 'outlet name',
                value:
                  type === 'allcomplaint' || type === 'ptm'
                    ? item?.outlet?.[0]?.outlet_name ?? '--'
                    : item?.outlet_name ?? '--',
              },
              {
                key: 'Regional office',
                value:
                  type == 'allcomplaint' || type == 'ptm'
                    ? item?.regionalOffice?.[0]?.regional_office_name ?? '--'
                    : item?.regional_office_name ?? '--',
              },
              {
                key: 'Sales Area',
                value:
                  type == 'allcomplaint' || type == 'ptm'
                    ? item?.saleAreaDetails?.[0]?.sales_area_name ?? '--'
                    : item?.sales_area_name ?? '--',
              },

              ...(type == 'draft' ||
              type == 'discard' ||
              type == 'final' ||
              type == 'readytopi'
                ? [
                    {
                      key: 'Po Number',
                      value: item?.po_number ?? '--',
                    },
                  ]
                : []),
              {
                key: 'ordery by',
                value:
                  type == 'allcomplaint' || type == 'ptm'
                    ? item?.order_by_details ?? '--'
                    : item?.order_by_name ?? '--',
              },
              ...(type == 'draft' ||
              type == 'discard' ||
              type == 'final' ||
              type == 'readytopi'
                ? [
                    {
                      key: 'Measurement amount',
                      value: item?.measurement_amount ?? 0,
                      keyColor: Colors().aprroved,
                    },
                  ]
                : []),
              ...(type == 'draft' ||
              type == 'discard' ||
              type == 'final' ||
              type == 'readytopi'
                ? [
                    {
                      key: 'Measurement Date',
                      value: item?.measurement_date ?? '--',
                      keyColor: Colors().pending,
                    },
                  ]
                : []),
              ...(type == 'draft' ||
              type == 'discard' ||
              type == 'final' ||
              type == 'readytopi'
                ? [
                    {
                      key: 'PO Amount',
                      value: item?.po_limit ?? '--',
                      keyColor: Colors().aprroved,
                    },
                  ]
                : []),

              ...(type === 'allcomplaint' || type === 'ptm'
                ? [
                    {
                      key: 'Company name',
                      value: item?.energy_company_name ?? '--',
                    },
                  ]
                : []),
            ]}
            status={[
              {
                key: 'status',
                value: item?.status,

                color: getStatusColor(item?.status),
              },
            ]}
            attachmentButton={
              type == 'allcomplaint' && item?.status == 'Resolved'
                ? true
                : false
            }
            editButton={
              type == 'ptm' ||
              type == 'draft' ||
              type == 'final' ||
              type == 'readytopi'
                ? true
                : false
            }
            reactiveButton={type == 'discard' ? true : false}
            discardButton={type == 'final' ? true : false}
            changeButton={type == 'final' ? true : false}
            timelineButton={
              type == 'final' || type == 'readytopi' ? true : false
            }
            action={handleAction}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (type == 'allcomplaint' || type == 'ptm') {
      dispatch(
        getMeasurementListOfAllComplaintAndPTM({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
    if (
      type == 'draft' ||
      type == 'discard' ||
      type == 'final' ||
      type == 'readytopi'
    ) {
      dispatch(
        getMeasurementListOfDraftDiscardFinalReadyToPi({
          status: getStatusCode(type),
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <View style={{flexDirection: 'row'}}>
        {/* Filter for componenet */}
        <MeasurementFilter
          type={type}
          setCompanyId={setCompanyId}
          roId={roId}
          companyId={companyId}
          setRoId={setRoId}
          saId={saId}
          setSaId={setSaId}
          outletId={outletId}
          setOutletId={setOutletId}
          orderById={orderById}
          setOrderById={setOrderById}
          statusId={statusId}
          setStatusId={setStatusId}
        />
      </View>
      <View style={{height: WINDOW_HEIGHT * 0.8, width: WINDOW_WIDTH}}>
        <List
          data={ListData}
          permissions={{view: true}}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={''}
        />
      </View>

      {discardVisible && (
        <AlertModal
          visible={discardVisible}
          iconName={'ban'}
          icontype={IconType.FontAwesome}
          iconColor={Colors().partial}
          textToShow={'ARE YOU SURE YOU WANT TO DISCARD THIS!!'}
          cancelBtnPress={() => {
            setDiscardVisible(!discardVisible), setBody('');
          }}
          ConfirmBtnPress={() => discardMeasurement()}
        />
      )}
      {reactiveVisible && (
        <AlertModal
          visible={reactiveVisible}
          iconName={'restore'}
          icontype={IconType.MaterialCommunityIcons}
          iconColor={Colors().partial}
          textToShow={'ARE YOU SURE YOU WANT TO RE-ACTIVE THIS!!'}
          cancelBtnPress={() => {
            setReactiveVisible(!reactiveVisible), setBody('');
          }}
          ConfirmBtnPress={() => reactiveMeasurement()}
        />
      )}
    </SafeAreaView>
  );
};

export default MeasurementListingScreen;
