/*    ----------------Created Date :: 19- March -2024   ----------------- */

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import CustomeHeader from '../../../component/CustomeHeader';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import NeumorphCard from '../../../component/NeumorphCard';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {DataTable} from 'react-native-paper';
import {getFundRequestDetailById} from '../../../redux/slices/fund-management/fund-request/getFundRequestDetailSlice';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {Avatar, Icon} from '@rneui/themed';
import Images from '../../../constants/Images';
import {apiBaseUrl} from '../../../../config';
import ImageViewer from '../../../component/ImageViewer';
import ScreensLabel from '../../../constants/ScreensLabel';

const FundRequestDetailScreen = ({navigation, route}) => {
  const edit_id = route?.params?.edit_id;
  const label = ScreensLabel();
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [imageUri, setImageUri] = useState('');

  const listData = useSelector(state => state.getFundRequestDetail);
  const data = listData?.data?.data;

  /* for getting color of status*/
  function getStatusColor(action) {
    if (action === undefined) {
      return 'black'; // or whatever default color you prefer
    }
    switch (action) {
      case '0':
        return Colors().pending;
      case '1':
        return Colors().aprroved;
      case '2':
        return Colors().rejected;
      case '3':
        return Colors().red;
      case '4':
        return Colors().partial;
      case '5':
        return Colors().resolved;

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
      case '3':
        return 'hold';
      case '4':
        return 'partial';
      case '5':
        return 'done';

      default:
        break;
    }
  }

  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const getTotalRequestAmount = itm => {
    let sum = 0;
    itm.forEach(element => {
      sum += parseFloat(element.fund_amount);
    });
    return sum;
  };
  const getTotalApprovetAmount = itm => {
    let sum = 0;
    itm.forEach(element => {
      sum += parseFloat(element.request_transfer_fund);
    });
    return sum;
  };
  const getTotalNewApprovetAmount = itm => {
    let sum = 0;
    itm.forEach(element => {
      sum += parseFloat(element.request_transfer_fund);
    });
    return sum;
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getFundRequestDetailById(edit_id));
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    dispatch(getFundRequestDetailById(edit_id));
  }, [edit_id]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label.FUND_REQUEST_DETAIL} />

      {listData?.isLoading ? (
        <Loader />
      ) : !listData?.isLoading &&
        !listData?.isError &&
        listData?.data?.status ? (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }>
            <View style={styles.mainView}>
              {/* Request fund card */}
              <NeumorphCard>
                <View style={styles.cardContainer}>
                  <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                    REQUEST Fund
                  </Text>
                  <SeparatorComponent
                    separatorColor={Colors().gray2}
                    separatorHeight={0.5}
                  />

                  {/* view for request user */}
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
                              `${apiBaseUrl}${data?.request_for_image}`,
                            );
                          }}
                          source={{
                            uri: data?.request_for_image
                              ? `${apiBaseUrl}${data?.request_for_image}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          }}
                        />
                      </NeuomorphAvatar>
                    </View>

                    <View style={{flex: 1, justifyContent: 'center'}}>
                      {data?.request_for && (
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}>
                            Request for :{' '}
                          </Text>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              {color: Colors().pureBlack},
                            ]}>
                            {data?.request_for}
                          </Text>
                        </View>
                      )}

                      {data?.request_date && (
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}>
                            REQUEST DATE :
                          </Text>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              {color: Colors().pureBlack},
                            ]}>
                            {data?.request_date}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                  <View style={styles.actionView}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        STATUS :{' '}
                      </Text>
                      <NeumorphCard>
                        <View style={{padding: 5}}>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              {color: getStatusColor(data?.status)},
                            ]}>
                            {getStatusText(data?.status)}
                          </Text>
                        </View>
                      </NeumorphCard>
                    </View>
                    <View style={styles.actionView2}>
                      <NeumorphCard
                        lightShadowColor={Colors().darkShadow2}
                        darkShadowColor={Colors().lightShadow}>
                        <Icon
                          name="edit"
                          type={IconType.Feather}
                          color={Colors().edit}
                          style={styles.actionIcon}
                          onPress={() =>
                            navigation.navigate(
                              'AddUpdateApproveFundRequestScreen',
                              {
                                edit_id: data?.id,
                                type: 'update',
                              },
                            )
                          }
                        />
                      </NeumorphCard>
                    </View>
                  </View>
                </View>
              </NeumorphCard>

              {/* Request data card  */}
              <NeumorphCard>
                <View style={styles.cardContainer}>
                  <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                    {' '}
                    REQUEST DATA
                  </Text>
                  <SeparatorComponent
                    separatorColor={Colors().gray2}
                    separatorHeight={0.5}
                  />
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <DataTable>
                      <DataTable.Header style={{columnGap: 10}}>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          style={[styles.tableHeadingView, {width: 50}]}>
                          S.NO
                        </DataTable.Title>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          style={[styles.tableHeadingView, {width: 120}]}>
                          item Name
                        </DataTable.Title>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          style={[styles.tableHeadingView, {width: 80}]}>
                          Prev.Price
                        </DataTable.Title>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          numberOfLines={2}
                          style={[styles.tableHeadingView, {width: 80}]}>
                          PRev. user stock
                        </DataTable.Title>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          numberOfLines={2}
                          style={[styles.tableHeadingView, {width: 80}]}>
                          current Price
                        </DataTable.Title>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          numberOfLines={2}
                          style={[styles.tableHeadingView, {width: 80}]}>
                          Request Stock
                        </DataTable.Title>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          numberOfLines={2}
                          style={[styles.tableHeadingView, {width: 120}]}>
                          Request Amount
                        </DataTable.Title>
                      </DataTable.Header>
                      <ScrollView>
                        {data?.request_fund?.request_fund.map((itm, index) => (
                          <>
                            <DataTable.Row key={index} style={{}}>
                              <DataTable.Cell
                                textStyle={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().pureBlack},
                                ]}
                                style={[
                                  styles.tableHeadingView,
                                  {
                                    width: 50,
                                  },
                                ]}>
                                <View style={styles.tableHeadingView}>
                                  <Text
                                    numberOfLines={2}
                                    style={[
                                      styles.cardtext,
                                      {color: Colors().pureBlack},
                                    ]}>
                                    {index + 1}
                                  </Text>
                                </View>
                              </DataTable.Cell>

                              <DataTable.Cell
                                textStyle={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().pureBlack},
                                ]}
                                style={[styles.tableHeadingView, {width: 120}]}>
                                <View
                                  style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    columnGap: 2,
                                  }}>
                                  <NeuomorphAvatar gap={3}>
                                    <Avatar
                                      size={30}
                                      rounded
                                      onPress={() => {
                                        setImageModalVisible(true);
                                        setImageUri(
                                          `${apiBaseUrl}${itm?.item_name?.image}`,
                                        );
                                      }}
                                      source={{
                                        uri: itm?.item_name?.image
                                          ? `${apiBaseUrl}${itm?.item_name?.image}`
                                          : `${Images.DEFAULT_PROFILE}`,
                                      }}
                                    />
                                  </NeuomorphAvatar>
                                  <Text
                                    style={[
                                      styles.cardtext,
                                      {color: Colors().pureBlack},
                                    ]}
                                    numberOfLines={2}>
                                    {itm?.item_name?.label}
                                  </Text>
                                </View>
                              </DataTable.Cell>
                              <DataTable.Cell
                                textStyle={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().pureBlack},
                                ]}
                                style={[styles.tableHeadingView, {width: 80}]}>
                                <Text
                                  numberOfLines={2}
                                  style={[
                                    styles.cardtext,
                                    {color: Colors().pureBlack},
                                  ]}>
                                  ₹ {itm?.previous_price}
                                </Text>
                              </DataTable.Cell>
                              <DataTable.Cell
                                textStyle={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().pureBlack},
                                ]}
                                style={[styles.tableHeadingView, {width: 80}]}>
                                <Text
                                  numberOfLines={2}
                                  style={[
                                    styles.cardtext,
                                    {color: Colors().pureBlack},
                                  ]}>
                                  {itm?.current_user_stock}
                                </Text>
                              </DataTable.Cell>
                              <DataTable.Cell
                                textStyle={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().pureBlack},
                                ]}
                                style={[styles.tableHeadingView, {width: 80}]}>
                                <Text
                                  numberOfLines={2}
                                  style={[
                                    styles.cardtext,
                                    {color: Colors().pureBlack},
                                  ]}>
                                  ₹ {itm?.current_price}
                                </Text>
                              </DataTable.Cell>
                              <DataTable.Cell
                                textStyle={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().pureBlack},
                                ]}
                                style={[styles.tableHeadingView, {width: 80}]}>
                                <Text
                                  numberOfLines={2}
                                  style={[
                                    styles.cardtext,
                                    {color: Colors().pureBlack},
                                  ]}>
                                  {itm?.request_quantity}
                                </Text>
                              </DataTable.Cell>
                              <DataTable.Cell
                                textStyle={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().pureBlack},
                                ]}
                                style={[styles.tableHeadingView, {width: 120}]}>
                                <Text
                                  numberOfLines={2}
                                  style={[
                                    styles.cardtext,
                                    {color: Colors().pureBlack},
                                  ]}>
                                  ₹ {itm?.fund_amount}
                                </Text>
                              </DataTable.Cell>
                            </DataTable.Row>
                          </>
                        ))}

                        <DataTable.Row
                          style={{
                            alignItems: 'flex-end',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple, alignSelf: 'center'},
                            ]}>
                            TOTAL Request Amount ={' '}
                            {getTotalRequestAmount(
                              data?.request_fund?.request_fund,
                            )}
                          </Text>
                        </DataTable.Row>
                      </ScrollView>
                    </DataTable>
                  </ScrollView>
                </View>
              </NeumorphCard>

              {/*New Request data card  */}
              {!isObjectEmpty(data?.request_fund?.new_request_fund) && (
                <NeumorphCard>
                  <View style={styles.cardContainer}>
                    <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                      New REQUEST DATA
                    </Text>
                    <SeparatorComponent
                      separatorColor={Colors().gray2}
                      separatorHeight={0.5}
                    />
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      <DataTable>
                        <DataTable.Header style={{columnGap: 10}}>
                          <DataTable.Title
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple},
                            ]}
                            style={[styles.tableHeadingView, {width: 50}]}>
                            S.NO
                          </DataTable.Title>
                          <DataTable.Title
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple},
                            ]}
                            style={[styles.tableHeadingView, {width: 120}]}>
                            item Name
                          </DataTable.Title>

                          <DataTable.Title
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple},
                            ]}
                            numberOfLines={2}
                            style={[styles.tableHeadingView, {width: 80}]}>
                            current Price
                          </DataTable.Title>
                          <DataTable.Title
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple},
                            ]}
                            numberOfLines={2}
                            style={[styles.tableHeadingView, {width: 80}]}>
                            Request Stock
                          </DataTable.Title>
                          <DataTable.Title
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple},
                            ]}
                            numberOfLines={2}
                            style={[styles.tableHeadingView, {width: 120}]}>
                            Request Amount
                          </DataTable.Title>
                        </DataTable.Header>
                        <ScrollView>
                          {data?.request_fund?.new_request_fund.map(
                            (itm, index) => (
                              <>
                                <DataTable.Row key={index} style={{}}>
                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      {color: Colors().pureBlack},
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      {
                                        width: 50,
                                      },
                                    ]}>
                                    <View style={styles.tableHeadingView}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {index + 1}
                                      </Text>
                                    </View>
                                  </DataTable.Cell>

                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      {color: Colors().pureBlack},
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      {width: 120},
                                    ]}>
                                    <View
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        columnGap: 2,
                                      }}>
                                      <NeuomorphAvatar gap={3}>
                                        <Avatar
                                          size={30}
                                          rounded
                                          onPress={() => {
                                            setImageModalVisible(true);
                                            setImageUri(`${itm?.item_image}`);
                                          }}
                                          source={{
                                            uri: itm?.item_image
                                              ? `${itm?.item_image}`
                                              : `${Images.DEFAULT_PROFILE}`,
                                          }}
                                        />
                                      </NeuomorphAvatar>
                                      <Text
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}
                                        numberOfLines={2}>
                                        {itm?.title?.label}
                                      </Text>
                                    </View>
                                  </DataTable.Cell>

                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      {color: Colors().pureBlack},
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      {width: 80},
                                    ]}>
                                    <Text
                                      numberOfLines={2}
                                      style={[
                                        styles.cardtext,
                                        {color: Colors().pureBlack},
                                      ]}>
                                      ₹ {itm?.rate}
                                    </Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      {color: Colors().pureBlack},
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      {width: 80},
                                    ]}>
                                    <Text
                                      numberOfLines={2}
                                      style={[
                                        styles.cardtext,
                                        {color: Colors().pureBlack},
                                      ]}>
                                      {itm?.qty}
                                    </Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      {color: Colors().pureBlack},
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      {width: 120},
                                    ]}>
                                    <Text
                                      numberOfLines={2}
                                      style={[
                                        styles.cardtext,
                                        {color: Colors().pureBlack},
                                      ]}>
                                      ₹ {itm?.fund_amount}
                                    </Text>
                                  </DataTable.Cell>
                                </DataTable.Row>
                              </>
                            ),
                          )}

                          <DataTable.Row
                            style={{
                              alignItems: 'flex-end',
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple, alignSelf: 'center'},
                              ]}>
                              TOTAL Request Amount ={' '}
                              {getTotalRequestAmount(
                                data?.request_fund?.new_request_fund,
                              )}
                            </Text>
                          </DataTable.Row>
                          <DataTable.Row
                            style={{
                              alignItems: 'flex-end',
                              justifyContent: 'center',
                            }}>
                            <Text
                              style={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple, alignSelf: 'center'},
                              ]}>
                              Final Request Amount ={' '}
                              {data?.total_request_amount}
                            </Text>
                          </DataTable.Row>
                        </ScrollView>
                      </DataTable>
                    </ScrollView>
                  </View>
                </NeumorphCard>
              )}

              {/* approved fund card  */}
              {data?.approved_data && !isObjectEmpty(data?.approved_data) && (
                <NeumorphCard>
                  <View style={styles.cardContainer}>
                    <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                      approve Fund
                    </Text>
                    <SeparatorComponent
                      separatorColor={Colors().gray2}
                      separatorHeight={0.5}
                    />

                    {/* view for request user */}
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
                                `${apiBaseUrl}${data?.approved_image}`,
                              );
                            }}
                            source={{
                              uri: data?.approved_image
                                ? `${apiBaseUrl}${data?.approved_image}`
                                : `${
                                    Image.resolveAssetSource(
                                      Images.DEFAULT_PROFILE,
                                    ).uri
                                  }`,
                            }}
                          />
                        </NeuomorphAvatar>
                      </View>

                      <View style={{flex: 1, justifyContent: 'center'}}>
                        {data?.request_for && (
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}>
                              Approved by :{' '}
                            </Text>
                            <Text
                              numberOfLines={2}
                              ellipsizeMode="tail"
                              style={[
                                styles.cardtext,
                                {color: Colors().pureBlack},
                              ]}>
                              {data?.approved_by_name}
                            </Text>
                          </View>
                        )}

                        {data?.approved_at && (
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}>
                              approved DATE :
                            </Text>
                            <Text
                              numberOfLines={2}
                              ellipsizeMode="tail"
                              style={[
                                styles.cardtext,
                                {color: Colors().pureBlack},
                              ]}>
                              {data?.approved_at}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    <View style={styles.actionView}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            {color: Colors().pureBlack},
                          ]}>
                          STATUS :{' '}
                        </Text>
                        <NeumorphCard>
                          <View style={{padding: 5}}>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={[
                                styles.cardtext,
                                {color: getStatusColor(data?.status)},
                              ]}>
                              {getStatusText(data?.status)}
                            </Text>
                          </View>
                        </NeumorphCard>
                      </View>
                      <View style={styles.actionView2}>
                        <NeumorphCard
                          lightShadowColor={Colors().darkShadow2}
                          darkShadowColor={Colors().lightShadow}>
                          <Icon
                            name="edit"
                            type={IconType.Feather}
                            color={Colors().edit}
                            style={styles.actionIcon}
                            onPress={() =>
                              navigation.navigate(
                                'AddUpdateApproveFundRequestScreen',
                                {
                                  edit_id: data?.id,
                                  type: 'update',
                                },
                              )
                            }
                          />
                        </NeumorphCard>
                      </View>
                    </View>
                  </View>
                </NeumorphCard>
              )}

              {/* Approved item card  */}
              {data?.approved_data &&
                !isObjectEmpty(data?.approved_data?.request_fund) && (
                  <NeumorphCard>
                    <View style={styles.cardContainer}>
                      <Text
                        style={[styles.headingTxt, {color: Colors().purple}]}>
                        {' '}
                        Approved item
                      </Text>
                      <SeparatorComponent
                        separatorColor={Colors().gray2}
                        separatorHeight={0.5}
                      />
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <DataTable>
                          <DataTable.Header style={{columnGap: 10}}>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 50}]}>
                              S.NO
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 120}]}>
                              item Name
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 100}]}>
                              Description
                            </DataTable.Title>
                            <DataTable.Title
                              numberOfLines={2}
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Previous Price
                            </DataTable.Title>
                            <DataTable.Title
                              numberOfLines={2}
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Request Price
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              request qty.
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              approve Price
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Approve Qty.
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 120}]}>
                              Approve Amount
                            </DataTable.Title>
                          </DataTable.Header>
                          <ScrollView>
                            {data?.approved_data?.request_fund.map(
                              (itm, index) => (
                                <>
                                  <DataTable.Row key={index} style={{}}>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {
                                          width: 50,
                                        },
                                      ]}>
                                      <View style={styles.tableHeadingView}>
                                        <Text
                                          numberOfLines={2}
                                          style={[
                                            styles.cardtext,
                                            {color: Colors().pureBlack},
                                          ]}>
                                          {index + 1}
                                        </Text>
                                      </View>
                                    </DataTable.Cell>

                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 120},
                                      ]}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          columnGap: 2,
                                        }}>
                                        <NeuomorphAvatar gap={3}>
                                          <Avatar
                                            size={30}
                                            rounded
                                            onPress={() => {
                                              setImageModalVisible(true);
                                              setImageUri(
                                                `${apiBaseUrl}${itm?.item_name?.image}`,
                                              );
                                            }}
                                            source={{
                                              uri: itm?.item_name?.image
                                                ? `${apiBaseUrl}${itm?.item_name?.image}`
                                                : `${Images.DEFAULT_PROFILE}`,
                                            }}
                                          />
                                        </NeuomorphAvatar>
                                        <Text
                                          style={[
                                            styles.cardtext,
                                            {color: Colors().pureBlack},
                                          ]}
                                          numberOfLines={2}>
                                          {itm?.item_name?.label}
                                        </Text>
                                      </View>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 100},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.description}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.previous_price}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.current_price}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.request_quantity}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.price}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.quantity}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 120},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.total_approve_amount}
                                      </Text>
                                    </DataTable.Cell>
                                  </DataTable.Row>
                                </>
                              ),
                            )}

                            <DataTable.Row
                              style={{
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().purple, alignSelf: 'center'},
                                ]}>
                                TOTAL Approve Amount ={' '}
                                {getTotalApprovetAmount(
                                  data?.approved_data?.request_fund,
                                )}
                              </Text>
                            </DataTable.Row>
                          </ScrollView>
                        </DataTable>
                      </ScrollView>
                    </View>
                  </NeumorphCard>
                )}

              {/* New Approved item card */}
              {data?.approved_data &&
                !isObjectEmpty(data?.approved_data?.new_request_fund) && (
                  <NeumorphCard>
                    <View style={styles.cardContainer}>
                      <Text
                        style={[styles.headingTxt, {color: Colors().purple}]}>
                        New Approve items
                      </Text>
                      <SeparatorComponent
                        separatorColor={Colors().gray2}
                        separatorHeight={0.5}
                      />
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <DataTable>
                          <DataTable.Header style={{columnGap: 10}}>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 50}]}>
                              S.NO
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 120}]}>
                              item Name
                            </DataTable.Title>

                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Hsn code
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Requested Price
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Requested QTy.
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Approved Price
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Approved QTy.
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 120}]}>
                              Approved Amount
                            </DataTable.Title>
                          </DataTable.Header>
                          <ScrollView>
                            {data?.approved_data?.new_request_fund.map(
                              (itm, index) => (
                                <>
                                  <DataTable.Row key={index} style={{}}>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {
                                          width: 50,
                                        },
                                      ]}>
                                      <View style={styles.tableHeadingView}>
                                        <Text
                                          numberOfLines={2}
                                          style={[
                                            styles.cardtext,
                                            {color: Colors().pureBlack},
                                          ]}>
                                          {index + 1}
                                        </Text>
                                      </View>
                                    </DataTable.Cell>

                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 120},
                                      ]}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          columnGap: 2,
                                        }}>
                                        <NeuomorphAvatar gap={3}>
                                          <Avatar
                                            size={30}
                                            rounded
                                            onPress={() => {
                                              setImageModalVisible(true);
                                              setImageUri(`${itm?.item_image}`);
                                            }}
                                            source={{
                                              uri: itm?.item_image
                                                ? `${itm?.item_image}`
                                                : `${Images.DEFAULT_PROFILE}`,
                                            }}
                                          />
                                        </NeuomorphAvatar>
                                        <Text
                                          style={[
                                            styles.cardtext,
                                            {color: Colors().pureBlack},
                                          ]}
                                          numberOfLines={2}>
                                          {itm?.title?.label}
                                        </Text>
                                      </View>
                                    </DataTable.Cell>

                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.hsncode}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.requested_rate}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.requested_qty}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.rate}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.qty}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 120},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.approve_fund_amount}
                                      </Text>
                                    </DataTable.Cell>
                                  </DataTable.Row>
                                </>
                              ),
                            )}

                            <DataTable.Row
                              style={{
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().purple, alignSelf: 'center'},
                                ]}>
                                TOTAL Approved Amount ={' '}
                                {getTotalNewApprovetAmount(
                                  data?.approved_data?.new_request_fund,
                                )}
                              </Text>
                            </DataTable.Row>
                            <DataTable.Row
                              style={{
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().purple, alignSelf: 'center'},
                                ]}>
                                Final approved Amount ={' '}
                                {data?.total_approved_amount}
                              </Text>
                            </DataTable.Row>
                          </ScrollView>
                        </DataTable>
                      </ScrollView>
                    </View>
                  </NeumorphCard>
                )}

              {/* Transfer fund card  */}
              {data?.transfer_data && !isObjectEmpty(data?.transfer_data) && (
                <NeumorphCard>
                  <View style={styles.cardContainer}>
                    <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                      Transfer Fund
                    </Text>
                    <SeparatorComponent
                      separatorColor={Colors().gray2}
                      separatorHeight={0.5}
                    />

                    {/* view for request user */}
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
                                `${apiBaseUrl}${data?.approved_image}`,
                              );
                            }}
                            source={{
                              uri: data?.approved_image
                                ? `${apiBaseUrl}${data?.approved_image}`
                                : `${
                                    Image.resolveAssetSource(
                                      Images.DEFAULT_PROFILE,
                                    ).uri
                                  }`,
                            }}
                          />
                        </NeuomorphAvatar>
                      </View>

                      <View style={{flex: 1, justifyContent: 'center'}}>
                        {data?.request_for && (
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}>
                              Approved by :{' '}
                            </Text>
                            <Text
                              numberOfLines={2}
                              ellipsizeMode="tail"
                              style={[
                                styles.cardtext,
                                {color: Colors().pureBlack},
                              ]}>
                              {data?.approved_by_name}
                            </Text>
                          </View>
                        )}

                        {data?.approved_at && (
                          <View style={{flexDirection: 'row'}}>
                            <Text
                              style={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}>
                              approved DATE :
                            </Text>
                            <Text
                              numberOfLines={2}
                              ellipsizeMode="tail"
                              style={[
                                styles.cardtext,
                                {color: Colors().pureBlack},
                              ]}>
                              {data?.approved_at}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>
                    {/* <View style={styles.actionView}>
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text  style={[styles.cardHeadingTxt,{  color: Colors().pureBlack,}]}>STATUS : </Text>
                        <NeumorphCard>
                          <View style={{padding: 5}}>
                            <Text
                              numberOfLines={1}
                              ellipsizeMode="tail"
                              style={[
                                styles.cardtext,
                                {color: getStatusColor(data?.status)},
                              ]}>
                              {getStatusText(data?.status)}
                            </Text>
                          </View>
                        </NeumorphCard>
                      </View>
                      <View style={styles.actionView2}>
                        <NeumorphCard
                          lightShadowColor={Colors().darkShadow2}
                          darkShadowColor={Colors().lightShadow}>
                          <Icon
                            name="edit"
                            type={IconType.Feather}
                            color={Colors().edit}
                            style={styles.actionIcon}
                            onPress={() =>
                              navigation.navigate(
                                'AddUpdateApproveFundRequestScreen',
                                {
                                  edit_id: data?.id,
                                  type: 'update',
                                },
                              )
                            }
                          />
                        </NeumorphCard>
                      </View>
                    </View> */}
                  </View>
                </NeumorphCard>
              )}

              {/* Transfer item card  */}
              {data?.transfer_data &&
                !isObjectEmpty(data?.transfer_data?.transfer_fund) && (
                  <NeumorphCard>
                    <View style={styles.cardContainer}>
                      <Text
                        style={[styles.headingTxt, {color: Colors().purple}]}>
                        {' '}
                        Transfer item
                      </Text>
                      <SeparatorComponent
                        separatorColor={Colors().gray2}
                        separatorHeight={0.5}
                      />
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <DataTable>
                          <DataTable.Header style={{columnGap: 10}}>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 50}]}>
                              S.NO
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 120}]}>
                              item Name
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 100}]}>
                              Description
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              hsn code
                            </DataTable.Title>
                            <DataTable.Title
                              numberOfLines={2}
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Previous Price
                            </DataTable.Title>

                            <DataTable.Title
                              numberOfLines={2}
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              current stock
                            </DataTable.Title>
                            <DataTable.Title
                              numberOfLines={2}
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Item Rate
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              request qty.
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 120}]}>
                              Total Request Amt.
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              approve Price
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Approve Qty.
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Transfer Qty.
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 120}]}>
                              Transfer Amount
                            </DataTable.Title>
                          </DataTable.Header>
                          <ScrollView>
                            {data?.transfer_data?.transfer_fund.map(
                              (itm, index) => (
                                <>
                                  <DataTable.Row key={index} style={{}}>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {
                                          width: 50,
                                        },
                                      ]}>
                                      <View style={styles.tableHeadingView}>
                                        <Text
                                          numberOfLines={2}
                                          style={[
                                            styles.cardtext,
                                            {color: Colors().pureBlack},
                                          ]}>
                                          {index + 1}
                                        </Text>
                                      </View>
                                    </DataTable.Cell>

                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 120},
                                      ]}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          columnGap: 2,
                                        }}>
                                        <NeuomorphAvatar gap={3}>
                                          <Avatar
                                            size={30}
                                            rounded
                                            onPress={() => {
                                              setImageModalVisible(true);
                                              setImageUri(
                                                `${apiBaseUrl}${itm?.item_name?.image}`,
                                              );
                                            }}
                                            source={{
                                              uri: itm?.item_name?.image
                                                ? `${apiBaseUrl}${itm?.item_name?.image}`
                                                : `${Images.DEFAULT_PROFILE}`,
                                            }}
                                          />
                                        </NeuomorphAvatar>
                                        <Text
                                          style={[
                                            styles.cardtext,
                                            {color: Colors().pureBlack},
                                          ]}
                                          numberOfLines={2}>
                                          {itm?.item_name?.label}
                                        </Text>
                                      </View>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 100},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.item_name?.description}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.item_name?.hsncode}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.previous_price}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.current_user_stock}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.current_price}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.request_quantity}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 120},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.fund_amount}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.price}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.quantity}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.transfer_quantity}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 120},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.request_transfer_fund}
                                      </Text>
                                    </DataTable.Cell>
                                  </DataTable.Row>
                                </>
                              ),
                            )}

                            <DataTable.Row
                              style={{
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().purple, alignSelf: 'center'},
                                ]}>
                                TOTAL Transfer Amount ={' '}
                                {getTotalApprovetAmount(
                                  data?.transfer_data?.transfer_fund,
                                )}
                              </Text>
                            </DataTable.Row>
                          </ScrollView>
                        </DataTable>
                      </ScrollView>
                    </View>
                  </NeumorphCard>
                )}

              {/* New Transfer item card */}
              {data?.transfer_data &&
                !isObjectEmpty(data?.transfer_data?.new_transfer_fund) && (
                  <NeumorphCard>
                    <View style={styles.cardContainer}>
                      <Text
                        style={[styles.headingTxt, {color: Colors().purple}]}>
                        New Transfer items
                      </Text>
                      <SeparatorComponent
                        separatorColor={Colors().gray2}
                        separatorHeight={0.5}
                      />
                      <ScrollView
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}>
                        <DataTable>
                          <DataTable.Header style={{columnGap: 10}}>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 50}]}>
                              S.NO
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              style={[styles.tableHeadingView, {width: 120}]}>
                              item Name
                            </DataTable.Title>

                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Hsn code
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Requested Price
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Requested QTy.
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Approved Price
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Approved QTy.
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              Transfer QTy.
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().purple},
                              ]}
                              numberOfLines={2}
                              style={[styles.tableHeadingView, {width: 120}]}>
                              Transfer Amount
                            </DataTable.Title>
                          </DataTable.Header>
                          <ScrollView>
                            {data?.transfer_data?.new_transfer_fund.map(
                              (itm, index) => (
                                <>
                                  <DataTable.Row key={index} style={{}}>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {
                                          width: 50,
                                        },
                                      ]}>
                                      <View style={styles.tableHeadingView}>
                                        <Text
                                          numberOfLines={2}
                                          style={[
                                            styles.cardtext,
                                            {color: Colors().pureBlack},
                                          ]}>
                                          {index + 1}
                                        </Text>
                                      </View>
                                    </DataTable.Cell>

                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 120},
                                      ]}>
                                      <View
                                        style={{
                                          flexDirection: 'row',
                                          alignItems: 'center',
                                          columnGap: 2,
                                        }}>
                                        <NeuomorphAvatar gap={3}>
                                          <Avatar
                                            size={30}
                                            rounded
                                            onPress={() => {
                                              setImageModalVisible(true);
                                              setImageUri(`${itm?.item_image}`);
                                            }}
                                            source={{
                                              uri: itm?.item_image
                                                ? `${itm?.item_image}`
                                                : `${Images.DEFAULT_PROFILE}`,
                                            }}
                                          />
                                        </NeuomorphAvatar>
                                        <Text
                                          style={[
                                            styles.cardtext,
                                            {color: Colors().pureBlack},
                                          ]}
                                          numberOfLines={2}>
                                          {itm?.title?.label}
                                        </Text>
                                      </View>
                                    </DataTable.Cell>

                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.hsncode}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.requested_rate}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.requested_qty}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.rate}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.qty}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 80},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        {itm?.transfer_quantity}
                                      </Text>
                                    </DataTable.Cell>
                                    <DataTable.Cell
                                      textStyle={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}
                                      style={[
                                        styles.tableHeadingView,
                                        {width: 120},
                                      ]}>
                                      <Text
                                        numberOfLines={2}
                                        style={[
                                          styles.cardtext,
                                          {color: Colors().pureBlack},
                                        ]}>
                                        ₹ {itm?.request_transfer_fund}
                                      </Text>
                                    </DataTable.Cell>
                                  </DataTable.Row>
                                </>
                              ),
                            )}

                            <DataTable.Row
                              style={{
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().purple, alignSelf: 'center'},
                                ]}>
                                TOTAL Approved Amount ={' '}
                                {getTotalNewApprovetAmount(
                                  data?.transfer_data?.new_transfer_fund,
                                )}
                              </Text>
                            </DataTable.Row>
                            <DataTable.Row
                              style={{
                                alignItems: 'flex-end',
                                justifyContent: 'center',
                              }}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  {color: Colors().purple, alignSelf: 'center'},
                                ]}>
                                Final Transfer Amount =
                                {getTotalNewApprovetAmount(
                                  data?.transfer_data?.new_transfer_fund,
                                ) +
                                  getTotalApprovetAmount(
                                    data?.transfer_data?.transfer_fund,
                                  )}
                              </Text>
                            </DataTable.Row>
                          </ScrollView>
                        </DataTable>
                      </ScrollView>
                    </View>
                  </NeumorphCard>
                )}

              {imageModalVisible && (
                <ImageViewer
                  visible={imageModalVisible}
                  imageUri={imageUri}
                  cancelBtnPress={() =>
                    setImageModalVisible(!imageModalVisible)
                  }
                  // downloadBtnPress={item => downloadImageRemote(item)}
                />
              )}
            </View>
          </ScrollView>
        </>
      ) : listData?.isError ? (
        <InternalServer />
      ) : !listData?.data?.status &&
        listData?.data?.message == 'Data not found' ? (
        <>
          <DataNotFound />
          {/* View for floating button */}
        </>
      ) : (
        <InternalServer />
      )}
    </SafeAreaView>
  );
};

export default FundRequestDetailScreen;

const styles = StyleSheet.create({
  mainView: {
    padding: 15,
    rowGap: 15,
  },
  cardContainer: {
    margin: WINDOW_WIDTH * 0.03,
    flex: 1,
    rowGap: WINDOW_HEIGHT * 0.01,
  },
  headingTxt: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    alignSelf: 'center',
    marginBottom: 2,
    flexShrink: 1,
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
    marginLeft: 2,
  },

  tableHeadingView: {
    // width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
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
});
