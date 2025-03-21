/*    ----------------Created Date :: 18- May -2024   ----------------- */
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import React, {useState} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import Images from '../../../constants/Images';
import NeumorphCard from '../../../component/NeumorphCard';
import SeparatorComponent from '../../../component/SeparatorComponent';
import {DataTable} from 'react-native-paper';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import {Avatar} from '@rneui/themed';
import ImageViewer from '../../../component/ImageViewer';
import {apiBaseUrl} from '../../../../config';
import CustomeCard from '../../../component/CustomeCard';
import IncreDecreComponent from '../../../component/IncreDecreComponent';

const SiteStockInspectionItemList = ({data, index, formik, type, purpose}) => {
  const [imageUri, setImageUri] = useState('');
  const [imageModalVisible, setImageModalVisible] = useState(false);

  /*function for total price based on rate and qty*/
  const multipliedPrice = (
    changeAblevalue, //this the value which
    fixedValue,
    assignKey,
    setFormikValues,
  ) => {
    const total = (changeAblevalue * fixedValue).toFixed(2);
    setFormikValues(assignKey, parseFloat(isNaN(total) ? 0 : total));
  };

  const onIncreDecre = ({returnValue, formik, keyToSet}) => {
    formik.setFieldValue(keyToSet, returnValue);
    let str = keyToSet;
    let parts = str.split('.');
    let index = parts[1]; // Get the first index
    let idx = parts[3]; // Get the second index

    multipliedPrice(
      returnValue, //change value
      formik.values.users[index]?.itemDetails[idx]?.item_rate, // itm.current_item_price, //fixed value
      `users.${index}.itemDetails.${idx}.approved_amount`,
      formik.setFieldValue,
    );
  };
  /*function  for getting total of approve qty and amount of approved item*/
  const getTotal = (data, key) => {
    let total = 0;
    data.forEach(element => {
      total += parseFloat(element[key]) || 0;
    });

    return total;
  };

  return (
    <>
      {type == 'approved' && (
        <View>
          <CustomeCard
            headerName={'Feedback detail'}
            data={[
              {
                key: 'Area manger name',
                value: data?.confirmDetails[0]?.area_manager_name,
              },
              {
                key: 'SUPERVISOR NAME',
                value: data?.confirmDetails[0]?.supervisor_name,
              },
              {
                key: 'ENDUSER NAME',
                value: data?.confirmDetails[0]?.end_user_name,
              },
              {
                key: 'CONTACT NUMBER',
                value: data?.confirmDetails[0]?.contact_number,
              },
              {
                key: 'OUTLET NAME ',
                value: data?.confirmDetails[0]?.outlet_honor_name,
              },
              {
                key: 'REMARKS',
                value: data?.confirmDetails[0]?.remarks,
              },
            ]}
          />
        </View>
      )}

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
                    item
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple},
                    ]}
                    style={[styles.tableHeadingView, {width: 80}]}>
                    price
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple},
                    ]}
                    numberOfLines={2}
                    style={[styles.tableHeadingView, {width: 80}]}>
                    QUANTITY
                  </DataTable.Title>
                  {type == 'approved' && (
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        {color: Colors().purple},
                      ]}
                      numberOfLines={2}
                      style={[styles.tableHeadingView, {width: 80}]}>
                      approve QUANTITY
                    </DataTable.Title>
                  )}
                  {purpose == 'approve' && (
                    <DataTable.Title
                      textStyle={[
                        styles.cardHeadingTxt,
                        {color: Colors().purple},
                      ]}
                      numberOfLines={2}
                      style={[styles.tableHeadingView, {width: 100}]}>
                      approve QUANTITY
                    </DataTable.Title>
                  )}

                  <DataTable.Title
                    textStyle={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple},
                    ]}
                    numberOfLines={2}
                    style={[styles.tableHeadingView, {width: 120}]}>
                    Total price
                  </DataTable.Title>
                  <DataTable.Title
                    textStyle={[
                      styles.cardHeadingTxt,
                      {color: Colors().purple},
                    ]}
                    numberOfLines={2}
                    style={[styles.tableHeadingView, {width: 120}]}>
                    Approve date & time
                  </DataTable.Title>
                </DataTable.Header>
                <ScrollView>
                  {data?.itemDetails.map((itm, idx) => (
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
                          style={[
                            styles.tableHeadingView,
                            {width: 120, justifyContent: 'flex-start'},
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
                              {itm?.item_name}
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
                              {color: Colors().aprroved},
                            ]}>
                            ₹ {itm?.item_rate}
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
                            {itm?.approved_qty}
                          </Text>
                        </DataTable.Cell>

                        {type == 'approved' && (
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
                              {itm?.office_approved_qty}
                            </Text>
                          </DataTable.Cell>
                        )}

                        {purpose == 'approve' && (
                          <DataTable.Cell
                            textStyle={[
                              styles.cardHeadingTxt,
                              {color: Colors().pureBlack},
                            ]}
                            style={[styles.tableHeadingView, {width: 100}]}>
                            <IncreDecreComponent
                              defaultValue={
                                formik.values.users[index].itemDetails[idx]
                                  .approve_office_qty || 0
                              }
                              MaxValue={itm?.approved_qty}
                              formik={formik}
                              keyToSet={`users.${index}.itemDetails.${idx}.approve_office_qty`}
                              onChange={onIncreDecre}
                            />
                          </DataTable.Cell>
                        )}

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
                            ₹ {itm?.total_approved_amount}
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
                            {itm?.approved_at}
                          </Text>
                        </DataTable.Cell>
                      </DataTable.Row>
                    </>
                  ))}
                  {purpose == 'view' && (
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
                        TOTAL Request Amount = ₹ {data?.total}
                      </Text>
                    </DataTable.Row>
                  )}
                  {purpose == 'approve' && (
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
                        TOTAL Amount = ₹{' '}
                        {getTotal(
                          formik.values.users[index]?.itemDetails,
                          'approved_amount',
                        )}
                      </Text>
                    </DataTable.Row>
                  )}

                  {type == 'approved' && (
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
                        TOTAL SITE APPROVE AMOUNT = ₹ {data?.total_site_amount}
                      </Text>
                    </DataTable.Row>
                  )}
                </ScrollView>
              </DataTable>
            </ScrollView>
          </View>
        </NeumorphCard>
      </View>

      {imageModalVisible && (
        <ImageViewer
          visible={imageModalVisible}
          imageUri={imageUri}
          cancelBtnPress={() => setImageModalVisible(!imageModalVisible)}
          // downloadBtnPress={item => downloadImageRemote(item)}
        />
      )}
    </>
  );
};

export default SiteStockInspectionItemList;

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
