/*    ----------------Created Date :: 17- July -2024   ----------------- */
import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomeCard from '../../component/CustomeCard';
import Colors from '../../constants/Colors';
import DropDownItem from '../../component/DropDownItem';
import {Dropdown} from 'react-native-element-dropdown';
import {useDispatch} from 'react-redux';
import {getAllSupplier} from '../../redux/slices/commonApi';
import {Icon} from '@rneui/themed';
import IconType from '../../constants/IconType';
import NeumorphDatePicker from '../../component/NeumorphDatePicker';
import {WINDOW_WIDTH} from '../../utils/ScreenLayout';
import moment from 'moment';
import {CheckBox} from '@rneui/base';
import {TextInput} from 'react-native';
import Fileupploader from '../../component/Fileupploader';
import RBSheet from 'react-native-raw-bottom-sheet';

const AssestForm = ({formik, type, edit_id, edit}) => {
  const dispatch = useDispatch();

  const refRBSheet = useRef(RBSheet);
  const warrantyGurantyType = [
    {label: 'WARRANTY', value: 1},
    {label: 'GUARANTEE', value: 2},
  ];
  const [allSupplier, setAllSupplier] = useState([]);

  const [openPurchaseDate, setOpenPurchaseDate] = useState(false);
  const [openStartDate, setOpenStartDate] = useState(false);
  const [openEndDate, setOpenEndDate] = useState(false);

  useEffect(() => {
    fetchAllSupplier();
  }, []);

  /*fucnction for fetching all company*/
  const fetchAllSupplier = async () => {
    const result = await dispatch(getAllSupplier()).unwrap();

    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.supplier_name,
          value: itm?.id,
        };
      });
      setAllSupplier(rData);
    } else {
      setAllSupplier([]);
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'image':
        refRBSheet.current.open();
        break;

      default:
        break;
    }
  };

  return (
    <View>
      {/* card for complaint detail */}
      <CustomeCard
        headerName={'Basic detail'}
        avatarImage={
          edit_id && typeof formik?.values?.asset_image == 'string'
            ? formik?.values?.asset_image
            : formik?.values?.asset_image?.uri
        }
        data={[
          {
            key: 'name',
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
                  value={formik?.values?.asset_name}
                  onChangeText={formik.handleChange(`asset_name`)}
                />
                {!formik?.values?.asset_name && (
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
            key: 'model no',
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
                  value={formik?.values?.asset_model_number}
                  onChangeText={formik.handleChange(`asset_model_number`)}
                />
                {!formik?.values?.asset_model_number && (
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
            key: 'UIN no',
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
                  value={formik?.values?.asset_uin_number}
                  onChangeText={formik.handleChange(`asset_uin_number`)}
                />
                {!formik?.values?.asset_uin_number && (
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
            key: 'Price ',
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
                  keyboardType="numeric"
                  value={formik?.values?.asset_price}
                  onChangeText={formik.handleChange(`asset_price`)}
                />
                {!formik?.values?.asset_price && (
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
                  style={[styles.cardHeadingTxt, {color: Colors().pureBlack}]}>
                  Supplier :{' '}
                </Text>

                <View style={{flex: 1, height: 'auto'}}>
                  <Dropdown
                    data={allSupplier}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.asset_supplier_id}
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
                      formik.setFieldValue(`asset_supplier_id`, val?.value);
                    }}
                  />
                </View>
              </View>
            ),
          },
        ]}
        status={[{key: 'action', value: 'select  image'}]}
        action={handleAction}
        imageButton={true}
      />

      {/* card for WARRANTY/GUARANTEE detail*/}
      <CustomeCard
        headerName={`${
          formik?.values?.asset_warranty_guarantee_value == 1
            ? 'WARRANTY'
            : 'GUARANTEE'
        } detail`}
        data={[
          {
            component: (
              <View
                style={{
                  flexDirection: 'row',

                  flex: 1,
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                }}>
                {warrantyGurantyType.map((radioButton, index) => (
                  <>
                    <CheckBox
                      key={index}
                      textStyle={{
                        fontFamily: Colors().fontFamilyBookMan,
                        color: Colors().gray,
                        fontWeight: '500',
                      }}
                      containerStyle={{
                        backgroundColor: Colors().cardBackground,
                        padding: 0,
                      }}
                      checkedIcon="dot-circle-o"
                      uncheckedIcon="circle-o"
                      title={radioButton.label}
                      //   disabled={edit_id ? true : false}
                      checked={
                        formik.values.asset_warranty_guarantee_value ===
                        radioButton.value
                      }
                      onPress={() => {
                        formik.setFieldValue(
                          'asset_warranty_guarantee_value',
                          radioButton.value,
                        );
                      }}
                      checkedColor={Colors().aprroved}
                    />
                  </>
                ))}
              </View>
            ),
          },
          {
            component: (
              <View style={styles.twoItemView}>
                <Text
                  style={[styles.cardHeadingTxt, {color: Colors().pureBlack}]}>
                  Purchase dates :{' '}
                </Text>

                <View style={{flex: 1}}>
                  <NeumorphDatePicker
                    height={38}
                    width={
                      formik.values.asset_purchase_date
                        ? WINDOW_WIDTH * 0.56
                        : WINDOW_WIDTH * 0.54
                    }
                    withoutShadow={true}
                    iconPress={() => setOpenPurchaseDate(!openPurchaseDate)}
                    valueOfDate={
                      formik.values.asset_purchase_date
                        ? moment(formik.values.asset_purchase_date).format(
                            'DD/MM/YYYY',
                          )
                        : ''
                    }
                    modal
                    open={openPurchaseDate}
                    date={new Date()}
                    mode="date"
                    onConfirm={date => {
                      formik.setFieldValue(`asset_purchase_date`, date);

                      setOpenPurchaseDate(false);
                    }}
                    onCancel={() => {
                      setOpenPurchaseDate(false);
                    }}></NeumorphDatePicker>
                </View>
                {!formik.values?.asset_purchase_date && (
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
                  start dates :{' '}
                </Text>

                <View style={{flex: 1}}>
                  <NeumorphDatePicker
                    height={38}
                    width={
                      formik.values.asset_warranty_guarantee_start_date
                        ? WINDOW_WIDTH * 0.64
                        : WINDOW_WIDTH * 0.62
                    }
                    withoutShadow={true}
                    iconPress={() => setOpenStartDate(!openStartDate)}
                    valueOfDate={
                      formik.values.asset_warranty_guarantee_start_date
                        ? moment(
                            formik.values.asset_warranty_guarantee_start_date,
                          ).format('DD/MM/YYYY')
                        : ''
                    }
                    modal
                    open={openStartDate}
                    date={new Date()}
                    mode="date"
                    onConfirm={date => {
                      formik.setFieldValue(
                        `asset_warranty_guarantee_start_date`,
                        date,
                      );

                      setOpenStartDate(false);
                    }}
                    onCancel={() => {
                      setOpenStartDate(false);
                    }}></NeumorphDatePicker>
                </View>
                {!formik.values?.asset_warranty_guarantee_start_date && (
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
                  End dates :{' '}
                </Text>

                <View style={{flex: 1}}>
                  <NeumorphDatePicker
                    height={38}
                    width={
                      formik.values.asset_warranty_guarantee_end_date
                        ? WINDOW_WIDTH * 0.67
                        : WINDOW_WIDTH * 0.65
                    }
                    withoutShadow={true}
                    iconPress={() => setOpenEndDate(!openEndDate)}
                    valueOfDate={
                      formik.values.asset_warranty_guarantee_end_date
                        ? moment(
                            formik.values.asset_warranty_guarantee_end_date,
                          ).format('DD/MM/YYYY')
                        : ''
                    }
                    modal
                    open={openEndDate}
                    date={new Date()}
                    mode="date"
                    onConfirm={date => {
                      formik.setFieldValue(
                        `asset_warranty_guarantee_end_date`,
                        date,
                      );

                      setOpenEndDate(false);
                    }}
                    onCancel={() => {
                      setOpenEndDate(false);
                    }}></NeumorphDatePicker>
                </View>
                {!formik.values?.asset_warranty_guarantee_end_date && (
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
        ]}
      />

      <Fileupploader
        btnRef={refRBSheet}
        cameraOption={{
          base64: false,
          multiselet: false,
        }}
        cameraResponse={item => {
          if (!item) return; // Check if item has a value
          const imageFormData = {
            uri: item?.uri,
            name: item?.name,
            type: item?.type,
          };
          formik.setFieldValue(`asset_image`, imageFormData);
          refRBSheet.current.close();
        }}
        galleryOption={{base64: false, multiselet: false}}
        galleryResponse={item => {
          if (!item) return; // Check if item has a value
          const imageFormData = {
            uri: item?.uri,
            name: item?.name,
            type: item?.type,
          };
          formik.setFieldValue(`asset_image`, imageFormData);
          refRBSheet.current.close();
        }}
      />
    </View>
  );
};

export default AssestForm;

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
});
