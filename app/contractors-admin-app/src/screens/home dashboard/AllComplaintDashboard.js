/*    ----------------Created Date :: 20 - sep -2024   ----------------- */

import { StyleSheet, View, FlatList } from 'react-native';
import React, { useEffect, useState } from 'react';
import NeumorphLinearGradientCard from '../../component/NeumorphLinearGradientCard';
import Colors from '../../constants/Colors';
import CustomeCard from '../../component/CustomeCard';
import { useDispatch } from 'react-redux';
import { getAllComplaintDataByFY } from '../../redux/slices/commonApi';

export default function AllComplaintDashboard({ selectedFY }) {
  const dispatch = useDispatch();
  const [data, setData] = useState({});

  useEffect(() => {
    fetchAllData();
  }, [selectedFY]);

  const fetchAllData = async () => {
    try {
      const result = await dispatch(
        getAllComplaintDataByFY(selectedFY),
      ).unwrap();
      setData(result?.status ? result?.data : {});
    } catch (error) {}
  };

  const cardData = [
    {
      gradientArray: Colors().skyGradient,
      mainValue: data?.financialYearData?.totalComplaints,
      mainTitle: 'Total complaints',
      lowerValue: data?.financialYearData?.totalComplaints,
    },
    {
      gradientArray: Colors().orangeGradient,
      mainValue: data?.financialYearData?.status?.pending,
      mainTitle: 'Pending complaints',
      lowerValue: data?.financialYearData?.status?.pending,
    },
    {
      gradientArray: Colors().purpleGradient,
      mainValue: data?.financialYearData?.status?.approved,
      mainTitle: 'Approved complaints',
      lowerValue: data?.financialYearData?.status?.approved,
    },
    {
      gradientArray: Colors().redGradient,
      mainValue: data?.financialYearData?.status?.working,
      mainTitle: 'Working complaints',
      lowerValue: data?.financialYearData?.status?.working,
    },
    {
      gradientArray: Colors().skyGradient,
      mainValue: data?.financialYearData?.status?.rejected,
      mainTitle: 'Rejected complaints',
      lowerValue: data?.financialYearData?.status?.rejected,
    },
    {
      gradientArray: Colors().orangeGradient,
      mainValue: data?.financialYearData?.status?.resolved,
      mainTitle: 'Resolved complaints',
      lowerValue: data?.financialYearData?.status?.resolved,
    },
    {
      gradientArray: Colors().purpleGradient,
      mainValue: data?.financialYearData?.status?.hold,
      mainTitle: 'Hold complaints',
      lowerValue: data?.financialYearData?.status?.hold,
    },
    {
      gradientArray: Colors().redGradient,
      mainValue: data?.getPaymentData?.financialYearCount,
      mainTitle: 'Payment received',
      lowerValue: data?.getPaymentData?.currentMonthCount,
    },
  ];

  return (
    <View>
      <CustomeCard
        headerName={'All complaint'}
        data={[
          {
            component: (
              <FlatList
                data={cardData}
                keyExtractor={(item, index) => index.toString()}
                numColumns={3}
                contentContainerStyle={{ paddingLeft: 10 }}
                renderItem={({ item }) => (
                  <NeumorphLinearGradientCard
                    gradientArray={item.gradientArray}
                    mainValue={item?.mainValue ?? 0}
                    mainTitle={item?.mainTitle}
                    lowerValue={item?.lowerValue ?? 0}
                    lowerTitle={data?.currentMonthData?.current_month_and_year}
                    selectedFY={selectedFY}
                  />
                )}
                showsVerticalScrollIndicator={false}
              />
            ),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
