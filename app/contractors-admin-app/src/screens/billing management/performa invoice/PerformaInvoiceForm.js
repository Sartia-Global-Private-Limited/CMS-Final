/*    ----------------Created Date :: 2 - July -2024   ----------------- */
import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CustomeCard from '../../../component/CustomeCard';
import Colors from '../../../constants/Colors';
import DropDownItem from '../../../component/DropDownItem';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { useDispatch } from 'react-redux';
import {
  getAllMyCompanyList,
  getAllStateList,
} from '../../../redux/slices/commonApi';
import { Badge, Icon } from '@rneui/themed';
import IconType from '../../../constants/IconType';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import { WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import moment from 'moment';
import { getAllFinacialYearList } from '../../../redux/slices/master-data-management/financial-year/getFinacialYearListSlice';
import {
  getAllMeasurementItemListPi,
  getItemListofMeasurementItemPi,
} from '../../../redux/slices/billing management/performa invoice/addUpdatePerformaInvoiceSlice';
import Toast from 'react-native-toast-message';
import PtmItemList from '../measurements/PtmItemList';
import NeumorphCard from '../../../component/NeumorphCard';
import { TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MultiSelectComponent from '../../../component/MultiSelectComponent';

const PerformaInvoiceForm = ({ formik, type, edit_id, edit }) => {
  const dispatch = useDispatch();
  const complaintId = formik?.values?.complaint_id;
  const totalQtyRef = useRef();
  const navigation = useNavigation();

  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [allState, setAllState] = useState([]);
  const [allCompany, setAllCompnay] = useState([]);
  const [allItem, setAllItem] = useState([]);
  const [itemListData, setItemListData] = useState([]);
  const [openPoDate, setOpenPoDate] = useState(false);
  const [showTable, setShowTable] = useState([]);
  const [selectedFinYear, setSelectedFinYear] = useState('');

  useEffect(() => {
    fetchAllMyCompany();
    fetchAllFinancialYear();
    fetchAllStateDetail();
    if (formik.values.measurementIds) {
      fetchAllMeasurementItem();
    }
  }, [formik.values.measurementIds]);

  useEffect(() => {
    if (formik.values.complaint_id && allItem) {
      const filteredData = allItem.filter(item =>
        formik.values.complaint_id.includes(item.value),
      );
      if (filteredData.length > 0) {
        const rData = filteredData.map(itm => {
          fetchMeasurementItemList(
            itm?.measurement_id,
            formik.values.complaint_id,
          );
          return {
            measurement_list: itm?.measurement_id,
          };
        });

        formik.setFieldValue('measurements', rData);
      } else {
        setItemListData([]);
      }
    }
  }, [formik.values.complaint_id, allItem]);

  /* function for fetching for all company list*/
  const fetchAllMyCompany = async () => {
    const result = await dispatch(getAllMyCompanyList()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.company_name,
          value: itm?.company_id,
        };
      });

      setAllCompnay(rData);
    } else {
      setAllCompnay([]);
    }
  };

  /*fucnction for fetching Financial year*/
  const fetchAllFinancialYear = async () => {
    const result = await dispatch(
      getAllFinacialYearList({ search: '' }),
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
  /*fucnction for fetching all state*/
  const fetchAllStateDetail = async () => {
    const result = await dispatch(getAllStateList()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.name,
          value: itm?.id,
        };
      });
      setAllState(rData);
    } else {
      setAllState([]);
    }
  };
  /*fucnction for fetching all Measurement item list*/
  const fetchAllMeasurementItem = async () => {
    const result = await dispatch(
      getAllMeasurementItemListPi({
        poId: formik.values?.po_number.value,
        measurementIds: formik.values?.measurementIds,
      }),
    ).unwrap();

    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.complaint_unique_id,
          value: itm?.complaint_id,
          measurement_id: itm?.measurement_id,
        };
      });

      setAllItem(rData);
    } else {
      setAllItem([]);
    }
  };

  /*fucnction for fetching all item list of  Measurement item*/
  const fetchMeasurementItemList = async (measurementid, complaintIds) => {
    const result = await dispatch(
      getItemListofMeasurementItemPi(measurementid),
    ).unwrap();

    if (result?.status) {
      setItemListData(prevItemListData => {
        // Ensure result?.data is wrapped in an array
        const newData = result?.data ? [result?.data] : [];
        let data = [...prevItemListData, ...newData];

        const filteredData = [
          ...new Map(
            data
              .filter(item => complaintIds.includes(item.complaintDetails?.id))
              .map(item => [item.measurement_list, item]),
          ).values(),
        ];

        return filteredData;
      });
    } else {
      setItemListData([]);
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
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
    const { index, idx } = actionButton?.itemData;
    switch (actionButton.typeOfButton) {
      case 'list':
        setShowTable(prevState => {
          const newState = { ...prevState };
          // Reset all inner arrays to be false
          Object.keys(newState).forEach(key => {
            newState[key] = new Array(
              actionButton?.itemData[key]?.items_data.length,
            ).fill(false);
          });
          // Toggle the specific item
          if (newState[index]) {
            newState[index][idx] = !prevState[index][idx];
          } else {
            newState[index] = new Array(
              actionButton?.itemData[idx]?.items_data.length,
            ).fill(false);
            newState[index][idx] = true;
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
      {/* card for complaint detail */}
      <CustomeCard
        headerName={'Billing detail'}
        data={[
          {
            component: (
              <View style={styles.twoItemView}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { color: Colors().pureBlack },
                  ]}>
                  from:{' '}
                </Text>

                <View style={{ flex: 1, height: 20 }}>
                  <Dropdown
                    data={allCompany}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.billing_from}
                    activeColor={Colors().skyBule}
                    renderItem={item => (
                      <DropDownItem item={item}></DropDownItem>
                    )}
                    disable={type == 'approve'}
                    placeholderStyle={[
                      styles.inputText,
                      { color: Colors().pureBlack },
                    ]}
                    selectedTextStyle={[
                      styles.selectedTextStyle,
                      { color: Colors().pureBlack },
                    ]}
                    style={[styles.inputText, { color: Colors().pureBlack }]}
                    containerStyle={{
                      backgroundColor: Colors().inputLightShadow,
                    }}
                    onChange={val => {
                      formik.setFieldValue(`billing_from`, val?.value);
                    }}
                  />
                </View>
                {!formik.values?.billing_from && (
                  <View style={{ alignSelf: 'center' }}>
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
                    { color: Colors().pureBlack },
                  ]}>
                  from state:{' '}
                </Text>

                <View style={{ flex: 1, height: 20 }}>
                  <Dropdown
                    data={allState}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.billing_from_state}
                    activeColor={Colors().skyBule}
                    renderItem={item => (
                      <DropDownItem item={item}></DropDownItem>
                    )}
                    disable={type == 'approve'}
                    placeholderStyle={[
                      styles.inputText,
                      { color: Colors().pureBlack },
                    ]}
                    selectedTextStyle={[
                      styles.selectedTextStyle,
                      { color: Colors().pureBlack },
                    ]}
                    style={[styles.inputText, { color: Colors().pureBlack }]}
                    containerStyle={{
                      backgroundColor: Colors().inputLightShadow,
                    }}
                    onChange={val => {
                      formik.setFieldValue(`billing_from_state`, val?.value);
                    }}
                  />
                </View>
                {!formik.values?.billing_from_state && (
                  <View style={{ alignSelf: 'center' }}>
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
            key: 'To',
            value: formik.values.billing_to?.label,
          },
          {
            key: 'to Ro',
            value: formik.values.billing_to_ro_office?.label,
          },
        ]}
      />
      {/* card for po detail*/}
      <CustomeCard
        headerName={'Po detail'}
        data={[
          {
            component: (
              <View style={styles.twoItemView}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { color: Colors().pureBlack },
                  ]}>
                  financial year :{' '}
                </Text>

                <View style={{ flex: 1, height: 20 }}>
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
                      { color: Colors().pureBlack },
                    ]}
                    selectedTextStyle={[
                      styles.selectedTextStyle,
                      { color: Colors().pureBlack },
                    ]}
                    style={[styles.inputText, { color: Colors().pureBlack }]}
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
                        'measurement_date',
                        isCurrentFinancialYear(finYearData)
                          ? moment().format('YYYY-MM-DD')
                          : finYearData.end_date,
                      );
                    }}
                  />
                </View>
                {!formik.values?.financial_year && (
                  <View style={{ alignSelf: 'center' }}>
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
                    { color: Colors().pureBlack },
                  ]}>
                  Measurement dates :{' '}
                </Text>

                <View style={{ flex: 1 }}>
                  <NeumorphDatePicker
                    height={38}
                    width={WINDOW_WIDTH * 0.46}
                    withoutShadow={true}
                    iconPress={() =>
                      isCurrentFinancialYear(getSelectedFinYear()) &&
                      setOpenPoDate(!openPoDate)
                    }
                    valueOfDate={
                      formik.values.measurement_date
                        ? moment(formik.values.measurement_date).format(
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
                      formik.setFieldValue(`measurement_date`, date);

                      setOpenPoDate(false);
                    }}
                    onCancel={() => {
                      setOpenPoDate(false);
                    }}></NeumorphDatePicker>
                </View>
                {!formik.values?.measurement_date && (
                  <View style={{ alignSelf: 'center' }}>
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
            key: 'Po Number',
            value: formik.values.po_number?.label,
          },
          {
            key: 'work',
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
                  value={formik.values.work}
                  onChangeText={formik.handleChange('work')}
                />
                {!formik.values.work && (
                  <View style={{ alignSelf: 'center' }}>
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
        ]}
      />

      <View style={{ flexDirection: 'row' }}>
        <View style={{ flex: 1, marginHorizontal: WINDOW_WIDTH * 0.03 }}>
          <MultiSelectComponent
            title={'Measurement list'}
            placeHolderTxt={`Measurement list ...`}
            required={true}
            data={allItem}
            value={formik.values.complaint_id}
            inside={false}
            onChange={e => {
              formik.setFieldValue(`complaint_id`, e);
            }}
            errorMessage={formik?.errors?.complaint_id}
          />
        </View>
      </View>

      {itemListData.map((item, index) => {
        return (
          <View key={index}>
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
                  { fontSize: 15, color: Colors().pending },
                ]}>
                {'complaint id - '}
                {item?.complaintDetails.complaint_unique_id}
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
                      complaint_id: formik.values.po_number.value,
                      edit_id: item?.measurement_list,
                      type: 'readytopi',
                    });
                  }}
                />
              </NeumorphCard>
            </View>

            {item?.items_data.map((itm, idx) => {
              return (
                <View key={idx}>
                  <CustomeCard
                    allData={{ itm, index, idx, showTable }}
                    data={[
                      {
                        key: 'item name',
                        value: itm?.item_name || '--',
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
                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().pureBlack },
                                ]}>
                                order line no :
                              </Text>

                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().pureBlack, flexShrink: 1 },
                                ]}>
                                {itm?.order_line_number ?? '----'}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().pureBlack },
                                ]}>
                                unit :
                              </Text>

                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().pureBlack, flexShrink: 1 },
                                ]}>
                                {itm?.unit || '--'}
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
                            <View style={{ flexDirection: 'row' }}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().pureBlack },
                                ]}>
                                HSN CODE :
                              </Text>

                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().pureBlack, flexShrink: 1 },
                                ]}>
                                {itm?.hsn_code}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().pureBlack },
                                ]}>
                                Rate :
                              </Text>

                              <Text
                                style={[
                                  styles.cardHeadingTxt,
                                  { color: Colors().aprroved, flexShrink: 1 },
                                ]}>
                                ₹ {itm?.rate || 0}
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
                              { justifyContent: 'space-between' },
                            ]}>
                            <Text
                              style={[
                                styles.cardHeadingTxt,
                                { color: Colors().pureBlack },
                              ]}>
                              {itm?.total_qty || 0}
                            </Text>
                          </View>
                        ),
                      },
                    ]}
                    status={[
                      {
                        key: 'Amount',

                        value:
                          itm?.rate && itm?.total_qty
                            ? `₹ ${(itm?.rate * itm?.total_qty).toFixed(2)}`
                            : `₹ 0`,
                        color: Colors().aprroved,
                      },
                    ]}
                    listButton={true}
                    action={handleAction}
                  />

                  {showTable[index] && showTable[index][idx] && (
                    <PtmItemList data={itm} />
                  )}
                </View>
              );
            })}
          </View>
        );
      })}
    </View>
  );
};

export default PerformaInvoiceForm;

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
