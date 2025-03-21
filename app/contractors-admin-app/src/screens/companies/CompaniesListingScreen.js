import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../constants/Colors';
import IconType from '../../constants/IconType';
import CustomeHeader from '../../component/CustomeHeader';
import SearchBar from '../../component/SearchBar';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../utils/ScreenLayout';
import { useDispatch, useSelector } from 'react-redux';
import {
  getAllCompaniesList,
  getMyCompanyList,
  getPurchaseCompanyList,
  getSalesCompanyList,
} from '../../redux/slices/company/getCompanyListSlice';
import { deleteCompanyById } from '../../redux/slices/company/deleteCompanySlice';
import AlertModal from '../../component/AlertModal';
import ScreensLabel from '../../constants/ScreensLabel';
import CustomeCard from '../../component/CustomeCard';
import List from '../../component/List/List';
import {
  getCitiesBasedOnCompany,
  getCitiesBasedOnType,
} from '../../services/authApi';
import NeumorphicDropDownList from '../../component/DropDownList';

const CompaniesListingScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const typeOfCompany = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const label = ScreensLabel();
  const getCompanyListData = useSelector(state => state.getCompanyList);

  /*declare useState variable here */
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [companyId, setCompanyId] = useState('');
  const [cityId, setCityId] = useState('');
  const [allCities, setAllCities] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (typeOfCompany == 'sales' || typeOfCompany == 'purchase') {
      getCitiesByType(typeOfCompany === 'sales' ? 1 : 2);
    } else if (typeOfCompany === 'my') {
      getCitiesByCompnay();
    } else {
    }
  }, []);

  const getCitiesByCompnay = async () => {
    try {
      const res = await getCitiesBasedOnCompany('my');
      if (res.status) {
        const rdata = res?.data?.map(i => ({
          label: i.city_name,
          value: i.city_name,
        }));
        setAllCities(rdata);
      } else {
        setAllCities([]);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  const getCitiesByType = async type => {
    try {
      const res = await getCitiesBasedOnType(type);
      if (res.status) {
        const rdata = res?.data?.map(i => ({
          label: i.city_name,
          value: i.city_name,
        }));
        setAllCities(rdata);
      } else {
        setAllCities([]);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useEffect(() => {
    if (typeOfCompany === 'sales') {
      dispatch(
        getSalesCompanyList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
          city: cityId,
        }),
      );
    } else if (typeOfCompany === 'my') {
      dispatch(
        getMyCompanyList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
          city: cityId,
        }),
      );
    } else if (typeOfCompany === 'purchase') {
      dispatch(
        getPurchaseCompanyList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
          city: cityId,
        }),
      );
    } else {
      dispatch(
        getAllCompaniesList({
          pageSize: pageSize,
          pageNo: pageNo,
          search: searchText,
          city: cityId,
        }),
      );
    }
  }, [searchText, cityId]);

  const getCompanyHeader = type => {
    switch (type) {
      case 'my':
        return label.MY_COMPANIES;

      case 'sales':
        return label.CLIENT;

      case 'purchase':
        return label.VENDOR;

      case 'all':
        return label.ALL_COMPANIES;

      case 'client':
        return label.CLIENT;

      default:
        break;
    }
  };

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
          dispatch(
            getSalesCompanyList({
              pageSize: pageSize,
              pageNo: pageNo,
              city: cityId,
            }),
          );
        } else if (typeOfCompany === 'my') {
          dispatch(
            getMyCompanyList({
              pageSize: pageSize,
              pageNo: pageNo,
              city: cityId,
            }),
          );
        } else if (typeOfCompany === 'purchase') {
          dispatch(
            getPurchaseCompanyList({
              pageSize: pageSize,
              pageNo: pageNo,
              city: cityId,
            }),
          );
        } else {
          dispatch(
            getAllCompaniesList({
              pageSize: pageSize,
              pageNo: pageNo,
              city: cityId,
            }),
          );
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
  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={styles.cardContainer}
        onPress={() =>
          navigation.navigate('CompaniesDetailsScreen', {
            title: 'Company Detail',
            company_id: item?.company_id,
            type: typeOfCompany,
          })
        }>
        <CustomeCard
          allData={item}
          data={[
            { key: 'COMPANY NAME', value: item?.company_name },
            { key: 'COMPANY TYPE', value: item?.company_type_name },
            { key: 'Phone no.', value: item?.company_contact },
            { key: 'pan no', value: item?.pan_number },
            { key: 'gst no.', value: item?.gst_details[0]?.gst_number },
          ]}
          status={[{ key: 'Action', value: '' }]}
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
      dispatch(
        getSalesCompanyList({
          pageSize: pageSize,
          pageNo: pageNo,
          city: cityId,
        }),
      );
    } else if (typeOfCompany === 'my') {
      dispatch(
        getMyCompanyList({ pageSize: pageSize, pageNo: pageNo, city: cityId }),
      );
    } else if (typeOfCompany === 'purchase') {
      dispatch(
        getPurchaseCompanyList({
          pageSize: pageSize,
          pageNo: pageNo,
          city: cityId,
        }),
      );
    } else {
      dispatch(
        getAllCompaniesList({
          pageSize: pageSize,
          pageNo: pageNo,
          city: cityId,
        }),
      );
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={getCompanyHeader(typeOfCompany)} />

      <View style={{ display: 'flex', flexDirection: 'row', paddingTop: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ paddingTop: 8, paddingLeft: 8 }}>
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'Locations'}
              data={allCities}
              value={cityId}
              onChange={val => {
                setCityId(val.value);
              }}
              onCancle={() => {
                setCityId('');
              }}
            />
          </View>
          <SearchBar
            setSearchText={setSearchText}
            placeholderText={`${label.SEARCH}`}
            value={searchText}
          />
        </ScrollView>
      </View>

      <View style={{ height: WINDOW_HEIGHT * 0.9, width: WINDOW_WIDTH }}>
        <List
          data={getCompanyListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addFunction={() => {
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
    </SafeAreaView>
  );
};

export default CompaniesListingScreen;

const styles = StyleSheet.create({
  cardContainer: {
    width: WINDOW_WIDTH,
    height: 'auto',
    alignSelf: 'center',
  },
});
