/*    ----------------Created Date :: 5- August -2024   ----------------- */
import {View, SafeAreaView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import ScreensLabel from '../../../constants/ScreensLabel';
import CustomeCard from '../../../component/CustomeCard';
import CustomeHeader from '../../../component/CustomeHeader';
import {getSalesOrderDetailById} from '../../../redux/slices/purchase & sale/sale-order/getSaleOrderDetailSlice';
import List from '../../../component/List/List';

const SoDetaiItemListScreen = ({route}) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  const soId = route?.params?.soId;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getSaleOrderDetail);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  useEffect(() => {
    dispatch(
      getSalesOrderDetailById({
        soId: soId,
        pageNo: pageNo,
        pageSize: pageSize,
      }),
    );
  }, [isFocused, soId]);

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <CustomeCard
          data={[
            {
              key: 'order line no',
              value: item?.OrderLineNumber,
              keyColor: Colors().skyBule,
            },
            {key: 'name', value: item?.Name},
            {key: 'HSN code', value: item?.HsnCode},
            {
              key: 'Rate',
              value: `₹ ${item?.Rate}`,
              keyColor: Colors().aprroved,
            },
            {
              key: 'quantity',
              value: item?.Qty,
            },
            {
              key: 'Amount',
              value: `	₹ ${item?.Amount}`,
              keyColor: Colors().red,
            },
            ...(item?.gst_type
              ? [{key: 'gst type', value: item?.gst_type}]
              : []),
            ...(item?.gst_percent
              ? [{key: 'gst %', value: item?.gst_percent}]
              : []),
            ...(item?.description
              ? [{key: 'description', value: item?.description}]
              : []),
          ]}
          status={[{key: 'unit', value: item?.Unit, color: Colors().pending}]}
        />
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getSalesOrderDetailById({
        soId: soId,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.SO_DETAIL_ITEM_LIST}`} />
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

export default SoDetaiItemListScreen;
