/*    ----------------Created Date :: 20 - sep -2024   ----------------- */

import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getEndUserComplaints } from '../../redux/slices/commonApi';
import { useDispatch } from 'react-redux';
import Colors from '../../constants/Colors';
import ChartCard from '../../component/ChartCard';

const EndUserComplaintDetail = ({ selectedFY }) => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAllData();
  }, [selectedFY]);

  const fetchAllData = async () => {
    try {
      const res = await dispatch(getEndUserComplaints(selectedFY)).unwrap();
      if (res?.status) {
        setData(res?.data);
      } else {
        setData([]);
      }
    } catch (error) {}
  };

  return (
    <SafeAreaView>
      <ChartCard
        headerName={'End User Complaint details'}
        data={[
          {
            component: (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ padding: 5 }}>
                  <View style={{ display: 'flex', flexDirection: 'row' }}>
                    <Text style={{ ...styles.tableHeader, width: 40 }}>
                      Sr.
                    </Text>
                    <Text style={[styles.tableHeader, { width: 200 }]}>
                      NAME
                    </Text>
                    <Text style={[styles.tableHeader, { width: 50 }]}>ALL</Text>
                    <Text style={[styles.tableHeader, { width: 75 }]}>
                      PENDING
                    </Text>
                    <Text style={[styles.tableHeader, { width: 85 }]}>
                      APPROVED
                    </Text>
                    <Text style={[styles.tableHeader, { width: 75 }]}>
                      WORKING
                    </Text>
                    <Text style={[styles.tableHeader, { width: 85 }]}>
                      REJECTED
                    </Text>
                    <Text style={[styles.tableHeader, { width: 85 }]}>
                      RESOLVED
                    </Text>
                    <Text style={[styles.tableHeader, { width: 75 }]}>
                      HOLD
                    </Text>
                  </View>
                  {data && data?.length > 0 ? (
                    data?.map((itm, idx) => (
                      <View
                        style={{ display: 'flex', flexDirection: 'row' }}
                        key={idx}>
                        <Text style={{ ...styles.tableHeader, width: 40 }}>
                          {idx + 1}
                        </Text>
                        <Text style={[styles.tableHeader, { width: 200 }]}>
                          {itm.name}
                        </Text>
                        <Text style={[styles.tableHeader, { width: 50 }]}>
                          {itm.total_complaints}
                        </Text>
                        <Text style={[styles.tableHeader, { width: 75 }]}>
                          {itm?.status?.pending}
                        </Text>
                        <Text style={[styles.tableHeader, { width: 85 }]}>
                          {itm?.status?.approved}
                        </Text>
                        <Text style={[styles.tableHeader, { width: 75 }]}>
                          {itm?.status?.working}
                        </Text>
                        <Text style={[styles.tableHeader, { width: 85 }]}>
                          {itm?.status?.rejected}
                        </Text>
                        <Text style={[styles.tableHeader, { width: 85 }]}>
                          {itm?.status?.resolved}
                        </Text>
                        <Text style={[styles.tableHeader, { width: 75 }]}>
                          {itm?.status?.hold}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <View
                      style={{
                        width: '100%',
                        height: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: Colors().gray,
                        borderWidth: 0.5,
                      }}>
                      <Text style={{ color: Colors().pureBlack }}>No Data</Text>
                    </View>
                  )}
                </View>
              </ScrollView>
            ),
          },
        ]}
      />
    </SafeAreaView>
  );
};

export default EndUserComplaintDetail;

const styles = StyleSheet.create({
  tableHeader: {
    width: 'auto',
    paddingHorizontal: 5,
    minWidth: 30,
    textAlign: 'center',
    padding: 3,
    textTransform: 'uppercase',
    // borderBottomColor: Colors().gray,
    // borderLeftColor: Colors().gray,
    // borderBottomWidth: 0.5,
    // borderLeftWidth: 0.5,
    borderColor: Colors().gray,
    borderWidth: 0.5,
    color: Colors().gray,
  },
});
