import { StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import CustomeCard from '../../component/CustomeCard';
import Colors from '../../constants/Colors';
import DropDownItem from '../../component/DropDownItem';
import { Dropdown, MultiSelect } from 'react-native-element-dropdown';
import { useDispatch } from 'react-redux';
import {
  getAllActiveCompanyList,
  getAllCompanyList,
  getAllComplaintList,
  getAllPoList,
  getAllRegionalOffice,
  getAllStateList,
  getOutletBySaId,
  getSalesRAOnRoId,
} from '../../redux/slices/commonApi';
import { Icon } from '@rneui/themed';
import IconType from '../../constants/IconType';
import NeumorphDatePicker from '../../component/NeumorphDatePicker';
import { WINDOW_WIDTH } from '../../utils/ScreenLayout';
import moment from 'moment';

import { getPurchaseOrderDetailByPoId } from '../../redux/slices/billing management/measurement/addUpdateMeasurementSlice';
import MeasurementItemList from '../billing management/measurements/MeasurementItemList';
import Toast from 'react-native-toast-message';
import MultiSelectComponent from '../../component/MultiSelectComponent';

const WorkQuotationForm = ({ formik, type, edit_id, edit }) => {
  const dispatch = useDispatch();
  const complaintId = formik?.values?.complaint_id;
  const totalQtyRef = useRef();

  const [allPo, setAllPo] = useState([]);
  const [allFromCompany, setAllFromCompany] = useState([]);
  const [allToCompany, setAllToCompany] = useState([]);
  const [allState, setAllState] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [allOutlet, setAllOutlet] = useState([]);
  const [allComplaintType, setAllComplaintType] = useState([]);
  const allQuotationType = [
    { label: 'Energy Company', value: '1' },
    { label: 'Other Company', value: '2' },
  ];
  const [allItem, setAllItem] = useState([]);
  const [openPoDate, setOpenPoDate] = useState(false);
  const [showTable, setShowTable] = useState([]);

  useEffect(() => {
    if (edit) {
      const totalQty = edit?.items_data?.map(itm => itm?.total_qty);
      totalQtyRef.current = totalQty;
    }
  }, [edit]);
  useEffect(() => {
    fetchAllCompany();
    fetchAllActiveEnergyCompany();
    fetchAllState();
    fetchAllRo();
    fetchAllComplaintType();
    fetchAllPoDetail();
  }, []);

  useEffect(() => {
    handlePoChange(formik?.values?.po_id);
  }, [formik?.values?.items_data]);
  useEffect(() => {
    if (
      edit_id &&
      formik?.values?.sales_area_id &&
      formik?.values?.regional_office_id
    ) {
      fetchallSalesArea(formik?.values?.regional_office_id);
      fetchAllOutlet(formik?.values?.sales_area_id);
    }
  }, [formik?.values?.sales_area_id, formik?.values?.sales_area_id, edit_id]);

  /*fucnction for fetching all company*/
  const fetchAllCompany = async () => {
    const result = await dispatch(getAllCompanyList()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.company_name,
          value: itm?.company_id,
        };
      });
      setAllFromCompany(rData);
    } else {
      setAllFromCompany([]);
    }
  };
  /*fucnction for fetching all active company*/
  const fetchAllActiveEnergyCompany = async () => {
    const result = await dispatch(getAllActiveCompanyList()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.name,
          value: itm?.energy_company_id,
        };
      });
      setAllToCompany(rData);
    } else {
      setAllToCompany([]);
    }
  };
  /*fucnction for fetching all states*/
  const fetchAllState = async () => {
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

  /*fucnction for fetching all regional office*/
  const fetchAllRo = async () => {
    const result = await dispatch(getAllRegionalOffice()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.regional_office_name,
          value: itm?.id,
        };
      });
      setAllRo(rData);
    } else {
      setAllRo([]);
    }
  };

  /*fucnction for fetching Complaint type*/
  const fetchAllComplaintType = async () => {
    const result = await dispatch(getAllComplaintList()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.complaint_type_name,
          value: itm?.id,
        };
      });
      setAllComplaintType(rData);
    } else {
      setAllComplaintType([]);
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

  /*fucnction for fetching all sales area company  by regional id*/
  const fetchallSalesArea = async regionalId => {
    // formik.setFieldValue(`sales_area_id`, '');
    // formik.setFieldValue(`outlet`, '');
    setAllOutlet([]);
    setAllSa([]);
    const result = await dispatch(getSalesRAOnRoId(regionalId)).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.sales_area_name,
          value: itm?.id,
        };
      });
      setAllSa(rData);
    } else {
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
      setAllSa([]);
    }
  };

  /*fucnction for fetching all outlet  by sales area  id*/
  const fetchAllOutlet = async saId => {
    const result = await dispatch(getOutletBySaId(saId)).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.outlet_name,
          value: itm?.id,
        };
      });
      setAllOutlet(rData);
    } else {
      Toast.show({ type: 'error', text1: result?.message, position: 'bottom' });
      setAllOutlet([]);
    }
  };

  /*fucnction for fetching state */
  const handlePoChange = async poId => {
    const result = await dispatch(getPurchaseOrderDetailByPoId(poId)).unwrap();
    if (result?.status) {
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
    const { index, idx } = actionButton?.itemData;
    switch (actionButton.typeOfButton) {
      case 'list':
        if (!formik.values.items_data[index].childArray) {
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

  return (
    <View>
      {/* card for complaint detail */}
      <CustomeCard
        headerName={'Company detail'}
        data={[
          {
            component: (
              <View style={styles.twoItemView}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { color: Colors().pureBlack },
                  ]}>
                  Quotation type :{' '}
                </Text>

                <View style={{ flex: 1, height: 20 }}>
                  <Dropdown
                    data={allQuotationType}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.quotation_type}
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
                      formik.setFieldValue(`quotation_type`, val?.value);
                    }}
                  />
                </View>
                {!formik.values?.quotation_type && (
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
                  from:{' '}
                </Text>

                <View style={{ flex: 1, height: 'auto' }}>
                  <Dropdown
                    data={allFromCompany}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.company_from}
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
                      formik.setFieldValue(`company_from`, val?.value);
                    }}
                  />
                </View>
                {!formik.values?.company_from && (
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

                <View style={{ flex: 1, height: 'auto' }}>
                  <Dropdown
                    data={allState}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.company_from_state}
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
                      formik.setFieldValue(`company_from_state`, val?.value);
                    }}
                  />
                </View>
                {!formik.values?.company_from_state && (
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
                  To :{' '}
                </Text>

                <View style={{ flex: 1, height: 'auto' }}>
                  <Dropdown
                    data={
                      formik?.values?.quotation_type == '1'
                        ? allToCompany
                        : allFromCompany
                    }
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.company_to}
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
                      formik.setFieldValue(`company_to`, val?.value);
                    }}
                  />
                </View>
                {!formik.values?.company_to && (
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
                  TO RO:{' '}
                </Text>

                <View style={{ flex: 1, height: 'auto' }}>
                  <Dropdown
                    data={allRo}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.company_to_regional_office}
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
                      formik.setFieldValue(
                        `company_to_regional_office`,
                        val?.value,
                      );
                    }}
                  />
                </View>
                {!formik.values?.company_to_regional_office && (
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
      {/* card for quotation detail*/}
      <CustomeCard
        headerName={'Quotation detail'}
        data={[
          {
            component: (
              <View style={styles.twoItemView}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { color: Colors().pureBlack },
                  ]}>
                  Quotation dates :{' '}
                </Text>

                <View style={{ flex: 1 }}>
                  <NeumorphDatePicker
                    height={38}
                    width={
                      formik.values.quotation_date
                        ? WINDOW_WIDTH * 0.54
                        : WINDOW_WIDTH * 0.46
                    }
                    withoutShadow={true}
                    iconPress={() => setOpenPoDate(!openPoDate)}
                    valueOfDate={
                      formik.values.quotation_date
                        ? moment(formik.values.quotation_date).format(
                            'DD/MM/YYYY',
                          )
                        : ''
                    }
                    modal
                    open={openPoDate}
                    date={new Date()}
                    mode="date"
                    onConfirm={date => {
                      formik.setFieldValue(`quotation_date`, date);

                      setOpenPoDate(false);
                    }}
                    onCancel={() => {
                      setOpenPoDate(false);
                    }}></NeumorphDatePicker>
                </View>
                {!formik.values?.quotation_date && (
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
                  regional office :{' '}
                </Text>

                <View style={{ flex: 1, height: '20' }}>
                  <Dropdown
                    data={allRo}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.regional_office_id}
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
                      formik.setFieldValue(`regional_office_id`, val?.value);
                      fetchallSalesArea(val?.value);
                    }}
                  />
                </View>
                {!formik.values?.regional_office_id && (
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
                  sales area :{' '}
                </Text>

                <View style={{ flex: 1, height: 'auto' }}>
                  <Dropdown
                    data={allSa}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.sales_area_id}
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
                      formik.setFieldValue(`sales_area_id`, val?.value);
                      fetchAllOutlet(val?.value);
                    }}
                  />
                </View>
                {!formik.values?.sales_area_id && (
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
                  outlet :{' '}
                </Text>

                <View style={{ flex: 1, height: 'auto' }}>
                  <Dropdown
                    data={allOutlet}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.outlet}
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
                      formik.setFieldValue(`outlet`, val?.value);
                    }}
                  />
                </View>
                {!formik.values?.outlet && (
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
                  complaint type :{' '}
                </Text>

                <View style={{ flex: 1, height: 'auto' }}>
                  <Dropdown
                    data={allComplaintType}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.complaint_type}
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
                      formik.setFieldValue(`complaint_type`, val?.value);
                    }}
                  />
                </View>
                {!formik.values?.complaint_type && (
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
                  po Number :{' '}
                </Text>

                <View style={{ flex: 1, height: 20 }}>
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
                    disable={
                      formik?.values?.items_id?.length > 0 ? true : false
                    }
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
                      formik.setFieldValue(`po_id`, val?.value);
                      handlePoChange(val?.value);
                      formik.setFieldValue(`po_number`, val?.label);
                    }}
                  />
                </View>
                {!formik.values?.po_id && (
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

      <View style={{ marginHorizontal: WINDOW_WIDTH * 0.03 }}>
        <MultiSelectComponent
          title={'Items'}
          placeHolderTxt={`Select item...`}
          required={true}
          labelField="name"
          valueField="id"
          data={userData}
          value={formik.values.items_id}
          inside={false}
          onChange={e => {
            formik.setFieldValue(`items_id`, e);

            const filteredData = allItem.filter(item => e.includes(item.value));

            if (formik?.values?.items_data) {
              let bMap = new Map();
              formik?.values?.items_data.forEach(item => {
                bMap.set(item.item_id, item);
              });

              // Replace objects in a with corresponding objects from b
              filteredData.forEach((obj, index) => {
                if (bMap.has(obj.order_line_number)) {
                  let newObj = bMap.get(obj.order_line_number);
                  filteredData[index] = newObj;
                }
              });
            }

            const rData = filteredData.map(itm => {
              if (itm?.childArray) {
                // If item has childArray key
                return itm;
              } else {
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
              }
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
              allData={{ item, index, showTable }}
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
                            { color: Colors().pureBlack },
                          ]}>
                          unit :
                        </Text>

                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            { color: Colors().pureBlack, flexShrink: 1 },
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
                            { color: Colors().pureBlack },
                          ]}>
                          Rate :
                        </Text>

                        <Text
                          style={[
                            styles.cardHeadingTxt,
                            { color: Colors().aprroved, flexShrink: 1 },
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
                        { justifyContent: 'space-between' },
                      ]}>
                      <Text
                        style={[
                          styles.cardHeadingTxt,
                          { color: Colors().pureBlack },
                        ]}>
                        {item?.total_qty || 0}
                      </Text>
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

export default WorkQuotationForm;

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
