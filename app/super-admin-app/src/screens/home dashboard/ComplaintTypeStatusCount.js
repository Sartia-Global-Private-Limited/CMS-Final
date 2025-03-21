import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  getInvoiceByFY,
  getMeasurementByFY,
  getPaymentByFY,
  getPerformaInvoiceByFY,
} from '../../redux/slices/commonApi';
import ChartCard from '../../component/ChartCard';
import Colors from '../../constants/Colors';
import {Menu, MenuItem} from 'react-native-material-menu';
import {Icon} from '@rneui/themed';
import IconType from '../../constants/IconType';
import CustomeBarChart from '../../component/CustomeBarChart';
import CustomeLineChart from '../../component/CustomeLineChart';
import {WINDOW_WIDTH} from '../../utils/ScreenLayout';

const ComplaintTypeStatusCount = ({selectedFY}) => {
  const dispatch = useDispatch();
  const [measurementData, setMeasurementData] = useState([]);
  const [performaInvoiceData, setPerformaInvoiceData] = useState([]);
  const [inoviceData, setInoviceData] = useState([]);
  const [paymentData, setPaymentData] = useState([]);
  const [mergedData, setMergedData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [visible1, setVisible1] = useState(false);
  const [selectedChart, setSelectedChart] = useState('Barchart');
  const [selectedChart1, setSelectedChart1] = useState('Barchart');
  const menuData = ['Bar chart', 'Line chart'];

  useEffect(() => {
    fetchMeasurement();
    fetchPerformaInvoice();
    fetchInvoice();
    fetchPayment();
  }, [selectedFY]);

  /*function for fetching measurement data*/
  const fetchMeasurement = async () => {
    const result = await dispatch(getMeasurementByFY(selectedFY)).unwrap();

    if (result?.status) {
      const barData = Object.entries(result?.data?.amounts).map(
        ([key, value]) => ({
          value: value,
        }),
      );

      setMeasurementData(barData);
    } else {
      setMeasurementData([]);
    }
  };

  /*function for fetching performa invoice data*/
  const fetchPerformaInvoice = async () => {
    const result = await dispatch(getPerformaInvoiceByFY(selectedFY)).unwrap();
    if (result?.status) {
      const barData = Object.entries(result?.data?.amounts).map(
        ([key, value]) => ({
          value: value,
        }),
      );
      setPerformaInvoiceData(barData);
    } else {
      setPerformaInvoiceData([]);
    }
  };

  /*function for fetching  invoice data*/
  const fetchInvoice = async () => {
    const result = await dispatch(getInvoiceByFY(selectedFY)).unwrap();

    if (result?.status) {
      const barData = Object.entries(result?.data?.amounts).map(
        ([key, value]) => ({
          value: value,
        }),
      );

      setInoviceData(barData);
    } else {
      setInoviceData([]);
    }
  };

  /*function for fetching  payment data*/
  const fetchPayment = async () => {
    const result = await dispatch(getPaymentByFY(selectedFY)).unwrap();

    if (result?.status) {
      const barData = Object.entries(result?.data?.amounts).map(
        ([key, value]) => ({
          value: value,
        }),
      );
      setPaymentData(barData);
    } else {
      setPaymentData([]);
    }
  };

  /*menu item selection function*/
  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');

    setSelectedChart(valueToSend);
    setVisible(false);
  };

  /*menu item selection function*/
  const hideMenu1 = val => {
    const valueToSend = val?.split(' ').join('');
    setSelectedChart1(valueToSend);
    setVisible1(false);
  };

  const dummydata = [
    {
      value: 40,
      label: 'Apr',
      labelTextStyle: {
        color: Colors().pureBlack,
        fontFamily: Colors().fontFamilyBookMan,
        textTransform: 'uppercase',
      },
      labelWidth: 60,
      spacing: 2,
      frontColor: Colors().skyBule,
    },
    {value: 20, frontColor: Colors().rejected, spacing: 2},
    {value: 20, frontColor: Colors().pending, spacing: 2},
    {value: 20, frontColor: Colors().resolved},

    {
      value: 40,
      label: 'May',
      labelTextStyle: {
        color: Colors().pureBlack,
        fontFamily: Colors().fontFamilyBookMan,
        textTransform: 'uppercase',
      },
      labelWidth: 60,
      spacing: 2,
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665', spacing: 2},
    {value: 20, frontColor: '#ED6', spacing: 2},
    {value: 20, frontColor: 'aqua'},

    {
      value: 40,
      label: 'June',
      labelTextStyle: {
        color: Colors().pureBlack,
        fontFamily: Colors().fontFamilyBookMan,
        textTransform: 'uppercase',
      },
      labelWidth: 60,
      spacing: 2,
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665', spacing: 2},
    {value: 20, frontColor: '#ED6', spacing: 2},
    {value: 20, frontColor: 'aqua'},

    {
      value: 40,
      label: 'July',
      labelTextStyle: {
        color: Colors().pureBlack,
        fontFamily: Colors().fontFamilyBookMan,
        textTransform: 'uppercase',
      },
      labelWidth: 60,
      spacing: 2,
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665', spacing: 2},
    {value: 20, frontColor: '#ED6', spacing: 2},
    {value: 20, frontColor: 'aqua'},

    {
      value: 40,
      label: 'Aug',
      labelTextStyle: {
        color: Colors().pureBlack,
        fontFamily: Colors().fontFamilyBookMan,
        textTransform: 'uppercase',
      },
      labelWidth: 60,
      spacing: 2,
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665', spacing: 2},
    {value: 20, frontColor: '#ED6', spacing: 2},
    {value: 20, frontColor: 'aqua'},

    {
      value: 40,
      label: 'sept',
      labelTextStyle: {
        color: Colors().pureBlack,
        fontFamily: Colors().fontFamilyBookMan,
        textTransform: 'uppercase',
      },
      labelWidth: 60,
      spacing: 2,
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665', spacing: 2},
    {value: 20, frontColor: '#ED6', spacing: 2},
    {value: 20, frontColor: 'aqua'},

    {
      value: 40,
      label: 'Oct',
      labelTextStyle: {
        color: Colors().pureBlack,
        fontFamily: Colors().fontFamilyBookMan,
        textTransform: 'uppercase',
      },
      labelWidth: 60,
      spacing: 2,
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665', spacing: 2},
    {value: 20, frontColor: '#ED6', spacing: 2},
    {value: 20, frontColor: 'aqua'},
    {
      value: 40,
      label: 'Nov',
      labelTextStyle: {
        color: Colors().pureBlack,
        fontFamily: Colors().fontFamilyBookMan,
        textTransform: 'uppercase',
      },
      labelWidth: 60,
      spacing: 2,
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665', spacing: 2},
    {value: 20, frontColor: '#ED6', spacing: 2},
    {value: 20, frontColor: 'aqua'},
    {
      value: 40,
      label: 'Dec',
      labelTextStyle: {
        color: Colors().pureBlack,
        fontFamily: Colors().fontFamilyBookMan,
        textTransform: 'uppercase',
      },
      labelWidth: 60,
      spacing: 2,
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665', spacing: 2},
    {value: 20, frontColor: '#ED6', spacing: 2},
    {value: 20, frontColor: 'aqua'},
    {
      value: 40,
      label: 'jan',
      labelTextStyle: {
        color: Colors().pureBlack,
        fontFamily: Colors().fontFamilyBookMan,
        textTransform: 'uppercase',
      },
      labelWidth: 60,
      spacing: 2,
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665', spacing: 2},
    {value: 20, frontColor: '#ED6', spacing: 2},
    {value: 20, frontColor: 'aqua'},
    {
      value: 40,
      label: 'Feb',
      labelTextStyle: {
        color: Colors().pureBlack,
        fontFamily: Colors().fontFamilyBookMan,
        textTransform: 'uppercase',
      },
      labelWidth: 60,
      spacing: 2,
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665', spacing: 2},
    {value: 20, frontColor: '#ED6', spacing: 2},
    {value: 20, frontColor: 'aqua'},
    {
      value: 40,
      label: 'Mar',
      labelTextStyle: {
        color: Colors().pureBlack,
        fontFamily: Colors().fontFamilyBookMan,
        textTransform: 'uppercase',
      },
      labelWidth: 60,
      spacing: 2,
      frontColor: '#177AD5',
    },
    {value: 20, frontColor: '#ED6665', spacing: 2},
    {value: 20, frontColor: '#ED6', spacing: 2},
    {value: 20, frontColor: 'aqua'},
  ];
  const Nodata = [
    {value: 10},
    {value: 0},
    {value: 20},
    {value: 15},
    {value: 0},
    {value: 9},
    {value: 8},
    {value: 0},
    {value: 11},
    {value: 0},
    {value: 0},
    {value: 0},
  ];

  return (
    <View>
      <ChartCard
        headerName={'Complaint type status count'}
        data={[
          {
            component: (
              <View
                style={{
                  alignSelf: 'flex-end',
                  position: 'absolute',
                  marginLeft: '90%',
                  top: -40,
                }}>
                <Icon
                  name={'dots-three-vertical'}
                  type={IconType.Entypo}
                  color={Colors().purple}
                  onPress={() => setVisible(!visible)}
                />
                <Menu
                  visible={visible}
                  onRequestClose={() => setVisible(false)}
                  style={{}}>
                  {menuData.map(itm => (
                    <MenuItem
                      style={{
                        backgroundColor: Colors().cardBackground,
                      }}
                      textStyle={
                        [styles.cardtext, {color: Colors().pureBlack}] // Otherwise, use the default text style
                      }
                      onPress={() => {
                        hideMenu(itm);
                      }}>
                      {itm}
                    </MenuItem>
                  ))}
                </Menu>
              </View>
            ),
          },
          ...(measurementData &&
          measurementData?.length > 0 &&
          selectedChart == 'Barchart'
            ? [
                {
                  component: (
                    <View style={{flex: 1, margin: -5}}>
                      <ChartCard
                        headerName={'total measurement'}
                        data={[
                          {
                            component: (
                              <CustomeBarChart
                                isGrouped={false}
                                data={measurementData || Nodata}
                              />
                            ),
                          },
                        ]}
                      />
                    </View>
                  ),
                },
              ]
            : [
                {
                  component: (
                    <View style={{flex: 1, margin: -5}}>
                      <ChartCard
                        headerName={'total measurement'}
                        data={[
                          {
                            component: (
                              <CustomeLineChart
                                isGrouped={false}
                                data={measurementData || Nodata}
                              />
                            ),
                          },
                        ]}
                      />
                    </View>
                  ),
                },
              ]),

          ...(performaInvoiceData &&
          performaInvoiceData?.length > 0 &&
          selectedChart == 'Barchart'
            ? [
                {
                  component: (
                    <View style={{flex: 1, margin: -5}}>
                      <ChartCard
                        headerName={'total performa invoice'}
                        data={[
                          {
                            component: (
                              <CustomeBarChart
                                isGrouped={false}
                                data={performaInvoiceData || Nodata}
                              />
                            ),
                          },
                        ]}
                      />
                    </View>
                  ),
                },
              ]
            : [
                {
                  component: (
                    <View style={{flex: 1, margin: -5}}>
                      <ChartCard
                        headerName={'total performa invoice'}
                        data={[
                          {
                            component: (
                              <CustomeLineChart
                                isGrouped={false}
                                data={performaInvoiceData || Nodata}
                              />
                            ),
                          },
                        ]}
                      />
                    </View>
                  ),
                },
              ]),

          ...(inoviceData &&
          inoviceData?.length > 0 &&
          selectedChart == 'Barchart'
            ? [
                {
                  component: (
                    <View style={{flex: 1, margin: -5}}>
                      <ChartCard
                        headerName={'total invoice'}
                        data={[
                          {
                            component: (
                              <CustomeBarChart
                                isGrouped={false}
                                data={inoviceData || Nodata}
                              />
                            ),
                          },
                        ]}
                      />
                    </View>
                  ),
                },
              ]
            : [
                {
                  component: (
                    <View style={{flex: 1, margin: -5}}>
                      <ChartCard
                        headerName={'total invoice'}
                        data={[
                          {
                            component: (
                              <CustomeLineChart
                                isGrouped={false}
                                data={inoviceData || Nodata}
                              />
                            ),
                          },
                        ]}
                      />
                    </View>
                  ),
                },
              ]),

          ...(paymentData &&
          paymentData?.length > 0 &&
          selectedChart == 'Barchart'
            ? [
                {
                  component: (
                    <View style={{flex: 1, margin: -5}}>
                      <ChartCard
                        headerName={'total payment'}
                        data={[
                          {
                            component: (
                              <CustomeBarChart
                                isGrouped={false}
                                data={paymentData || Nodata}
                              />
                            ),
                          },
                        ]}
                      />
                    </View>
                  ),
                },
              ]
            : [
                {
                  component: (
                    <View style={{flex: 1, margin: -5}}>
                      <ChartCard
                        headerName={'total payment'}
                        data={[
                          {
                            component: (
                              <CustomeLineChart
                                isGrouped={false}
                                data={paymentData || Nodata}
                              />
                            ),
                          },
                        ]}
                      />
                    </View>
                  ),
                },
              ]),
        ]}
      />
      <ChartCard
        headerName={'Billing type'}
        data={[
          {
            component: (
              <View
                style={{
                  alignSelf: 'flex-end',
                  position: 'absolute',
                  marginLeft: '90%',
                  top: -40,
                }}>
                <Icon
                  name={'dots-three-vertical'}
                  type={IconType.Entypo}
                  color={Colors().purple}
                  onPress={() => setVisible1(!visible1)}
                />
                <Menu
                  visible={visible1}
                  onRequestClose={() => setVisible1(false)}
                  style={{}}>
                  {menuData.map(itm => (
                    <MenuItem
                      style={{
                        backgroundColor: Colors().cardBackground,
                      }}
                      textStyle={
                        [styles.cardtext, {color: Colors().pureBlack}] // Otherwise, use the default text style
                      }
                      onPress={() => {
                        hideMenu1(itm);
                      }}>
                      {itm}
                    </MenuItem>
                  ))}
                </Menu>
              </View>
            ),
          },
          ...(dummydata && dummydata?.length > 0 && selectedChart1 == 'Barchart'
            ? [
                {
                  component: (
                    <CustomeBarChart data={dummydata || []} barWidth={12} />
                  ),
                },
              ]
            : [
                {
                  component: <CustomeLineChart data={dummydata || []} />,
                },
              ]),
        ]}
      />
    </View>
  );
};

export default ComplaintTypeStatusCount;

const styles = StyleSheet.create({
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
