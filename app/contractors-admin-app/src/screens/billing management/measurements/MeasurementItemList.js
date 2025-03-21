/*    ----------------Created Date :: 26- June -2024   ----------------- */
import {StyleSheet, Text, View, ScrollView, TextInput} from 'react-native';
import React, {useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import NeumorphCard from '../../../component/NeumorphCard';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {DataTable} from 'react-native-paper';
import IconType from '../../../constants/IconType';
import {Icon} from '@rneui/themed';

const MeasurementItemList = ({data, formik, index}) => {
  useEffect(() => {
    if (formik.values.items_data[index].childArray) {
      getTotalItemQty(index);
      getGrandTotal();
    }
  }, [formik.values.items_data]);

  /*function for hiding and show ui based on unit
   */
  const checkUnits = x => {
    switch (x) {
      case 'cubic meter':
      case 'cum':
      case 'CUM':
      case 'CUBIC METER':
        return ['length', 'breadth', 'depth'];

      case 'square meter':
      case 'SQAURE METER':
      case 'SQM':
      case 'sqm':
        return ['length', 'breadth'];
      case 'running meter':
        return ['length'];
      case 'meter':
        return ['length'];
      case 'each':
        return [];
      case 'lump sum':
        return ['length'];
      case 'set':
        return [];
      case 'lot':
        return [];
      case 'km':
        return [];
      case 'month':
        return [];
      case 'quarter':
        return [];
      case 'months':
        return [];
      case 'page':
        return [];
      case 'man day':
        return [];
      case 'litre':
        return [];
      case 'pair':
        return [];
      case 'inch':
        return [];
      case 'KILO LITRE':
        return ['length'];
      case 'VISIT':
        return [];
      case 'CAN':
        return [];
      case 'ACTUALS':
        return [];
      case 'HOUR':
        return [];
      case 'KILO GRAM':
        return [];
      case 'METRIC TON':
        return [];

      default:
        return [];
    }
  };
  /*function  for getting total of approve qty and amount of approved item*/
  const getTotal = (data, key) => {
    let total = 0;
    data.forEach(element => {
      total += parseFloat(element[key]) || 0;
    });

    return total;
  };

  const getGrandTotal = () => {
    const total = getTotal(formik.values.items_data, 'amount');
    formik.setFieldValue(`amount`, total);
  };
  /*function  for calcualting total quantity of item*/
  const getTotalItemQty = index => {
    if (formik.values.items_data[index]?.childArray) {
      const totalItemQty = getTotal(
        formik.values.items_data[index].childArray,
        'qty',
      );

      formik.setFieldValue(`items_data.${index}.total_qty`, totalItemQty);
      formik.setFieldValue(
        `items_data.${index}.amount`,
        totalItemQty * formik.values.items_data[index].rate,
      );
    }
  };

  /*this funciton will give multiplication of no,l,b,d, */
  const getMultiply = (fixVal1, fixVal2, fixVal3, changeValue, assignKey) => {
    // Create an array of the values
    const values = [fixVal1, fixVal2, fixVal3, changeValue];

    // Filter out any values that are zero, undefined, or an empty string
    const filteredValues = values.filter(
      value => value !== 0 && value !== undefined && value !== '',
    );

    // If all values are zero or no values to multiply, return 0
    if (filteredValues.length === 0) {
      return formik.setFieldValue(assignKey, 0);
    }

    // Calculate the product of the remaining values
    const total = filteredValues.reduce((acc, value) => acc * value, 1);
    formik.setFieldValue(assignKey, parseFloat(isNaN(total) ? 0 : total));
  };

  return (
    <>
      {/* Item list card  */}
      <View style={{marginHorizontal: WINDOW_WIDTH * 0.03}}>
        <NeumorphCard>
          <View style={styles.cardContainer}>
            <Text style={[styles.headingTxt, {color: Colors().purple}]}>
              Item list
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
                    Description
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple},
                    ]}
                    style={[styles.tableHeadingView, {width: 80}]}>
                    NO.
                  </DataTable.Title>
                  {checkUnits(data?.unit).includes('length') && (
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        {color: Colors().purple},
                      ]}
                      numberOfLines={2}
                      style={[styles.tableHeadingView, {width: 80}]}>
                      LENGTH
                    </DataTable.Title>
                  )}
                  {checkUnits(data?.unit).includes('breadth') && (
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        {color: Colors().purple},
                      ]}
                      numberOfLines={2}
                      style={[styles.tableHeadingView, {width: 80}]}>
                      BREADTH
                    </DataTable.Title>
                  )}

                  {checkUnits(data?.unit).includes('depth') && (
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        {color: Colors().purple},
                      ]}
                      numberOfLines={2}
                      style={[styles.tableHeadingView, {width: 80}]}>
                      DEPTH
                    </DataTable.Title>
                  )}

                  <DataTable.Title
                    textStyle={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple},
                    ]}
                    numberOfLines={2}
                    style={[styles.tableHeadingView, {width: 80}]}>
                    quantity
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple},
                    ]}
                    numberOfLines={2}
                    style={[styles.tableHeadingView, {width: 50}]}>
                    action
                  </DataTable.Title>
                </DataTable.Header>
                <ScrollView>
                  {data?.childArray &&
                    data?.childArray.map((itm, idx) => (
                      <View>
                        <DataTable.Row key={idx} style={{}}>
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
                                {idx + 1}
                              </Text>
                            </View>
                          </DataTable.Cell>
                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}
                            style={[styles.tableHeadingView, {width: 120}]}>
                            <TextInput
                              placeholder="TYPE..."
                              placeholderTextColor={Colors().gray2}
                              style={[styles.inputText, styles.inputext2]}
                              value={itm?.description}
                              onChangeText={formik.handleChange(
                                `items_data.${index}.childArray.${idx}.description`,
                              )}
                            />
                          </DataTable.Cell>

                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}
                            style={[styles.tableHeadingView, {width: 80}]}>
                            <TextInput
                              textAlign="center"
                              placeholder="TYPE..."
                              keyboardType="numeric"
                              placeholderTextColor={Colors().gray2}
                              style={[styles.inputText, styles.inputext2]}
                              value={itm?.no}
                              onChangeText={txt => {
                                formik.setFieldValue(
                                  `items_data.${index}.childArray.${idx}.no`,
                                  txt,
                                );
                                getMultiply(
                                  itm?.length,
                                  itm?.breadth,
                                  itm?.depth,
                                  txt,
                                  `items_data.${index}.childArray.${idx}.qty`,
                                );
                                getTotalItemQty(
                                  `items_data.${index}.childArray.${idx}.qty`,
                                );
                              }}
                            />
                          </DataTable.Cell>
                          {checkUnits(data?.unit).includes('length') && (
                            <DataTable.Cell
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              <TextInput
                                textAlign="center"
                                placeholder="TYPE..."
                                keyboardType="numeric"
                                placeholderTextColor={Colors().gray2}
                                style={[styles.inputText, styles.inputext2]}
                                value={itm?.length}
                                onChangeText={txt => {
                                  formik.setFieldValue(
                                    `items_data.${index}.childArray.${idx}.length`,
                                    txt,
                                  );
                                  getMultiply(
                                    itm?.no,
                                    itm?.breadth,
                                    itm?.depth,
                                    txt,
                                    `items_data.${index}.childArray.${idx}.qty`,
                                  );
                                }}
                              />
                            </DataTable.Cell>
                          )}

                          {checkUnits(data?.unit).includes('breadth') && (
                            <DataTable.Cell
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              <TextInput
                                placeholder="TYPE..."
                                textAlign="center"
                                keyboardType="numeric"
                                placeholderTextColor={Colors().gray2}
                                style={[styles.inputText, styles.inputext2]}
                                value={itm?.breadth}
                                onChangeText={txt => {
                                  formik.setFieldValue(
                                    `items_data.${index}.childArray.${idx}.breadth`,
                                    txt,
                                  );
                                  getMultiply(
                                    itm?.no,
                                    itm?.length,
                                    itm?.depth,
                                    txt,
                                    `items_data.${index}.childArray.${idx}.qty`,
                                  );
                                }}
                              />
                            </DataTable.Cell>
                          )}

                          {checkUnits(data?.unit).includes('depth') && (
                            <DataTable.Cell
                              textStyle={[
                                styles.cardHeadingTxt,
                                {color: Colors().pureBlack},
                              ]}
                              style={[styles.tableHeadingView, {width: 80}]}>
                              <TextInput
                                textAlign="center"
                                placeholder="TYPE..."
                                keyboardType="numeric"
                                placeholderTextColor={Colors().gray2}
                                style={[styles.inputText, styles.inputext2]}
                                value={itm?.depth}
                                onChangeText={txt => {
                                  formik.setFieldValue(
                                    `items_data.${index}.childArray.${idx}.depth`,
                                    txt,
                                  );
                                  getMultiply(
                                    itm?.no,
                                    itm?.length,
                                    itm?.breadth,
                                    txt,
                                    `items_data.${index}.childArray.${idx}.qty`,
                                  );
                                }}
                              />
                            </DataTable.Cell>
                          )}

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
                              {itm?.qty || 0}
                            </Text>
                          </DataTable.Cell>

                          <DataTable.Cell
                            style={[styles.tableHeadingView, {width: 50}]}>
                            <NeumorphCard
                              lightShadowColor={Colors().darkShadow2}
                              darkShadowColor={Colors().lightShadow}>
                              <Icon
                                name={
                                  idx ===
                                  formik.values.items_data[index].childArray
                                    .length -
                                    1
                                    ? 'plus'
                                    : 'minus'
                                }
                                type={IconType.AntDesign}
                                size={20}
                                color={
                                  idx ===
                                  formik.values.items_data[index].childArray
                                    .length -
                                    1
                                    ? Colors().aprroved
                                    : Colors().red
                                }
                                style={styles.actionIcon}
                                onPress={() => {
                                  if (
                                    idx !==
                                    formik.values.items_data[index].childArray
                                      .length -
                                      1
                                  ) {
                                    // Remove item from childArray
                                    const newChildArray =
                                      formik.values.items_data[
                                        index
                                      ].childArray.filter((_, i) => i !== idx);
                                    formik.setFieldValue(
                                      `items_data.${index}.childArray`,
                                      newChildArray,
                                    );
                                  }
                                  if (
                                    idx ===
                                    formik.values.items_data[index].childArray
                                      .length -
                                      1
                                  ) {
                                    // Add new item to childArray
                                    const newChildArray = [
                                      ...formik.values.items_data[index]
                                        .childArray,
                                      {
                                        description: '',
                                        no: '',
                                        length: '',
                                        breadth: '',
                                        depth: '',
                                        qty: '',
                                      },
                                    ];
                                    formik.setFieldValue(
                                      `items_data.${index}.childArray`,
                                      newChildArray,
                                    );
                                  }
                                }}
                              />
                            </NeumorphCard>
                          </DataTable.Cell>
                        </DataTable.Row>
                      </View>
                    ))}
                </ScrollView>
              </DataTable>
            </ScrollView>
          </View>
        </NeumorphCard>
      </View>
    </>
  );
};

export default MeasurementItemList;

const styles = StyleSheet.create({
  cardContainer: {
    margin: WINDOW_WIDTH * 0.03,
    rowGap: WINDOW_HEIGHT * 0.01,
  },
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
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
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
    marginLeft: 2,
  },
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },

  tableHeadingView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputext2: {
    height: 20,
    padding: 1,
    paddingLeft: 5,
    alignSelf: 'center',
    color: Colors().pureBlack,
    justifyContent: 'center',
    flexShrink: 1,
  },

  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    flexShrink: 1,
    fontFamily: Colors().fontFamilyBookMan,
  },
});
