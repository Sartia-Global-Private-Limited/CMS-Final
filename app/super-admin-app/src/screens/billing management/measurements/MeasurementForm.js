import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomeCard from '../../../component/CustomeCard';
import Colors from '../../../constants/Colors';
import DropDownItem from '../../../component/DropDownItem';
import {Dropdown, MultiSelect} from 'react-native-element-dropdown';
import {useDispatch} from 'react-redux';
import {getAllPoList} from '../../../redux/slices/commonApi';
import {Badge, Icon} from '@rneui/themed';
import IconType from '../../../constants/IconType';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import {WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import moment from 'moment';
import {getComlaintDetailById} from '../../../redux/slices/complaint/getComplaintDetailSlice';
import {getAllFinacialYearList} from '../../../redux/slices/master-data-management/financial-year/getFinacialYearListSlice';
import {getPurchaseOrderDetailByPoId} from '../../../redux/slices/billing management/measurement/addUpdateMeasurementSlice';
import MeasurementItemList from './MeasurementItemList';
import MultiSelectComponent from '../../../component/MultiSelectComponent';

const MeasurementForm = ({formik, type, edit_id, edit}) => {
  const dispatch = useDispatch();
  const complaintId = formik?.values?.complaint_id;
  const totalQtyRef = useRef();

  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [allPo, setAllPo] = useState([]);
  const [allItem, setAllItem] = useState([]);
  const [openPoDate, setOpenPoDate] = useState(false);
  const [showTable, setShowTable] = useState([]);
  const [poLimit, setPoLimit] = useState('');
  const [poUsedAmount, setPoUsedAmount] = useState('');
  const [selectedFinYear, setSelectedFinYear] = useState('');

  useEffect(() => {
    if (edit) {
      const totalQty = edit?.items_data?.map(itm => itm?.total_qty);
      totalQtyRef.current = totalQty;
    }
  }, [edit]);

  useEffect(() => {
    if (type == 'ptm') {
      fetchComplaintDetail();
    }

    fetchAllFinancialYear();
    fetchAllPoDetail();
    if (type !== 'ptm') {
      handlePoChange(formik?.values?.po_id);
    }
  }, [formik?.values?.items_data]);

  /* function for fetching complaint details*/
  const fetchComplaintDetail = async () => {
    const result = await dispatch(getComlaintDetailById(complaintId)).unwrap();
    if (result?.status) {
      const {
        regionalOffices,
        saleAreas,
        outlets,
        energy_company_id,
        complaint_for,
        complaint_unique_id,
      } = result?.data;

      formik.setFieldValue(`ro_office_id`, regionalOffices[0]);
      if (complaint_for == '1') {
        formik.setFieldValue(`outlet_id`, outlets[0] || '');
      }

      formik.setFieldValue(`sale_area_id`, saleAreas[0]);
      formik.setFieldValue(`energy_company_id`, energy_company_id);
      formik.setFieldValue(`complaint_for`, complaint_for);
      formik.setFieldValue(`complaint_unique_id`, complaint_unique_id);
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
  const getSelecteFinYear = () => {
    const finYearData = allFinancialYear.find(
      itm => itm?.value == selectedFinYear,
    );

    return finYearData;
  };

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
  /*fucnction for fetching sales company*/
  const fetchAllPoDetail = async () => {
    const result = await dispatch(getAllPoList()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.po_number,
          value: itm?.id,
          po_for: itm?.po_for,
        };
      });
      setAllPo(rData);
    } else {
      setAllPo([]);
    }
  };
  /*fucnction for fetching state */
  const handlePoChange = async poId => {
    const result = await dispatch(getPurchaseOrderDetailByPoId(poId)).unwrap();
    if (result?.status) {
      // setPoLimit(result?.data?.po_limit);
      // setPoUsedAmount(result?.data?.po_used_amount);
      formik.setFieldValue(`poLimit`, result?.data?.po_limit);
      formik.setFieldValue(`poUsedAmount`, result?.data?.po_used_amount);

      const rData = result?.data?.po_items?.map(itm => {
        return {
          label: itm?.name,
          value: itm?.order_line_number,
          order_line_number: itm?.order_line_number,
          hsn_code: itm?.hsn_code,
          unit: itm?.unit,
          rate: itm?.rate,
          remaining_quantity: itm?.remaining_quantity,
        };
      });
      setAllItem(rData);
    } else {
      setAllItem([]);
    }
  };
  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    const {index, idx} = actionButton?.itemData;
    switch (actionButton.typeOfButton) {
      case 'list':
        if (!formik?.values?.items_data[index].childArray) {
          formik.setFieldValue(`items_data.${index}.childArray`, [
            {
              description: '',
              no: '',
              length: '',
              breadth: '',
              depth: '',
              qty: '',
            },
          ]);
        }

        setShowTable(prevState => {
          // Initialize the state if it's empty or the index is out of bounds
          const newState = [...prevState];
          if (newState.length <= index) {
            for (let i = newState.length; i <= index; i++) {
              newState.push(false);
            }
          }
          // Reverse the value of the given index
          newState[index] = !newState[index];
          // If remaining indices are true, make them false
          for (let i = 0; i < newState.length; i++) {
            if (i !== index && newState[i] === true) {
              newState[i] = false;
            }
          }
          return newState;
        });
        break;

      default:
        break;
    }
  };

  /*function for checking error only for with qty*/
  const checkTotalQuantityError = (data, index) => {
    const {total_qty, remaining_quantity} = data;
    if (edit_id) {
      if (
        parseInt(totalQtyRef.current[index]) + remaining_quantity <
        total_qty
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      if (remaining_quantity < total_qty) {
        return true;
      } else {
        return false;
      }
    }
  };

  return (
    <View>
      {/* card for complaint detail */}
      <CustomeCard
        headerName={'Complaint detail'}
        data={[
          {
            key: 'Complaint Number',
            value: formik?.values?.complaint_unique_id,
            keyColor: Colors().skyBule,
          },
          {
            key: 'Regional office',
            value: formik?.values?.ro_office_id?.regional_office_name,
          },
          {
            key: 'Sales Area',
            value: formik?.values?.sale_area_id?.sales_area_name,
          },

          {
            key: 'outlet',
            value: formik?.values?.outlet_id?.outlet_name,
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
                        'measurement_date',
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
                  Measurement dates :{' '}
                </Text>

                <View style={{flex: 1}}>
                  <NeumorphDatePicker
                    height={38}
                    width={WINDOW_WIDTH * 0.46}
                    withoutShadow={true}
                    iconPress={() =>
                      isCurrentFinancialYear(getSelecteFinYear()) &&
                      setOpenPoDate(!openPoDate)
                    }
                    valueOfDate={
                      formik?.values?.measurement_date
                        ? moment(formik?.values?.measurement_date).format(
                            'DD/MM/YYYY',
                          )
                        : moment().format('DD/MM/YYYY')
                    }
                    modal
                    {...(getSelecteFinYear()
                      ? {
                          minimumDate: new Date(
                            getSelecteFinYear()?.start_date,
                          ),
                        }
                      : {})}
                    {...(getSelecteFinYear()
                      ? {
                          maximumDate: new Date(getSelecteFinYear()?.end_date),
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
                  po Number :{' '}
                </Text>

                <View style={{flex: 1, height: 20}}>
                  <Dropdown
                    data={allPo}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.po_id}
                    activeColor={Colors().skyBule}
                    renderItem={item => (
                      <DropDownItem item={item}></DropDownItem>
                    )}
                    disable={type != 'ptm'}
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
                      formik.setFieldValue(`po_id`, val?.value);
                      handlePoChange(val?.value);
                      formik.setFieldValue(`po_for`, val?.po_for);
                    }}
                  />
                </View>
                {!formik.values?.po_id && (
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
          ...(formik?.values?.po_id
            ? [
                {
                  key: 'Po limit',
                  value: `₹ ${formik.values?.poLimit || 0}`,
                  keyColor: Colors().aprroved,
                },
              ]
            : []),

          ...(formik?.values?.po_id
            ? [
                {
                  key: 'Po Used Amount',
                  value: `₹ ${formik.values?.poUsedAmount || 0}`,
                  keyColor: Colors().pending,
                },
              ]
            : []),
          ...(formik?.values?.po_id
            ? [
                {
                  key: 'Remaining amount',
                  value: `₹ ${
                    formik.values?.poLimit - formik.values?.poUsedAmount
                  }`,
                  keyColor: Colors().red,
                },
              ]
            : []),
        ]}
      />

      <View style={{marginHorizontal: WINDOW_WIDTH * 0.03}}>
        <MultiSelectComponent
          title={'Measurement list'}
          placeHolderTxt={`Select item ...${
            formik.values.po_for == '1'
              ? 'with quantity'
              : formik.values.po_for == '2'
              ? 'without qty'
              : ''
          }`}
          required={true}
          data={allItem}
          value={formik.values.items_id}
          inside={false}
          onChange={e => {
            formik.setFieldValue(`items_id`, e);

            const filteredData = allItem.filter(item => e.includes(item.value));

            const rData = filteredData.map(itm => {
              return {
                item_name: itm?.label,
                item_id: itm?.value,
                order_line_number: itm?.order_line_number,
                hsn_code: itm?.hsn_code,
                unit: itm?.unit,
                rate: itm?.rate,
                remaining_quantity: itm?.remaining_quantity,
                total_qty: 0,
              };
            });

            formik.setFieldValue('items_data', rData);
          }}
          errorMessage={formik?.errors?.items_id}
        />
      </View>

      {formik?.values?.items_data?.map((item, index) => {
        return (
          <View key={index}>
            <CustomeCard
              allData={{item, index, showTable}}
              data={[
                {
                  key: 'item name',
                  value: item?.item_name || '--',
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
                            {color: Colors().pureBlack, flexShrink: 1},
                          ]}>
                          {item?.order_line_number ?? '----'}
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
                            {color: Colors().pureBlack, flexShrink: 1},
                          ]}>
                          {item?.unit || '--'}
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
                            {color: Colors().pureBlack, flexShrink: 1},
                          ]}>
                          {item?.hsn_code}
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
                            {color: Colors().aprroved, flexShrink: 1},
                          ]}>
                          ₹ {item?.rate || 0}
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
                        {item?.total_qty || 0}
                      </Text>

                      {formik?.values?.po_for == '1' &&
                        item?.childArray &&
                        checkTotalQuantityError(item, index) && (
                          <View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'center',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={[
                                styles.cardHeadingTxt,
                                {color: Colors().red},
                              ]}>
                              Max value
                            </Text>
                            <Badge
                              value={
                                edit_id
                                  ? parseInt(totalQtyRef.current[index]) +
                                    item?.remaining_quantity
                                  : item?.remaining_quantity
                              }
                              status={'error'}
                              containerStyle={{marginLeft: 10}}
                              textStyle={{fontSize: 10, alignSelf: 'center'}}
                            />
                          </View>
                        )}
                    </View>
                  ),
                },
              ]}
              status={[
                {
                  key: 'Amount',

                  value: item?.amount ? `₹ ${item?.amount.toFixed(2)}` : `₹ 0`,
                  color: Colors().aprroved,
                },
              ]}
              listButton={true}
              action={handleAction}
            />
            {showTable[index] && showTable[index] && (
              <MeasurementItemList data={item} formik={formik} index={index} />
            )}
          </View>
        );
      })}
    </View>
  );
};

export default MeasurementForm;

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
