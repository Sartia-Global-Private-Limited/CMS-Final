/*    ----------------Created Date :: 5 - Sep -2024   ----------------- */

import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import SearchBar from '../../../component/SearchBar';
import SeparatorComponent from '../../../component/SeparatorComponent';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import NeumorphCard from '../../../component/NeumorphCard';
import { getAllFinacialYearList } from '../../../redux/slices/master-data-management/financial-year/getFinacialYearListSlice';
import { deleteFinancialYearById } from '../../../redux/slices/master-data-management/financial-year/addUpdateFinancialSlice';
import CustomeHeader from '../../../component/CustomeHeader';
import CustomeCard from '../../../component/CustomeCard';
import moment from 'moment';
import List from '../../../component/List/List';
import { WINDOW_HEIGHT } from '../../../utils/ScreenLayout';

const FinancialYearListScreen = ({ navigation, route }) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getFinacialYearList);

  /*declare useState variable here */

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [yearId, setYearId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      getAllFinacialYearList({
        pageSize: pageSize,
        pageNo: pageNo,
        search: searchText,
      }),
    );
  }, [isFocused, searchText]);

  /* delete Stock request  function with id */
  const deleteFinancialYear = async () => {
    try {
      const deleteResult = await dispatch(
        deleteFinancialYearById(yearId),
      ).unwrap();

      if (deleteResult?.status === true) {
        Toast.show({
          type: 'success',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setYearId('');
        dispatch(
          getAllFinacialYearList({ pageSize: pageSize, pageNo: pageNo }),
        );
      } else {
        Toast.show({
          type: 'error',
          text1: deleteResult?.message,
          position: 'bottom',
        });
        setDeleteModalVisible(false), setYearId('');
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setDeleteModalVisible(false), setYearId('');
    }
  };

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateFinancialScreen', {
          edit_id: actionButton?.itemData?.id,
        });

        break;
      case 'delete':
        setDeleteModalVisible(true);
        setDeleteModalVisible(true), setYearId(actionButton?.itemData?.id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({ item }) => {
    return (
      <CustomeCard
        avatarImage={item?.logo}
        allData={item}
        data={[
          {
            key: 'start date',
            value: item?.start_date ?? '--',
            component: (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.cardtext,
                  { marginLeft: 5, color: Colors().skyBule },
                ]}>
                {moment(item?.start_date).format('DD/MM/YYYY')}
              </Text>
            ),
          },
          {
            key: 'end date',
            component: (
              <Text
                numberOfLines={1}
                ellipsizeMode="tail"
                style={[
                  styles.cardtext,
                  { marginLeft: 5, color: Colors().skyBule },
                ]}>
                {moment(item?.end_date).format('DD/MM/YYYY')}
              </Text>
            ),
          },
          {
            key: 'Finacial year',
            component: (
              <NeumorphCard>
                <View style={{ padding: 5 }}>
                  <Text
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    style={[styles.cardtext, { color: Colors().pending }]}>
                    {item?.year_name}
                  </Text>
                </View>
              </NeumorphCard>
            ),
          },
        ]}
        status={[]}
        editButton={true}
        deleteButton={true}
        action={handleAction}
      />
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={`Finacial year`} />
      <SearchBar setSearchText={setSearchText} />
      <SeparatorComponent
        separatorWidth={0.2}
        separatorColor={Colors().darkShadow2}
      />

      <View style={{ height: 820, width: 'auto' }}>
        <List
          addAction={'AddUpdateFinancialScreen'}
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={() => {
            dispatch(
              getAllFinacialYearList({ pageSize: pageSize, pageNo: pageNo }),
            );
          }}
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
          ConfirmBtnPress={() => deleteFinancialYear()}
        />
      )}
    </SafeAreaView>
  );
};

export default FinancialYearListScreen;

const styles = StyleSheet.create({
  cardtext: {
    color: Colors().pureBlack,
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
