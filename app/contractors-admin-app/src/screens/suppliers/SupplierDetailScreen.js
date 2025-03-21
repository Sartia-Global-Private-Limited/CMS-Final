/*    ----------------Created Date :: 28- Feb -2024   ----------------- */

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import FloatingAddButton from '../../component/FloatingAddButton';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../component/Loader';
import InternalServer from '../../component/InternalServer';
import DataNotFound from '../../component/DataNotFound';
import { getSupplierDetailById } from '../../redux/slices/suppliers/getSupplierDetailSlice';
import { DataTable } from 'react-native-paper';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeCard from '../../component/CustomeCard';
import ImageViewer from '../../component/ImageViewer';
import { apiBaseUrl } from '../../../config';
import Images from '../../constants/Images';

const SupplierDetailScreen = ({ navigation, route }) => {
  const edit_id = route?.params?.edit_id;
  const label = ScreensLabel();
  /* declare props constant variale*/
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [imageUri, setImageUri] = useState(false);
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const listData = useSelector(state => state.getSupplierDetail);
  const data = listData?.data?.data;

  useEffect(() => {
    dispatch(getSupplierDetailById(edit_id));
  }, [edit_id]);

  /*function for getting status color */
  const getStatusColor = status => {
    switch (status) {
      case 'request':
        return Colors().pending;
      case 'approved':
        return Colors().aprroved;
      case 'rejected':
        return Colors().rejected;

      default:
        break;
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.SUPPLIERS} ${label.DETAIL}`} />

      {listData?.isLoading ? (
        <Loader />
      ) : !listData?.isLoading &&
        !listData?.isError &&
        listData?.data?.status ? (
        <>
          <ScrollView>
            <View style={{}}>
              {/* card for   detail */}

              <CustomeCard
                headerName={'DETAILS'}
                data={[
                  {
                    key: 'Supplier name',
                    value: data?.supplier_name ?? '--',
                    keyColor: Colors().skyBule,
                  },
                  {
                    key: 'owner name',
                    value: data?.owner_name ?? '--',
                  },
                  {
                    key: 'cashier name',
                    value: data?.cashier_name ?? '--',
                  },
                ]}
                status={[
                  {
                    key: 'status',
                    value: data?.status,
                    color: getStatusColor(data?.status),
                  },
                ]}
              />

              {/* card for   BANK DETAILS */}
              <CustomeCard
                headerName={'Bank DETAILS'}
                data={[
                  {
                    key: 'Bank name',
                    value: data?.bank_name ?? '--',
                  },
                  {
                    key: 'account holder name',
                    value: data?.account_holder_name ?? '--',
                  },
                  {
                    key: 'account no',
                    value: data?.account_number ?? '--',
                  },
                  {
                    key: 'Branch name',
                    value: data?.branch_name ?? '--',
                  },
                  {
                    key: 'upi id',
                    value: data?.upi_id ?? '--',
                  },
                  {
                    key: 'qr Image',
                    component: (
                      <TouchableOpacity
                        onPress={() => {
                          if (data?.upi_image) {
                            setImageModalVisible(true);
                            setImageUri(`${apiBaseUrl}${data?.upi_image}`);
                          }
                        }}>
                        <Image
                          source={{
                            uri: data?.upi_image
                              ? `${apiBaseUrl}${data?.upi_image}`
                              : `${
                                  Image.resolveAssetSource(
                                    Images.DEFAULT_PROFILE,
                                  ).uri
                                }`,
                          }}
                          style={[styles.Image]}
                        />
                      </TouchableOpacity>
                    ),
                  },
                ]}
                status={[
                  {
                    key: 'ifsc code',
                    value: data?.ifsc_code,
                    color: Colors().pending,
                  },
                ]}
              />

              {/* card for addresses table */}
              <CustomeCard
                headerName={'supplier addrresses'}
                data={[
                  {
                    component: (
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
                              SHOP OFFICE NO
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                { color: Colors().purple },
                              ]}
                              style={[styles.tableHeadingView, { width: 120 }]}>
                              STREET NAME
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                { color: Colors().purple },
                              ]}
                              style={[styles.tableHeadingView, { width: 120 }]}>
                              CITY
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                { color: Colors().purple },
                              ]}
                              style={[styles.tableHeadingView, { width: 120 }]}>
                              STATE
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                { color: Colors().purple },
                              ]}
                              style={[styles.tableHeadingView, { width: 120 }]}>
                              PIN CODE
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                { color: Colors().purple },
                              ]}
                              style={[styles.tableHeadingView, { width: 120 }]}>
                              LANDMARK
                            </DataTable.Title>
                            <DataTable.Title
                              textStyle={[
                                styles.cardHeadingTxt,
                                { color: Colors().purple },
                              ]}
                              style={[styles.tableHeadingView, { width: 120 }]}>
                              GST NUMBER
                            </DataTable.Title>
                          </DataTable.Header>
                          <ScrollView>
                            {data?.supplier_addresses?.map((itm, index) => (
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

                                      {itm.is_default === '1' && (
                                        <View style={styles.defaultView}>
                                          <Text
                                            style={{
                                              color: 'white',
                                              fontSize: 9,
                                              fontFamily:
                                                Colors().fontFamilyBookMan,
                                            }}>
                                            DEFAULT
                                          </Text>
                                        </View>
                                      )}
                                    </View>
                                  </DataTable.Cell>

                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      { color: Colors().pureBlack },
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      { width: 120 },
                                    ]}>
                                    <Text
                                      numberOfLines={2}
                                      style={[
                                        styles.cardtext,
                                        { color: Colors().pureBlack },
                                      ]}>
                                      {itm?.shop_office_number}
                                    </Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      { color: Colors().pureBlack },
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      { width: 120 },
                                    ]}>
                                    <Text
                                      numberOfLines={2}
                                      style={[
                                        styles.cardtext,
                                        { color: Colors().pureBlack },
                                      ]}>
                                      {itm?.street_name}
                                    </Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      { color: Colors().pureBlack },
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      { width: 120 },
                                    ]}>
                                    <Text
                                      numberOfLines={2}
                                      style={[
                                        styles.cardtext,
                                        { color: Colors().pureBlack },
                                      ]}>
                                      {itm?.city}
                                    </Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      { color: Colors().pureBlack },
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      { width: 120 },
                                    ]}>
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
                                    style={[
                                      styles.tableHeadingView,
                                      { width: 120 },
                                    ]}>
                                    <Text
                                      numberOfLines={2}
                                      style={[
                                        styles.cardtext,
                                        { color: Colors().pureBlack },
                                      ]}>
                                      {itm?.pin_code}
                                    </Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      { color: Colors().pureBlack },
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      { width: 120 },
                                    ]}>
                                    <Text
                                      numberOfLines={2}
                                      style={[
                                        styles.cardtext,
                                        { color: Colors().pureBlack },
                                      ]}>
                                      {itm?.landmark}
                                    </Text>
                                  </DataTable.Cell>
                                  <DataTable.Cell
                                    textStyle={[
                                      styles.cardHeadingTxt,
                                      { color: Colors().pureBlack },
                                    ]}
                                    style={[
                                      styles.tableHeadingView,
                                      { width: 120 },
                                    ]}>
                                    <Text
                                      numberOfLines={2}
                                      style={[
                                        styles.cardtext,
                                        { color: Colors().pureBlack },
                                      ]}>
                                      {itm?.gst_number}
                                    </Text>
                                  </DataTable.Cell>
                                </DataTable.Row>
                              </>
                            ))}
                          </ScrollView>
                        </DataTable>
                      </ScrollView>
                    ),
                  },
                ]}
              />
            </View>
            {/*view for modal of upate */}
            {imageModalVisible && (
              <ImageViewer
                visible={imageModalVisible}
                imageUri={imageUri}
                cancelBtnPress={() => {
                  setImageModalVisible(!imageModalVisible);
                }}
                downloadBtnPress={true}
              />
            )}
          </ScrollView>
        </>
      ) : listData?.isError ? (
        <InternalServer />
      ) : !listData?.data?.status &&
        listData?.data?.message == 'No supplier found' ? (
        <>
          <DataNotFound />
          {/* View for floating button */}
          <View
            style={{
              marginTop: WINDOW_HEIGHT * 0.8,
              marginLeft: WINDOW_WIDTH * 0.8,
              position: 'absolute',
            }}>
            <FloatingAddButton
              backgroundColor={Colors().purple}
              onPress={() => {
                navigation.navigate('AddUpdateSuplierScreen');
              }}></FloatingAddButton>
          </View>
        </>
      ) : (
        <InternalServer />
      )}
    </SafeAreaView>
  );
};

export default SupplierDetailScreen;

const styles = StyleSheet.create({
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
  Image: {
    height: WINDOW_HEIGHT * 0.05,
    width: WINDOW_WIDTH * 0.18,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  tableHeadingView: {
    // width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
  },
  defaultView: {
    backgroundColor: Colors().purple,
    borderRadius: 5,
    padding: 1,
    height: 20,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
