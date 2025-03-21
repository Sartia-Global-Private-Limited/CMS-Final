import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import React, {useEffect} from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {Badge, Avatar, Icon} from '@rneui/base';
import NeumorphCard from '../../../component/NeumorphCard';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import SeparatorComponent from '../../../component/SeparatorComponent';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {apiBaseUrl} from '../../../../config';
import Images from '../../../constants/Images';
import DataNotFound from '../../../component/DataNotFound';
import {useDispatch, useSelector} from 'react-redux';
import InternalServer from '../../../component/InternalServer';
import {getTimeLineDetailById} from '../../../redux/slices/complaint/getComplaintTimelineSlice';
import Loader from '../../../component/Loader';
import ScreensLabel from '../../../constants/ScreensLabel';

const ComplaintTimelineScreen = ({navigation, route}) => {
  const complaint_id = route?.params?.complaint_id;
  const label = ScreensLabel();
  const complainttDetailDta = useSelector(state => state.getComplaintTimeline);
  const dispatch = useDispatch();
  const assinedData =
    complainttDetailDta?.data?.data?.complaintAssignDetails?.assignData;

  useEffect(() => {
    dispatch(getTimeLineDetailById(complaint_id));
  }, [complaint_id]);
  /*function for finding object is empty or not retun boolean value*/
  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

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
      case 'Hold':
        return Colors().partial;
      case 'assigned':
        return Colors().orange;
      case 'created':
        return Colors().edit;
      default:
        return 'black';
    }
  }

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.timlineView}>
        <View style={styles.lineView}>
          <Badge
            value={index + 1}
            badgeStyle={{
              backgroundColor: `#52${item?.id}${item?.id}FF`,
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
              TITLE :
            </Text>
            <Text
              numberOfLines={2}
              ellipsizeMode="tail"
              style={[styles.cardtext, {color: Colors().pureBlack}]}>
              {item?.title}
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
              {item?.remark}
            </Text>
          </View>

          {(item?.assigned_by_image || item?.assigned_by) && (
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
                    uri: item?.assigned_by_image
                      ? `${apiBaseUrl}${item?.assigned_by_image}`
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
                {item?.assigned_by}
              </Text>
            </View>
          )}

          {(item?.assigned_to_image || item?.assigned_to) && (
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
                    uri: item?.assigned_to_image
                      ? `${apiBaseUrl}${item?.assigned_to_image}`
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
                {item?.assigned_to}
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
                STATUS :{' '}
              </Text>
              <NeumorphCard>
                <View style={{padding: 5}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[
                      styles.cardtext,
                      {color: getStatusColor(item?.status), fontWeight: '600'},
                    ]}>
                    {item?.status}
                  </Text>
                </View>
              </NeumorphCard>
            </View>
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
                style={[styles.cardtext, {color: Colors().pureBlack}]}>
                {item?.assigned_at}
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

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`${label.TIMELINE} ${label.DETAIL}`} />

      {complainttDetailDta?.isLoading ? (
        <Loader />
      ) : !complainttDetailDta?.isLoading &&
        !complainttDetailDta?.isError &&
        complainttDetailDta?.data?.status ? (
        <>
          <View style={[styles.mainView]}>
            {/* card for company detail */}
            <NeumorphCard>
              <View style={styles.cardContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                    COmplaint assign DETAILS
                  </Text>
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      name="user-check"
                      type={IconType.Feather}
                      color={Colors().red}
                      onPress={() =>
                        navigation.navigate(
                          'AddUpdateAllocateComplaintScreen',
                          {
                            complaint_id: complaint_id,
                          },
                        )
                      }
                      style={styles.actionIcon}
                    />
                  </NeumorphCard>
                </View>

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
                  contentContainerStyle={{paddingBottom: 250}}
                  showsVerticalScrollIndicator={false}
                  ListEmptyComponent={renderEmptyComponent}
                />
              </View>
            </NeumorphCard>
          </View>
        </>
      ) : complainttDetailDta?.isError ? (
        <InternalServer />
      ) : !complainttDetailDta?.data?.status &&
        complainttDetailDta?.data?.message == 'Data not found' ? (
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

export default ComplaintTimelineScreen;

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
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
});
