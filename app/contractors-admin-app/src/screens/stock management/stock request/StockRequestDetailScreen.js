/*    ----------------Created Date :: 2- April -2024   ----------------- */

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  RefreshControl,
  TouchableOpacity,
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

import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {Avatar, Icon} from '@rneui/themed';
import Images from '../../../constants/Images';
import {apiBaseUrl} from '../../../../config';
import ImageViewer from '../../../component/ImageViewer';
import {getStockRequestDetailById} from '../../../redux/slices/stock-management/stock-request/getStockRequestDetailSlice';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import ScreensLabel from '../../../constants/ScreensLabel';

const StockRequestDetailScreen = ({navigation, route}) => {
  const edit_id = route?.params?.edit_id;

  /* declare props constant variale*/

  /*declare hooks variable here */

  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const label = ScreensLabel();
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [visible, setVisible] = useState(false);
  const [imageUri, setImageUri] = useState('');

  const listData = useSelector(state => state.getStockRequestDetail);

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
  const getStatusText = status => {
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
  };

  /*fucntion for getting text of tax type*/
  const getGstType = action => {
    switch (action) {
      case '1':
        return 'item wise';
        break;
      case '2':
        return 'overall';
        break;

      default:
        break;
    }
  };

  function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  const filterArray = ['Approve Data', 'Transfer Data', 'Existing Items'];

  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');
    setVisible(false);
    if (val !== undefined) {
      if (valueToSend == 'ExistingItems') {
        navigation.navigate('AllExistingStockItemListScreen', {
          userId: data?.requested_for,
        });
      }
      if (valueToSend == 'ApproveData') {
        navigation.navigate('StockRequestApprovedDataScreen', {
          edit_id: edit_id,
        });
      }
      if (valueToSend == 'TransferData') {
        navigation.navigate('StockRequestTransferDataScreen', {
          edit_id: edit_id,
        });
      }
    }
  };

  const showMenu = () => setVisible(true);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getStockRequestDetailById(edit_id));
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    dispatch(getStockRequestDetailById(edit_id));
  }, [edit_id]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={`${label.STOCK_REQUEST} ${label.DETAIL}`}
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'dots-three-vertical'}
        rightIcontype={IconType.Entypo}
        rightIconPress={showMenu}
      />

      {visible && (
        <Menu
          style={styles.menuView}
          visible={visible}
          onRequestClose={hideMenu}>
          {filterArray.map(itm => (
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <MenuItem
                textStyle={[
                  styles.cardtext,
                  {fontSize: 15, color: Colors().pureBlack},
                ]}
                onPress={() => {
                  hideMenu(itm);
                  // setSearchText(itm);
                }}>
                {itm}
              </MenuItem>
              <Icon
                name="doubleright"
                type={IconType.AntDesign}
                style={[styles.actionIcon]}
              />
            </View>
          ))}

          {/* <MenuItem onPress={hideMenu}>Menu item 2</MenuItem>
                  <MenuItem disabled>Disabled item</MenuItem>
                  <MenuDivider />
                  <MenuItem onPress={hideMenu}>Menu item 4</MenuItem> */}
        </Menu>
      )}

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
              {/*Stock Request card */}
              <NeumorphCard>
                <View style={styles.cardContainer}>
                  <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                    Stock request
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
                              `${apiBaseUrl}${data?.requested_for_image}`,
                            );
                          }}
                          source={{
                            uri: data?.requested_for_image
                              ? `${apiBaseUrl}${data?.requested_for_image}`
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
                      {data?.requested_for_name && (
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
                            {data?.requested_for_name} -
                            {data?.requested_for_employee_id}
                          </Text>
                        </View>
                      )}
                      {data?.request_tax_type == '2' && data?.gst_id && (
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}>
                            gst type :{' '}
                          </Text>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              {color: Colors().pureBlack},
                            ]}>
                            {data?.gst_type}
                          </Text>
                        </View>
                      )}
                      {data?.request_tax_type == '2' && data?.gst_percent && (
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}>
                            gst % :{' '}
                          </Text>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              {color: Colors().pureBlack},
                            ]}>
                            {data?.gst_percent}
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

                      {data?.request_stock_images && (
                        <View style={{flexDirection: 'row'}}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}>
                            Bills :{' '}
                          </Text>
                          <View style={[styles.userNameView, {columnGap: 10}]}>
                            {data?.request_stock_images.map((itm, index) => (
                              <TouchableOpacity
                                onPress={() => {
                                  setImageModalVisible(true);
                                  setImageUri(
                                    `${apiBaseUrl}${itm?.item_image}`,
                                  );
                                }}>
                                <Image
                                  source={{
                                    uri: `${apiBaseUrl}${itm?.item_image}`,
                                  }}
                                  style={[styles.Image, {marginTop: 10}]}
                                />
                              </TouchableOpacity>
                            ))}
                          </View>
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
                      <View
                        style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            {color: Colors().pureBlack},
                          ]}>
                          tax type :{' '}
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
                              {getGstType(data?.request_tax_type)}
                            </Text>
                          </View>
                        </NeumorphCard>
                      </View>
                    </View>
                  </View>
                </View>
              </NeumorphCard>

              {/* Requested items card  */}
              <NeumorphCard>
                <View style={styles.cardContainer}>
                  <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                    {' '}
                    Requested items
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
                        {data?.request_tax_type == '1' && (
                          <DataTable.Title
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple},
                            ]}
                            style={[styles.tableHeadingView, {width: 120}]}>
                            Gst type
                          </DataTable.Title>
                        )}
                        {data?.request_tax_type == '1' && (
                          <DataTable.Title
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().purple},
                            ]}
                            style={[styles.tableHeadingView, {width: 80}]}>
                            Gst %
                          </DataTable.Title>
                        )}

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
                          Total price
                        </DataTable.Title>
                      </DataTable.Header>
                      <ScrollView>
                        {data?.request_stock?.request_stock.map(
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
                                {data?.request_tax_type == '1' && (
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
                                      {itm?.gst_id?.label}
                                    </Text>
                                  </DataTable.Cell>
                                )}
                                {data?.request_tax_type == '1' && (
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
                                      {itm?.gst_percent}
                                    </Text>
                                  </DataTable.Cell>
                                )}
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
                                    ₹ {itm?.prev_item_price}
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
                                    {itm?.prev_user_stock}
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
                                    ₹ {itm?.current_item_price}
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
                                    ₹ {itm?.total_price}
                                  </Text>
                                </DataTable.Cell>
                              </DataTable.Row>
                            </>
                          ),
                        )}

                        <DataTable.Row
                          style={{
                            alignSelf: 'flex-end',
                          }}>
                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}
                            style={[styles.tableHeadingView, {width: 80}]}>
                            <Text
                              style={[
                                styles.cardHeadingTxt,
                                {
                                  color: Colors().purple,
                                  alignSelf: 'center',
                                  fontSize: 15,
                                },
                              ]}>
                              TOTAL =
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
                                {fontSize: 15, color: Colors().pureBlack},
                              ]}>
                              {data?.total_request_quantity}
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
                                {fontSize: 15, color: Colors().pureBlack},
                              ]}>
                              ₹ {data?.total_sum_of_request}
                            </Text>
                          </DataTable.Cell>
                        </DataTable.Row>
                      </ScrollView>
                    </DataTable>
                  </ScrollView>
                </View>
              </NeumorphCard>

              {/*New Request items card  */}
              {!isObjectEmpty(data?.request_stock?.new_request_stock) && (
                <NeumorphCard>
                  <View style={styles.cardContainer}>
                    <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                      New REQUEST items
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
                            Total price
                          </DataTable.Title>
                        </DataTable.Header>
                        <ScrollView>
                          {data?.request_stock?.new_request_stock.map(
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
                                              `${apiBaseUrl}${itm?.item_image}`,
                                            );
                                          }}
                                          source={{
                                            uri: itm?.item_image
                                              ? `${apiBaseUrl}${itm?.item_image}`
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
                              alignSelf: 'flex-end',
                            }}>
                            <DataTable.Cell
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  {
                                    color: Colors().purple,
                                    alignSelf: 'center',
                                    fontSize: 15,
                                  },
                                ]}>
                                TOTAL =
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
                                  {fontSize: 15, color: Colors().pureBlack},
                                ]}>
                                {data?.total_new_request_quantity}
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
                                  {fontSize: 15, color: Colors().pureBlack},
                                ]}>
                                ₹ {data?.total_sum_of_new_request_stock}
                              </Text>
                            </DataTable.Cell>
                          </DataTable.Row>
                          <DataTable.Row
                            style={{
                              alignSelf: 'flex-end',
                            }}>
                            <DataTable.Cell
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  {
                                    color: Colors().purple,
                                    alignSelf: 'center',
                                    fontSize: 18,
                                  },
                                ]}>
                                Final =
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
                                  {fontSize: 18, color: Colors().pureBlack},
                                ]}>
                                {data?.total_sum_of_quantity}
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
                                  {fontSize: 18, color: Colors().pureBlack},
                                ]}>
                                ₹ {data?.total_sum_of_request_stock}
                              </Text>
                            </DataTable.Cell>
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

export default StockRequestDetailScreen;

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
  menuView: {
    backgroundColor: Colors().menu,
    marginTop: WINDOW_HEIGHT * 0.06,
    marginLeft: WINDOW_WIDTH * 0.45,
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
  Image: {
    height: WINDOW_HEIGHT * 0.05,
    width: WINDOW_WIDTH * 0.18,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  userNameView: {flex: 1, flexDirection: 'row', flexWrap: 'wrap'},

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
