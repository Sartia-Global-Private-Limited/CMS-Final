/*    ----------------Created Date :: 3- Feb -2024    ----------------- */
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import Colors from '../../../constants/Colors';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicTextInput from '../../../component/NeumorphicTextInput';
import {useFormik} from 'formik';
import NeumorphicButton from '../../../component/NeumorphicButton';
import NeumorphCard from '../../../component/NeumorphCard';
import {useDispatch} from 'react-redux';
import {
  getAllRoles,
  getAllUsers,
  getInsuranceCompanyList,
  getPlansForInsuranceCompanny,
} from '../../../redux/slices/commonApi';
import {CheckBox} from '@rneui/themed';
import CustomeHeader from '../../../component/CustomeHeader';
import {getInsurancePlanDetail} from '../../../redux/slices/hr-management/group-insurance/getInsurancePlanDetailSlice';
import SeparatorComponent from '../../../component/SeparatorComponent';
import moment from 'moment';
import {
  createInsurance,
  updateInsurance,
} from '../../../redux/slices/hr-management/group-insurance/addUpdateInsuranceSlice';
import {addInsuranceSchema} from '../../../utils/FormSchema';
import {getInsuranceDetail} from '../../../redux/slices/hr-management/group-insurance/getInsuranceDetailSlice';
import AlertModal from '../../../component/AlertModal';
import ScreensLabel from '../../../constants/ScreensLabel';
import MultiSelectComponent from '../../../component/MultiSelectComponent';

const CreateAllowanceScreen = ({navigation, route}) => {
  const insurance_id = route?.params?.insurance_id;
  const isnurance_plan_id = route?.params?.isnurance_plan_id;
  const insurance_company_id = route?.params?.insurance_company_id;

  const [allRoles, setAllRoles] = useState([]);
  const [allUser, setAllUser] = useState([]);
  const [allCompany, setAllCompany] = useState([]);
  const [allPlans, setAllPlans] = useState([]);
  const [plansDetail, setPlainDetail] = useState([]);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [confirm, setConfrim] = useState(false);

  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState('');
  const label = ScreensLabel();

  const dispatch = useDispatch();
  useEffect(() => {
    fetchRolesData();
    fetchAllUser();
    fetchAllInsuranceCompany();

    if (insurance_id && isnurance_plan_id && insurance_company_id) {
      fetchPlanDetails(isnurance_plan_id);
      fetchInsuranceDetails(insurance_id);
      fetchAllInsurancePlan(insurance_company_id);
    }
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      insurance_for: parseInt(edit?.insurance_for_id) || 1,
      insurance_company_id: edit.insurance_company_id || '',
      insurance_deduction_amount: edit.insurance_deduction_amount || '',
      insurance_plan_id: edit.insurance_plan_id || '',
      insurance_applied_on: edit.insurance_applied_on
        ? edit.insurance_applied_on?.map(itm => {
            return itm.id;
          })
        : '',
    },
    validationSchema: addInsuranceSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      insurance_for: values.insurance_for,
      insurance_applied_on: values?.insurance_applied_on.join(','),

      insurance_deduction_amount: values.insurance_deduction_amount,
      insurance_company_id: values.insurance_company_id,
      insurance_plan_id: values.insurance_plan_id,
    };
    if (edit) {
      sData['id'] = insurance_id;
    }

    try {
      if (edit) {
        setUpdateModalVisible(true);
        setConfrim(sData);
      } else {
        setLoading(true);
        const createInsuranceResult = await dispatch(
          createInsurance(sData),
        ).unwrap();

        if (createInsuranceResult?.status) {
          setLoading(false);
          ToastAndroid.show(createInsuranceResult?.message, ToastAndroid.LONG);
          navigation.navigate('GroupInsuranceListScreen');
          resetForm();
        } else {
          ToastAndroid.show(createInsuranceResult?.message, ToastAndroid.LONG);
          setLoading(false);
        }
        // resetForm();
      }
    } catch (error) {
      console.error('Error in creating insurance:', error);
    }
  };

  /*function for fetching Roloes data*/
  const fetchRolesData = async () => {
    try {
      const result = await dispatch(getAllRoles()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllRoles(rData);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setAllRoles([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setAllRoles([]);
    }
  };
  /*function for fetching all user data*/
  const fetchAllUser = async () => {
    try {
      const result = await dispatch(getAllUsers()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllUser(rData);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setAllUser([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setAllUser([]);
    }
  };
  /*function for fetching all company list  data*/
  const fetchAllInsuranceCompany = async () => {
    try {
      const result = await dispatch(getInsuranceCompanyList()).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.company_name,
          value: itm?.id,
        }));
        setAllCompany(rData);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setAllCompany([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setAllCompany([]);
    }
  };

  /*function for fetching all insurance plan list  data*/
  const fetchAllInsurancePlan = async companyId => {
    try {
      const result = await dispatch(
        getPlansForInsuranceCompanny(companyId),
      ).unwrap();

      if (result.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.policy_name,
          value: itm?.plan_id,
        }));
        setAllPlans(rData);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setAllPlans([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setAllPlans([]);
    }
  };
  /*function for fetching all insurance plan details  data*/
  const fetchInsuranceDetails = async insuranceId => {
    try {
      const result = await dispatch(
        getInsuranceDetail({insuranceId: insuranceId}),
      ).unwrap();

      if (result.status) {
        setEdit(result?.data);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setEdit([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setEdit([]);
    }
  };
  /*function for fetching all insurance plan details  data*/
  const fetchPlanDetails = async planId => {
    try {
      const result = await dispatch(
        getInsurancePlanDetail({planId: planId}),
      ).unwrap();

      if (result.status) {
        setPlainDetail(result?.data);
      } else {
        ToastAndroid.show(result?.message, ToastAndroid.LONG);
        setPlainDetail([]);
      }
    } catch (error) {
      ToastAndroid.show(error, ToastAndroid.LONG);
      setPlainDetail([]);
    }
  };

  /*function for updating of insurance*/
  const updateInsurancefunction = async reqBody => {
    setLoading(true);

    const updateTeamResult = await dispatch(updateInsurance(reqBody)).unwrap();

    if (updateTeamResult?.status) {
      setLoading(false);
      setUpdateModalVisible(false);
      ToastAndroid.show(updateTeamResult?.message, ToastAndroid.LONG);
      navigation.navigate('GroupInsuranceListScreen');
    } else {
      ToastAndroid.show(updateTeamResult?.message, ToastAndroid.LONG);
      setLoading(false);
      setUpdateModalVisible(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={
          edit
            ? `${label.UPDATE} ${label.INSURANCE}`
            : `${label.ADD} ${label.INSURANCE}`
        }
      />
      <ScrollView>
        <View style={styles.inpuntContainer}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
            }}>
            <CheckBox
              containerStyle={{
                backgroundColor: Colors().screenBackground,
                maxWidth: '30%',
                padding: 0,
              }}
              textStyle={{
                color: Colors().pureBlack,
                fontFamily: Colors().fontFamilyBookMan,
                fontWeight: '500',
              }}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              title={'Employee- Wise'}
              checked={formik?.values?.insurance_for === 1}
              onPress={() => {
                formik.setFieldValue(`insurance_for`, 1);
                formik.setFieldValue(`insurance_applied_on`, null);
              }}
              checkedColor={Colors().aprroved}
            />
            <CheckBox
              containerStyle={{
                backgroundColor: Colors().screenBackground,
                maxWidth: '30%',
                padding: 0,
              }}
              textStyle={{
                color: Colors().pureBlack,
                fontFamily: Colors().fontFamilyBookMan,
                fontWeight: '500',
              }}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              title={'Designation-Wise'}
              checked={formik?.values?.insurance_for === 2}
              onPress={() => {
                formik.setFieldValue(`insurance_for`, 2);
                formik.setFieldValue(`insurance_applied_on`, null);
              }}
              checkedColor={Colors().aprroved}
            />
          </View>

          {formik?.values?.insurance_for === 1 && (
            <MultiSelectComponent
              title={'select employee'}
              required={true}
              data={allUser}
              value={formik?.values?.insurance_applied_on}
              onChange={item => {
                formik.setFieldValue(`insurance_applied_on`, item);
              }}
              inside={true}
              errorMessage={formik?.errors?.insurance_applied_on}
            />
          )}
          {formik?.values?.insurance_for === 2 && (
            <MultiSelectComponent
              title={'Select designation'}
              required={true}
              data={allRoles}
              value={formik?.values?.insurance_applied_on}
              onChange={item => {
                formik.setFieldValue(`insurance_applied_on`, item);
              }}
              inside={true}
              errorMessage={formik?.errors?.insurance_applied_on}
            />
          )}

          <NeumorphicDropDownList
            title={'insurance company'}
            required={true}
            data={allCompany}
            value={formik?.values?.insurance_company_id}
            onChange={val => {
              formik.setFieldValue(`insurance_company_id`, val.value);
              fetchAllInsurancePlan(val.value);
            }}
            errorMessage={formik?.errors?.insurance_company_id}
          />

          <NeumorphicDropDownList
            title={'insurance plan'}
            required={true}
            data={allPlans}
            value={formik?.values?.insurance_plan_id}
            onChange={val => {
              formik.setFieldValue(`insurance_plan_id`, val.value);
              fetchPlanDetails(val.value);
            }}
            errorMessage={formik?.errors?.insurance_plan_id}
          />

          <NeumorphicTextInput
            title={'deduction amount'}
            required={true}
            value={formik?.values?.insurance_deduction_amount}
            keyboardType="number-pad"
            onChangeText={formik.handleChange(`insurance_deduction_amount`)}
            errorMessage={formik?.errors?.insurance_deduction_amount}
          />

          {/* card for insurance policy   detail */}
          {plansDetail && (
            <NeumorphCard>
              <View style={styles.cardContainer}>
                <Text style={[styles.headingTxt, {color: Colors().purple}]}>
                  Insurance policy detail
                </Text>
                <SeparatorComponent
                  separatorColor={Colors().gray2}
                  separatorHeight={0.5}
                />

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    COMPANY :{' '}
                  </Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().pureBlack}]}>
                    {plansDetail?.company_name}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    Name :{' '}
                  </Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().pureBlack}]}>
                    {plansDetail?.policy_name}
                  </Text>
                </View>
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={[
                      styles.cardHeadingTxt,
                      {color: Colors().pureBlack},
                    ]}>
                    type :{' '}
                  </Text>
                  <Text
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, {color: Colors().pureBlack}]}>
                    {plansDetail?.policy_type}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      start date :{' '}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
                      {plansDetail?.policy_start_date
                        ? moment(plansDetail?.policy_start_date).format(
                            'DD/MM/YYYY',
                          )
                        : null}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      end date :{' '}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
                      {plansDetail?.policy_end_date &&
                        moment(plansDetail?.policy_end_date).format(
                          'DD/MM/YYYY',
                        )}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      PREMIUM AMOUNT :{' '}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
                      {plansDetail?.policy_premium_amount}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      COVERAGE LIMITS :{' '}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
                      {plansDetail?.policy_coverage_limits}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      COVERED RISKS :{' '}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
                      {plansDetail?.policy_covered_risks}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      DEDUCTIBLE AMOUNT :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
                      {plansDetail?.policy_deductible_amount}
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      RRENEWAL DATE:{' '}
                    </Text>
                    <Text
                      numberOfLines={1}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
                      {plansDetail?.policy_renewal_date &&
                        moment(plansDetail?.policy_renewal_date).format(
                          'DD/MM/YYYY',
                        )}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row', flex: 1}}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      TENURE :{' '}
                    </Text>
                    <Text
                      numberOfLines={2}
                      ellipsizeMode="tail"
                      style={[styles.cardtext, {color: Colors().pureBlack}]}>
                      {plansDetail?.policy_tenure}
                    </Text>
                  </View>
                </View>

                <View style={styles.actionView}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text
                      style={[
                        styles.cardHeadingTxt,
                        {color: Colors().pureBlack},
                      ]}>
                      policy code :{' '}
                    </Text>
                    <NeumorphCard>
                      <View style={{padding: 5}}>
                        <Text
                          numberOfLines={1}
                          ellipsizeMode="tail"
                          style={[
                            styles.cardtext,
                            {
                              color: Colors().pending,
                              fontWeight: '600',
                            },
                          ]}>
                          {plansDetail?.policy_code}
                        </Text>
                      </View>
                    </NeumorphCard>
                  </View>
                </View>
              </View>
            </NeumorphCard>
          )}

          <View style={{alignSelf: 'center', marginVertical: 10}}>
            <NeumorphicButton
              title={edit ? 'update' : 'ADD'}
              titleColor={Colors().purple}
              onPress={formik.handleSubmit}
              loading={loading}
            />
          </View>
          {/*view for modal of upate */}
          {updateModalVisible && (
            <AlertModal
              visible={updateModalVisible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
              ConfirmBtnPress={() => updateInsurancefunction(confirm)}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateAllowanceScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    // backgroundColor: 'red',
    margin: WINDOW_WIDTH * 0.05,
  },

  title: {
    fontSize: 12,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
  },

  cardContainer: {
    margin: WINDOW_WIDTH * 0.03,
    flex: 1,
    rowGap: WINDOW_HEIGHT * 0.01,
  },
  headingTxt: {
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.2,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    alignSelf: 'center',
    marginBottom: 2,
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
    marginLeft: 2,
  },
  actionView: {
    flexDirection: 'row',
    // justifyContent: 'flex-end',
    columnGap: 10,
  },
});
