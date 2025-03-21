import {
  StyleSheet,
  View,
  SafeAreaView,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import {useDispatch, useSelector} from 'react-redux';
import ScreensLabel from '../../constants/ScreensLabel';
import DataNotFound from '../../component/DataNotFound';
import CustomeCard from '../../component/CustomeCard';
import {getFeedbackDetailById} from '../../redux/slices/feedback suggestion/getFeedbackDetailSlice';

const FeedbackSuggestionDetailScreen = ({navigation, route}) => {
  const id = route?.params?.id;

  const label = ScreensLabel();

  const [refreshing, setRefreshing] = useState(false);
  const ListData = useSelector(state => state.getFeedbackDetail);
  const dispatch = useDispatch();

  const all_Data = ListData?.data?.data || {};

  useEffect(() => {
    dispatch(getFeedbackDetailById(id));
  }, [id]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getFeedbackDetailById(id));

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
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={`${label.FEEDBACK_AND_SUGGESTION} ${label.DETAIL}`}
      />

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
                headerName={'feedback & suggestion DETAILS'}
                avatarImage={all_Data?.asset_image}
                data={[
                  {
                    key: 'title',
                    value: all_Data?.title ?? '--',
                  },
                  {
                    key: 'Description',
                    value: all_Data?.description ?? '--',
                  },
                  {
                    key: 'response',
                    value: all_Data?.response ?? '--',
                  },
                ]}
                status={[
                  {
                    key: 'status',
                    value: getStatusText(all_Data?.status),
                    color: getStatusColor(all_Data?.status),
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

export default FeedbackSuggestionDetailScreen;

const styles = StyleSheet.create({});
