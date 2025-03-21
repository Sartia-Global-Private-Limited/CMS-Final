/*    ----------------Created Date :: 8-April -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, { useState, useEffect } from 'react';
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
import { Badge } from '@rneui/themed';
import Toast from 'react-native-toast-message';
import {
  getAllSTList,
  getPendingSTList,
  getRescheduledSTList,
  getTransferedSTList,
} from '../../../redux/slices/stock-management/stock-transfer/getStockTransferListSlice';
import {
  rejectStockTransfer,
  rescheduleStockTransfer,
} from '../../../redux/slices/stock-management/stock-transfer/changeStockTransferStatusSlice';
import List from '../../../component/List/List';

const StockTransferListingScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const typeOfStockTransfer = route?.params?.type;
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getStockTransferList);

  /*declare useState variable here */
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
      remark: '',
    },
  });

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      if (typeOfStockTransfer == 'pending') {
        dispatch(getPendingSTList({ pageSize: pageSize, pageNo: pageNo }));
      }
      if (typeOfStockTransfer == 'transfer') {
        dispatch(getTransferedSTList({ pageSize: pageSize, pageNo: pageNo }));
      }
      if (typeOfStockTransfer == 'reschedule') {
        dispatch(getRescheduledSTList({ pageSize: pageSize, pageNo: pageNo }));
      }
      if (typeOfStockTransfer == 'all') {
        dispatch(getAllSTList({ pageSize: pageSize, pageNo: pageNo }));
      }
    });
    return unsubscribe;
  }, [typeOfStockTransfer, isFocused]);

  useEffect(() => {
    if (typeOfStockTransfer == 'pending') {
      dispatch(
        getPendingSTList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
    if (typeOfStockTransfer == 'transfer') {
      dispatch(
        getTransferedSTList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
    if (typeOfStockTransfer == 'reschedule') {
      dispatch(
        getRescheduledSTList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
    if (typeOfStockTransfer == 'all') {
      dispatch(
        getAllSTList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
  }, [searchText]);

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
                      requested for :{' '}
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
                  {typeOfStockTransfer == 'pending' && (
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          { color: Colors().pureBlack },
                        ]}>
                        supplier :{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          { color: Colors().pureBlack },
                        ]}>
                        {item?.supplier_name}
                      </Text>
                    </View>
                  )}
                  {typeOfStockTransfer == 'transfer' && (
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          { color: Colors().pureBlack },
                        ]}>
                        Bill :{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          { color: Colors().pureBlack },
                        ]}>
                        {item?.bill_number}
                      </Text>
                    </View>
                  )}

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      request Qty. :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      {typeOfStockTransfer == 'pending'
                        ? item?.total_request_qty
                        : item?.request_stock_quantity}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      approve qty. :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      {typeOfStockTransfer == 'pending'
                        ? item?.total_approved_qty
                        : item?.approve_stock_quantity}
                    </Text>
                  </View>

                  {typeOfStockTransfer == 'pending' && (
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
                          value={`${item?.total_request_items} OLD `}
                          status="primary"
                        />
                        <Badge
                          value={`${item?.total_new_request_items} NEW `}
                          status="error"
                          textStyle={{ color: '#fff', fontSize: 12 }} // Adjust font size if needed
                          badgeStyle={{
                            backgroundColor: Colors().pending,
                          }}
                        />
                      </View>
                    </View>
                  )}

                  {(typeOfStockTransfer == 'transfer' ||
                    typeOfStockTransfer == 'all') && (
                    <View style={{ flexDirection: 'row' }}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          { color: Colors().pureBlack },
                        ]}>
                        transfer Qty :{' '}
                      </Text>
                      <Text
                        numberOfLines={2}
                        ellipsizeMode="tail"
                        style={[
                          styles.cardtext,
                          {
                            color:
                              item?.transfer_stock_quantity == 0
                                ? Colors().red
                                : Colors().aprroved,
                          },
                        ]}>
                        {item?.transfer_stock_quantity}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
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
                            typeOfStockTransfer == 'pending'
                              ? item?.status == '1'
                                ? Colors().pending
                                : Colors().partial
                              : getStatusColor(item?.status),
                        },
                      ]}>
                      {typeOfStockTransfer == 'pending'
                        ? item?.status == '1'
                          ? 'pending'
                          : 'partial'
                        : item?.status}
                    </Text>
                  </View>
                </NeumorphCard>
              </View>
              <View style={styles.actionView2}>
                {typeOfStockTransfer == 'pending' && (
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      name="exchange"
                      type={IconType.FontAwesome}
                      color={Colors().rejected}
                      style={styles.actionIcon}
                      disabled={!item?.active}
                      onPress={() =>
                        navigation.navigate('TransferStockRequestScreen', {
                          edit_id: item?.id,
                          type: 'transfer',
                        })
                      }
                    />
                  </NeumorphCard>
                )}
                {typeOfStockTransfer == 'transfer' && (
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      name="edit"
                      type={IconType.Feather}
                      color={Colors().edit}
                      disabled={item?.bill_number ? true : false}
                      style={styles.actionIcon}
                      onPress={() =>
                        navigation.navigate('TransferStockRequestScreen', {
                          edit_id: item?.id,
                          type: 'update',
                        })
                      }
                    />
                  </NeumorphCard>
                )}
                {typeOfStockTransfer == 'pending' && (
                  <NeumorphCard
                    lightShadowColor={Colors().darkShadow2}
                    darkShadowColor={Colors().lightShadow}>
                    <Icon
                      name="history"
                      type={IconType.MaterialCommunityIcons}
                      color={Colors().rejected}
                      disabled={!item?.active}
                      onPress={() => {
                        setReactiveModalVisble(true),
                          setStockRequestId(item?.id);
                      }}
                      style={styles.actionIcon}
                    />
                  </NeumorphCard>
                )}
                {typeOfStockTransfer == 'pending' &&
                  item.status != 'partial' && (
                    <NeumorphCard
                      lightShadowColor={Colors().darkShadow2}
                      darkShadowColor={Colors().lightShadow}>
                      <Icon
                        name="cancel-presentation"
                        type={IconType.MaterialIcons}
                        color={Colors().red}
                        disabled={!item?.active}
                        onPress={() => {
                          setRejectModalVisible(true),
                            setStockRequestId(item?.id);
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

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (typeOfStockTransfer == 'pending') {
      dispatch(getPendingSTList({ pageSize: pageSize, pageNo: pageNo }));
    }
    if (typeOfStockTransfer == 'transfer') {
      dispatch(getTransferedSTList({ pageSize: pageSize, pageNo: pageNo }));
    }
    if (typeOfStockTransfer == 'reschedule') {
      dispatch(getRescheduledSTList({ pageSize: pageSize, pageNo: pageNo }));
    }
    if (typeOfStockTransfer == 'all') {
      dispatch(getAllSTList({ pageSize: pageSize, pageNo: pageNo }));
    }
  };

  /* function for rejecting stock Transfer*/
  const rejectST = async () => {
    const reqBody = {
      rejected_remarks: formik.values.remark,
      id: stockRequestId,
      status: '2',
    };

    const result = await dispatch(
      rejectStockTransfer({ reqBody: reqBody }),
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

  /*function for rescheduling stock transfer*/
  const rescheduletST = async () => {
    const result = await dispatch(
      rescheduleStockTransfer({
        id: stockRequestId,
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

      <View style={{ height: WINDOW_HEIGHT * 0.85, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateApproveStockRequestScreen'}
        />
      </View>

      {/*view for Aler modal */}
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
          ConfirmBtnPress={() => rejectST()}
          remarkText={formik.values.remark}
          onRemarkChange={formik.handleChange('remark')}
          errorMesage={formik.values.remark ? '' : 'Remark is required'}
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
          ConfirmBtnPress={() => rescheduletST()}
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

export default StockTransferListingScreen;

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
    // marginTop: 5,
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
