import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {getMonthlyComplaintCountByFY} from '../../redux/slices/commonApi';
import Colors from '../../constants/Colors';
import {Menu, MenuItem} from 'react-native-material-menu';
import {Icon} from '@rneui/themed';
import IconType from '../../constants/IconType';
import CustomeBarChart from '../../component/CustomeBarChart';
import CustomeLineChart from '../../component/CustomeLineChart';
import ChartCard from '../../component/ChartCard';

const MonthlyComplaintCount = ({selectedFY}) => {
  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [visible, setVisible] = useState(false);
  const [selectedChart, setSelectedChart] = useState('Barchart');

  useEffect(() => {
    fetchAllData();
  }, [selectedFY]);

  const fetchAllData = async () => {
    const result = await dispatch(
      getMonthlyComplaintCountByFY(selectedFY),
    ).unwrap();

    if (result?.status) {
      const barData = Object.entries(result?.data).map(([key, value]) => ({
        value: value,
      }));

      setData(barData);
    } else {
      setData([]);
    }
  };

  const menuData = ['Bar chart', 'Line chart'];

  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');
    setSelectedChart(valueToSend);
    setVisible(false);
  };

  return (
    <View>
      <ChartCard
        headerName={'Monthly complaint count'}
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
          ...(data && data?.length > 0 && selectedChart == 'Barchart'
            ? [
                {
                  component: (
                    <CustomeBarChart isGrouped={false} data={data || []} />
                  ),
                },
              ]
            : [
                {
                  component: (
                    <CustomeLineChart isGrouped={false} data={data || []} />
                  ),
                },
              ]),
        ]}
      />
    </View>
  );
};

export default MonthlyComplaintCount;

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
