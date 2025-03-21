import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Switch,
  ToastAndroid,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {addMyCompanySchema} from '../../utils/FormSchema';
import NeumorphicButton from '../../component/NeumorphicButton';
import NeumorphicDropDownList from '../../component/DropDownList';
import SeparatorComponent from '../../component/SeparatorComponent';
import NeumorphicCheckbox from '../../component/NeumorphicCheckbox';
import {CheckBox} from '@rneui/themed';
import {Icon} from '@rneui/base';
import {createContractorCompany} from '../../redux/slices/company/createCompanySlice';
import {getCompanyDetailById} from '../../redux/slices/company/companyDetailSlice';
import {
  updateAllComapnyById,
  updateMyComapnyById,
  updatePurchaseComapnyById,
  updateSalesComapnyById,
} from '../../redux/slices/company/updateCompanySlice';
import ScreensLabel from '../../constants/ScreensLabel';

const AddUpdateCompaniesScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const typeOfCompany = route?.params?.typeOfCompany;
  const edit_id = route?.params?.edit_id;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const label = ScreensLabel();

  var updateCompanyResult;
  const companytDetailDta = useSelector(state => state.companyDetail);
  const editData = companytDetailDta?.data?.data;

  /*declare useState variable here */
  const [modalVisible, setModalVisible] = useState(false);
  const [confirm, setConfrim] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hidePassword, setHidePassword] = useState(true);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      company_name: (edit_id && editData?.company_name) || '',
      company_email: (edit_id && editData?.company_email) || '',
      company_contact: (edit_id && editData?.company_contact) || '',
      company_mobile: (edit_id && editData?.company_mobile) || '',
      company_website: (edit_id && editData?.company_website) || '',
      company_address: (edit_id && editData?.company_address) || '',
      company_contact_person:
        (edit_id && editData?.company_contact_person) || '',
      primary_contact_number:
        (edit_id && editData?.primary_contact_number) || '',
      primary_contact_email: (edit_id && editData?.primary_contact_email) || '',
      designation: (edit_id && editData?.designation) || '',
      department: (edit_id && editData?.department) || '',
      business_trade_name: (edit_id && editData?.business_trade_name) || '',
      enable_company_type:
        edit_id && editData?.is_company_login_enable === '1'
          ? true
          : false || 0,
      email: (edit_id && editData?.email) || '',
      password: (edit_id && editData?.password) || '',
      gst_treatment_type:
        edit_id && editData?.gst_treatment_type
          ? {
              label: editData?.gst_treatment_type,
              value: editData?.gst_treatment_type,
            }
          : '',
      business_legal_name: (edit_id && editData?.business_legal_name) || '',
      company_type: (edit_id && editData?.company_type) || '',
      pan_number: (edit_id && editData?.pan_number) || '',
      place_of_supply: (edit_id && editData?.place_of_supply) || '',
      gst_details: (edit_id && editData?.gst_details) || [
        {
          gst_number: '',
          shipping_address: '',
          billing_address: '',
          is_default: '1',
          same_as: '0',
        },
      ],
    },
    validationSchema: addMyCompanySchema,

    onSubmit: values => {
      handleSubmit(values);
    },
  });

  const handleSubmit = async values => {
    const reqBody = {
      company_name: values.company_name,
      company_email: values.company_email,
      company_contact: values.company_contact,
      company_mobile: values.company_mobile,
      company_address: values.company_address,
      company_contact_person: values.company_contact_person,
      primary_contact_number: values.primary_contact_number,
      primary_contact_email: values.primary_contact_email,
      designation: values.designation,
      department: values.department,
      company_website: values.company_website,
      gst_treatment_type: values.gst_treatment_type.label,
      business_legal_name: values.business_legal_name,
      business_trade_name: values.business_trade_name,
      pan_number: values.pan_number,
      place_of_supply: values.place_of_supply,
      enable_company_type: values.enable_company_type,
      email: values.enable_company_type === 1 ? values.company_email : '',
      password: values.enable_company_type === 1 ? values.password : '',
      company_type: values.company_type,
      gst_details: values.gst_details || [
        {
          gst_number: '',
          shipping_address: '',
          billing_address: '',
          is_default: '0',
        },
      ],
      id: edit_id,
      my_company: typeOfCompany === 'my' ? '1' : '0',
    };

    try {
      if (edit_id) {
        /* for update block*/
        setModalVisible(true);
        setConfrim(reqBody);
      } else {
        /* for add block*/
        setLoading(true);

        const createCompanyResult = await dispatch(
          createContractorCompany(reqBody),
        ).unwrap();

        if (createCompanyResult?.status) {
          setLoading(false);
          ToastAndroid.show(createCompanyResult?.message, ToastAndroid.LONG);
          navigation.navigate('CompaniesListingScreen', {type: typeOfCompany});
        } else {
          ToastAndroid.show(createCompanyResult?.message, ToastAndroid.LONG);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
    }
  };

  const updateCompany = async reqBody => {
    setLoading(true);

    if (typeOfCompany === 'my') {
      updateCompanyResult = await dispatch(
        updateMyComapnyById(reqBody),
      ).unwrap();
    } else if (typeOfCompany === 'sales') {
      updateCompanyResult = await dispatch(
        updateSalesComapnyById(reqBody),
      ).unwrap();
    } else if (typeOfCompany === 'purchase') {
      updateCompanyResult = await dispatch(
        updatePurchaseComapnyById(reqBody),
      ).unwrap();
    } else {
      updateCompanyResult = await dispatch(
        updateAllComapnyById(reqBody),
      ).unwrap();
    }

    if (updateCompanyResult?.status) {
      setLoading(false);
      setModalVisible(false);
      ToastAndroid.show(updateCompanyResult?.message, ToastAndroid.LONG);
      navigation.navigate('CompaniesListingScreen', {type: typeOfCompany});
    } else {
      ToastAndroid.show(updateCompanyResult?.message, ToastAndroid.LONG);
      setLoading(false);
      setModalVisible(false);
    }
  };
  const GST_TREATMENT_TYPE = [
    {
      label: 'Registered Business – Regular',
      value: 'Registered Business – Regular',
    },
    {
      label: 'Registered Business – Composition',
      value: 'Registered Business – Composition',
    },
    {
      label: 'Unregistered Business',
      value: 'Unregistered Business',
    },
    {label: 'Consumer', value: 'Consumer'},
  ];

  const COMPANY_TYPE = [
    {label: 'SALES', value: '1'},
    {label: 'PURCHASE', value: '2'},
    {label: 'BOTH', value: '3'},
  ];

  useEffect(() => {
    if (edit_id) {
      dispatch(getCompanyDetailById(edit_id));
      // setEditData(getMyCompanyDetail?.data?.data);
    }
  }, [edit_id]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={
          edit_id
            ? `${label.UPDATE} ${label.COMPANY}`
            : `${label.ADD} ${label.COMPANY}`
        }
      />
      {/* modal view for delete*/}
      {setModalVisible && (
        <View style={styles.centeredView}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
              setModalVisible(!modalVisible);
            }}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Icon
                  name="edit"
                  type={IconType.FontAwesome}
                  size={80}
                  color={Colors().red}
                />
                <Text
                  style={[
                    styles.modalText,
                    styles.cardHeadingTxt,
                    {color: Colors().pureBlack},
                  ]}>
                  ARE YOU SURE YOU WANT TO Update THIS!!
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    columnGap: 50,
                  }}>
                  <NeumorphicButton
                    title={'Cancel'}
                    titleColor={Colors().red}
                    btnRadius={10}
                    btnWidth={WINDOW_WIDTH * 0.3}
                    onPress={() => setModalVisible(false)}
                  />

                  <NeumorphicButton
                    title={'confirm'}
                    titleColor={Colors().aprroved}
                    btnRadius={10}
                    btnWidth={WINDOW_WIDTH * 0.3}
                    onPress={() => updateCompany(confirm)}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}

      <ScrollView>
        <View style={styles.inputContainer}>
          <NeumorphicTextInput
            title={'Company name'}
            required={true}
            LeftIconName={'building'}
            LeftIconType={IconType.FontAwesome}
            LeftIconColor={Colors().purple}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.company_name}
            onChangeText={formik.handleChange('company_name')}
            errorMessage={formik?.errors?.company_name}
          />

          <NeumorphicTextInput
            title={'Compnay email'}
            LeftIconName={'email'}
            LeftIconType={IconType.Zocial}
            LeftIconColor={Colors().purple}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.company_email}
            onChangeText={formik.handleChange('company_email')}
            errorMessage={formik?.errors?.company_email}
          />

          <NeumorphicTextInput
            title={'Company contact'}
            required={true}
            maxLength={10}
            keyboardType="phone-pad"
            width={WINDOW_WIDTH * 0.92}
            LeftIconName={'mobile'}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.Entypo}
            value={formik?.values?.company_contact}
            onChangeText={formik.handleChange('company_contact')}
            errorMessage={formik?.errors?.company_contact}
          />

          <NeumorphicTextInput
            title={'Company mobile'}
            required={true}
            maxLength={10}
            keyboardType="phone-pad"
            LeftIconName={'mobile'}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.Entypo}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.company_mobile}
            onChangeText={formik.handleChange('company_mobile')}
            errorMessage={formik?.errors?.company_mobile}
          />

          <NeumorphicTextInput
            title={'Company website'}
            LeftIconName={'chrome'}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.AntDesign}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.company_website}
            onChangeText={formik.handleChange('company_website')}
          />

          <NeumorphicTextInput
            title={'company contact person'}
            required={true}
            LeftIconName={'contact-phone'}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.MaterialIcons}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.company_contact_person}
            onChangeText={formik.handleChange('company_contact_person')}
            errorMessage={formik?.errors?.company_contact_person}
          />

          <NeumorphicTextInput
            title={'company address'}
            required={true}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.MaterialCommunityIcons}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.company_address}
            onChangeText={formik.handleChange('company_address')}
            errorMessage={formik?.errors?.company_address}
          />

          <NeumorphicTextInput
            title={'primary contact number'}
            required={true}
            maxLength={10}
            keyboardType="phone-pad"
            LeftIconName={'mobile'}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.Entypo}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.primary_contact_number}
            onChangeText={formik.handleChange('primary_contact_number')}
            errorMessage={formik?.errors?.primary_contact_number}
          />

          <NeumorphicTextInput
            title={'primary contact email'}
            LeftIconName={'email'}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.Entypo}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.primary_contact_email}
            onChangeText={formik.handleChange('primary_contact_email')}
            errorMessage={formik?.errors?.primary_contact_email}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.92}
            LeftIconName={'format-list-bulleted-type'}
            LeftIconType={IconType.MaterialCommunityIcons}
            LeftIconColor={Colors().purple}
            title={'gst treatement type'}
            required={true}
            value={formik?.values?.gst_treatment_type}
            data={GST_TREATMENT_TYPE}
            onChange={val => {
              formik.setFieldValue('gst_treatment_type', val);
            }}
            errorMessage={formik?.errors?.gst_treatment_type}
          />

          <NeumorphicTextInput
            title={'designation'}
            LeftIconName={'person'}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.Fontisto}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.designation}
            onChangeText={formik.handleChange('designation')}
          />

          <NeumorphicTextInput
            title={'department'}
            LeftIconName={'persons'}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.Fontisto}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.department}
            onChangeText={formik.handleChange('department')}
          />

          <NeumorphicTextInput
            title={'BUSINESS LEGAL NAME'}
            required={true}
            LeftIconName={'business'}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.Ionicons}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.business_legal_name}
            onChangeText={formik.handleChange('business_legal_name')}
            errorMessage={formik?.errors?.business_legal_name}
          />

          <NeumorphicTextInput
            title={'business trade name'}
            LeftIconName={'business'}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.Ionicons}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.business_trade_name}
            onChangeText={formik.handleChange('business_trade_name')}
          />

          <NeumorphicTextInput
            maxLength={10}
            required={true}
            title={'pan number'}
            LeftIconName={'business'}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.Ionicons}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.pan_number}
            onChangeText={formik.handleChange('pan_number')}
            errorMessage={formik?.errors?.pan_number}
          />

          <NeumorphicTextInput
            title={'place of supply'}
            LeftIconName={'truck-fast-outline'}
            LeftIconColor={Colors().purple}
            LeftIconType={IconType.MaterialCommunityIcons}
            width={WINDOW_WIDTH * 0.92}
            value={formik?.values?.place_of_supply}
            onChangeText={formik.handleChange('place_of_supply')}
          />
          {/* ============== view of enable login  ================ */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',

              alignItems: 'center',
            }}>
            <Text style={[styles.employeeLoginTxt, {color: Colors().black2}]}>
              Enable Employee login
            </Text>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={
                (
                  formik?.values?.enable_company_type === 1 ||
                  (edit_id && editData?.is_company_login_enable === '1')
                    ? true
                    : false
                )
                  ? '#f5dd4b'
                  : '#f4f3f4'
              }
              ios_backgroundColor="#3e3e3e"
              onValueChange={value => {
                value == true
                  ? formik.setFieldValue(`enable_company_type`, 1)
                  : formik.setFieldValue(`enable_company_type`, 0);
              }}
              value={
                formik?.values?.enable_company_type === 1 ||
                (edit_id && editData?.is_company_login_enable === '1')
                  ? true
                  : false
              }
            />
          </View>
          {(formik?.values?.enable_company_type === 1 ||
            (edit_id && editData?.is_company_login_enable === '1')) && (
            <>
              <View style={{rowGap: 10}}>
                <NeumorphicTextInput
                  width={WINDOW_WIDTH * 0.92}
                  title={'user email'}
                  LeftIconType={IconType.AntDesign}
                  LeftIconName={'user'}
                  LeftIconColor={Colors().purple}
                  value={
                    formik?.values?.company_email
                      ? formik?.values?.company_email
                      : formik?.values?.email
                  }
                  onChangeText={formik.handleChange('email')}
                  errorMessage={formik?.errors?.email}
                />

                <NeumorphicTextInput
                  width={WINDOW_WIDTH * 0.92}
                  title={'password'}
                  LeftIconType={IconType.MaterialCommunityIcons}
                  LeftIconName={'lock-check-outline'}
                  LeftIconColor={Colors().purple}
                  value={formik?.values?.password}
                  onChangeText={formik.handleChange('password')}
                  RightIconType={IconType.Feather}
                  RightIconName={hidePassword ? 'eye-off' : 'eye'}
                  RightIconPress={() => setHidePassword(!hidePassword)}
                  secureTextEntry={hidePassword}
                  RightIconColor={Colors().purple}
                />
              </View>
            </>
          )}
          {/* ============== view of gst details ================ */}
          <View>
            {formik?.values?.gst_details.map((item, index) => (
              <View key={index}>
                <View style={{rowGap: 10}}>
                  <View style={styles.gstDetailsText}>
                    <SeparatorComponent
                      separatorWidth={WINDOW_WIDTH * 0.3}
                      separatorHeight={WINDOW_HEIGHT * 0.002}
                      separatorColor={Colors().gray2}
                    />
                    <Text style={[styles.inputText, {color: Colors().purple}]}>
                      {index > 0 ? `GST DETAILS ${index}` : 'GST DETAILS'}
                    </Text>
                    <SeparatorComponent
                      separatorWidth={WINDOW_WIDTH * 0.3}
                      separatorHeight={WINDOW_HEIGHT * 0.002}
                      separatorColor={Colors().gray2}
                    />
                  </View>
                  {index > 0 && (
                    <Icon
                      onPress={() =>
                        formik.setFieldValue(
                          `gst_details`,
                          formik?.values?.gst_details.filter(
                            (_, i) => i !== index,
                          ),
                        )
                      }
                      name="squared-cross"
                      type={IconType.Entypo}
                      style={{alignSelf: 'flex-end'}}
                      color={'red'}
                    />
                  )}

                  <NeumorphicTextInput
                    title={'gst number'}
                    required={true}
                    LeftIconName={'truck-fast-outline'}
                    placeHolderTxtColor={Colors().pureBlack}
                    LeftIconColor={Colors().purple}
                    LeftIconType={IconType.MaterialCommunityIcons}
                    width={WINDOW_WIDTH * 0.92}
                    value={item.gst_number}
                    onChangeText={formik.handleChange(
                      `gst_details.${index}.gst_number`,
                    )}
                    errorMessage={
                      formik?.errors?.gst_details?.[index]?.gst_number
                    }
                  />

                  <NeumorphicTextInput
                    title={'billing address'}
                    required={true}
                    LeftIconName={'location'}
                    LeftIconColor={Colors().purple}
                    LeftIconType={IconType.Entypo}
                    width={WINDOW_WIDTH * 0.92}
                    value={item.billing_address}
                    onChangeText={formik.handleChange(
                      `gst_details.${index}.billing_address`,
                    )}
                    errorMessage={
                      formik?.errors?.gst_details?.[index]?.billing_address
                    }
                  />

                  <NeumorphicTextInput
                    title={'shipping address'}
                    required={true}
                    LeftIconName={'location'}
                    LeftIconColor={Colors().purple}
                    LeftIconType={IconType.Entypo}
                    width={WINDOW_WIDTH * 0.92}
                    value={
                      (item.same_as === '1' ? true : false)
                        ? item.billing_address
                        : item.shipping_address
                    }
                    onChangeText={formik.handleChange(
                      `gst_details.${index}.shipping_address`,
                    )}
                    multiline
                    errorMessage={
                      formik?.errors?.gst_details?.AddUpdateCompaniesScreen?.[
                        index
                      ]?.shipping_address
                    }
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: 10,
                    }}>
                    <View style={styles.checkboxView}>
                      <NeumorphicCheckbox
                        isChecked={item.same_as === '1' ? true : false}
                        onChange={value => {
                          value == true
                            ? formik.setFieldValue(
                                `gst_details.${index}.same_as`,
                                '1',
                              )
                            : formik.setFieldValue(
                                `gst_details.${index}.same_as`,
                                '0',
                              );
                        }}></NeumorphicCheckbox>
                      <Text
                        style={[
                          styles.inputText,
                          {fontSize: 13, color: Colors().gray2, marginLeft: 10},
                        ]}>
                        SAME AS BILLINGS ADDRESS
                      </Text>
                    </View>
                    <View style={styles.checkboxView}>
                      <NeumorphicCheckbox
                        isChecked={item?.is_default === '1'}
                        onChange={e => {
                          const updatedGstDetails =
                            formik?.values?.gst_details.map((gstItem, idx) => {
                              return {
                                ...gstItem,
                                is_default: idx === index ? '1' : '0',
                              };
                            });

                          formik.setFieldValue(
                            'gst_details',
                            updatedGstDetails,
                          );
                        }}
                      />

                      <Text
                        style={[
                          styles.inputText,
                          {fontSize: 13, color: Colors().gray2, marginLeft: 10},
                        ]}>
                        MARK AS DEFAULT
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
            <Icon
              onPress={() =>
                formik.setFieldValue(`gst_details`, [
                  ...formik?.values?.gst_details,
                  {
                    gst_number: '',
                    shipping_address: '',
                    billing_address: '',
                    is_default: '0',
                    same_as: '0',
                  },
                ])
              }
              name="library-add"
              type={IconType.MaterialIcons}
              color={Colors().aprroved}
              size={40}
              style={{alignSelf: 'flex-end'}}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {COMPANY_TYPE.map((radioButton, index) => (
              <>
                <CheckBox
                  key={index}
                  containerStyle={{
                    backgroundColor: Colors().screenBackground,
                    alignSelf: 'center',
                    width: 'auto',
                    padding: 0,
                  }}
                  textStyle={[styles.inputText, {color: Colors().gray2}]}
                  checkedIcon="dot-circle-o"
                  uncheckedIcon="circle-o"
                  title={radioButton.label}
                  checked={formik?.values?.company_type == radioButton.value}
                  onPress={() =>
                    formik.setFieldValue('company_type', radioButton.value)
                  }
                  checkedColor={Colors().aprroved}
                />
              </>
            ))}
          </View>
          {formik?.touched?.company_type && formik?.errors?.company_type && (
            <Text style={styles.errorMesage}>
              {formik?.errors?.company_type}
            </Text>
          )}
          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={edit_id ? `${label.UPDATE}` : `${label.ADD}`}
              titleColor={Colors().purple}
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateCompaniesScreen;
const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    marginHorizontal: WINDOW_WIDTH * 0.04,
    marginTop: WINDOW_HEIGHT * 0.02,
    rowGap: 10,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  listView: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 8,
  },
  inputText: {
    fontSize: 15,
    fontWeight: '300',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  selectedTextStyle: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  errorMesage: {
    color: Colors().red,
    alignSelf: 'flex-start',
    marginLeft: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  checkboxView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gstDetailsText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: WINDOW_HEIGHT * 0.02,
    fontFamily: Colors().fontFamilyBookMan,
  },
  employeeLoginTxt: {
    fontSize: 15,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontFamily: Colors().fontFamilyBookMan,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: Colors().screenBackground,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },

  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    maxWidth: '65%',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
