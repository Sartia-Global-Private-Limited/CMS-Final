/*    ----------------Created Date :: 10- April -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import React, { useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { Avatar, CheckBox } from '@rneui/base';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import { apiBaseUrl } from '../../../../config';
import NeumorphCard from '../../../component/NeumorphCard';
import CustomeHeader from '../../../component/CustomeHeader';
import Images from '../../../constants/Images';
import NeuomorphAvatar from '../../../component/NeuomorphAvatar';
import { useFormik } from 'formik';
import { getBankBalanceByBankId } from '../../../redux/slices/fund-management/fund balance overview/getBankBalanceListSlice';
import { getBankBalanceByEmpId } from '../../../redux/slices/fund-management/fund balance overview/getEmpBalanceListSlice';
import { getSupplierBalanceById } from '../../../redux/slices/stock-management/stock-balance-overview/getSupplierBalanceListSlice';
import StockTransactionFilter from '../stock transactions/StockTransactionFilter';
import ScreensLabel from '../../../constants/ScreensLabel';

const StockBalanceOverViewScreen = ({ navigation }) => {
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const label = ScreensLabel();
  const ListData = useSelector(state => state.getBankBalanceList);
  const ListData2 = useSelector(state => state.getEmpBalanceList);
  const ListData3 = useSelector(state => state.getSupplierBalanceList);

  const formik = useFormik({
    initialValues: {
      section_type: '1',
      pageSize: 8,
      pageNo: 1,
      search: '',
      bank_id: '',
      office_id: '',
      manager_id: '',
      supervisor_id: '',
      enduser_id: '',
      end_user_id: '',
      supplier_id: '',
    },
  });
  /*values for radio button*/
  const BALANCE_FOR = [
    { label: 'BANK', value: '1' },
    { label: 'EMPLOYEE', value: '2' },
    { label: 'SUPPLIER', value: '3' },
  ];

  useEffect(() => {
    /*for bank section*/
    if (formik.values.section_type == '1') {
      dispatch(
        getBankBalanceByBankId({
          bankId: formik.values.bank_id,
          pageSize: formik.values.pageSize,
          pageNo: formik.values.pageNo,
          search: formik.values.search,
        }),
      );
    }
    /*for employee section*/
    if (formik.values.section_type == '2') {
      dispatch(
        getBankBalanceByEmpId({
          empId: formik.values.end_user_id,
          pageSize: formik.values.pageSize,
          pageNo: formik.values.pageNo,
          search: formik.values.search,
        }),
      );
    }

    /*for supplier section*/
    if (formik.values.section_type == '3') {
      dispatch(
        getSupplierBalanceById({
          Id: formik.values.supplier_id,
          pageSize: formik.values.pageSize,
          pageNo: formik.values.pageNo,
          search: formik.values.search,
        }),
      );
    }
  }, [
    formik.values.bank_id,
    formik.values.search,
    formik.values.pageNo,
    formik.values.section_type,
    formik.values.end_user_id,
    formik.values.supplier_id,
  ]);

  /* function pagination detail of each section */
  const getPaginatinoData = () => {
    if (formik.values.section_type == '1') {
      return ListData?.data?.pageDetails?.totalPages;
    }
    if (formik.values.section_type == '2') {
      return ListData2?.data?.pageDetails?.totalPages;
    }
    if (formik.values.section_type == '3') {
      return ListData3?.data?.pageDetails?.totalPages;
    }
  };

  /* for getting color of status*/
  function getStatusColor(action) {
    switch (action) {
      case 'current':
        return Colors().pending;
      case 'savings':
        return Colors().aprroved;

      default:
        return 'black';
    }
  }

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

  /* flatlist render ui  for bank section*/
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity style={styles.cardContainer}>
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
                      source={{
                        uri: item?.logo
                          ? `${apiBaseUrl}${item?.logo}`
                          : `${
                              Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                .uri
                            }`,
                      }}
                    />
                  </NeuomorphAvatar>
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Account No. :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().skyBule }]}>
                      {item?.account_number}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Holder name :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.account_holder_name}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      IFSC CODE:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.ifsc_code}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Branch:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.branch}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Balance:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      ₹ {item?.last_balance ? item?.last_balance : 0}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            <View style={styles.actionView}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { color: Colors().pureBlack },
                  ]}>
                  account type :{' '}
                </Text>
                <NeumorphCard>
                  <View style={{ padding: 5 }}>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[
                        styles.cardtext,
                        { color: getStatusColor(item?.account_type) },
                      ]}>
                      {item?.account_type}
                    </Text>
                  </View>
                </NeumorphCard>
              </View>
              <View style={styles.actionView2}></View>
            </View>
          </NeumorphCard>
        </TouchableOpacity>
      </View>
    );
  };
  /* flatlist render ui for employee section */
  const renderItem2 = ({ item }) => {
    return (
      <View>
        <TouchableOpacity style={styles.cardContainer}>
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
                      source={{
                        uri: item?.image
                          ? `${apiBaseUrl}${item?.image}`
                          : `${
                              Image.resolveAssetSource(Images.DEFAULT_PROFILE)
                                .uri
                            }`,
                      }}
                    />
                  </NeuomorphAvatar>
                </View>

                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      employee id :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().skyBule }]}>
                      {item?.employee_id}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      name :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.name}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      email:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.email}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Mobile :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.mobile}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      Balance:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      ₹ {item?.balance ? item?.balance : 0}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </NeumorphCard>
        </TouchableOpacity>
      </View>
    );
  };
  /* flatlist render ui for supplier  section */
  const renderItem3 = ({ item }) => {
    return (
      <View>
        <TouchableOpacity style={styles.cardContainer}>
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
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      supplier id :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().skyBule }]}>
                      {item?.supplier_id}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      supplier name :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.supplier_name}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      bill no :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().purple }]}>
                      {item?.bill_number}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      bill date :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().pureBlack }]}>
                      {item?.bill_date}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row' }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        { color: Colors().pureBlack },
                      ]}>
                      total transfer amount:{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, { color: Colors().aprroved }]}>
                      ₹{' '}
                      {item?.total_transfer_amount
                        ? item?.total_transfer_amount
                        : 0}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </NeumorphCard>
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button UI*/
  const renderPaginationButtons = () => {
    const buttons = [];

    for (let i = 1; i <= getPaginatinoData(); i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          onPress={() => formik.setFieldValue(`pageNo`, i)}
          style={[
            styles.paginationButton,
            i === formik.values.pageNo ? styles.activeButton : null,
          ]}>
          <Text style={{ color: 'white' }}>{i}</Text>
        </TouchableOpacity>,
      );
    }

    return buttons;
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={label.STOCK_BALANCE_OVERVIEW} />

      <View>
        <Text
          style={[
            styles.title,
            { marginLeft: 10, marginTop: 5, color: Colors().pureBlack },
          ]}>
          balance overview FOR :--
        </Text>
      </View>

      <View style={styles.radioView}>
        {BALANCE_FOR.map((radioButton, index) => (
          <>
            <CheckBox
              key={index}
              textStyle={{
                fontFamily: Colors().fontFamilyBookMan,
                color: Colors().gray2,
              }}
              containerStyle={{
                backgroundColor: Colors().screenBackground,
                padding: 0,
              }}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              title={radioButton.label}
              checked={formik.values.section_type === radioButton.value}
              onPress={() => {
                formik.resetForm();
                formik.setFieldValue('section_type', radioButton.value);
              }}
              checkedColor={Colors().aprroved}
            />
          </>
        ))}
      </View>

      <StockTransactionFilter
        formik={formik}
        type={'balance'}
        dateFilter={formik.values.section_type == '1' ? true : false}
      />

      {formik.values.section_type == '1' && (
        <>
          {ListData?.isLoading ? (
            <Loader />
          ) : !ListData?.isLoading &&
            !ListData?.isError &&
            ListData?.data?.status ? (
            <>
              <FlatList
                data={ListData?.data?.data}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 50 }}
                ListEmptyComponent={renderEmptyComponent}
              />
              {ListData?.data?.pageDetails?.totalPages > 1 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.paginationButtonView}>
                  {renderPaginationButtons()}
                </ScrollView>
              )}
            </>
          ) : ListData?.isError ? (
            <InternalServer />
          ) : !formik.values.bank_id ||
            (!ListData?.data?.status &&
              ListData?.data?.message == 'Data not found') ? (
            <>
              <DataNotFound />
            </>
          ) : (
            <InternalServer></InternalServer>
          )}
        </>
      )}

      {formik.values.section_type == '2' && (
        <>
          {ListData2?.isLoading ? (
            <Loader />
          ) : !ListData2?.isLoading &&
            !ListData2?.isError &&
            ListData2?.data?.status ? (
            <>
              <FlatList
                data={ListData2?.data?.data}
                renderItem={renderItem2}
                contentContainerStyle={{ paddingBottom: 50 }}
                ListEmptyComponent={renderEmptyComponent}
              />
              {ListData2?.data?.pageDetails?.totalPages > 1 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.paginationButtonView}>
                  {renderPaginationButtons()}
                </ScrollView>
              )}
            </>
          ) : ListData2?.isError ? (
            <InternalServer />
          ) : !formik.values.end_user_id ||
            (!ListData2?.data?.status &&
              ListData2?.data?.message == 'Data not found') ? (
            <>
              <DataNotFound />
            </>
          ) : (
            <InternalServer></InternalServer>
          )}
        </>
      )}
      {formik.values.section_type == '3' && (
        <>
          {ListData3?.isLoading ? (
            <Loader />
          ) : !ListData3?.isLoading &&
            !ListData3?.isError &&
            ListData3?.data?.status ? (
            <>
              <FlatList
                data={ListData3?.data?.data}
                renderItem={renderItem3}
                contentContainerStyle={{ paddingBottom: 50 }}
                ListEmptyComponent={renderEmptyComponent}
              />
              {ListData3?.data?.pageDetails?.totalPages > 1 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.paginationButtonView}>
                  {renderPaginationButtons()}
                </ScrollView>
              )}
            </>
          ) : ListData3?.isError ? (
            <InternalServer />
          ) : !formik.values.supplier_id ||
            (!ListData3?.data?.status &&
              ListData3?.data?.message == 'Data not found') ? (
            <>
              <DataNotFound />
            </>
          ) : (
            <InternalServer></InternalServer>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default StockBalanceOverViewScreen;

const styles = StyleSheet.create({
  radioView: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,

    flexShrink: 1,
  },
  paginationButtonView: {
    marginTop: WINDOW_HEIGHT * 0.8,
    bottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    backgroundColor: '',
    marginHorizontal: WINDOW_WIDTH * 0.01,
    columnGap: 20,
  },
  cardContainer: {
    width: WINDOW_WIDTH * 0.95,
    marginBottom: 15,
    height: 'auto',
    alignSelf: 'center',
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
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  paginationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  activeButton: {
    backgroundColor: '#22c55d',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  actionView: {
    margin: WINDOW_WIDTH * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
});
