import { View, SafeAreaView, ScrollView, Text } from 'react-native';
import React, { useEffect } from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import Colors from '../../../constants/Colors';
import CustomeCard from '../../../component/CustomeCard';
import { useDispatch, useSelector } from 'react-redux';
import { getSalaryDisbursalDetailById } from '../../../redux/slices/hr-management/salarydisbursal/getSalaryDisbursalSlice';

const ViewSalaryDisbursal = ({ route }) => {
  const id = route?.params?.id;
  const month = route?.params?.month;
  const dispatch = useDispatch();
  const getData = useSelector(state => state.getSalaryDisbursalDetail);
  const allData = getData?.data?.data;

  useEffect(() => {
    dispatch(getSalaryDisbursalDetailById({ id: id, month: month }));
  }, [id]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={'Salary Disbursal Details'} />
      <ScrollView>
        <View style={{ display: 'flex', flex: 1, gap: 15, paddingBottom: 50 }}>
          <CustomeCard
            avatarImage={allData?.user_image}
            headerName={`${allData?.user_name} Salary DETAILS`}
            data={[
              { key: 'Name', value: allData?.user_name },
              { key: 'Employee Code', value: allData?.employee_code },
              { key: 'Mobile', value: allData?.user_mobile },
              { key: 'Email', value: allData?.user_email },
              {
                key: 'Base Salary',
                value: `₹ ${allData?.base_salary}`,
              },
              {
                key: 'total working day salary',
                value: `₹ ${allData?.total_working_day_salary}`,
              },
              {
                key: 'Total Gross Value',
                value: `₹ ${allData?.gross_salary}` ?? '--',
                keyColor: Colors().aprroved,
              },
            ]}
          />
          <CustomeCard
            headerName={`Allowance`}
            data={[
              {
                key: '',
                component: (
                  <View>
                    {allData?.allowance?.map((item, i) => (
                      <View key={i}>
                        <Text
                          style={{
                            fontSize: 15,
                            fontFamily: Colors().fontFamilyBookMan,
                            color: Colors().pureBlack,
                          }}>
                          {item?.name} : {item?.value}
                        </Text>
                      </View>
                    ))}
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        fontFamily: Colors().fontFamilyBookMan,
                        color: Colors().pureBlack,
                      }}>
                      Total Amount :{' '}
                      <Text style={{ color: Colors().aprroved }}>
                        {' '}
                        ₹ {allData?.totalAllowanceAmount}
                      </Text>
                    </Text>
                  </View>
                ),
              },
            ]}
          />
          <CustomeCard
            headerName={`Deduction`}
            data={[
              {
                key: '',
                component: (
                  <View>
                    {allData?.deduction?.map((item, i) => (
                      <View
                        key={i}
                        style={{ display: 'flex', flexDirection: 'row' }}>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: '500',
                              width: 130,
                              fontFamily: Colors().fontFamilyBookMan,
                              color: Colors().pureBlack,
                            }}>
                            {item?.name}
                          </Text>
                        </View>
                        <View
                          style={{
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              textAlign: 'center',
                              fontFamily: Colors().fontFamilyBookMan,
                              color: Colors().pureBlack,
                              fontWeight: '500',
                            }}>
                            :
                          </Text>
                        </View>
                        <View style={{ margin: 5 }}>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: '500',
                              alignItems: 'center',
                              fontFamily: Colors().fontFamilyBookMan,
                              color: Colors().pureBlack,
                            }}>
                            {item?.by_employer} (Employer)
                          </Text>
                          <Text
                            style={{
                              fontSize: 15,
                              fontWeight: '500',
                              alignItems: 'center',
                              fontFamily: Colors().fontFamilyBookMan,
                              color: Colors().pureBlack,
                            }}>
                            {item?.by_employee} (Employee)
                          </Text>
                        </View>
                      </View>
                    ))}
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '500',
                        fontFamily: Colors().fontFamilyBookMan,
                        color: Colors().pureBlack,
                      }}>
                      Total Deduction :{' '}
                      <Text style={{ color: Colors().rejected }}>
                        {' '}
                        ₹ -{allData?.totalDeductionAmount}
                      </Text>
                    </Text>
                  </View>
                ),
              },
            ]}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewSalaryDisbursal;
