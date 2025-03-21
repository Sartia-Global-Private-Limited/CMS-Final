/*    ----------------Created Date :: 12-Sep -2024   ----------------- */

import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { Badge } from '@rneui/base';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import CustomeHeader from '../../../component/CustomeHeader';
import { getInsuranceList } from '../../../redux/slices/hr-management/group-insurance/getInsuranceListSlice';
import { deleteInsuranceById } from '../../../redux/slices/hr-management/group-insurance/addUpdateInsuranceSlice';
import ScreensLabel from '../../../constants/ScreensLabel';
import Toast from 'react-native-toast-message';
import List from '../../../component/List/List';
import CustomeCard from '../../../component/CustomeCard';

const GroupInsuranceListScreen = ({ navigation }) => {
  /* declare props constant variale*/
  const label = ScreensLabel();
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const insuranceListData = useSelector(state => state.getInsuranceList);

  /*declare useState variable here */

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [insuranceId, setInsuranceId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getInsuranceList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /*   function for deletitn insurance with insurance id */
  const deleteInsurance = async insuranceId => {
    try {
      const deleteResult = await dispatch(
        deleteInsuranceById(insuranceId),
      ).unwrap();
      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setInsuranceId('');
        dispatch(getInsuranceList({ pageSize: pageSize, pageNo: pageNo }));
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setInsuranceId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setInsuranceId('');
    }
  };

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateInsuranceScreen', {
          insurance_id: item?.id,
          isnurance_plan_id: item?.insurance_plan_id,
          insurance_company_id: item?.insurance_company_id,
        });
        break;
      case 'delete':
        setDeleteModalVisible(true), setInsuranceId(item?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() =>
          navigation.navigate('InsuranceDetailScreen', {
            insurance_id: item?.id,
            isnurance_plan_id: item?.insurance_plan_id,
          })
        }>
        <CustomeCard
          allData={item}
          data={[
            { key: 'Insu. Company Name', value: item?.insurance_company_name },
            { key: 'Insu. Plan Name', value: item?.insurance_plan_name },
            { key: 'INSU. FOR', value: item?.insurance_for },
            {
              key: 'INSU. APPLIED ON',
              component: (
                <View style={{ flex: 1 }}>
                  {item?.insurance_applied_on?.map((itm, index) => (
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
              key: 'Deduction Amt.',
              value: `₹ ${item?.insurance_deduction_amount}`,
              color: Colors().pending,
            },
          ]}
          editButton={true}
          deleteButton={true}
          action={handleAction}
        />
      </TouchableOpacity>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(getInsuranceList({ pageSize: pageSize, pageNo: pageNo }));
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`${label.ALL} ${label.GROUP_INSURANCE}`} />
      <SearchBar setSearchText={setSearchText} />
      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={insuranceListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={'AddUpdateInsuranceScreen'}
        />
      </View>

      {/* modal view for ACTION */}
      {deleteModalVisible && (
        <AlertModal
          visible={deleteModalVisible}
          iconName={'delete-circle-outline'}
          icontype={IconType.MaterialCommunityIcons}
          iconColor={Colors().red}
          textToShow={'ARE YOU SURE YOU WANT TO DELETE THIS!!'}
          cancelBtnPress={() => setDeleteModalVisible(!deleteModalVisible)}
          ConfirmBtnPress={() => deleteInsurance(insuranceId)}
        />
      )}
    </SafeAreaView>
  );
};

export default GroupInsuranceListScreen;

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
