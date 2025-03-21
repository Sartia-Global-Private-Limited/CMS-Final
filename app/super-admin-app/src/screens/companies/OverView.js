import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import CustomeHeader from '../../component/CustomeHeader';
import SearchBar from '../../component/SearchBar';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {useDispatch, useSelector} from 'react-redux';
import {
  getAllCompaniesList,
  getMyCompanyList,
  getPurchaseCompanyList,
  getSalesCompanyList,
} from '../../redux/slices/company/getCompanyListSlice';
import {deleteCompanyById} from '../../redux/slices/company/deleteCompanySlice';
import AlertModal from '../../component/AlertModal';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeCard from '../../component/CustomeCard';
import List from '../../component/List/List';
import CustomPieChart from '../../component/CustomPieChart';
import ClientBarChart from '../../component/ClientBarChart';
import CustomLineChart from '../../component/CustomLineChart';
import {Text} from 'react-native';

const OverView = ({navigation, route}) => {
  /* declare props constant variale*/
  const typeOfCompany = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const label = ScreensLabel();
  const getCompanyListData = useSelector(state => state.getCompanyList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (typeOfCompany === 'sales') {
      dispatch(
        getSalesCompanyList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    } else if (typeOfCompany === 'my') {
      dispatch(
        getMyCompanyList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    } else if (typeOfCompany === 'purchase') {
      dispatch(
        getPurchaseCompanyList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    } else {
      dispatch(
        getAllCompaniesList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
        }),
      );
    }
  }, [searchText]);

  /* delete my company function with id */
  const deleteCompany = async companyId => {
    try {
      const deleteResult = await dispatch(
        deleteCompanyById(companyId),
      ).unwrap();

      if (deleteResult?.status === true) {
        ToastAndroid.show(deleteResult?.message, ToastAndroid.LONG);
        setDeleteModalVisible(false), setCompanyId('');

        if (typeOfCompany === 'sales') {
          dispatch(getSalesCompanyList({pageSize: pageSize, pageNo: pageNo}));
        } else if (typeOfCompany === 'my') {
          dispatch(getMyCompanyList({pageSize: pageSize, pageNo: pageNo}));
        } else if (typeOfCompany === 'purchase') {
          dispatch(
            getPurchaseCompanyList({pageSize: pageSize, pageNo: pageNo}),
          );
        } else {
          dispatch(getAllCompaniesList({pageSize: pageSize, pageNo: pageNo}));
        }
      } else {
        ToastAndroid.show(deleteResult?.message, ToastAndroid.LONG);
        setDeleteModalVisible(false), setCompanyId('');
      }
    } catch (error) {}
  };

  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'edit':
        navigation.navigate('AddUpdateCompaniesScreen', {
          edit_id: actionButton?.itemData?.company_id,
          typeOfCompany: typeOfCompany,
        });

        break;

      case 'delete':
        setDeleteModalVisible(true),
          setCompanyId(actionButton?.itemData?.company_id);
        break;

      default:
        break;
    }
  };

  /* flatlist render ui */
  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() =>
          navigation.navigate('CompaniesDetailsScreen', {
            title: 'Company Detail',
            company_id: item?.company_id,
          })
        }>
        <CustomeCard
          allData={item}
          data={[
            {key: 'COMPANY NAME', value: item?.company_name},
            {key: 'COMPANY TYPE', value: item?.company_type_name},
            {key: 'Phone no.', value: item?.company_contact},
            {key: 'pan no', value: item?.pan_number},
            {key: 'gst no.', value: item?.gst_details[0]?.gst_number},
          ]}
          status={[{key: '', value: ''}]}
          editButton={true}
          deleteButton={true}
          action={handleAction}
        />
      </TouchableOpacity>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    if (typeOfCompany === 'sales') {
      dispatch(getSalesCompanyList({pageSize: pageSize, pageNo: pageNo}));
    } else if (typeOfCompany === 'my') {
      dispatch(getMyCompanyList({pageSize: pageSize, pageNo: pageNo}));
    } else if (typeOfCompany === 'purchase') {
      dispatch(getPurchaseCompanyList({pageSize: pageSize, pageNo: pageNo}));
    } else {
      dispatch(getAllCompaniesList({pageSize: pageSize, pageNo: pageNo}));
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader headerTitle={'360 View'} />
      <ScrollView>
        <CustomLineChart />
        <CustomPieChart />
        <ClientBarChart />
        <View
          style={{
            width: WINDOW_WIDTH * 0.92,
            alignItems: 'left',
            padding: 10,
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 18,
              color: Colors().purple,
              fontWeight: '600',
              fontFamily: Colors().fontFamilyBookMan,
            }}>
            All Companies
          </Text>
        </View>
        <SearchBar
          setSearchText={setSearchText}
          placeholderText={`${label.SEARCH}`}
          value={searchText}
        />
        <View style={{height: 'auto', width: WINDOW_WIDTH}}>
          <List
            data={getCompanyListData}
            permissions={{view: true}}
            renderItem={renderItem}
            setPageNo={setPageNo}
            pageNo={pageNo}
            apiFunctions={handlePageClick}
            editButton={() => {
              navigation.navigate('AddUpdateCompaniesScreen', {
                typeOfCompany: typeOfCompany,
              });
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
            ConfirmBtnPress={() => deleteCompany(companyId)}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OverView;

const styles = StyleSheet.create({
  cardContainer: {
    width: WINDOW_WIDTH,
    height: 'auto',
    alignSelf: 'center',
  },
});
