/*    ----------------Created Date :: 2-Feb -2024   ----------------- */

import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '@rneui/base';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import DataNotFound from '../../../component/DataNotFound';
import FloatingAddButton from '../../../component/FloatingAddButton';
import { getInsuranceDetail } from '../../../redux/slices/hr-management/group-insurance/getInsuranceDetailSlice';
import { getInsurancePlanDetail } from '../../../redux/slices/hr-management/group-insurance/getInsurancePlanDetailSlice';
import moment from 'moment';
import ScreensLablel from '../../../constants/ScreensLabel';
import CustomeCard from '../../../component/CustomeCard';

const InsuranceDetailScreen = ({ navigation, route }) => {
  const insurance_id = route?.params?.insurance_id;
  const isnurance_plan_id = route?.params?.isnurance_plan_id;
  const label = ScreensLablel();
  const dispatch = useDispatch();

  const insuranceDetailData = useSelector(state => state.getInsuranceDetail);
  const insurancePlanDetailData = useSelector(
    state => state.getInsurancePlanDetail,
  );

  const dataOfEmp = insuranceDetailData?.data?.data;
  const plainData = insurancePlanDetailData?.data?.data;

  useEffect(() => {
    dispatch(getInsuranceDetail({ insuranceId: insurance_id }));
    dispatch(getInsurancePlanDetail({ planId: isnurance_plan_id }));
  }, [insurance_id, isnurance_plan_id]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.INSURANCE} ${label.DETAIL}`} />

      {insuranceDetailData?.isLoading ? (
        <Loader />
      ) : !insuranceDetailData?.isLoading &&
        !insuranceDetailData?.isError &&
        insuranceDetailData?.data?.status ? (
        <>
          <ScrollView>
            <View style={{}}>
              {/* card for Applieed on  detail */}
              <CustomeCard
                headerName={'Applied on'}
                data={[
                  {
                    key: 'INSU. COMPANY NAME',
                    value: dataOfEmp?.insurance_company_name ?? '--',
                  },
                  {
                    key: 'INSU. PLAN NAME',
                    value: dataOfEmp?.insurance_plan_name ?? '--',
                  },
                  {
                    key: 'INSU. FOR',
                    value: dataOfEmp?.insurance_for ?? '--',
                  },
                  {
                    key: 'INSU. APPLIED ON',
                    component: (
                      <View style={{ flex: 1 }}>
                        {dataOfEmp?.insurance_applied_on.map((itm, index) => (
                          <View
                            style={{
                              flexDirection: 'row',
                            }}>
                            <Badge value={index + 1} status="primary" />
                            {itm?.employee_name && (
                              <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={[
                                  styles.cardtext,
                                  { marginLeft: 5, color: Colors().pureBlack },
                                ]}>
                                {itm?.employee_name}
                              </Text>
                            )}

                            {itm?.designation_name && (
                              <Text
                                numberOfLines={2}
                                ellipsizeMode="tail"
                                style={[
                                  styles.cardtext,
                                  { marginLeft: 5, color: Colors().pureBlack },
                                ]}>
                                {itm?.designation_name}
                              </Text>
                            )}
                          </View>
                        ))}
                      </View>
                    ),
                  },
                ]}
                status={[
                  {
                    key: 'deposit amount',
                    value: `₹ ${dataOfEmp?.insurance_deduction_amount}`,
                    color: Colors().pending,
                  },
                ]}
              />
              <CustomeCard
                headerName={'Insurance policy detail'}
                data={[
                  {
                    key: 'COMPANY',
                    value: plainData?.company_name ?? '--',
                  },
                  {
                    key: 'NAME',
                    value: plainData?.policy_name ?? '--',
                  },
                  {
                    key: 'type',
                    value: plainData?.policy_type ?? '--',
                  },
                  {
                    component: (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}>
                            start date :{' '}
                          </Text>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              { color: Colors().pureBlack },
                            ]}>
                            {moment(plainData?.policy_start_date).format(
                              'DD/MM/YYYY',
                            )}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}>
                            end date :{' '}
                          </Text>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              { color: Colors().pureBlack },
                            ]}>
                            {moment(plainData?.policy_end_date).format(
                              'DD/MM/YYYY',
                            )}
                          </Text>
                        </View>
                      </View>
                    ),
                  },
                  {
                    component: (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}>
                            PREMIUM AMOUNT :{' '}
                          </Text>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              { color: Colors().pureBlack },
                            ]}>
                            {plainData?.policy_premium_amount}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}>
                            COVERAGE LIMITS :{' '}
                          </Text>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              { color: Colors().pureBlack },
                            ]}>
                            {plainData?.policy_coverage_limits}
                          </Text>
                        </View>
                      </View>
                    ),
                  },
                  {
                    component: (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}>
                            COVERED RISKS :{' '}
                          </Text>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              { color: Colors().pureBlack },
                            ]}>
                            {plainData?.policy_covered_risks}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}>
                            DEDUCTIBLE AMOUNT :{' '}
                          </Text>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              { color: Colors().pureBlack },
                            ]}>
                            {plainData?.policy_deductible_amount}
                          </Text>
                        </View>
                      </View>
                    ),
                  },
                  {
                    component: (
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}>
                            RRENEWAL DATE:{' '}
                          </Text>
                          <Text
                            numberOfLines={1}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              { color: Colors().pureBlack },
                            ]}>
                            {moment(plainData?.policy_renewal_date).format(
                              'DD/MM/YYYY',
                            )}
                          </Text>
                        </View>
                        <View style={{ flexDirection: 'row', flex: 1 }}>
                          <Text
                            style={[
                              styles.cardHeadingTxt,
                              { color: Colors().pureBlack },
                            ]}>
                            TENURE :{' '}
                          </Text>
                          <Text
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={[
                              styles.cardtext,
                              { color: Colors().pureBlack },
                            ]}>
                            {plainData?.policy_tenure}
                          </Text>
                        </View>
                      </View>
                    ),
                  },
                ]}
                status={[
                  {
                    key: 'policy code',
                    value: `${plainData?.policy_code}`,
                    color: Colors().pending,
                  },
                ]}
              />
            </View>
          </ScrollView>
        </>
      ) : insuranceDetailData?.isError ? (
        <InternalServer />
      ) : !insuranceDetailData?.data?.status &&
        insuranceDetailData?.data?.message === 'Data not found' ? (
        <>
          <DataNotFound />
        </>
      ) : (
        <InternalServer />
      )}
    </SafeAreaView>
  );
};

export default InsuranceDetailScreen;

const styles = StyleSheet.create({
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
});
