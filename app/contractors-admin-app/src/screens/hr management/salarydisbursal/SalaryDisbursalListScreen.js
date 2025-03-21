/*    ---------Created Date :: 12- Sep -2024   ---------*/

import { SafeAreaView, TouchableOpacity, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getSalaryDisbursalList } from '../../../redux/slices/hr-management/salarydisbursal/getSalaryDisbursalListSlice';
import CustomeCard from '../../../component/CustomeCard';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';
import moment from 'moment';
import List from '../../../component/List/List';

const SalaryDisbursalListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const [openMonth, setOpenMonth] = useState(false);
  const [month, setMonth] = useState(new Date());

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const geListData = useSelector(state => state.getSalaryDisbursalList);

  /*declare useState variable here */
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getSalaryDisbursalList({
        pageSize: pageSize,
        pageNo: pageNo,
        month: moment(month).format('YYYY-MM'),
      }),
    );
  }, [isFocused, month]);

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        key={item?.user_id}
        onPress={() => {
          navigation.navigate('ViewSalaryDisbursal', {
            id: item.user_id,
            month: moment(month).format('YYYY-MM'),
          });
        }}>
        <CustomeCard
          avatarImage={item?.image}
          allData={item}
          data={[
            {
              key: 'Employee Id',
              value: item?.employee_code ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'employee name',
              value: item?.name ?? '--',
            },
            {
              key: 'Month',
              value: item?.month ?? '--',
            },
            {
              key: 'Basic Salary',
              value: `₹ ${item?.salary}` ?? '--',
            },
            {
              key: 'Allowance',
              value: `₹ ${item?.allowance}` ?? '--',
            },
            {
              key: 'Deduction',
              value: `₹ -${item?.deduction}` ?? '--',
              keyColor: Colors().rejected,
            },
            {
              key: 'Gross',
              value: `₹ ${item?.grossSalary}` ?? '--',
              keyColor: Colors().aprroved,
            },
            {
              key: 'Status',
              value:
                `${item?.is_salary_disbursed ? 'Disbursed' : '--'}` ?? '--',
              keyColor: Colors().aprroved,
            },
          ]}
          status={[]}
          approveButton={item?.is_salary_disbursed ? false : true}
          action={handleAction}
        />
      </TouchableOpacity>
    );
  };

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'approve':
        navigation.navigate('UpdateSalaryDisbursal', {
          data: actionButton?.itemData,
        });
        break;

      default:
        break;
    }
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getSalaryDisbursalList({
        pageSize: pageSize,
        pageNo: pageNo,
        month: month,
        search: searchText,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`Salary Disbursal`} />
      <SearchBar setSearchText={setSearchText} />
      <View style={{ marginLeft: 10, marginTop: 2 }}>
        <NeumorphDatePicker
          width={WINDOW_WIDTH * 0.95}
          iconPress={() => setOpenMonth(!openMonth)}
          valueOfDate={
            month ? moment(month).format('MMMM YYYY') : 'Select Month'
          }
          modal
          open={openMonth}
          date={new Date()}
          mode="date"
          onConfirm={date => {
            setMonth(date);
            setOpenMonth(false);
          }}
          onCancel={() => {
            setOpenMonth(false);
          }}
        />
      </View>

      <View style={{ height: WINDOW_HEIGHT * 0.85, width: WINDOW_WIDTH }}>
        <List
          data={geListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={''}
        />
      </View>
    </SafeAreaView>
  );
};

export default SalaryDisbursalListScreen;
