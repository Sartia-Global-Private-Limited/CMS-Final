/*    ----------------Created Date :: 16- April -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  ScrollView,
  Image,
  RefreshControl,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {Avatar} from '@rneui/base';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import {apiBaseUrl} from '../../../../config';
import NeumorphCard from '../../../component/NeumorphCard';
import CustomeHeader from '../../../component/CustomeHeader';
import ImageViewer from '../../../component/ImageViewer';
import Images from '../../../constants/Images';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {Icon} from '@rneui/themed';
import {DataTable} from 'react-native-paper';
import {getExpenseRequestDetailById} from '../../../redux/slices/expense-management/expense-request/getExpenseRequestDetailSlice';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {Menu, MenuItem} from 'react-native-material-menu';
import ScreensLabel from '../../../constants/ScreensLabel';

const ExpenseRequestListingScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.edit_id;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const label = ScreensLabel();
  const ListData = useSelector(state => state.getExpenseRequestDetail);

  /*declare useState variable here */
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  const [indexPressed, setIndexPressed] = useState('');
  const [visible, setVisible] = useState(false);
  const [visible2, setVisible2] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(
    new Date().getMonth() + 1,
  );
  const [selectedMonthText, setSelectedMonthText] = useState(
    new Date().toLocaleString('en-us', {month: 'long'}),
  );
  const [mainFilter, setMainFilter] = useState('current month');

  useEffect(() => {
    dispatch(
      getExpenseRequestDetailById({
        id: edit_id,
        search: selectedMenuItem,
      }),
    );
  }, [edit_id, selectedMenuItem, refreshing]);

  /*pull down to refresh funciton*/
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  /*const for main filter*/
  const mainFilterArray = ['current month', 'previous month'];
  /*constant of month*/
  const months = [
    {
      label: 'January',
      value: '1',
    },
    {
      label: 'February',
      value: '2',
    },
    {
      label: 'March',
      value: '3',
    },
    {
      label: 'April',
      value: '4',
    },
    {
      label: 'May',
      value: '5',
    },
    {
      label: 'June',
      value: '6',
    },
    {
      label: 'July',
      value: '7',
    },
    {
      label: 'August',
      value: '8',
    },
    {
      label: 'September',
      value: '9',
    },
    {
      label: 'October',
      value: '10',
    },
    {
      label: 'November',
      value: '11',
    },
    {
      label: 'December',
      value: '12',
    },
  ];

  /* function for hiding the month list*/
  const hideMenu = val => {
    setVisible(false);
    if (val !== undefined) {
      setSelectedMenuItem(val.value);
      setSelectedMonthText(`${val.label}`);
    }
  };
  /* function for hiding the main filter*/
  const hideMenu2 = val => {
    setVisible2(false);
    if (val !== undefined) {
      setMainFilter(val);
    }
  };

  /*for hiding the menu of months*/
  const showMenu = () => setVisible(true);
  /*for hiding the main filter*/
  const showMenu2 = () => setVisible2(true);

  /* if we got no data for flatlist*/
  const renderEmptyComponent = () => (
    // Render your empty component here<>
    <View
      style={{
        height: WINDOW_HEIGHT * 0.6,
      }}>
      <DataNotFound />
    </View>
  );

  /* flatlist render ui */
  const renderItem = ({item, index}) => {
    return (
      <View style={styles.cardContainer}>
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
                      setImageUri(`${apiBaseUrl}${item?.data[0].item_images}`);
                    }}
                    source={{
                      uri: item?.data[0].item_images
                        ? `${apiBaseUrl}${item?.data[0].item_images}`
                        : `${
                            Image.resolveAssetSource(Images.DEFAULT_PROFILE).uri
                          }`,
                    }}
                  />
                </NeuomorphAvatar>
              </View>

              <View style={{flex: 1, justifyContent: 'center'}}>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    name :{' '}
                  </Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().pureBlack}]}>
                    {item?.data[0].item_name}
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    Final amount:{' '}
                  </Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().aprroved}]}>
                    ₹ {item?.totalSum}
                  </Text>
                </View>

                <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    Remaining amount :{' '}
                  </Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().aprroved}]}>
                    ₹ {item?.remainingAmount}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.actionView}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[styles.cardHeadingTxt, {color: Colors().pureBlack}]}>
                Remaining qty :{' '}
              </Text>
              <NeumorphCard>
                <View style={{padding: 5}}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().pending}]}>
                    {item?.remainingQty}
                  </Text>
                </View>
              </NeumorphCard>
            </View>
            <View style={styles.actionView2}>
              <NeumorphCard
                lightShadowColor={Colors().darkShadow2}
                darkShadowColor={Colors().lightShadow}>
                <Icon
                  name={index === indexPressed ? 'caretup' : 'caretdown'}
                  type={IconType.AntDesign}
                  color={
                    index === indexPressed ? Colors().red : Colors().purple
                  }
                  style={styles.actionIcon}
                  onPress={() => {
                    {
                      index === indexPressed
                        ? setIndexPressed('')
                        : setIndexPressed(index);
                    }
                  }}
                />
              </NeumorphCard>
            </View>
          </View>
        </NeumorphCard>
        {indexPressed === index && (
          <View>
            <NeumorphCard>
              <View style={styles.cardContainer}>
                <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                  items price list
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
                        style={[styles.tableHeadingView, {width: 100}]}>
                        item Price
                      </DataTable.Title>

                      <DataTable.Title
                        textStyle={[
                          styles.cardHeadingTxt,
                          {color: Colors().purple},
                        ]}
                        numberOfLines={2}
                        style={[styles.tableHeadingView, {width: 50}]}>
                        Qty
                      </DataTable.Title>
                      <DataTable.Title
                        textStyle={[
                          styles.cardHeadingTxt,
                          {color: Colors().purple},
                        ]}
                        numberOfLines={2}
                        style={[styles.tableHeadingView, {width: 100}]}>
                        Total
                      </DataTable.Title>
                      <DataTable.Title
                        textStyle={[
                          styles.cardHeadingTxt,
                          {color: Colors().purple},
                        ]}
                        numberOfLines={2}
                        style={[styles.tableHeadingView, {width: 100}]}>
                        Approve date
                      </DataTable.Title>
                    </DataTable.Header>
                    <ScrollView>
                      {item?.data?.map((itm, index) => (
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
                              style={[styles.tableHeadingView, {width: 100}]}>
                              <Text
                                numberOfLines={2}
                                style={[
                                  styles.cardtext,
                                  {color: Colors().pureBlack},
                                ]}>
                                ₹ {itm?.item_price}
                              </Text>
                            </DataTable.Cell>
                            <DataTable.Cell
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}
                              style={[styles.tableHeadingView, {width: 50}]}>
                              <Text
                                numberOfLines={2}
                                style={[
                                  styles.cardtext,
                                  {color: Colors().pureBlack},
                                ]}>
                                {itm?.request_qty}
                              </Text>
                            </DataTable.Cell>
                            <DataTable.Cell
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}
                              style={[styles.tableHeadingView, {width: 100}]}>
                              <Text
                                numberOfLines={2}
                                style={[
                                  styles.cardtext,
                                  {color: Colors().pureBlack},
                                ]}>
                                ₹ {itm?.total_approve_amount}
                              </Text>
                            </DataTable.Cell>

                            <DataTable.Cell
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}
                              style={[styles.tableHeadingView, {width: 100}]}>
                              <Text
                                numberOfLines={2}
                                style={[
                                  styles.cardtext,
                                  {color: Colors().pureBlack},
                                ]}>
                                {itm?.requested_date}
                              </Text>
                            </DataTable.Cell>
                          </DataTable.Row>
                        </>
                      ))}
                    </ScrollView>
                  </DataTable>
                </ScrollView>
              </View>
            </NeumorphCard>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={label.EXPENSE_DETAIL}
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'dots-three-vertical'}
        rightIcontype={IconType.Entypo}
        rightIconPress={showMenu2}
      />
      <View style={{alignSelf: 'flex-end'}}>
        <Menu visible={visible2} onRequestClose={hideMenu2}>
          {mainFilterArray.map(itm => (
            <MenuItem
              style={{backgroundColor: Colors().cardBackground}}
              disabled={mainFilter == itm}
              textStyle={
                mainFilter == itm // If the menu item is disabled
                  ? [styles.cardtext, {color: 'red'}] // Apply red color
                  : [styles.cardtext, {color: Colors().pureBlack}] // Otherwise, use the default text style
              }
              onPress={() => {
                hideMenu2(itm);
              }}>
              {itm}
            </MenuItem>
          ))}
        </Menu>
      </View>

      {ListData?.isLoading ? (
        <Loader />
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <>
          <ImageBackground
            source={Images.BANK_CARD}
            imageStyle={{borderRadius: WINDOW_WIDTH * 0.03}}
            style={styles.bankCard}>
            <Text style={[styles.title, {color: 'white', fontSize: 20}]}>
              {ListData?.data?.data?.users[0]?.name
                ? ListData?.data?.data?.users[0]?.name
                : 'Account Holder name'}
            </Text>
            <View
              style={[styles.twoItemView, {justifyContent: 'space-between'}]}>
              <Text style={[styles.title, {color: 'white', maxWidth: '50%'}]}>
                {selectedMonthText ? selectedMonthText : 'Month'}
              </Text>
              <Text style={[styles.title, {color: 'white', maxWidth: '50%'}]}>
                {ListData?.data?.data?.currentMonth.overallTotalSum
                  ? `₹ ${ListData?.data?.data?.currentMonth.overallTotalSum}`
                  : '-- -- --'}
              </Text>
            </View>

            <Text
              style={[
                styles.title,
                {color: 'white', fontSize: 22, alignSelf: 'center'},
              ]}>
              {ListData?.data?.data?.users[0]?.employee_id
                ? ListData?.data?.data?.users[0]?.employee_id
                : '-- -- --'}
            </Text>
          </ImageBackground>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: WINDOW_WIDTH * 0.03,
            }}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={[
                  styles.cardHeadingTxt,
                  {fontSize: 15, color: Colors().purple},
                ]}>
                {mainFilter === 'current month'
                  ? 'All item list'
                  : 'Previous month item list'}
              </Text>
            </View>

            <Menu
              visible={visible}
              anchor={
                <Icon
                  name="dots-three-vertical"
                  type={IconType.Entypo}
                  color={Colors().edit}
                  style={{}}
                  onPress={showMenu}
                />
              }
              onRequestClose={hideMenu}>
              {months.map(itm => (
                <MenuItem
                  disabled={selectedMenuItem == itm.value}
                  style={{backgroundColor: Colors().cardBackground}}
                  textStyle={
                    selectedMenuItem == itm.value // If the menu item is disabled
                      ? [styles.cardtext, {color: 'red'}] // Apply red color
                      : [styles.cardtext, {color: Colors().pureBlack}] // Otherwise, use the default text style
                  }
                  onPress={() => {
                    hideMenu(itm);
                  }}>
                  {itm.label}
                </MenuItem>
              ))}
            </Menu>
          </View>
          <FlatList
            data={
              mainFilter === 'current month'
                ? Object.values(ListData?.data?.data?.currentMonth?.items)
                : Object.values(ListData?.data?.data?.previousMonth?.items)
            }
            renderItem={renderItem}
            contentContainerStyle={{paddingBottom: 50}}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={renderEmptyComponent}
          />

          {/*view for modal of upate */}
          {imageModalVisible && (
            <ImageViewer
              visible={imageModalVisible}
              imageUri={imageUri}
              cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
              // downloadBtnPress={item => downloadImageRemote(item)}
            />
          )}
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

export default ExpenseRequestListingScreen;

const styles = StyleSheet.create({
  tableHeadingView: {
    justifyContent: 'center',
    alignItems: 'center',
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
  cardContainer: {
    width: WINDOW_WIDTH * 0.95,
    marginBottom: 15,
    height: 'auto',
    alignSelf: 'center',
  },
  bankCard: {
    margin: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 10,
  },
  twoItemView: {
    flexDirection: 'row',
    columnGap: 5,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,

    flexShrink: 1,
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
});
