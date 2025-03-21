/*    ----------------Created Date :: 8 - August -2024   ----------------- */
import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import { useDispatch, useSelector } from 'react-redux';
import ScreensLabel from '../../../constants/ScreensLabel';
import DataNotFound from '../../../component/DataNotFound';
import CustomeCard from '../../../component/CustomeCard';

import { getBulkMessageDetailById } from '../../../redux/slices/contacts/all message/getBulkMessageDetailSlice';

const BulkMessageDetailScreen = ({ navigation, route }) => {
  const id = route?.params?.id;

  const label = ScreensLabel();

  const [refreshing, setRefreshing] = useState(false);
  const ListData = useSelector(state => state.getBulkMessageDetail);
  const dispatch = useDispatch();

  const all_Data = ListData?.data?.data || {};

  useEffect(() => {
    dispatch(getBulkMessageDetailById(id));
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getBulkMessageDetailById(id));

      setRefreshing(false);
    }, 2000);
  }, []);

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 1:
        return Colors().aprroved;
      case 2:
        return Colors().red;

      default:
        return 'black';
    }
  }

  /*for getting the text of status*/
  function getStatusText(status) {
    switch (status) {
      case 1:
        return 'Feedback';

      case 2:
        return 'Suggestion';

      default:
        break;
    }
  }
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.MESSAGE} ${label.DETAIL}`} />

      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={{}}>
              {/* card for assest detail */}
              <CustomeCard
                headerName={'message DETAILS'}
                data={[
                  {
                    key: 'title',
                    value: all_Data?.title ?? '--',
                  },
                  {
                    key: 'message',
                    value: all_Data?.message ?? '--',
                  },
                  {
                    key: 'date',
                    value: all_Data?.date ?? '--',
                  },
                ]}
              />
            </View>
          </ScrollView>
        </>
      ) : ListData?.isError ? (
        <InternalServer />
      ) : !ListData?.data?.status &&
        ListData?.data?.message == 'Data not found' ? (
        <>
          <DataNotFound />
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default BulkMessageDetailScreen;

const styles = StyleSheet.create({});
