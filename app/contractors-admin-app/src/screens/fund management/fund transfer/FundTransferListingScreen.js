/*    ----------------Created Date :: 7- sep -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState, useEffect, memo } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { Avatar, Icon } from '@rneui/base';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { apiBaseUrl } from '../../../../config';
import NeumorphCard from '../../../component/NeumorphCard';
import ImageViewer from '../../../component/ImageViewer';
import Images from '../../../constants/Images';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import AlertModal from '../../../component/AlertModal';
import { useFormik } from 'formik';
import {
  getAllFTList,
  getPendingFTList,
  getRescheduledFTList,
  getTransferedFTList,
} from '../../../redux/slices/fund-management/fund-transfer/getFundTransferListSlice';
import {
  rejectFundTransfer,
  rescheduleFundTransfer,
} from '../../../redux/slices/fund-management/fund-transfer/changeFundTransferStausSlice';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../../constants/ScreensLabel';
import List from '../../../component/List/List';

const FundRequestListingScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const typeOfFundTransfer = route?.params?.type;
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getFundTransferList);

  /*declare useState variable here */
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [reactiveModalVisible, setReactiveModalVisble] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [fundRequestId, setFundRequestId] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const formik = useFormik({
    initialValues: {
      remark: '',
    },
  });

  useEffect(() => {
    if (typeOfFundTransfer == 'pending') {
      dispatch(
        getPendingFTList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
    if (typeOfFundTransfer == 'transfer') {
      dispatch(
        getTransferedFTList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
    if (typeOfFundTransfer == 'reschedule') {
      dispatch(
        getRescheduledFTList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
    if (typeOfFundTransfer == 'all') {
      dispatch(
        getAllFTList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
  }, [typeOfFundTransfer, isFocused, searchText]);

  /* for getting color of status*/
  function getStatusColor(action) {
    if (action === undefined) {
      return 'black'; // or whatever default color you prefer
    }
    switch (action.toLowerCase()) {
      case 'pending':
        return Colors().pending;
      case 'approved':
        return Colors().aprroved;
      case 'rejected':
        return Colors().rejected;
      case 'done':
        return Colors().resolved;
      case 'partial':
        return Colors().partial;
      case 'hold':
        return Colors().red;
      case 'rescheduled':
        return Colors().rejected;

      default:
        return 'black';
    }
  }

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() =>
            navigation.navigate('FundRequestDetailScreen', {
              edit_id: item?.id,
            })
          }>
          <NeumorphCard
            darkShadowColor={Colors().darkShadow} // <- set this
            lightShadowColor={Colors().lightShadow} // <- this
          >
            <View
              style={{
                margin: WINDOW_WIDTH * 0.03,
                flex: 1,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  columnGap: 10,
                }}>
                <View>
                  <NeuomorphAvatar gap={4}>
                    <Avatar
                      size={50}
                      rounded
                      onPress={() => {
                        setImageModalVisible(true);
                        setImageUri(`${apiBaseUrl}${item?.request_by_image}`);
                      }}
                      source={{
                        uri: item?.request_by_image
                          ? `${apiBaseUrl}${item?.request_by_image}`
                          : `${
                              Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                .uri
                            }`,
                      }}
                    />
                  </NeuomorphAvatar>
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      unique id :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().skyBule }]}>
                      {item?.unique_id}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      requestedy by :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.request_by}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      request date:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.request_date}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Total request amount:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      ₹ {item?.total_request_amount}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Total approve amount:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      ₹ {item?.total_approved_amount}
                    </Text>
                  </View>
                  {(typeOfFundTransfer == 'transfer' ||
                    typeOfFundTransfer == 'all') && (
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          { color: Colors().pureBlack },
                        ]}>
                        total transfer amount:{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          {
                            color:
                              item?.total_transfer_amount == 0
                                ? Colors().red
                                : Colors().aprroved,
                          },
                        ]}>
                        ₹ {item?.total_transfer_amount}
                      </Text>
                    </View>
                  )}
                </View>
              </View>

              {(item?.status === '1' || item?.status === '2') && (
                <View
                  style={{
                    flexDirection: 'row',
                    columnGap: 10,
                  }}>
                  <View>
                    <NeuomorphAvatar gap={4}>
                      <Avatar
                        size={50}
                        rounded
                        onPress={() => {
                          setImageModalVisible(true);
                          setImageUri(
                            `${apiBaseUrl}${
                              item?.approved_by_image || item?.rejected_by_image
                            }`,
                          );
                        }}
                        source={{
                          uri:
                            item?.approved_by_image || item?.rejected_by_image
                              ? `${apiBaseUrl}${
                                  item?.approved_by_image ||
                                  item?.rejected_by_image
                                }`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                        }}
                      />
                    </NeuomorphAvatar>
                  </View>

                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          { color: Colors().pureBlack },
                        ]}>
                        {item?.status === '1'
                          ? 'Approved by : '
                          : 'Rejected by : '}{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          { color: Colors().pureBlack },
                        ]}>
                        {item?.approved_by || item?.rejected_by}
                      </Text>
                    </View>

                    {item?.total_approved_amount && item?.status === '1' && (
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            { color: Colors().pureBlack },
                          ]}>
                          aprroved amount:{' '}
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            { color: Colors().aprroved },
                          ]}>
                          ₹ {item?.total_approved_amount}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>

            <View style={styles.actionView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { color: Colors().pureBlack },
                  ]}>
                  STATUS :{' '}
                </Text>
                <NeumorphCard>
                  <View style={{ padding: 5 }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        { color: getStatusColor(item?.status) },
                      ]}>
                      {item?.status}
                    </Text>
                  </View>
                </NeumorphCard>
              </View>
              <View style={styles.actionView2}>
                {typeOfFundTransfer == 'pending' && (
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      name="exchange"
                      type={IconType.FontAwesome}
                      color={Colors().rejected}
                      style={styles.actionIcon}
                      onPress={() =>
                        navigation.navigate('TransferFundRquestScreen', {
                          edit_id: item?.id,
                          type: 'transfer',
                        })
                      }
                    />
                  </NeumorphCard>
                )}
                {typeOfFundTransfer == 'pending' && (
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      name="history"
                      type={IconType.MaterialCommunityIcons}
                      color={Colors().rejected}
                      onPress={() => {
                        setReactiveModalVisble(true),
                          setFundRequestId(item?.id);
                      }}
                      style={styles.actionIcon}
                    />
                  </NeumorphCard>
                )}
                {typeOfFundTransfer == 'pending' &&
                  item.status != 'partial' && (
                    <NeumorphCard
                      lightShadowColor={Colors().darkShadow2}
                      darkShadowColor={Colors().lightShadow}>
                      <Icon
                        name="cancel-presentation"
                        type={IconType.MaterialIcons}
                        color={Colors().red}
                        onPress={() => {
                          setRejectModalVisible(true),
                            setFundRequestId(item?.id);
                        }}
                        style={styles.actionIcon}
                      />
                    </NeumorphCard>
                  )}
              </View>
            </View>
          </NeumorphCard>
        </TouchableOpacity>
      </View>
    );
  };

  const handlePageClick = () => {
    if (typeOfFundTransfer == 'pending') {
      dispatch(getPendingFTList({ pageSize: pageSize, pageNo: pageNo }));
    }
    if (typeOfFundTransfer == 'transfer') {
      dispatch(getTransferedFTList({ pageSize: pageSize, pageNo: pageNo }));
    }
    if (typeOfFundTransfer == 'reschedule') {
      dispatch(getRescheduledFTList({ pageSize: pageSize, pageNo: pageNo }));
    }
    if (typeOfFundTransfer == 'all') {
      dispatch(getAllFTList({ pageSize: pageSize, pageNo: pageNo }));
    }
  };

  const rejectFT = async () => {
    const reqBody = { remark: formik.values.remark };
    const result = await dispatch(
      rejectFundTransfer({ id: fundRequestId, reqBody: reqBody }),
    ).unwrap();

    if (result?.status) {
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      setRejectModalVisible(false);
      formik.resetForm();
    } else {
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      setRejectModalVisible(false);
      formik.resetForm();
    }
  };

  const rescheduletFT = async () => {
    const result = await dispatch(
      rescheduleFundTransfer({
        id: fundRequestId,
        date: formik.values.remark,
      }),
    ).unwrap();

    if (result?.status) {
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      setReactiveModalVisble(false);
      formik.resetForm();
    } else {
      Toast.show({
        type: 'success',
        text1: result?.message,
        position: 'bottom',
      });
      setReactiveModalVisble(false);
      formik.resetForm();
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <View style={{ flexDirection: 'row' }}>
        <SearchBar setSearchText={setSearchText} />
      </View>

      <View style={{ height: WINDOW_HEIGHT * 0.87, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateApproveFundRequestScreen'}
        />
      </View>

      {/*view for modal of upate */}

      {rejectModalVisible && (
        <AlertModal
          visible={rejectModalVisible}
          iconName={'closecircleo'}
          icontype={IconType.AntDesign}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO REJECT THIS!!'}
          cancelBtnPress={() => {
            setRejectModalVisible(!rejectModalVisible),
              formik.setFieldValue(`remark`, '');
          }}
          ConfirmBtnPress={() => rejectFT()}
          remarkText={formik.values.remark}
          onRemarkChange={formik.handleChange('remark')}
          errorMesage={formik.values.remark ? '' : 'Remark is required'}
        />
      )}

      {approveModalVisible && (
        <AlertModal
          visible={approveModalVisible}
          iconName={'checkcircleo'}
          icontype={IconType.AntDesign}
          iconColor={Colors().aprroved}
          textToShow={'ARE YOU SURE YOU WANT TO APPROVE THIS!!'}
          cancelBtnPress={() => setApproveModalVisible(!approveModalVisible)}
          ConfirmBtnPress={() => approveComplaint(fundRequestId)}
        />
      )}

      {reactiveModalVisible && (
        <AlertModal
          visible={reactiveModalVisible}
          iconName={'refresh-circle-outline'}
          icontype={IconType.Ionicons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO RE-SCHEDULE THIS!!'}
          remarkText={formik.values.remark}
          onDateChange={date => formik.setFieldValue(`remark`, date)}
          cancelBtnPress={() => setReactiveModalVisble(!reactiveModalVisible)}
          ConfirmBtnPress={() => rescheduletFT()}
          errorMesage={formik.values.remark ? '' : 'Date  is required'}
        />
      )}

      {imageModalVisible && (
        <ImageViewer
          visible={imageModalVisible}
          imageUri={imageUri}
          cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
          // downloadBtnPress={item => downloadImageRemote(item)}
        />
      )}
    </SafeAreaView>
  );
};

export default memo(FundRequestListingScreen);

const styles = StyleSheet.create({
  cardContainer: {
    width: WINDOW_WIDTH * 0.95,
    marginBottom: 15,
    height: 'auto',
    alignSelf: 'center',
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  actionView: {
    margin: WINDOW_WIDTH * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  actionView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    fontSize: 12,
  },
});
