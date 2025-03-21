/*    ----------------Created Date :: 16- March -2024   ----------------- */

import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect} from 'react';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import NeumorphCard from '../../../component/NeumorphCard';
import SeparatorComponent from '../../../component/SeparatorComponent';
import moment from 'moment';
import {getFundRequestExistingItemById} from '../../../redux/slices/fund-management/fund-request/getExistingItemListSlice';
import {DataTable} from 'react-native-paper';

const ExistingItemListScreen = ({navigation, route}) => {
  const userId = route?.params?.userId;

  /* declare props constant variale*/

  /*declare hooks variable here */

  const dispatch = useDispatch();

  const listData = useSelector(state => state.getExistingItemList);
  const data = listData?.data?.data;

  useEffect(() => {
    dispatch(getFundRequestExistingItemById(userId));
  }, [userId]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={`Existing items`} />

      {listData?.isLoading ? (
        <Loader />
      ) : !listData?.isLoading &&
        !listData?.isError &&
        listData?.data?.status ? (
        <>
          <ScrollView>
            <View style={styles.mainView}>
              {/* card for Previous price table */}
              <NeumorphCard>
                <View style={styles.cardContainer}>
                  <Text style={styles.headingTxt}> All existing item</Text>
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
                          Price
                        </DataTable.Title>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          style={[styles.tableHeadingView, {width: 80}]}>
                          Request qty.
                        </DataTable.Title>
                        <DataTable.Title
                          textStyle={[
                            styles.cardHeadingTxt,
                            {color: Colors().purple},
                          ]}
                          style={[styles.tableHeadingView, {width: 120}]}>
                          date
                        </DataTable.Title>
                      </DataTable.Header>
                      <ScrollView>
                        {data.map((itm, index) => (
                          <>
                            <DataTable.Row key={index} style={{}}>
                              <DataTable.Cell
                                textStyle={styles.cardHeadingTxt}
                                style={[
                                  styles.tableHeadingView,
                                  {
                                    width: 50,
                                  },
                                ]}>
                                <View style={styles.tableHeadingView}>
                                  <Text
                                    numberOfLines={2}
                                    style={styles.cardtext}>
                                    {index + 1}
                                  </Text>
                                </View>
                              </DataTable.Cell>

                              <DataTable.Cell
                                textStyle={styles.cardHeadingTxt}
                                style={[styles.tableHeadingView, {width: 120}]}>
                                <Text numberOfLines={2} style={styles.cardtext}>
                                  {itm?.item_name}
                                </Text>
                              </DataTable.Cell>
                              <DataTable.Cell
                                textStyle={styles.cardHeadingTxt}
                                style={[styles.tableHeadingView, {width: 80}]}>
                                <Text numberOfLines={2} style={styles.cardtext}>
                                  {itm?.item_price}
                                </Text>
                              </DataTable.Cell>
                              <DataTable.Cell
                                textStyle={styles.cardHeadingTxt}
                                style={[styles.tableHeadingView, {width: 80}]}>
                                <Text numberOfLines={2} style={styles.cardtext}>
                                  {itm?.request_qty}
                                </Text>
                              </DataTable.Cell>
                              <DataTable.Cell
                                textStyle={styles.cardHeadingTxt}
                                style={[styles.tableHeadingView, {width: 120}]}>
                                <Text numberOfLines={2} style={styles.cardtext}>
                                  {moment(itm?.date).format('DD-MM-YYYY')}
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

export default ExistingItemListScreen;

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
    color: Colors().purple,
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
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardtext: {
    color: Colors().pureBlack,
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
