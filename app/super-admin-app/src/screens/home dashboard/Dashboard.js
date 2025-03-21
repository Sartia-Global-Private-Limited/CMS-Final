import {
  SafeAreaView,
  StyleSheet,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../constants/Colors';
import {Menu, MenuItem} from 'react-native-material-menu';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import {WINDOW_HEIGHT} from '../../utils/ScreenLayout';
import {useDispatch} from 'react-redux';
import AllComplaintDashboard from './AllComplaintDashboard';
import MonthlyComplaintCount from './MonthlyComplaintCount';
import ComplaintTypeStatusCount from './ComplaintTypeStatusCount';
import {getAllDashboardFY} from '../../redux/slices/commonApi';
import AreaManagerComplaintDetail from './AreaManagerComplaintDetail';
import EndUserComplaintDetail from './EndUserComplaintDetail';
import AreaManagerBillingDetail from './AreaManagerBillingDetail';
import RegionalOfficeBillingDetail from './RegionalOfficeBillingDetail';

const Dashboard = ({navigation}) => {
  const [selectedFY, setSelectedFY] = useState('');
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [allFY, setAllFY] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    fetchAllFinancialYear();
  }, []);

  /*function for fetching all financial year*/
  const fetchAllFinancialYear = async () => {
    const result = await dispatch(getAllDashboardFY()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => itm?.year_name);
      setAllFY(rData);
      setSelectedFY(result?.data?.[0]?.year_name);
    } else {
      setAllFY([]);
    }
  };

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      // dispatch(getAssestDetailById(id));

      setRefreshing(false);
    }, 2000);
  }, []);

  const menuData = allFY;

  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');
    setVisible(false);
    setSelectedFY(valueToSend);
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        leftIconPress={() => navigation.goBack()}
        headerTitle={'DASHBOARD'}
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'dots-three-vertical'}
        rightIcontype={IconType.Entypo}
        rightIconPress={() => setVisible(!visible)}
      />
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <View style={{alignSelf: 'flex-end'}}>
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
        <AllComplaintDashboard selectedFY={selectedFY} />
        <MonthlyComplaintCount selectedFY={selectedFY} />
        <ComplaintTypeStatusCount selectedFY={selectedFY} />
        <AreaManagerComplaintDetail selectedFY={selectedFY} />
        <EndUserComplaintDetail selectedFY={selectedFY} />
        <AreaManagerBillingDetail selectedFY={selectedFY} />
        <RegionalOfficeBillingDetail selectedFY={selectedFY} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  cardContainer: {
    flexDirection: 'row',
    gap: 10,
    marginTop: WINDOW_HEIGHT * 0.04,
    marginHorizontal: WINDOW_HEIGHT * 0.03,
    justifyContent: 'space-between',
  },
});
