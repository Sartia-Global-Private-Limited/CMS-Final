/*    ----------------Created Date :: 9- sep -2024   ----------------- */
import { View, SafeAreaView, TouchableOpacity, Text } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useDispatch, useSelector } from 'react-redux';
import CustomeHeader from '../../../component/CustomeHeader';
import { Badge } from '@rneui/themed';
import moment from 'moment';
import CustomeCard from '../../../component/CustomeCard';
import ScreensLabel from '../../../constants/ScreensLabel';
import List from '../../../component/List/List';
import { getAllEmployeeHistory } from '../../../redux/slices/stock-punch-management/employeeHistory/getAllEmployeeHistorySlice';
import { useFormik } from 'formik';
import NeumorphDatePicker from '../../../component/NeumorphDatePicker';

const OfficeInspectionEmployeeHistoryList = ({ navigation, route }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const ListData = useSelector(state => state.getAllEmployeeHistory);

  /*declare useState variable here */
  const [openMonth, setOpenMonth] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);

  const formik = useFormik({
    initialValues: {
      month: new Date(new Date().getFullYear(), new Date().getMonth()),
    },
  });

  useEffect(() => {
    dispatch(
      getAllEmployeeHistory({
        pageSize: pageSize,
        pageNo: pageNo,
        month: formik.values.month,
      }),
    );
  }, [formik?.values?.month]);

  /*search function*/
  const searchFunction = searchvalue => {
    dispatch(getAllEmployeeHistory({ search: searchvalue }));
  };

  const onSearchCancel = () => {
    dispatch(
      getAllEmployeeHistory({
        pageSize: pageSize,
        pageNo: pageNo,
        month: formik.values.month,
      }),
    );
  };

  const keyHasValue = value => {
    if (value) {
      return value;
    } else {
      return '----';
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('SPRequestDetailScreen', {
              edit_id: item?.id,
            })
          }>
          <CustomeCard
            avatarImage={item?.image}
            data={[
              {
                key: 'Employee Id',
                value: keyHasValue(item?.employee_id),
                keyColor: Colors().skyBule,
              },
              { key: 'name', value: item?.name },
              {
                key: 'Complaint No.',
                component: (
                  <Badge
                    value={`${item?.complaints[0]?.complaint_unique_id}`}
                    status="primary"
                  />
                ),
              },
              {
                key: 'Complaint Type',
                value: item?.complaints[0].complaint_type_name,
                keyColor: Colors().aprroved,
              },
            ]}
          />
        </TouchableOpacity>
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getAllEmployeeHistory({
        pageSize: pageSize,
        pageNo: pageNo,
        month: formik.values.month,
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={label.EMPLOYEE_HISTORY} />
      <View style={{ flexDirection: 'row' }}>
        <SearchBar setSearchText={setSearchText} />
      </View>
      <View style={{ margin: 5, marginLeft: 10 }}>
        <NeumorphDatePicker
          height={WINDOW_HEIGHT * 0.055}
          width={WINDOW_WIDTH * 0.95}
          iconPress={() => setOpenMonth(!openMonth)}
          valueOfDate={
            formik.values.month
              ? moment(formik.values.month).format('MMMM YYYY')
              : formik.values.month
          }
          modal
          open={openMonth}
          date={new Date()}
          mode="date"
          onConfirm={date => {
            formik.setFieldValue(`month`, moment(date).format('YYYY-MM'));
            setOpenMonth(false);
          }}
          onCancel={() => {
            setOpenMonth(false);
          }}
        />
      </View>

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
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

export default OfficeInspectionEmployeeHistoryList;
