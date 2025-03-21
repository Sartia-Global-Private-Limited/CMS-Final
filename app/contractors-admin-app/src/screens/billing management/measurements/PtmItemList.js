/*    ----------------Created Date :: 13- June -2024   ----------------- */
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';

import NeumorphCard from '../../../component/NeumorphCard';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {DataTable} from 'react-native-paper';

const PtmItemList = ({data, type}) => {
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
                    item name
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple},
                    ]}
                    style={[styles.tableHeadingView, {width: 80}]}>
                    NO.
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple},
                    ]}
                    numberOfLines={2}
                    style={[styles.tableHeadingView, {width: 80}]}>
                    LENGTH
                  </DataTable.Title>

                  <DataTable.Title
                    textStyle={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple},
                    ]}
                    numberOfLines={2}
                    style={[styles.tableHeadingView, {width: 80}]}>
                    BREADTH
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple},
                    ]}
                    numberOfLines={2}
                    style={[styles.tableHeadingView, {width: 80}]}>
                    DEPTH
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple},
                    ]}
                    numberOfLines={2}
                    style={[styles.tableHeadingView, {width: 80}]}>
                    quantity
                  </DataTable.Title>
                  {type == 'timeline' && (
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        {color: Colors().purple},
                      ]}
                      numberOfLines={2}
                      style={[styles.tableHeadingView, {width: 120}]}>
                      created at
                    </DataTable.Title>
                  )}
                </DataTable.Header>
                <ScrollView>
                  {data?.childArray.map((itm, idx) => (
                    <>
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
                          <Text
                            numberOfLines={2}
                            style={[
                              styles.cardtext,
                              {color: Colors().aprroved},
                            ]}>
                            {itm?.description || '----'}
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
                            {itm?.no || '----'}
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
                            {itm?.length || '----'}
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
                            {itm?.breadth || '----'}
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
                            {itm?.depth || '----'}
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
                            {itm?.qty || '----'}
                          </Text>
                        </DataTable.Cell>
                        {type == 'timeline' && (
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
                              {itm?.created_at || '----'}
                            </Text>
                          </DataTable.Cell>
                        )}
                      </DataTable.Row>
                    </>
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

export default PtmItemList;

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

  tableHeadingView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
