/*    ----------------Created Date :: 24- April -2024   ----------------- */
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../../constants/Colors';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import {useDispatch, useSelector} from 'react-redux';
import Loader from '../../../component/Loader';
import InternalServer from '../../../component/InternalServer';
import DataNotFound from '../../../component/DataNotFound';
import CustomeHeader from '../../../component/CustomeHeader';
import Images from '../../../constants/Images';
import {useFormik} from 'formik';
import {Menu, MenuItem} from 'react-native-material-menu';
import {Icon} from '@rneui/themed';
import StockTransactionFilter from '../../stock management/stock transactions/StockTransactionFilter';
import {getBankFundTransactionByUserId} from '../../../redux/slices/expense-management/expense transaction/getExpenseTransactionSlice';
import CustomeCard from '../../../component/CustomeCard';
import ScreensLabel from '../../../constants/ScreensLabel';
const ViewSPTranscationScreen = ({navigation, route}) => {
  /*declare hooks variable here */
  const dispatch = useDispatch();
  const label = ScreensLabel();
  const ListData = useSelector(state => state.getExpenseTransaction);

  /*declare useState variable here */
  const [visible, setVisible] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('last 12 Months');

  const filterArray = [
    'today',
    'yesterday',
    'this Week',
    'last Week',
    'this Month',
    'last Month',
    'this Quarter',
    'last Quarter',
    'last 6 Months',
    'last 12 Months',
  ];

  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');

    setVisible(false);
    if (val !== undefined) {
      setSelectedMenuItem(val);
      formik.setFieldValue(`date`, valueToSend);
    }
  };

  const showMenu = () => setVisible(true);

  const formik = useFormik({
    initialValues: {
      pageSize: 8,
      pageNo: 1,
      search: '',
      section_type: '2',
      selectedData: '',
      start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end_date: new Date(),
      date: 'last12Months',
      office_id: '',
      manager_id: '',
      supervisor_id: '',
      enduser_id: '',
      end_user_id: '',
    },
  });

  useEffect(() => {
    if (formik.values.section_type == '2') {
      dispatch(
        getBankFundTransactionByUserId({
          empId: formik.values.end_user_id,
          date: formik.values.date,
          pageSize: formik.values.pageSize,
          pageNo: formik.values.pageNo,
          search: formik.values.search,
        }),
      );
    }
  }, [
    formik.values.search,
    formik.values.pageNo,
    formik.values.end_user_id,
    formik.values.date,
  ]);

  /* function pagination detail of each section */
  const getPaginatinoData = () => {
    if (formik.values.section_type == '2') {
      return ListData?.data?.pageDetails?.totalPages;
    }
  };

  /* for getting color of status*/
  function getStatusColor1(action) {
    switch (action) {
      case 'credit':
        return Colors().aprroved;
      case 'debit':
        return Colors().red;

      default:
        return 'black';
    }
  }

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <View>
        <CustomeCard
          data={[
            {key: 'description', value: item?.description},
            {
              key: 'Complaint no',
              value: item?.complaint_details?.complaint_unique_id,
              keyColor: Colors().purple,
            },
            {
              key: 'UPDATED BALANCE',
              value: `₹ ${item?.balance}`,
              keyColor: Colors().purple,
            },
            {
              key: 'status',
              value: item?.status,
              keyColor: Colors().aprroved,
            },
            {
              key: 'date',
              value: item.transaction_date,
            },
          ]}
          status={[
            {
              key: 'Transaction',
              value: `${item?.transaction_type == 'credit' ? ' + ' : ' - '} ₹ ${
                item?.amount
              }`,
              color: getStatusColor1(item?.transaction_type),
            },
          ]}
          rightStatus={[
            {
              // key: '',
              value: `${item?.transaction_type}ed`,
              color: getStatusColor1(item?.transaction_type),
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
      <CustomeHeader headerTitle={label.SP_TRANSACTIONS} />
      <ScrollView
        contentContainerStyle={{}}
        showsVerticalScrollIndicator={false}>
        {formik.values.section_type == '2' && (
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
        )}
        {/*  This is custome component for filter*/}
        {
          <StockTransactionFilter
            formik={formik}
            type={'trasaction'}
            dateFilter={true}
          />
        }

        <View style={styles.actionView}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={[
                styles.cardHeadingTxt,
                {fontSize: 15, color: Colors().purple},
              ]}>
              All transaction history :{' '}
            </Text>
          </View>

          <View style={styles.actionView2}>
            <Menu
              visible={visible}
              anchor={
                <Icon
                  name="dots-three-vertical"
                  type={IconType.Entypo}
                  color={Colors().edit}
                  style={styles.actionIcon}
                  onPress={showMenu}
                />
              }
              onRequestClose={hideMenu}>
              {filterArray.map(itm => (
                <MenuItem
                  style={{backgroundColor: Colors().inputLightShadow}}
                  disabled={selectedMenuItem == itm}
                  textStyle={
                    selectedMenuItem === itm // If the menu item is disabled
                      ? [styles.cardtext, {color: 'red'}] // Apply red color
                      : [styles.cardtext, {color: Colors().pureBlack}] // Otherwise, use the default text style
                  }
                  onPress={() => {
                    hideMenu(itm);
                  }}>
                  {itm}
                </MenuItem>
              ))}
            </Menu>
          </View>
        </View>

        {formik.values.section_type == '2' && (
          <>
            {ListData?.isLoading ? (
              <View style={styles.transactionNoFound}>
                <Loader />
              </View>
            ) : !ListData?.isLoading &&
              !ListData?.isError &&
              ListData?.data?.status ? (
              <>
                {ListData?.data?.data.map(item => renderItem({item}))}

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
              <View style={styles.transactionNoFound}>
                <InternalServer />
              </View>
            ) : !formik.values.account_id ||
              (!ListData?.data?.status &&
                ListData?.data?.message == 'Data not found') ? (
              <View style={styles.transactionNoFound}>
                <DataNotFound />
              </View>
            ) : (
              <View style={styles.transactionNoFound}>
                <InternalServer></InternalServer>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewSPTranscationScreen;

const styles = StyleSheet.create({
  bankCard: {
    margin: WINDOW_WIDTH * 0.03,
    padding: WINDOW_WIDTH * 0.03,
    rowGap: 10,
  },
  transactionNoFound: {
    height: WINDOW_HEIGHT * 0.4,
    width: WINDOW_WIDTH * 0.95,
  },

  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    color: Colors().pureBlack,
    flexShrink: 1,
  },

  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
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
  actionView: {
    margin: WINDOW_WIDTH * 0.03,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionView2: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    columnGap: 10,
  },
});
