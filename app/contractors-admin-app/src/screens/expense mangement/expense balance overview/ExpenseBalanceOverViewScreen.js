/*    ----------------Created Date :: 22- April -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, {useEffect} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';

import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import CustomeHeader from '../../../component/CustomeHeader';
import Images from '../../../constants/Images';
import {useFormik} from 'formik';
import StockTransactionFilter from '../../stock management/stock transactions/StockTransactionFilter';
import {getExpenseBalanceByEmpId} from '../../../redux/slices/expense-management/expense-balance/getExpenseBalanceSlice';
import CustomeCard from '../../../component/CustomeCard';
import ScreensLabel from '../../../constants/ScreensLabel';

const ExpenseBalanceOverViewScreen = ({navigation}) => {
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const label = ScreensLabel();
  const ListData = useSelector(state => state.getExpenseBalance);

  const formik = useFormik({
    initialValues: {
      section_type: '2',
      pageSize: 8,
      pageNo: 1,
      search: '',
      selectedData: '',
      enduser_id: '',
      end_user_id: '',
      supplier_id: '',
    },
  });

  useEffect(() => {
    /*for employee section*/
    if (formik.values.section_type == '2') {
      dispatch(
        getExpenseBalanceByEmpId({
          empId: formik.values.end_user_id,
          pageSize: formik.values.pageSize,
          pageNo: formik.values.pageNo,
          search: formik.values.search,
        }),
      );
    }
  }, [
    formik.values.bank_id,
    formik.values.search,
    formik.values.pageNo,
    formik.values.end_user_id,
  ]);

  /* function pagination detail of each section */
  const getPaginatinoData = () => {
    if (formik.values.section_type == '2') {
      return ListData?.data?.pageDetails?.totalPages;
    }
  };

  /* if we got no data for flatlist*/
  const renderEmptyComponent = () => (
    // Render your empty component here<>
    <View
      style={{
        height: WINDOW_HEIGHT * 0.6,
      }}>
      <DataNotFound />
    </View>
  );

  /* flatlist render ui for employee section */
  const renderItem = ({item}) => {
    return (
      <View>
        <CustomeCard
          avatarImage={item?.image}
          data={[
            {
              key: 'employee id',
              value: item?.employee_id,
              keyColor: Colors().skyBule,
            },
            {key: 'name', value: item?.name},
            {key: 'email', value: item?.email},
            {key: 'Mobile', value: item?.mobile},
            {
              key: 'Balance',
              value: `₹ ${item?.balance ? item?.balance : 0}`,
              keyColor: Colors().aprroved,
            },
          ]}
        />
      </View>
    );
  };

  /*pagination button UI*/
  const renderPaginationButtons = () => {
    const buttons = [];

    for (let i = 1; i <= getPaginatinoData(); i++) {
      buttons.push(
        <TouchableOpacity
          key={i}
          onPress={() => formik.setFieldValue(`pageNo`, i)}
          style={[
            styles.paginationButton,
            i === formik.values.pageNo ? styles.activeButton : null,
          ]}>
          <Text style={{color: 'white'}}>{i}</Text>
        </TouchableOpacity>,
      );
    }
    return buttons;
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={label.EXPENSE_BALANCE_OVERVIEW} />
      <ImageBackground
        source={Images.BANK_CARD}
        imageStyle={{borderRadius: WINDOW_WIDTH * 0.03}}
        style={styles.bankCard}>
        <Text style={[styles.title, {color: 'white', fontSize: 15}]}>
          End user
        </Text>

        <Text
          style={[
            styles.title,
            {color: 'white', fontSize: 22, alignSelf: 'center'},
          ]}>
          {formik.values.selectedData}
        </Text>
      </ImageBackground>

      {/*  This is custome component for filter*/}
      {<StockTransactionFilter formik={formik} type={'balance'} />}

      {formik.values.section_type == '2' && (
        <>
          {ListData?.isLoading ? (
            <Loader />
          ) : !ListData?.isLoading &&
            !ListData?.isError &&
            ListData?.data?.status ? (
            <>
              <FlatList
                showsVerticalScrollIndicator={false}
                data={ListData?.data?.data}
                renderItem={renderItem}
                contentContainerStyle={{paddingBottom: 50}}
                ListEmptyComponent={renderEmptyComponent}
              />
              {ListData?.data?.pageDetails?.totalPages > 1 && (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.paginationButtonView}>
                  {renderPaginationButtons()}
                </ScrollView>
              )}
            </>
          ) : ListData?.isError ? (
            <InternalServer />
          ) : !formik.values.end_user_id ||
            (!ListData?.data?.status &&
              ListData?.data?.message == 'Data not found') ? (
            <>
              <DataNotFound />
            </>
          ) : (
            <InternalServer></InternalServer>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default ExpenseBalanceOverViewScreen;

const styles = StyleSheet.create({
  bankCard: {
    marginHorizontal: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 10,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
    flexShrink: 1,
  },
  paginationButtonView: {
    marginTop: WINDOW_HEIGHT * 0.8,
    bottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    backgroundColor: '',
    marginHorizontal: WINDOW_WIDTH * 0.01,
    columnGap: 20,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  paginationButton: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 4,
    backgroundColor: 'gray',
  },
  activeButton: {
    backgroundColor: '#22c55d',
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});
