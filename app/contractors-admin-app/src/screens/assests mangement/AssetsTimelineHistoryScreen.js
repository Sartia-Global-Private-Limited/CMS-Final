/*    ----------------Created Date :: 17- July -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../component/CustomeHeader';
import Colors from '../../constants/Colors';
import {Badge, Avatar} from '@rneui/base';
import NeumorphCard from '../../component/NeumorphCard';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import SeparatorComponent from '../../component/SeparatorComponent';
import NeuomorphAvatar from '../../component/NeuomorphAvatar';
import {apiBaseUrl} from '../../../config';
import Images from '../../constants/Images';
import DataNotFound from '../../component/DataNotFound';
import {useDispatch, useSelector} from 'react-redux';
import InternalServer from '../../component/InternalServer';

import Loader from '../../component/Loader';
import ScreensLabel from '../../constants/ScreensLabel';

import {getAssestTimelineById} from '../../redux/slices/assest mangement/getAssestTimelineSlice';
const AssetsTimelineHistoryScreen = ({navigation, route}) => {
  const id = route?.params?.id;
  const label = ScreensLabel();
  const ListData = useSelector(state => state.getAssestTimeline);
  const dispatch = useDispatch();
  const assinedData = ListData?.data?.data?.asset_timeline_history;

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    dispatch(getAssestTimelineById(id));
  }, [id]);

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.timlineView}>
        <View style={styles.lineView}>
          <Badge
            value={index + 1}
            badgeStyle={{
              backgroundColor: Colors().skyBule,
            }}
            containerStyle={{}}
          />
          <SeparatorComponent
            separatorColor={Colors().purple}
            separatorHeight={'95%'}
            separatorWidth={1.5}
          />
        </View>

        <View style={{flex: 1, rowGap: 10}}>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.cardHeadingTxt, {color: Colors().pureBlack}]}>
              asset name :
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[styles.cardtext, {color: Colors().pureBlack}]}>
              {` ${item?.asset_name} (${item?.asset_model_number})`}
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text style={[styles.cardHeadingTxt, {color: Colors().pureBlack}]}>
              REMARK :
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[styles.cardtext, {color: Colors().pureBlack}]}>
              {item?.notes}
            </Text>
          </View>

          {(item?.asset_assigned_by_image || item?.asset_assigned_by_name) && (
            <View style={styles.assignView}>
              <Text
                style={[styles.cardHeadingTxt, {color: Colors().pureBlack}]}>
                ASSIGNED BY -
              </Text>
              <NeuomorphAvatar gap={4}>
                <Avatar
                  size={50}
                  rounded
                  source={{
                    uri: item?.asset_assigned_by_image
                      ? `${apiBaseUrl}${item?.asset_assigned_by_image}`
                      : `${
                          Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri
                        }`,
                  }}
                />
              </NeuomorphAvatar>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[styles.cardtext, {color: Colors().pureBlack}]}>
                {item?.asset_assigned_by_name}
              </Text>
            </View>
          )}

          {(item?.asset_assigned_to_image || item?.asset_assigned_to_name) && (
            <View style={styles.assignView}>
              <Text
                style={[styles.cardHeadingTxt, {color: Colors().pureBlack}]}>
                ASSIGNED TO -{' '}
              </Text>
              <NeuomorphAvatar gap={4}>
                <Avatar
                  size={50}
                  rounded
                  source={{
                    uri: item?.asset_assigned_to_image
                      ? `${apiBaseUrl}${item?.asset_assigned_to_image}`
                      : `${
                          Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri
                        }`,
                  }}
                />
              </NeuomorphAvatar>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[styles.cardtext, {color: Colors().pureBlack}]}>
                {item?.asset_assigned_to_name}
              </Text>
            </View>
          )}

          <View style={styles.statusView}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={[styles.cardHeadingTxt, {color: Colors().pureBlack}]}>
                date :{' '}
              </Text>
              <Text
                numberOfLines={2}
                ellipsizeMode="tail"
                style={[styles.cardtext, {color: Colors().pending}]}>
                {item?.asset_assigned_at}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  /* if we got no data for flatlist*/
  const renderEmptyComponent = () => (
    <View
      style={{
        height: WINDOW_HEIGHT * 0.6,
      }}>
      <DataNotFound />
    </View>
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getAssestTimelineById(id));

      setRefreshing(false);
    }, 2000);
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={`${label.ASSEST} ${label.TIMELINE} ${label.DETAIL}`}
      />

      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <>
          <View style={[styles.mainView]}>
            {/* card for company detail */}
            <NeumorphCard>
              <View style={styles.cardContainer}>
                <Text
                  style={[
                    styles.headingTxt,
                    {color: Colors().purple, alignSelf: 'center'},
                  ]}>
                  assign DETAILS
                </Text>

                <SeparatorComponent
                  separatorColor={Colors().gray2}
                  separatorHeight={0.5}
                />

                <FlatList
                  data={assinedData}
                  renderItem={renderItem}
                  keyExtractor={(_, index) => {
                    return index.toString();
                  }}
                  refreshControl={
                    <RefreshControl
                      refreshing={refreshing}
                      onRefresh={onRefresh}
                    />
                  }
                  contentContainerStyle={{paddingBottom: 250}}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={renderEmptyComponent}
                />
              </View>
            </NeumorphCard>
          </View>
        </>
      ) : ListData?.isError ? (
        <InternalServer />
      ) : !ListData?.data?.status &&
        ListData?.data?.message == 'Data not found' ? (
        <>
          <DataNotFound />
          {/* View for floating button */}
        </>
      ) : (
        <InternalServer></InternalServer>
      )}
    </SafeAreaView>
  );
};

export default AssetsTimelineHistoryScreen;

const styles = StyleSheet.create({
  mainView: {
    padding: 15,
    rowGap: 15,
  },
  cardContainer: {
    margin: WINDOW_WIDTH * 0.03,
    // flex: 1,
    rowGap: WINDOW_HEIGHT * 0.01,
  },

  headingTxt: {
    fontSize: 15,

    letterSpacing: 0.2,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    alignSelf: 'center',
    marginBottom: 2,
  },

  cardHeadingTxt: {
    fontSize: 12,

    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
    marginLeft: 2,
  },
  lineView: {
    alignItems: 'center',
    marginTop: 5,
    justifyContent: 'center',
  },
  timlineView: {
    flexDirection: 'row',

    columnGap: 10,
    flex: 1,
  },
  assignView: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
  },
  statusView: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'space-between',
  },
});
