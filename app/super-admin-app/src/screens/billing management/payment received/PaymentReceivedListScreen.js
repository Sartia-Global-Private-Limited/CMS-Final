import {View, SafeAreaView, TouchableOpacity} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import {getPaymentReceivedListWithCode} from '../../../redux/slices/billing management/payment received/getPaymentReceivedListSlice';
import moment from 'moment';
import PaymentFilter from './PaymentFilter';
import List from '../../../component/List/List';

const PaymentReceivedListScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getPaymentReceivedList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [pvNo, setPvNo] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getPaymentReceivedListWithCode({
          status: getStatusCode(type),
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
          pvNo: pvNo,
        }),
      );
    });

    return unsubscribe;
  }, [type, isFocused]);

  useEffect(() => {
    dispatch(
      getPaymentReceivedListWithCode({
        status: getStatusCode(type),
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
        pvNo: pvNo,
      }),
    );
  }, [searchText, pvNo]);

  // function for status code//
  const getStatusCode = status => {
    switch (status) {
      case 'partial':
        return 1;
      case 'done':
        return 2;

      case 'all':
        return '';

      default:
        break;
    }
  };

  /*function for getting status color */
  const getStatusColor = status => {
    switch (status) {
      case '1':
        return Colors().partial;
      case '2':
        return Colors().aprroved;

      default:
        break;
    }
  };

  /*function for getting status Text */
  const getStatusText = status => {
    switch (status) {
      case '1':
        return 'partial';
      case '2':
        return 'Done';

      default:
        break;
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdatePayment', {
          edit_id: actionButton?.itemData?.id,
        });

        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item, index}) => {
    return (
      <View key={index}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('PaymentReceivedDetailScreen', {
              id: item?.id,
            });
          }}>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'PAYMENT UNIQUE ID',
                value: item?.payment_unique_id ?? '--',
                keyColor: Colors().skyBule,
              },
              {
                key: 'INVOICE NUMBER',
                value: item?.invoice_number ?? '--',
              },
              {
                key: 'INVOICE DATE',
                value: moment(item?.invoice_date).format('DD-MM-YYYY') ?? '--',
              },
              {
                key: 'PV NUMBER',
                value: item?.pv_number ?? '--',
              },
              {
                key: 'RECIEVED AMOUNT',
                value: `₹ ${item?.amount_received}` ?? '--',
                keyColor: Colors().aprroved,
              },
            ]}
            status={[
              {
                key: 'status',
                value: getStatusText(item?.status),
                color: getStatusColor(item?.status),
              },
            ]}
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
      getPaymentReceivedListWithCode({
        status: getStatusCode(type),
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
        pvNo: pvNo,
      }),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      {/*Fileter componenet */}
      <PaymentFilter
        type={type}
        pvNo={pvNo}
        setPvNo={setPvNo}
        statusCode={getStatusCode(type)}
      />

      <View style={{height: WINDOW_HEIGHT * 0.82, width: WINDOW_WIDTH}}>
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
    </SafeAreaView>
  );
};

export default PaymentReceivedListScreen;
