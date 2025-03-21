import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomeCard from '../../../component/CustomeCard';
import Colors from '../../../constants/Colors';
import DropDownItem from '../../../component/DropDownItem';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {useDispatch} from 'react-redux';
import {WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import moment from 'moment';
import {getAllFinacialYearList} from '../../../redux/slices/master-data-management/financial-year/getFinacialYearListSlice';
import Toast from 'react-native-toast-message';
import PtmItemList from '../measurements/PtmItemList';
import NeumorphCard from '../../../component/NeumorphCard';
import {TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  getItemListofInoviceItem,
  getPerormaListBasedonIds,
} from '../../../redux/slices/billing management/inovice/addUpdateInvoiceSlice';
import MultiSelectComponent from '../../../component/MultiSelectComponent';

const InoviceForm = ({formik, type, edit_id, edit}) => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [allItem, setAllItem] = useState([]);
  const [itemListData, setItemListData] = useState([]);
  const [openPoDate, setOpenPoDate] = useState(false);
  const [showTable, setShowTable] = useState([]);
  const [selectedFinYear, setSelectedFinYear] = useState('');

  useEffect(() => {
    fetchAllFinancialYear();

    if (formik?.values?.measurementIds) {
      fetchAllPerformaItem();
    }
  }, [formik?.values?.measurementIds]);

  useEffect(() => {
    if (formik?.values?.pi_id && allItem) {
      const filteredData = allItem.filter(item =>
        formik?.values?.pi_id.includes(item.value),
      );

      if (filteredData.length > 0) {
        const rData = filteredData.map(itm => {
          fetchMeasurementItemList(itm?.value, formik?.values?.pi_id);
        });
      } else {
        setItemListData([]);
      }
    }
  }, [formik?.values?.pi_id, allItem]);

  /*fucnction for fetching Financial year*/
  const fetchAllFinancialYear = async () => {
    const result = await dispatch(
      getAllFinacialYearList({search: ''}),
    ).unwrap();

    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.year_name,
          value: itm?.year_name,
          start_date: itm?.start_date,
          end_date: itm?.end_date,
        };
      });

      setAllFinancialYear(rData);
    } else {
      setAllFinancialYear([]);
    }
  };

  /*fucnction for fetching all Measurement item list*/
  const fetchAllPerformaItem = async () => {
    const reqBody = {
      id: formik?.values?.measurementIds,
    };
    const result = await dispatch(getPerormaListBasedonIds(reqBody)).unwrap();

    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.bill_no,
          value: itm?.id,
        };
      });

      setAllItem(rData);
    } else {
      setAllItem([]);
    }
  };

  /*fucnction for fetching all item list of  Measurement item*/
  const fetchMeasurementItemList = async (measurementid, selectedPiID) => {
    const result = await dispatch(
      getItemListofInoviceItem(measurementid),
    ).unwrap();

    if (result?.status) {
      setItemListData(prevItemListData => {
        const newData = result?.data ? [result.data] : [];
        const data = [...prevItemListData, ...newData];

        const filteredData = Array.from(
          new Map(data.map(item => [item?.pi_id, item])).values(),
        ).filter(item => selectedPiID.includes(item?.pi_id));

        return filteredData;
      });
    } else {
      setItemListData([]);
      Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
    }
  };
  // Check if the current date is within the financial year
  const isCurrentFinancialYear = item => {
    const currentDate = new Date();
    return (
      currentDate >= new Date(item?.start_date) &&
      currentDate <= new Date(item?.end_date)
    );
  };
  const getSelectedFinYear = () => {
    const finYearData = allFinancialYear.find(
      itm => itm?.value == selectedFinYear,
    );

    return finYearData;
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    const {index, idx, idx1} = actionButton?.itemData;
    switch (actionButton.typeOfButton) {
      case 'list':
        setShowTable(prevState => {
          const newState = {...prevState};

          // Reset all inner arrays to be false
          Object.keys(newState).forEach(key => {
            newState[key] = newState[key].map(subArray =>
              subArray.map(() => false),
            );
          });

          // Toggle the specific item
          if (newState[index] && newState[index][idx]) {
            newState[index][idx][idx1] = !prevState[index][idx][idx1];
          } else {
            newState[index] = newState[index] || [];
            newState[index][idx] = new Array(
              actionButton?.itemData[idx]?.items_data.length,
            )
              .fill(false)
              .map(() =>
                new Array(actionButton?.itemData[idx1]?.items_data.length).fill(
                  false,
                ),
              );
            newState[index][idx][idx1] = true;
          }

          return newState;
        });
        break;

      default:
        break;
    }
  };

  return (
    <View>
      {/* card for po detail*/}
      <CustomeCard
        headerName={'Inovoice detail'}
        data={[
          {
            component: (
              <View style={styles.twoItemView}>
                <Text
                  style={[styles.cardHeadingTxt, {color: Colors().pureBlack}]}>
                  financial year :{' '}
                </Text>

                <View style={{flex: 1, height: 20}}>
                  <Dropdown
                    data={allFinancialYear}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.financial_year}
                    activeColor={Colors().skyBule}
                    renderItem={item => (
                      <DropDownItem item={item}></DropDownItem>
                    )}
                    disable={type == 'approve'}
                    placeholderStyle={[
                      styles.inputText,
                      {color: Colors().pureBlack},
                    ]}
                    selectedTextStyle={[
                      styles.selectedTextStyle,
                      {color: Colors().pureBlack},
                    ]}
                    style={[styles.inputText, {color: Colors().pureBlack}]}
                    containerStyle={{
                      backgroundColor: Colors().inputLightShadow,
                    }}
                    onChange={val => {
                      formik.setFieldValue(`financial_year`, val?.value);

                      setSelectedFinYear(val?.value);
                      const finYearData = allFinancialYear.find(
                        itm => itm?.value === val?.value,
                      );
                      formik.setFieldValue(
                        'invoice_date',
                        isCurrentFinancialYear(finYearData)
                          ? moment().format('YYYY-MM-DD')
                          : finYearData.end_date,
                      );
                    }}
                  />
                </View>
                {!formik.values?.financial_year && (
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
            component: (
              <View style={styles.twoItemView}>
                <Text
                  style={[styles.cardHeadingTxt, {color: Colors().pureBlack}]}>
                  inovice dates :{' '}
                </Text>

                <View style={{flex: 1}}>
                  <NeumorphDatePicker
                    height={38}
                    width={WINDOW_WIDTH * 0.6}
                    withoutShadow={true}
                    iconPress={() =>
                      isCurrentFinancialYear(getSelectedFinYear()) &&
                      setOpenPoDate(!openPoDate)
                    }
                    valueOfDate={
                      formik?.values?.invoice_date
                        ? moment(formik?.values?.invoice_date).format(
                            'DD/MM/YYYY',
                          )
                        : moment().format('DD/MM/YYYY')
                    }
                    modal
                    {...(getSelectedFinYear()
                      ? {
                          minimumDate: new Date(
                            getSelectedFinYear()?.start_date,
                          ),
                        }
                      : {})}
                    {...(getSelectedFinYear()
                      ? {
                          maximumDate: new Date(getSelectedFinYear()?.end_date),
                        }
                      : {})}
                    open={openPoDate}
                    date={new Date()}
                    mode="date"
                    onConfirm={date => {
                      formik.setFieldValue(`invoice_date`, date);

                      setOpenPoDate(false);
                    }}
                    onCancel={() => {
                      setOpenPoDate(false);
                    }}></NeumorphDatePicker>
                </View>
                {!formik.values?.invoice_date && (
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
            key: 'call up Number',
            component: (
              <View
                style={{
                  flexDirection: 'row',
                  flex: 1,
                  justifyContent: 'space-between',
                }}>
                <TextInput
                  placeholder="TYPE..."
                  placeholderTextColor={Colors().gray2}
                  style={[
                    styles.inputText,
                    {
                      height: 20,
                      padding: 1,
                      paddingLeft: 5,
                      alignSelf: 'center',
                      color: Colors().pureBlack,
                      justifyContent: 'center',
                      flexShrink: 1,
                    },
                  ]}
                  value={formik?.values?.callup_number}
                  onChangeText={formik.handleChange('callup_number')}
                />
              </View>
            ),
          },
        ]}
      />

      <View style={{flexDirection: 'row'}}>
        <MultiSelectComponent
          title={'Measurement list'}
          placeHolderTxt={'select....'}
          required={true}
          data={allItem}
          value={formik?.values?.pi_id}
          inside={false}
          onChange={item => {
            formik.setFieldValue(`pi_id`, item);
          }}
          errorMessage={formik?.errors?.pi_id}
        />

        <View>
          {formik.values?.pi_id.length == 0 && (
            <View
              style={{
                alignSelf: 'center',
                marginRight: 20,
                marginTop: 10,
              }}>
              <Icon
                name="asterisk"
                type={IconType.FontAwesome}
                size={8}
                color={Colors().red}
              />
            </View>
          )}
        </View>
      </View>
      {itemListData?.map((item, index) => {
        return (
          <View key={index}>
            <Text
              style={[
                styles.cardHeadingTxt,

                {fontSize: 15, color: Colors().skyBule, alignSelf: 'center'},
              ]}>
              Pi no: {item?.bill_no}
            </Text>
            {item?.getMeasurements.map((itm, idx) => {
              return (
                <View key={idx}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginHorizontal: WINDOW_WIDTH * 0.03,
                    }}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {fontSize: 15, color: Colors().pending},
                      ]}>
                      {'compplaint no - '}
                      {itm?.complaintDetails?.complaint_unique_id}
                    </Text>
                    <NeumorphCard
                      lightShadowColor={Colors().darkShadow2}
                      darkShadowColor={Colors().lightShadow}>
                      <Icon
                        name={'edit'}
                        type={IconType.Feather}
                        color={Colors().aprroved}
                        style={styles.actionIcon}
                        onPress={() => {
                          navigation.navigate('AddUpdateMeasurementScreen', {
                            pi_id: itm.po_number,
                            edit_id: itm?.measurement_list,
                            type: 'readytopi',
                          });
                        }}
                      />
                    </NeumorphCard>
                  </View>

                  {itm?.items_data.map((itm1, idx1) => {
                    return (
                      <View key={idx1}>
                        <CustomeCard
                          allData={{itm1, index, idx, idx1, showTable}}
                          data={[
                            {
                              key: 'item name',
                              value: itm1?.item_name || '--',
                              keyColor: Colors().skyBule,
                            },
                            {
                              component: (
                                <View
                                  style={[
                                    styles.twoItemView,
                                    {
                                      justifyContent: 'space-between',
                                      gap: 10,
                                      flexWrap: 'wrap',
                                    },
                                  ]}>
                                  <View style={{flexDirection: 'row'}}>
                                    <Text
                                      style={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}>
                                      order line no :
                                    </Text>

                                    <Text
                                      style={[
                                        styles.cardHeadingTxt,
                                        {
                                          color: Colors().pureBlack,
                                          flexShrink: 1,
                                        },
                                      ]}>
                                      {itm1?.order_line_number ?? '----'}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                    }}>
                                    <Text
                                      style={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}>
                                      unit :
                                    </Text>

                                    <Text
                                      style={[
                                        styles.cardHeadingTxt,
                                        {
                                          color: Colors().pureBlack,
                                          flexShrink: 1,
                                        },
                                      ]}>
                                      {itm1?.unit || '--'}
                                    </Text>
                                  </View>
                                </View>
                              ),
                            },
                            {
                              component: (
                                <View
                                  style={[
                                    styles.twoItemView,
                                    {
                                      justifyContent: 'space-between',
                                      gap: 10,
                                      flexWrap: 'wrap',
                                    },
                                  ]}>
                                  <View style={{flexDirection: 'row'}}>
                                    <Text
                                      style={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}>
                                      HSN CODE :
                                    </Text>

                                    <Text
                                      style={[
                                        styles.cardHeadingTxt,
                                        {
                                          color: Colors().pureBlack,
                                          flexShrink: 1,
                                        },
                                      ]}>
                                      {itm1?.hsn_code}
                                    </Text>
                                  </View>
                                  <View
                                    style={{
                                      flexDirection: 'row',
                                    }}>
                                    <Text
                                      style={[
                                        styles.cardHeadingTxt,
                                        {color: Colors().pureBlack},
                                      ]}>
                                      Rate :
                                    </Text>

                                    <Text
                                      style={[
                                        styles.cardHeadingTxt,
                                        {
                                          color: Colors().aprroved,
                                          flexShrink: 1,
                                        },
                                      ]}>
                                      ₹ {itm1?.rate || 0}
                                    </Text>
                                  </View>
                                </View>
                              ),
                            },

                            {
                              key: 'total qty',
                              component: (
                                <View
                                  style={[
                                    styles.twoItemView,
                                    {justifyContent: 'space-between'},
                                  ]}>
                                  <Text
                                    style={[
                                      styles.cardHeadingTxt,
                                      {color: Colors().pureBlack},
                                    ]}>
                                    {itm1?.total_qty || 0}
                                  </Text>
                                </View>
                              ),
                            },
                          ]}
                          status={[
                            {
                              key: 'Amount',

                              value:
                                itm1?.rate && itm1?.total_qty
                                  ? `₹ ${(itm1?.rate * itm1?.total_qty).toFixed(
                                      2,
                                    )}`
                                  : `₹ 0`,
                              color: Colors().aprroved,
                            },
                          ]}
                          listButton={true}
                          action={handleAction}
                        />

                        {showTable[index] &&
                          showTable[index][idx] &&
                          showTable[index][idx][idx1] && (
                            <PtmItemList data={itm1} />
                          )}
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export default InoviceForm;

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
  actionIcon: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  selectedTextStyle: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    flexShrink: 1,
    fontFamily: Colors().fontFamilyBookMan,
  },
  dropdown: {
    marginLeft: 10,
    flex: 1,
  },
  placeholderStyle: {
    fontSize: 16,
    marginLeft: 10,
    paddingVertical: 10,
  },
  selectedTextStyle: {
    fontSize: 14,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  iconStyle: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  selectedStyle: {
    borderRadius: 12,
  },
});
