/*    ----------------Created Date :: 1- April -2024   ----------------- */
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
import Toast from 'react-native-toast-message';
import ImageViewer from '../../../component/ImageViewer';
import Images from '../../../constants/Images';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { Badge } from '@rneui/themed';
import AlertModal from '../../../component/AlertModal';
import { useFormik } from 'formik';
import {
  getAllSRList,
  getApprovedSRList,
  getRejectedSRList,
  getRequestedSRList,
} from '../../../redux/slices/stock-management/stock-request/getStockRequestListSlice';
import { rejectStockRequestById } from '../../../redux/slices/stock-management/stock-request/addUpdateStockRequestSlice';
import List from '../../../component/List/List';

const StockRequestListingScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const typeOfFundRequest = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getStockRequestList);

  /*declare useState variable here */
  const [approveModalVisible, setApproveModalVisible] = useState(false);
  const [reactiveModalVisible, setReactiveModalVisble] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [stockRequestId, setStockRequestId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const formik = useFormik({
    initialValues: {
      rejected_remarks: '',
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      // e.preventDefault();
      // Alert.alert(typeOfFundRequest);
      if (typeOfFundRequest == 'pending') {
        dispatch(getRequestedSRList({ pageSize: pageSize, pageNo: pageNo }));
      }
      if (typeOfFundRequest == 'approved') {
        dispatch(getApprovedSRList({ pageSize: pageSize, pageNo: pageNo }));
      }
      if (typeOfFundRequest == 'rejected') {
        dispatch(getRejectedSRList({ pageSize: pageSize, pageNo: pageNo }));
      }
      if (typeOfFundRequest == 'all') {
        dispatch(getAllSRList({ pageSize: pageSize, pageNo: pageNo }));
      }
    });
    return unsubscribe;
  }, [typeOfFundRequest, isFocused]);

  useEffect(() => {
    if (typeOfFundRequest == 'pending') {
      dispatch(
        getRequestedSRList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
    if (typeOfFundRequest == 'approved') {
      dispatch(
        getApprovedSRList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
    if (typeOfFundRequest == 'rejected') {
      dispatch(
        getRejectedSRList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
    if (typeOfFundRequest == 'all') {
      dispatch(
        getAllSRList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
  }, [searchText]);

  /* rejectComplaint  function with id */
  const rejectComplaint = async stockRequestId => {
    const reqbody = {
      id: stockRequestId,
      rejected_remarks: formik.values.rejected_remarks,
      status: '2',
    };

    try {
      const rejectResult = await dispatch(
        rejectStockRequestById({ reqBody: reqbody }),
      ).unwrap();

      if (rejectResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: rejectResult?.message,
          position: 'bottom',
        });
        if (typeOfFundRequest == 'pending') {
          dispatch(getRequestedSRList({ pageSize: pageSize, pageNo: pageNo }));
        }
        if (typeOfFundRequest == 'approved') {
          dispatch(getApprovedSRList({ pageSize: pageSize, pageNo: pageNo }));
        }

        setRejectModalVisible(false), setStockRequestId('');
        formik.setFieldValue(`rejected_remarks`, '');
      } else {
        Toast.show({
          type: 'error',
          text1: rejectResult?.message,
          position: 'bottom',
        });
        formik.setFieldValue(`rejected_remarks`, '');
        setRejectModalVisible(false), setStockRequestId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      formik.setFieldValue(`rejected_remarks`, '');
      setRejectModalVisible(false), setStockRequestId('');
    }
  };

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case '0':
        return Colors().pending;
      case '1':
        return Colors().aprroved;
      case '2':
        return Colors().rejected;

      default:
        return 'black';
    }
  }
  /* for getting color of status*/
  function getStatusColor2(action) {
    switch (action) {
      case 'Pending':
        return Colors().pending;
      case 'Done':
        return Colors().resolved;
      case 'Approved':
        return Colors().aprroved;
      case 'Partial':
        return Colors().partial;
      case 'Rejected':
        return Colors().rejected;

      default:
        return 'black';
    }
  }

  /*for getting the text of status*/
  function getStatusText(status) {
    switch (status) {
      case '0':
        return 'pending';

      case '1':
        return 'approved';
      case '2':
        return 'rejected';

      default:
        break;
    }
  }

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          style={styles.cardContainer}
          onPress={() =>
            navigation.navigate('StockRequestDetailScreen', {
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
                        setImageUri(`${apiBaseUrl}${item?.request_for_image}`);
                      }}
                      source={{
                        uri: item?.request_for_image
                          ? `${apiBaseUrl}${item?.request_for_image}`
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
                      request for :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.request_for}
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
                      request QTY :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      {item?.total_request_qty}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      SUPPLIER :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.supplier_name}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Total item:{' '}
                    </Text>

                    <View
                      style={{
                        flexDirection: 'row',
                        marginLeft: 5,
                        columnGap: 8,
                      }}>
                      <Badge
                        value={`${item?.total_request_items} OLD`}
                        status="primary"
                      />
                      <Badge
                        value={`${item?.total_new_request_items} NEW`}
                        status="error"
                        badgeStyle={{
                          backgroundColor: Colors().pending,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {(item?.status == '1' || item?.status == '2') && (
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
                              item?.approved_image || item?.rejected_image
                            }`,
                          );
                        }}
                        source={{
                          uri:
                            item?.approved_image || item?.rejected_image
                              ? `${apiBaseUrl}${
                                  item?.approved_image || item?.rejected_image
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
                          : 'Rejected by : '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          { color: Colors().pureBlack },
                        ]}>
                        {item?.approved_by_name || item?.rejected_by_name}
                      </Text>
                    </View>

                    {item?.total_approved_qty && item?.status === '1' ? (
                      <View style={{ flexDirection: 'row' }}>
                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            { color: Colors().pureBlack },
                          ]}>
                          aprroved Qty :{' '}
                        </Text>
                        <Text
                          numberOfLines={2}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            { color: Colors().aprroved },
                          ]}>
                          {item?.total_approved_qty}
                        </Text>
                      </View>
                    ) : null}
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
                        {
                          color:
                            typeOfFundRequest == 'all'
                              ? getStatusColor2(item?.status)
                              : getStatusColor(item?.status),
                        },
                      ]}>
                      {typeOfFundRequest == 'all'
                        ? item.status
                        : getStatusText(item?.status)}
                    </Text>
                  </View>
                </NeumorphCard>
              </View>
              <View style={styles.actionView2}>
                {(item?.status === '0' ||
                  (item?.status === '1' && item?.active)) && (
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      name="edit"
                      // disabled={item.status === '0' ? false : !item?.active}
                      type={IconType.Feather}
                      color={Colors().edit}
                      style={styles.actionIcon}
                      onPress={() =>
                        navigation.navigate(
                          'AddUpdateApproveStockRequestScreen',
                          {
                            edit_id: item?.id,
                            type:
                              typeOfFundRequest == 'approved'
                                ? 'approve'
                                : 'update',
                            request_tax_type: item?.request_tax_type,
                          },
                        )
                      }
                    />
                  </NeumorphCard>
                )}
                {((item?.status === '0' && item?.active) ||
                  (item?.status === '1' && item?.active)) && (
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      name="cancel-presentation"
                      type={IconType.MaterialIcons}
                      // disabled={
                      //   item?.active !== undefined ? !item?.active : false
                      // }
                      color={Colors().red}
                      onPress={() => {
                        setRejectModalVisible(true),
                          setStockRequestId(item?.id);
                      }}
                      style={styles.actionIcon}
                    />
                  </NeumorphCard>
                )}

                {item?.status === '0' && item?.active && (
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      name="checksquareo"
                      type={IconType.AntDesign}
                      color={Colors().aprroved}
                      style={styles.actionIcon}
                      disabled={!item?.active}
                      onPress={() => {
                        navigation.navigate(
                          'AddUpdateApproveStockRequestScreen',
                          {
                            edit_id: item?.id,
                            type: 'approve',
                          },
                        );
                      }}
                    />
                  </NeumorphCard>
                )}

                {item?.status === '2' && (
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      name="restore"
                      type={IconType.MaterialCommunityIcons}
                      color={Colors().rejected}
                      onPress={() =>
                        navigation.navigate(
                          'AddUpdateApproveStockRequestScreen',
                          {
                            edit_id: item?.id,
                            type:
                              typeOfFundRequest == 'rejected'
                                ? 'approve'
                                : 'update',
                            request_tax_type: item?.request_tax_type,
                          },
                        )
                      }
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

  /*pagination button click funtion*/
  const handlePageClick = () => {
    // Alert.alert(typeOfFundRequest);
    if (typeOfFundRequest == 'pending') {
      dispatch(getRequestedSRList({ pageSize: pageSize, pageNo: pageNo }));
    }
    if (typeOfFundRequest == 'approved') {
      dispatch(getApprovedSRList({ pageSize: pageSize, pageNo: pageNo }));
    }
    if (typeOfFundRequest == 'rejected') {
      dispatch(getRejectedSRList({ pageSize: pageSize, pageNo: pageNo }));
    }
    if (typeOfFundRequest == 'all') {
      dispatch(getAllSRList({ pageSize: pageSize, pageNo: pageNo }));
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <View style={{ flexDirection: 'row' }}>
        <SearchBar setSearchText={setSearchText} />
      </View>

      <View style={{ height: WINDOW_HEIGHT * 0.85, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateApproveStockRequestScreenss'}
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
              formik.setFieldValue(`rejected_remarks`, '');
          }}
          ConfirmBtnPress={() => {
            rejectComplaint(stockRequestId);
          }}
          remarkText={formik.values.rejected_remarks}
          onRemarkChange={formik.handleChange('rejected_remarks')}
          errorMesage={
            formik.values.rejected_remarks ? '' : 'Remark is required'
          }
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
          ConfirmBtnPress={() => approveComplaint(stockRequestId)}
        />
      )}
      {reactiveModalVisible && (
        <AlertModal
          visible={reactiveModalVisible}
          iconName={'refresh-circle-outline'}
          icontype={IconType.Ionicons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO RE-ACTIVE THIS!!'}
          cancelBtnPress={() => setReactiveModalVisble(!reactiveModalVisible)}
          ConfirmBtnPress={() => reactiveComplaint(stockRequestId)}
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

export default memo(StockRequestListingScreen);

const styles = StyleSheet.create({
  cardContainer: {
    width: WINDOW_WIDTH * 0.95,
    marginBottom: 15,
    height: 'auto',
    alignSelf: 'center',
  },
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
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
  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    fontSize: 12,
  },
});
