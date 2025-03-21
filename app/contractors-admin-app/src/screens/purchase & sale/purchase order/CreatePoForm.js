import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import CustomeCard from '../../../component/CustomeCard';
import Colors from '../../../constants/Colors';
import DropDownItem from '../../../component/DropDownItem';
import { Dropdown } from 'react-native-element-dropdown';
import { useDispatch } from 'react-redux';

import {
  getAllBank,
  getAllGstType,
  getAllMyCompanyList,
  getAllRegionalOffice,
  getAllSalesCompanyList,
  getAllStateList,
} from '../../../redux/slices/commonApi';
import { Icon } from '@rneui/themed';
import IconType from '../../../constants/IconType';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import moment from 'moment';
import { TextInput } from 'react-native';
import GetFileExtension from '../../../utils/FileExtensionFinder';
import { apiBaseUrl } from '../../../../config';
import {
  useGetFromCompanyQuery,
  useGetToCompanyQuery,
} from '../../../services/generalapi';

const CreatePoForm = ({ formik, type, edit_id, edit }) => {
  const dispatch = useDispatch();

  const { data: fromCompanies } = useGetFromCompanyQuery();
  const { data: toCompanies } = useGetToCompanyQuery({ isDropdown: true });

  const [allMyCompany, setAllMyCompany] = useState([]);
  const [allSalesCompany, setAllSalesCompany] = useState([]);
  const [allState, setAllState] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allBank, setAllBank] = useState([]);
  const [allGst, setAllGst] = useState([]);
  const [openPoDate, setOpenPoDate] = useState(false);
  const [openDepositDate, setOpenDepositDate] = useState(false);
  const [openTenderDate, setOpenTenderDate] = useState(false);
  const [openCrDate, setOpenCrDate] = useState(false);

  useEffect(() => {
    fetchAllMyCompany();
    fetchAllSalesCompany();
    fetchAllState();
    fetchAllRo();
    fetchAllBank();
    fetchAllGst();
  }, []);

  /*fucnction for fetching my company*/
  const fetchAllMyCompany = async () => {
    const result = await dispatch(getAllMyCompanyList()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.company_name,
          value: itm?.company_id,
        };
      });
      setAllMyCompany(rData);
    } else {
      setAllMyCompany([]);
    }
  };

  /*fucnction for fetching sales company*/
  const fetchAllSalesCompany = async () => {
    const result = await dispatch(getAllSalesCompanyList()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.company_name,
          value: itm?.company_id,
        };
      });
      setAllSalesCompany(rData);
    } else {
      setAllSalesCompany([]);
    }
  };
  /*fucnction for fetching state */
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
  /*fucnction for fetching all ro  */
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

  /*fucnction for fetching all bank  */
  const fetchAllBank = async () => {
    const result = await dispatch(getAllBank()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.bank_name,
          value: itm?.id,
          image: itm?.logo,
        };
      });
      setAllBank(rData);
    } else {
      setAllBank([]);
    }
  };

  /*fucnction for fetching all gst  */
  const fetchAllGst = async () => {
    const result = await dispatch(getAllGstType()).unwrap();
    if (result?.status) {
      const rData = result?.data.map(itm => ({
        label: itm?.title,
        value: itm?.id,
        percentage: itm?.percentage,
      }));
      setAllGst(rData);
    } else {
      setAllGst([]);
    }
  };

  /*function  for getting total of approve qty and amount of approved item*/
  const getTotal = (data, key) => {
    let total = 0;
    data.forEach(element => {
      total += parseFloat(element[key]) || 0;
    });

    return total;
  };

  /*fucntion  for showing pdf */
  const showPdf = file => {
    if (typeof file == 'string') {
      if (['pdf'].includes(GetFileExtension(file))) {
        return true;
      } else {
        return false;
      }
    } else if (typeof file == 'object') {
      if (file?.type == 'application/pdf') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  /*fucntion  for showing image */
  const showImage = file => {
    if (typeof file == 'string') {
      if (['jpg', 'jpeg', 'png'].includes(GetFileExtension(file))) {
        return true;
      } else {
        return false;
      }
    } else if (typeof file == 'object') {
      if (file?.type == 'image/jpeg' || file?.type == 'image/png') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  /*fucntion  for showing docx */
  const showDocs = file => {
    if (typeof file == 'string') {
      if (['doc', 'docx'].includes(GetFileExtension(file))) {
        return true;
      } else {
        return false;
      }
    } else if (typeof file == 'object') {
      if (
        file?.type == 'application/msword' ||
        file?.type ==
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const crAndSdUi = (type, formik) => (
    <View style={{ flexDirection: 'row' }}>
      <View style={{ marginRight: 10 }}>
        <Text
          style={[
            styles.title,
            { color: Colors().pureBlack, alignSelf: 'center' },
          ]}>
          {type == 'cr' ? 'cr copy' : 'sd letter'}
        </Text>

        <View style={styles.crossIcon}>
          <Icon
            name="close"
            color={Colors().lightShadow}
            type={IconType.AntDesign}
            size={15}
            onPress={() => {
              if (type == 'cr') {
                formik.setFieldValue(`cr_copy`, ''),
                  formik.setFieldValue(`cr_copy_title`, '');
              }
              if (type == 'sd') {
                formik.setFieldValue(`sd_letter`, ''),
                  formik.setFieldValue(`sd_letter_title`, '');
              }
            }}
          />
        </View>

        {showDocs(
          type == 'cr' ? formik.values?.cr_copy : formik?.values?.sd_letter,
        ) && (
          <TouchableOpacity
            style={{ alignSelf: 'center' }}
            onPress={() => {
              // setImageModalVisible(true);
              // setImageUri(
              //   edit_id &&
              //     (type == 'cr'
              //       ? typeof formik.values?.cr_copy == 'string'
              //       : typeof formik.values?.sd_letter == 'string')
              //     ? `${apiBaseUrl}${
              //         type == 'cr'
              //           ? formik.values?.cr_copy
              //           : formik.values?.sd_letter
              //       }`
              //     : `${
              //         type == 'cr'
              //           ? formik.values?.cr_copy?.uri
              //           : formik.values?.sd_letter?.uri
              //       }`,
              // );
            }}>
            <View
              style={[
                styles.Image,
                { marginTop: 10, justifyContent: 'center' },
              ]}>
              <Icon
                name="document-text-outline"
                type={IconType.Ionicons}
                size={50}
                color={Colors().skyBule}
              />
            </View>
          </TouchableOpacity>
        )}

        {showPdf(
          type == 'cr' ? formik.values?.cr_copy : formik.values?.sd_letter,
        ) && (
          <TouchableOpacity
            style={{ alignSelf: 'center' }}
            onPress={() => {
              // setImageModalVisible(true);
              // setImageUri(
              //   edit_id &&
              //     (type == 'cr'
              //       ? typeof formik.values?.cr_copy == 'string'
              //       : typeof formik.values?.sd_letter == 'string')
              //     ? `${apiBaseUrl}${
              //         type == 'cr'
              //           ? formik.values?.cr_copy
              //           : formik.values?.sd_letter
              //       }`
              //     : `${
              //         type == 'cr'
              //           ? formik.values?.cr_copy?.uri
              //           : formik.values?.sd_letter?.uri
              //       }`,
              // );
            }}>
            <View
              style={[
                styles.Image,
                { marginTop: 10, justifyContent: 'center' },
              ]}>
              <Icon
                name="file-pdf-o"
                type={IconType.FontAwesome}
                size={45}
                color={Colors().red}
              />
            </View>
          </TouchableOpacity>
        )}

        {showImage(
          type == 'cr' ? formik.values?.cr_copy : formik.values?.sd_letter,
        ) && (
          <TouchableOpacity
            style={{ alignSelf: 'center' }}
            onPress={() => {
              // setImageModalVisible(true);
              // setImageUri(
              //   edit_id &&
              //     (type == 'cr'
              //       ? typeof formik.values?.cr_copy == 'string'
              //       : typeof formik.values?.sd_letter == 'string')
              //     ? `${apiBaseUrl}${
              //         type == 'cr'
              //           ? formik.values?.cr_copy
              //           : formik.values?.sd_letter
              //       }`
              //     : `${
              //         type == 'cr'
              //           ? formik.values?.cr_copy?.uri
              //           : formik.values?.sd_letter?.uri
              //       }`,
              // );
            }}>
            <Image
              source={{
                uri:
                  edit_id &&
                  (type == 'cr'
                    ? typeof formik.values?.cr_copy == 'string'
                    : typeof formik.values?.sd_letter == 'string')
                    ? `${apiBaseUrl}${
                        type == 'cr'
                          ? formik.values?.cr_copy
                          : formik.values?.sd_letter
                      }`
                    : `${
                        type == 'cr'
                          ? formik.values?.cr_copy?.uri
                          : formik.values?.sd_letter?.uri
                      }`,
              }}
              style={[styles.Image, { marginTop: 10 }]}
            />
          </TouchableOpacity>
        )}
        <TextInput
          placeholder="TYPE TITLE"
          numberOfLines={2}
          rows={2}
          multiline
          defaultValue={
            type == 'cr'
              ? formik.values?.cr_copy_title
              : formik?.values?.sd_letter_title
          }
          autoCapitalize="characters"
          placeholderTextColor={Colors().pureBlack}
          style={[
            styles.title,
            {
              color: Colors().pureBlack,
              alignSelf: 'center',
              maxWidth: WINDOW_WIDTH * 0.2,
              textAlign: 'center',
              width: '100%',
            },
          ]}
          onChangeText={text => {
            type == 'cr'
              ? formik.setFieldValue(`cr_copy_title`, text)
              : formik.setFieldValue(`sd_letter_title`, text);
          }}
        />
      </View>
    </View>
  );
  return (
    <View>
      {/* card for po company detail*/}
      <CustomeCard
        headerName={'Po Company detail'}
        data={[
          {
            component: (
              <View style={styles.twoItemView}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { color: Colors().pureBlack },
                  ]}>
                  from :{' '}
                </Text>

                <View style={{ flex: 1, height: 20 }}>
                  <Dropdown
                    data={
                      fromCompanies?.map(itm => ({
                        label: itm.company_name,
                        value: itm.unique_id,
                      })) || []
                    }
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.from_company}
                    activeColor={Colors().skyBule}
                    renderItem={item => (
                      <DropDownItem item={item}></DropDownItem>
                    )}
                    search={false}
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
                      formik.setFieldValue(`from_company`, val?.value);
                    }}
                  />
                </View>
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

                <View style={{ flex: 1, height: 20 }}>
                  <Dropdown
                    data={
                      toCompanies?.map(itm => ({
                        label: itm.company_name,
                        value: itm.company_id,
                      })) || []
                    }
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.to_company}
                    activeColor={Colors().skyBule}
                    renderItem={item => (
                      <DropDownItem item={item}></DropDownItem>
                    )}
                    search={false}
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
                      formik.setFieldValue(`to_company`, val?.value);
                    }}
                  />
                </View>
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
                  Regional office :{' '}
                </Text>

                <View style={{ flex: 1, height: 20 }}>
                  <Dropdown
                    data={allRo}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.ro_office}
                    activeColor={Colors().skyBule}
                    renderItem={item => (
                      <DropDownItem item={item}></DropDownItem>
                    )}
                    search={false}
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
                      formik.setFieldValue(`ro_office`, val?.value);
                    }}
                  />
                </View>
                {!formik.values?.ro_office && (
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
                  state :{' '}
                </Text>

                <View style={{ flex: 1, height: 20 }}>
                  <Dropdown
                    data={allState}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.state}
                    activeColor={Colors().skyBule}
                    renderItem={item => (
                      <DropDownItem item={item}></DropDownItem>
                    )}
                    search={false}
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
                      formik.setFieldValue(`state`, val?.value);
                    }}
                  />
                </View>
                {!formik.values?.state && (
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
      {/* card for Po detail*/}
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
                  PO date :{' '}
                </Text>

                <View style={{ flex: 1 }}>
                  <NeumorphDatePicker
                    height={38}
                    width={WINDOW_WIDTH * 0.7}
                    withoutShadow={true}
                    iconPress={() => setOpenPoDate(!openPoDate)}
                    valueOfDate={
                      formik?.values?.po_date
                        ? moment(formik?.values?.po_date).format('DD/MM/YYYY')
                        : new Date()
                    }
                    modal
                    open={openPoDate}
                    date={new Date()}
                    mode="date"
                    onConfirm={date => {
                      formik.setFieldValue(`po_date`, date);

                      setOpenPoDate(false);
                    }}
                    onCancel={() => {
                      setOpenPoDate(false);
                    }}></NeumorphDatePicker>
                </View>
                {!formik.values?.po_date && (
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
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.title, { color: Colors().pureBlack }]}>
                    Po Number :{' '}
                  </Text>
                  <TextInput
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().gray2}
                    style={[styles.inputText, styles.inputext2]}
                    value={formik?.values?.po_number}
                    onChangeText={formik.handleChange(`po_number`)}
                  />
                </View>
                {!formik.values?.po_number && (
                  <View style={{ alignSelf: 'center' }}>
                    <Icon
                      name="asterisk"
                      type={IconType.FontAwesome5}
                      size={8}
                      color={Colors().red}
                    />
                  </View>
                )}
              </>
            ),
          },
          {
            component: (
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.title, { color: Colors().pureBlack }]}>
                    limit : ₹{' '}
                  </Text>
                  <TextInput
                    editable={formik?.values?.po_for == '1' ? false : true}
                    keyboardType="numeric"
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().gray2}
                    style={[styles.inputText, styles.inputext2]}
                    value={
                      formik?.values?.po_for == '1'
                        ? getTotal(formik.values?.po_items, 'amount').toString()
                        : formik?.values?.limit
                    }
                    onChangeText={formik.handleChange(`limit`)}
                  />
                </View>
              </>
            ),
          },
        ]}
      />

      {/* card for Security deposit detail*/}
      <CustomeCard
        headerName={' security deposit detail'}
        data={[
          {
            component: (
              <View style={styles.twoItemView}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { color: Colors().pureBlack },
                  ]}>
                  deposit date :{' '}
                </Text>

                <View style={{ flex: 1 }}>
                  <NeumorphDatePicker
                    height={38}
                    width={WINDOW_WIDTH * 0.6}
                    withoutShadow={true}
                    iconPress={() => setOpenDepositDate(!openDepositDate)}
                    valueOfDate={
                      formik?.values?.security_deposit_date
                        ? moment(formik?.values?.security_deposit_date).format(
                            'DD/MM/YYYY',
                          )
                        : new Date()
                    }
                    modal
                    open={openDepositDate}
                    date={new Date()}
                    mode="date"
                    onConfirm={date => {
                      formik.setFieldValue(`security_deposit_date`, date);

                      setOpenDepositDate(false);
                    }}
                    onCancel={() => {
                      setOpenDepositDate(false);
                    }}></NeumorphDatePicker>
                </View>
                {!formik.values?.security_deposit_date && (
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
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.title, { color: Colors().pureBlack }]}>
                    deposit amount : ₹{' '}
                  </Text>
                  <TextInput
                    keyboardType="numeric"
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().gray2}
                    style={[styles.inputText, styles.inputext2]}
                    value={formik?.values?.security_deposit_amount}
                    onChangeText={formik.handleChange(
                      `security_deposit_amount`,
                    )}
                  />
                </View>
                {!formik.values?.security_deposit_amount && (
                  <View style={{ alignSelf: 'center' }}>
                    <Icon
                      name="asterisk"
                      type={IconType.FontAwesome5}
                      size={8}
                      color={Colors().red}
                    />
                  </View>
                )}
              </>
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
                  bank :{' '}
                </Text>

                <View style={{ flex: 1, height: 20 }}>
                  <Dropdown
                    data={allBank}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.bank}
                    activeColor={Colors().skyBule}
                    renderItem={item => (
                      <DropDownItem item={item}></DropDownItem>
                    )}
                    search={false}
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
                      formik.setFieldValue(`bank`, val?.value);
                    }}
                  />
                </View>
                {!formik.values?.bank && (
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

      {/* card for Tender detail*/}
      <CustomeCard
        headerName={'Tender detail'}
        data={[
          {
            component: (
              <View style={styles.twoItemView}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { color: Colors().pureBlack },
                  ]}>
                  Tender date :{' '}
                </Text>

                <View style={{ flex: 1 }}>
                  <NeumorphDatePicker
                    height={38}
                    width={WINDOW_WIDTH * 0.6}
                    withoutShadow={true}
                    iconPress={() => setOpenTenderDate(!openTenderDate)}
                    valueOfDate={
                      formik?.values?.tender_date
                        ? moment(formik?.values?.tender_date).format(
                            'DD/MM/YYYY',
                          )
                        : new Date()
                    }
                    modal
                    open={openTenderDate}
                    date={new Date()}
                    mode="date"
                    onConfirm={date => {
                      formik.setFieldValue(`tender_date`, date);

                      setOpenTenderDate(false);
                    }}
                    onCancel={() => {
                      setOpenTenderDate(false);
                    }}></NeumorphDatePicker>
                </View>
                {!formik.values?.tender_date && (
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
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.title, { color: Colors().pureBlack }]}>
                    Tender Number :{' '}
                  </Text>
                  <TextInput
                    // keyboardType="numeric"
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().gray2}
                    style={[styles.inputText, styles.inputext2]}
                    value={formik?.values?.tender_number}
                    onChangeText={formik.handleChange(`tender_number`)}
                  />
                </View>
                {!formik.values?.tender_number && (
                  <View style={{ alignSelf: 'center' }}>
                    <Icon
                      name="asterisk"
                      type={IconType.FontAwesome5}
                      size={8}
                      color={Colors().red}
                    />
                  </View>
                )}
              </>
            ),
          },
          {
            component: (
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.title, { color: Colors().pureBlack }]}>
                    DD/BG NO:{' '}
                  </Text>
                  <TextInput
                    // keyboardType="numeric"
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().gray2}
                    style={[styles.inputText, styles.inputext2]}
                    value={formik?.values?.dd_bg_number}
                    onChangeText={formik.handleChange(`dd_bg_number`)}
                  />
                </View>
                {!formik.values?.dd_bg_number && (
                  <View style={{ alignSelf: 'center' }}>
                    <Icon
                      name="asterisk"
                      type={IconType.FontAwesome5}
                      size={8}
                      color={Colors().red}
                    />
                  </View>
                )}
              </>
            ),
          },
        ]}
      />

      {/* card for Cr detail*/}
      <CustomeCard
        headerName={'Cr detail'}
        data={[
          {
            component: (
              <View style={styles.twoItemView}>
                <Text
                  style={[
                    styles.cardHeadingTxt,
                    { color: Colors().pureBlack },
                  ]}>
                  Cr date :{' '}
                </Text>

                <View style={{ flex: 1 }}>
                  <NeumorphDatePicker
                    height={38}
                    width={WINDOW_WIDTH * 0.7}
                    withoutShadow={true}
                    iconPress={() => setOpenCrDate(!openCrDate)}
                    valueOfDate={
                      formik?.values?.cr_date
                        ? moment(formik?.values?.cr_date).format('DD/MM/YYYY')
                        : new Date()
                    }
                    modal
                    open={openCrDate}
                    date={new Date()}
                    mode="date"
                    onConfirm={date => {
                      formik.setFieldValue(`cr_date`, date);

                      setOpenCrDate(false);
                    }}
                    onCancel={() => {
                      setOpenCrDate(false);
                    }}></NeumorphDatePicker>
                </View>
                {!formik.values?.cr_date && (
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
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.title, { color: Colors().pureBlack }]}>
                    CR Number :{' '}
                  </Text>
                  <TextInput
                    // keyboardType="numeric"
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().gray2}
                    style={[styles.inputText, styles.inputext2]}
                    value={formik?.values?.cr_number}
                    onChangeText={formik.handleChange(`cr_number`)}
                  />
                </View>
                {!formik.values?.cr_number && (
                  <View style={{ alignSelf: 'center' }}>
                    <Icon
                      name="asterisk"
                      type={IconType.FontAwesome5}
                      size={8}
                      color={Colors().red}
                    />
                  </View>
                )}
              </>
            ),
          },
          {
            component: (
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.title, { color: Colors().pureBlack }]}>
                    cr code:{' '}
                  </Text>
                  <TextInput
                    // keyboardType="numeric"
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().gray2}
                    style={[styles.inputText, styles.inputext2]}
                    value={formik?.values?.cr_code}
                    onChangeText={formik.handleChange(`cr_code`)}
                  />
                </View>
                {!formik.values?.cr_code && (
                  <View style={{ alignSelf: 'center' }}>
                    <Icon
                      name="asterisk"
                      type={IconType.FontAwesome5}
                      size={8}
                      color={Colors().red}
                    />
                  </View>
                )}
              </>
            ),
          },
        ]}
      />

      {/* card for Cr detail*/}
      <CustomeCard
        headerName={'Work detail'}
        data={[
          {
            component: (
              <>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <Text style={[styles.title, { color: Colors().pureBlack }]}>
                    Work :{' '}
                  </Text>
                  <TextInput
                    // keyboardType="numeric"
                    placeholder="TYPE..."
                    placeholderTextColor={Colors().gray2}
                    style={[styles.inputText, styles.inputext2]}
                    value={formik?.values?.work}
                    onChangeText={formik.handleChange(`work`)}
                  />
                </View>
                {!formik.values?.work && (
                  <View style={{ alignSelf: 'center' }}>
                    <Icon
                      name="asterisk"
                      type={IconType.FontAwesome5}
                      size={8}
                      color={Colors().red}
                    />
                  </View>
                )}
              </>
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
                  Gst type:{' '}
                </Text>

                <View style={{ flex: 1, height: 20 }}>
                  <Dropdown
                    data={allGst}
                    placeholder={'select...'}
                    labelField={'label'}
                    valueField={'value'}
                    value={formik.values?.gst_id}
                    activeColor={Colors().skyBule}
                    renderItem={item => (
                      <DropDownItem item={item}></DropDownItem>
                    )}
                    search={false}
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
                      formik.setFieldValue(`gst_id`, val.value);
                      formik.setFieldValue('gst_percent', val?.percentage);
                      if (formik.values.po_for == '2') {
                        formik.setFieldValue(
                          'po_tax',
                          (formik.values.po_amount * val?.percentage) / 100,
                        );
                      }
                    }}
                  />
                </View>
              </View>
            ),
          },
          { key: 'gst %', value: formik?.values?.gst_percent },
        ]}
      />
      {/* veiw for Cr copy and sd letter*/}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}>
        <>
          {formik?.values?.cr_copy && crAndSdUi('cr', formik)}
          {formik?.values?.sd_letter && crAndSdUi('sd', formik)}
        </>
      </View>
    </View>
  );
};

export default CreatePoForm;

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
  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  crossIcon: {
    backgroundColor: Colors().red,
    borderRadius: 50,
    padding: '1%',
    position: 'absolute',
    right: -7,
    top: 20,
    zIndex: 1,
    justifyContent: 'center',
  },

  selectedTextStyle: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,

    flexShrink: 1,
  },

  inputext2: {
    height: 20,
    padding: 1,
    paddingLeft: 5,
    alignSelf: 'center',
    color: Colors().pureBlack,
    justifyContent: 'center',
    flexShrink: 1,
  },

  inputText: {
    fontSize: 13,
    fontWeight: '300',
    textTransform: 'uppercase',
    flexShrink: 1,
    fontFamily: Colors().fontFamilyBookMan,
  },
});
