import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
  TextInput,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomeCard from '../../../component/CustomeCard';
import Colors from '../../../constants/Colors';
import {useDispatch, useSelector} from 'react-redux';
import {Icon} from '@rneui/themed';
import IconType from '../../../constants/IconType';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import moment from 'moment';
import DataNotFound from '../../../component/DataNotFound';
import InternalServer from '../../../component/InternalServer';
import {getAllInoviceDataByIds} from '../../../redux/slices/billing management/payment update/addUpdatePayementSlice';
import Loader from '../../../component/Loader';
import SeparatorComponent from '../../../component/SeparatorComponent';
import converToNumber from '../../../utils/StringToNumber';
import converToString from '../../../utils/NumberToString';

import {getPaymentReceivedDetailById} from '../../../redux/slices/billing management/payment received/getPaymentReceivedDetailSlice';

const CreatePaymentForm = ({formik, type, edit_id, edit, selectedId}) => {
  const dispatch = useDispatch();

  const ListData = edit_id
    ? useSelector(state => state.getPaymentReceivedDetail)
    : useSelector(state => state.addUpdatePayement);

  const assinedData = ListData?.data?.data;

  const [openPurchaseDate, setOpenPurchaseDate] = useState(false);

  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (selectedId) {
      dispatch(getAllInoviceDataByIds(selectedId));
    }
  }, [selectedId]);

  useEffect(() => {
    if (edit_id) {
      dispatch(getPaymentReceivedDetailById(edit_id));
    }
  }, [edit_id]);

  useEffect(() => {
    if (assinedData) {
      const invoiceData = assinedData.map(item => {
        return {
          invoice_id: item?.id,
          invoice_number: item?.invoice_number,
          invoice_date: item?.invoice_date,

          tds: item?.tds || 2,
          tds_amount:
            item?.tds_amount || ((item?.net_amount * 2) / 100).toFixed(2),
          tds_on_gst: item?.tds_on_gst || 2,
          tds_on_gst_amount:
            item?.tds_on_gst_amount ||
            ((item?.net_amount * 2) / 100).toFixed(2),
          retention: item?.retention || 10,
          retention_amount:
            item?.retention_amount ||
            ((item?.net_amount * 10) / 100).toFixed(2),

          covid19_amount_hold: item?.covid19_amount_hold || '',
          ld_amount: item?.ld_amount || '',
          hold_amount: item?.hold_amount || '',
          other_deduction: item?.other_deduction || '',

          net_amount: item?.net_amount || '',
          gst_amount: item?.gst_amount || '',
          gross_amount: item?.gross_amount || '',

          amount_received: item?.amount_received || '',
        };
      });

      formik.setFieldValue(`invoiceData`, invoiceData);
    }
  }, [assinedData]);

  /* if we got no data for flatlist*/
  const renderEmptyComponent = () => (
    <View
      style={{
        height: WINDOW_HEIGHT * 0.5,
        width: WINDOW_WIDTH * 0.9,
      }}>
      <DataNotFound />
    </View>
  );

  /*fucntion for calculating grand total of all card*/
  const grandTotal = () => {
    let total = 0;
    formik?.values?.invoiceData.forEach(element => {
      let totaldeduction = getTotalDeduction(element);
      total += converToNumber(element?.gross_amount) - totaldeduction;
    });
    return total.toFixed(2);
  };

  /*function  for getting total */
  const getTotal = (data, key) => {
    let total = 0;
    data.forEach(element => {
      total += parseFloat(element[key]) || 0;
    });

    return total;
  };

  /* fucntion for calulating total deduction */
  const getTotalDeduction = (data, index) => {
    const tds_amount = converToNumber(data?.tds_amount);
    const tds_on_gst_amount = converToNumber(data?.tds_on_gst_amount);
    const retention_amount = converToNumber(data?.retention_amount);
    const covid19_amount_hold = converToNumber(data?.covid19_amount_hold);
    const ld_amount = converToNumber(data?.ld_amount);
    const hold_amount = converToNumber(data?.hold_amount);
    const other_deduction = converToNumber(data?.other_deduction);

    let total =
      tds_amount +
      tds_on_gst_amount +
      retention_amount +
      covid19_amount_hold +
      ld_amount +
      hold_amount +
      other_deduction;

    return total.toFixed(2);
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      dispatch(getAllInoviceDataByIds(selectedId));

      setRefreshing(false);
    }, 2000);
  }, []);

  const renderItem = ({item, index}) => {
    return (
      <CustomeCard
        headerName={item?.invoice_number}
        data={[
          {
            component: (
              <View style={styles.twoTextInput}>
                <View style={styles.firstInput}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    TDs% :{' '}
                  </Text>
                  <TextInput
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().pureBlack}
                    keyboardType="numeric"
                    style={[styles.inputText, styles.inputText2]}
                    value={converToString(item?.tds)}
                    onChangeText={value => {
                      formik.setFieldValue(`invoiceData.${index}.tds`, value);
                      const tds_amount = (
                        (converToNumber(item?.net_amount) * value) /
                        100
                      ).toFixed(2);
                      formik.setFieldValue(
                        `invoiceData.${index}.tds_amount`,
                        tds_amount,
                      );
                    }}
                  />
                </View>
                <View style={[styles.secondInput]}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    TDs amt :{' '}
                  </Text>
                  <TextInput
                    placeholder="TYPE..."
                    keyboardType="numeric"
                    placeholderTextColor={Colors().pureBlack}
                    style={[styles.inputText, styles.inputText2]}
                    value={converToString(item?.tds_amount)}
                    onChangeText={value => {
                      formik.setFieldValue(
                        `invoiceData.${index}.tds_amount`,
                        value,
                      );
                      const tds = (
                        (value * 100) /
                        converToNumber(item?.net_amount)
                      ).toFixed(2);
                      formik.setFieldValue(`invoiceData.${index}.tds`, tds);
                    }}
                  />
                </View>
              </View>
            ),
          },
          {
            component: (
              <View style={styles.twoTextInput}>
                <View style={styles.firstInput}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    TDS % ON GST :{' '}
                  </Text>
                  <TextInput
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().pureBlack}
                    keyboardType="numeric"
                    style={[styles.inputText, styles.inputText2]}
                    value={converToString(item?.tds_on_gst)}
                    onChangeText={value => {
                      formik.setFieldValue(
                        `invoiceData.${index}.tds_on_gst`,
                        value,
                      );

                      const tds_on_gst_amount = (
                        (converToNumber(item?.net_amount) * value) /
                        100
                      ).toFixed(2);

                      formik.setFieldValue(
                        `invoiceData.${index}.tds_on_gst_amount`,
                        tds_on_gst_amount,
                      );
                    }}
                  />
                </View>
                <View style={[styles.secondInput]}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    TDS GST AMt :{' '}
                  </Text>
                  <TextInput
                    placeholder="TYPE..."
                    keyboardType="numeric"
                    placeholderTextColor={Colors().pureBlack}
                    style={[styles.inputText, styles.inputText2]}
                    value={converToString(item?.tds_on_gst_amount)}
                    onChangeText={value => {
                      formik.setFieldValue(
                        `invoiceData.${index}.tds_on_gst_amount`,
                        value,
                      );

                      const tds_gst_percent = (
                        (value * 100) /
                        converToNumber(item?.net_amount)
                      ).toFixed(2);
                      formik.setFieldValue(
                        `invoiceData.${index}.tds_on_gst`,
                        tds_gst_percent,
                      );
                    }}
                  />
                </View>
              </View>
            ),
          },
          {
            component: (
              <View style={styles.twoTextInput}>
                <View style={styles.firstInput}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    RETENTION % :{' '}
                  </Text>
                  <TextInput
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().pureBlack}
                    keyboardType="numeric"
                    style={[styles.inputText, styles.inputText2]}
                    value={converToString(item?.retention)}
                    onChangeText={value => {
                      formik.setFieldValue(
                        `invoiceData.${index}.retention`,
                        value,
                      );

                      const retention_amount = (
                        (converToNumber(item?.net_amount) * value) /
                        100
                      ).toFixed(2);

                      formik.setFieldValue(
                        `invoiceData.${index}.retention_amount`,
                        retention_amount,
                      );
                    }}
                  />
                </View>
                <View style={[styles.secondInput]}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    RETENTION :{' '}
                  </Text>
                  <TextInput
                    placeholder="TYPE..."
                    keyboardType="numeric"
                    placeholderTextColor={Colors().pureBlack}
                    style={[styles.inputText, styles.inputText2]}
                    value={converToString(item?.retention_amount)}
                    onChangeText={value => {
                      formik.setFieldValue(
                        `invoiceData.${index}.retention_amount`,
                        value,
                      );

                      const retention = (
                        (value * 100) /
                        converToNumber(item?.net_amount)
                      ).toFixed(2);
                      formik.setFieldValue(
                        `invoiceData.${index}.retention`,
                        retention,
                      );
                    }}
                  />
                </View>
              </View>
            ),
          },
          {
            component: (
              <View style={styles.twoTextInput}>
                <View style={styles.firstInput}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    COVID 19 AMt:{' '}
                  </Text>
                  <TextInput
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().pureBlack}
                    keyboardType="numeric"
                    style={[styles.inputText, styles.inputText2]}
                    value={converToString(item?.covid19_amount_hold)}
                    onChangeText={formik.handleChange(
                      `invoiceData.${index}.covid19_amount_hold`,
                    )}
                  />
                </View>
                <View style={[styles.secondInput]}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    LD AMt :{' '}
                  </Text>
                  <TextInput
                    placeholder="TYPE..."
                    keyboardType="numeric"
                    placeholderTextColor={Colors().pureBlack}
                    style={[styles.inputText, styles.inputText2]}
                    value={converToString(item?.ld_amount)}
                    onChangeText={formik.handleChange(
                      `invoiceData.${index}.ld_amount`,
                    )}
                  />
                </View>
              </View>
            ),
          },
          {
            component: (
              <View style={styles.twoTextInput}>
                <View style={styles.firstInput}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    HOLD AMt:{' '}
                  </Text>
                  <TextInput
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().pureBlack}
                    keyboardType="numeric"
                    style={[styles.inputText, styles.inputText2]}
                    value={converToString(item?.hold_amount)}
                    onChangeText={formik.handleChange(
                      `invoiceData.${index}.hold_amount`,
                    )}
                  />
                </View>
                <View style={[styles.secondInput]}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    OTHER DED. :{' '}
                  </Text>
                  <TextInput
                    placeholder="TYPE..."
                    keyboardType="numeric"
                    placeholderTextColor={Colors().pureBlack}
                    style={[styles.inputText, styles.inputText2]}
                    value={converToString(item?.other_deduction)}
                    onChangeText={formik.handleChange(
                      `invoiceData.${index}.other_deduction`,
                    )}
                  />
                </View>
              </View>
            ),
          },
          {
            component: (
              <View style={{marginVertical: WINDOW_HEIGHT * 0.01}}>
                <SeparatorComponent
                  separatorColor={Colors().gray}
                  separatorWidth={WINDOW_WIDTH * 0.9}
                  separatorHeight={WINDOW_HEIGHT * 0.0005}
                />
              </View>
            ),
          },

          {
            component: (
              <View
                style={[
                  styles.twoTextInput,
                  {alignItems: 'center', flexGrow: 0},
                ]}>
                <View style={[styles.firstInput, {flexDirection: 'column'}]}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      payment AMt:{' '}
                    </Text>
                    <TextInput
                      placeholder="TYPE..."
                      placeholderTextColor={Colors().pureBlack}
                      keyboardType="numeric"
                      style={[styles.inputText, styles.inputText2]}
                      value={converToString(item?.amount_received)}
                      onChangeText={value => {
                        const finalAmount = (
                          converToNumber(item?.gross_amount) -
                          getTotalDeduction(item)
                        ).toFixed(2);
                        const balanceAmt = (
                          (
                            converToNumber(item?.gross_amount) -
                            getTotalDeduction(item)
                          ).toFixed(2) -
                          assinedData[0]?.received_amount?.toFixed(2)
                        ).toFixed(2);

                        if (edit_id) {
                          if (
                            converToNumber(value) < converToNumber(balanceAmt)
                          ) {
                            formik.setFieldValue(
                              `invoiceData.${index}.amount_received`,
                              value,
                            );
                          } else {
                            formik.setFieldValue(
                              `invoiceData.${index}.amount_received`,
                              balanceAmt,
                            );
                          }
                        } else {
                          if (
                            converToNumber(value) < converToNumber(finalAmount)
                          ) {
                            formik.setFieldValue(
                              `invoiceData.${index}.amount_received`,
                              value,
                            );
                          } else {
                            formik.setFieldValue(
                              `invoiceData.${index}.amount_received`,
                              finalAmount,
                            );
                          }
                        }
                      }}
                    />
                  </View>

                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    balance amt :
                    {`₹ ${(
                      (
                        converToNumber(item?.gross_amount) -
                        getTotalDeduction(item)
                      ).toFixed(2) - assinedData[0]?.received_amount?.toFixed(2)
                    ).toFixed(2)}`}
                  </Text>
                </View>

                <View style={[styles.secondInput, {flexDirection: 'column'}]}>
                  <View style={styles.allDeductionView}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      net amt :{' '}
                    </Text>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      ₹ {converToNumber(item?.net_amount).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.allDeductionView}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      gst amt :{' '}
                    </Text>

                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      ₹ {converToNumber(item?.gst_amount).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.allDeductionView}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      gross amt :{' '}
                    </Text>

                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().aprroved},
                      ]}>
                      ₹ {converToNumber(item?.gross_amount).toFixed(2)}
                    </Text>
                  </View>
                  <View style={styles.allDeductionView}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      total DED. :{' '}
                    </Text>

                    <Text
                      style={[styles.cardHeadingTxt, {color: Colors().red}]}>
                      ₹ {getTotalDeduction(item, index)}
                    </Text>
                  </View>
                  <View>
                    <SeparatorComponent
                      separatorColor={Colors().pureBlack}
                      separatorHeight={WINDOW_HEIGHT * 0.0003}
                      separatorWidth={WINDOW_WIDTH * 0.45}
                    />
                  </View>
                  <View style={styles.allDeductionView}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      Final amt :{' '}
                    </Text>

                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().aprroved},
                      ]}>
                      ₹{' '}
                      {(
                        converToNumber(item?.gross_amount) -
                        getTotalDeduction(item)
                      ).toFixed(2)}
                    </Text>
                  </View>
                  {edit_id && (
                    <View style={styles.allDeductionView}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().pureBlack},
                        ]}>
                        Paid amt :{' '}
                      </Text>

                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          {color: Colors().aprroved},
                        ]}>
                        ₹ {assinedData[0]?.received_amount?.toFixed(2)}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            ),
          },
        ]}
      />
    );
  };

  return (
    <>
      {ListData?.isLoading ? (
        <View style={{height: WINDOW_HEIGHT * 0.9}}>
          <Loader />
        </View>
      ) : !ListData?.isLoading &&
        !ListData?.isError &&
        ListData?.data?.status ? (
        <View style={{}}>
          <CustomeCard
            headerName={'voucher detail'}
            data={[
              {
                key: 'Voucher no',
                component: (
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TextInput
                      placeholder="TYPE..."
                      placeholderTextColor={Colors().gray2}
                      style={[styles.inputText, styles.inputText2]}
                      value={formik?.values?.pv_number}
                      onChangeText={formik.handleChange(`pv_number`)}
                    />
                    {!formik?.values?.pv_number && (
                      <View style={{}}>
                        <Icon
                          name="asterisk"
                          type={IconType.FontAwesome5}
                          size={8}
                          color={Colors().red}
                        />
                      </View>
                    )}
                  </View>
                ),
              },
              {
                component: (
                  <View style={styles.twoItemView}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      Voucher dates :{' '}
                    </Text>

                    <View style={{flex: 1}}>
                      <NeumorphDatePicker
                        height={38}
                        width={
                          formik?.values?.receipt_date
                            ? WINDOW_WIDTH * 0.56
                            : WINDOW_WIDTH * 0.54
                        }
                        withoutShadow={true}
                        iconPress={() => setOpenPurchaseDate(!openPurchaseDate)}
                        valueOfDate={
                          formik?.values?.receipt_date
                            ? moment(formik?.values?.receipt_date).format(
                                'DD/MM/YYYY',
                              )
                            : ''
                        }
                        modal
                        open={openPurchaseDate}
                        date={new Date()}
                        mode="date"
                        onConfirm={date => {
                          formik.setFieldValue(`receipt_date`, date);

                          setOpenPurchaseDate(false);
                        }}
                        onCancel={() => {
                          setOpenPurchaseDate(false);
                        }}></NeumorphDatePicker>
                    </View>
                    {!formik.values?.receipt_date && (
                      <View style={{alignSelf: 'center'}}>
                        <Icon
                          name="asterisk"
                          type={IconType.FontAwesome5}
                          size={8}
                          color={Colors().red}
                        />
                      </View>
                    )}
                  </View>
                ),
              },

              {
                key: 'Voucher amount ',
                component: (
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}>
                    <TextInput
                      placeholder="TYPE..."
                      placeholderTextColor={Colors().gray2}
                      style={[styles.inputText, styles.inputText2]}
                      keyboardType="numeric"
                      value={formik?.values?.pv_amount}
                      onChangeText={formik.handleChange(`pv_amount`)}
                    />
                    {!formik?.values?.pv_amount && (
                      <View style={{}}>
                        <Icon
                          name="asterisk"
                          type={IconType.FontAwesome5}
                          size={8}
                          color={Colors().red}
                        />
                      </View>
                    )}
                  </View>
                ),
              },
              ...(converToNumber(formik?.values?.pv_amount) <
              getTotal(formik?.values?.invoiceData, 'amount_received')
                ? [
                    {
                      component: (
                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            {color: Colors().red},
                          ]}>
                          Voucher amount cant not be less than total pay amount
                        </Text>
                      ),
                    },
                  ]
                : []),

              {
                key: 'total amount',
                value: `₹ ${grandTotal()}`,
                keyColor: Colors().aprroved,
              },
              {
                key: 'total pay amount',
                value: `₹ ${getTotal(
                  formik?.values?.invoiceData,
                  'amount_received',
                )}`,
                keyColor: Colors().aprroved,
              },
              {
                key: 'Difference',
                value: `₹ ${(
                  formik?.values?.pv_amount -
                  getTotal(formik?.values?.invoiceData, 'amount_received')
                ).toFixed(2)}`,
                keyColor: Colors().red,
              },
            ]}
          />

          <FlatList
            data={formik?.values?.invoiceData}
            renderItem={renderItem}
            keyExtractor={(_, index) => {
              return index.toString();
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            // contentContainerStyle={{paddingBottom: 250}}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={renderEmptyComponent}
          />
        </View>
      ) : ListData?.isError ? (
        <View style={{height: WINDOW_HEIGHT * 0.9}}>
          <InternalServer />
        </View>
      ) : !ListData?.data?.status &&
        ListData?.data?.message == 'Data not found' ? (
        <View style={{height: WINDOW_HEIGHT * 0.9}}>
          <DataNotFound />
          {/* View for floating button */}
        </View>
      ) : (
        <View style={{height: WINDOW_HEIGHT * 0.9}}>
          <InternalServer></InternalServer>
        </View>
      )}
    </>
  );
};

export default CreatePaymentForm;

const styles = StyleSheet.create({
  twoItemView: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  cardHeadingTxt: {
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  twoTextInput: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: WINDOW_WIDTH * 0.9,
    columnGap: 10,
  },
  firstInput: {
    flexDirection: 'row',
    flex: 1,
    maxWidth: '50%',
  },
  secondInput: {
    flexDirection: 'row',
    flex: 1,
    maxWidth: '50%',
  },
  allDeductionView: {
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'wrap',
  },

  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    flexShrink: 1,
    fontFamily: Colors().fontFamilyBookMan,
  },
  inputText2: {
    height: 20,
    padding: 1,
    paddingLeft: 5,
    alignSelf: 'center',
    color: Colors().pureBlack,
    justifyContent: 'center',
    flexShrink: 1,
  },
});
