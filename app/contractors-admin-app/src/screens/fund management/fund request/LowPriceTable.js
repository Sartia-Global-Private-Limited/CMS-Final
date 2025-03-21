import { StyleSheet, Text, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  getLast3PreviousPrice,
  getLowPriceByHsncode,
} from '../../../redux/slices/fund-management/fund-request/getFundRequestDetailSlice';
import { useDispatch } from 'react-redux';
import Colors from '../../../constants/Colors';
import SeparatorComponent from '../../../component/SeparatorComponent';
import { DataTable } from 'react-native-paper';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import NeumorphCard from '../../../component/NeumorphCard';
import moment from 'moment';

const LowPriceTable = ({ hsncode, userId, itemId, index, visible }) => {
  const [lowPriceData, setLowPriceData] = useState([]);
  const [prviousPriceData, setPreviousPriceData] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    fetchOldPrice();
    fetchPreviousPrice();
  }, []);

  const fetchOldPrice = async () => {
    const res = await dispatch(getLowPriceByHsncode(hsncode)).unwrap();

    if (res?.status) {
      setLowPriceData(res.data);
    } else {
      setLowPriceData([]);
    }
  };
  const fetchPreviousPrice = async () => {
    const res = await dispatch(
      getLast3PreviousPrice({ itemId: itemId, userId: userId }),
    ).unwrap();

    if (res?.status) {
      setPreviousPriceData(res.data);
    } else {
      setPreviousPriceData([]);
    }
  };

  return (
    <View style={{ marginVertical: 10 }}>
      {visible[index] && (
        <View style={{ rowGap: 10 }}>
          {/* card for low price table */}
          <NeumorphCard>
            <View style={styles.cardContainer}>
              <Text style={[styles.headingTxt, { color: Colors().purple }]}>
                Top 4 Low price
              </Text>
              <SeparatorComponent
                separatorColor={Colors().gray2}
                separatorHeight={0.5}
              />
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <DataTable>
                  <DataTable.Header style={{ columnGap: 10 }}>
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}
                      style={[styles.tableHeadingView, { width: 50 }]}>
                      S.NO
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}
                      style={[styles.tableHeadingView, { width: 120 }]}>
                      supplier
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}
                      style={[styles.tableHeadingView, { width: 200 }]}>
                      Location
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}
                      style={[styles.tableHeadingView, { width: 120 }]}>
                      State
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}
                      style={[styles.tableHeadingView, { width: 120 }]}>
                      Hsncode
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}
                      style={[styles.tableHeadingView, { width: 120 }]}>
                      RudCode
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}
                      style={[styles.tableHeadingView, { width: 120 }]}>
                      rate
                    </DataTable.Title>
                  </DataTable.Header>
                  <ScrollView>
                    {lowPriceData.map((itm, index) => (
                      <>
                        <DataTable.Row key={index} style={{}}>
                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
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
                                  { color: Colors().pureBlack },
                                ]}>
                                {index + 1}
                              </Text>
                            </View>
                          </DataTable.Cell>

                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}
                            style={[styles.tableHeadingView, { width: 120 }]}>
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.cardtext,
                                { color: Colors().pureBlack },
                              ]}>
                              {itm?.supplier_name}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}
                            style={[styles.tableHeadingView, { width: 200 }]}>
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.cardtext,
                                { color: Colors().pureBlack },
                              ]}>
                              {itm?.shop_office_number},{itm?.street_name},
                              {itm?.city}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}
                            style={[styles.tableHeadingView, { width: 120 }]}>
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.cardtext,
                                { color: Colors().pureBlack },
                              ]}>
                              {itm?.state}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}
                            style={[styles.tableHeadingView, { width: 120 }]}>
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.cardtext,
                                { color: Colors().pureBlack },
                              ]}>
                              {itm?.hsncode}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}
                            style={[styles.tableHeadingView, { width: 120 }]}>
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.cardtext,
                                { color: Colors().pureBlack },
                              ]}>
                              {itm?.rucode}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}
                            style={[styles.tableHeadingView, { width: 120 }]}>
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.cardtext,
                                { color: Colors().pureBlack },
                              ]}>
                              {itm?.item_rate}
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

          {/* card for Previous price table */}
          <NeumorphCard>
            <View style={styles.cardContainer}>
              <Text style={[styles.headingTxt, { color: Colors().purple }]}>
                {' '}
                3 Previous Price
              </Text>
              <SeparatorComponent
                separatorColor={Colors().gray2}
                separatorHeight={0.5}
              />
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}>
                <DataTable>
                  <DataTable.Header style={{ columnGap: 10 }}>
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}
                      style={[styles.tableHeadingView, { width: 50 }]}>
                      S.NO
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}
                      style={[styles.tableHeadingView, { width: 120 }]}>
                      Name
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}
                      style={[styles.tableHeadingView, { width: 80 }]}>
                      Price
                    </DataTable.Title>
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        { color: Colors().purple },
                      ]}
                      style={[styles.tableHeadingView, { width: 120 }]}>
                      date
                    </DataTable.Title>
                  </DataTable.Header>
                  <ScrollView>
                    {prviousPriceData.map((itm, index) => (
                      <>
                        <DataTable.Row key={index} style={{}}>
                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
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
                                  { color: Colors().pureBlack },
                                ]}>
                                {index + 1}
                              </Text>
                            </View>
                          </DataTable.Cell>

                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}
                            style={[styles.tableHeadingView, { width: 120 }]}>
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.cardtext,
                                { color: Colors().pureBlack },
                              ]}>
                              {itm?.item_name}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}
                            style={[styles.tableHeadingView, { width: 80 }]}>
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.cardtext,
                                { color: Colors().pureBlack },
                              ]}>
                              {itm?.item_price}
                            </Text>
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}
                            style={[styles.tableHeadingView, { width: 120 }]}>
                            <Text
                              numberOfLines={2}
                              style={[
                                styles.cardtext,
                                { color: Colors().pureBlack },
                              ]}>
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
      )}
    </View>
  );
};

export default LowPriceTable;

const styles = StyleSheet.create({
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
});
