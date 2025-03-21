import {SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ChartCard from '../../component/ChartCard';
import {getAreaManagerBillingDetails} from '../../redux/slices/commonApi';
import {useDispatch} from 'react-redux';
import Colors from '../../constants/Colors';

const AreaManagerBillingDetail = ({selectedFY}) => {
  const [data, setData] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAllData();
  }, [selectedFY]);

  const fetchAllData = async () => {
    try {
      const res = await dispatch(
        getAreaManagerBillingDetails(selectedFY),
      ).unwrap();
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
        headerName={'Area Manager Billing details'}
        data={[
          {
            component: (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{padding: 5}}>
                  <View style={{display: 'flex', flexDirection: 'row'}}>
                    <Text style={{...styles.tableHeader, width: 40}}>Sr.</Text>
                    <Text style={[styles.tableHeader, {width: 200}]}>
                      MANAGER NAME
                    </Text>
                    <Text style={[styles.tableHeader, {width: 200}]}>
                      MEASUREMENTS AMOUNTS
                    </Text>
                    <Text style={[styles.tableHeader, {width: 150}]}>
                      PERFOMA AMOUNTS
                    </Text>
                    <Text style={[styles.tableHeader, {width: 150}]}>
                      INVOICES AMOUNTS
                    </Text>
                    <Text style={[styles.tableHeader, {width: 150}]}>
                      PAYMENT PAID
                    </Text>
                    <Text style={[styles.tableHeader, {width: 150}]}>
                      TOTAL AMOUNT
                    </Text>
                  </View>
                  {data && data?.length > 0 ? (
                    data?.map((itm, idx) => (
                      <View
                        style={{display: 'flex', flexDirection: 'row'}}
                        key={idx}>
                        <Text style={{...styles.tableHeader, width: 40}}>
                          {idx + 1}
                        </Text>
                        <Text style={[styles.tableHeader, {width: 200}]}>
                          {itm.manager?.name}
                        </Text>
                        <Text style={[styles.tableHeader, {width: 200}]}>
                          {itm.measurements_amounts}
                        </Text>
                        <Text style={[styles.tableHeader, {width: 150}]}>
                          {itm?.performa_amounts}
                        </Text>
                        <Text style={[styles.tableHeader, {width: 150}]}>
                          {itm?.invoices_amounts}
                        </Text>
                        <Text style={[styles.tableHeader, {width: 150}]}>
                          {itm?.payment_amounts}
                        </Text>
                        <Text style={[styles.tableHeader, {width: 150}]}>
                          {itm?.total}
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
                      <Text
                        style={{
                          color: Colors().pureBlack,
                          textTransform: 'uppercase',
                        }}>
                        No Data
                      </Text>
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

export default AreaManagerBillingDetail;

const styles = StyleSheet.create({
  tableHeader: {
    width: 'auto',
    paddingHorizontal: 5,
    minWidth: 30,
    textAlign: 'center',
    padding: 3,
    textTransform: 'uppercase',
    color: Colors().gray,
    // borderBottomColor: Colors().gray,
    // borderLeftColor: Colors().gray,
    // borderBottomWidth: 0.5,
    // borderLeftWidth: 0.5,
    borderColor: Colors().gray,
    borderWidth: 0.5,
  },
});
