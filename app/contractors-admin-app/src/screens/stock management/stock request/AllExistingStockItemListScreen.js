/*    ----------------Created Date :: 3- April -2024   ----------------- */

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
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
import {getStockExistingItemsById} from '../../../redux/slices/stock-management/stock-request/getStockItemSlice';
import ScreensLabel from '../../../constants/ScreensLabel';
const AllExistingStockItemListScreen = ({navigation, route}) => {
  const edit_id = route?.params?.userId;
  // const edit_id = 125;

  /* declare props constant variale*/
  const label = ScreensLabel();
  /*declare hooks variable here */

  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const [refreshing, setRefreshing] = useState(false);

  const listData = useSelector(state => state.getStockItem);
  const data = listData?.data?.data;

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getStockExistingItemsById(edit_id));
      setRefreshing(false);
    }, 2000);
  }, []);

  useEffect(() => {
    dispatch(getStockExistingItemsById(edit_id));
  }, [edit_id]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label.EXISTING_ITEMS} />

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
              {/* Requested items card  */}
              <NeumorphCard>
                <View style={styles.cardContainer}>
                  <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                    {' '}
                    All Existing items
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
                          style={[styles.tableHeadingView, {width: 80}]}>
                          Item id
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
                          Price
                        </DataTable.Title>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          numberOfLines={2}
                          style={[styles.tableHeadingView, {width: 80}]}>
                          Request Qty.
                        </DataTable.Title>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          numberOfLines={2}
                          style={[styles.tableHeadingView, {width: 120}]}>
                          Total Amount
                        </DataTable.Title>

                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          numberOfLines={2}
                          style={[styles.tableHeadingView, {width: 120}]}>
                          Request date
                        </DataTable.Title>
                      </DataTable.Header>
                      <ScrollView>
                        {data?.map((itm, index) => (
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
                                    width: 80,
                                  },
                                ]}>
                                <View style={styles.tableHeadingView}>
                                  <Text
                                    numberOfLines={2}
                                    style={[
                                      styles.cardtext,
                                      {color: Colors().pureBlack},
                                    ]}>
                                    {itm?.id}
                                  </Text>
                                </View>
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
                                  {itm?.item_name}
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
                                  ₹ {itm?.item_price}
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
                                  {itm?.quantity}
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
                                  ₹{' '}
                                  {parseFloat(itm?.item_price * itm?.quantity)}
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
                                  {' '}
                                  {itm?.request_date}
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

export default AllExistingStockItemListScreen;

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
    justifyContent: 'center',
    alignItems: 'center',
  },
});
