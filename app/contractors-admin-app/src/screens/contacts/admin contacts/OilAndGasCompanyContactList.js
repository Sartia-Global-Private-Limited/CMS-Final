import { View, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import SearchBar from '../../../component/SearchBar';
import CustomeHeader from '../../../component/CustomeHeader';
import List from '../../../component/List/List';
import { getOilAndGasContacts } from '../../../redux/slices/contacts/admin contacts/getAdminContactListSlice';
import NeumorphicDropDownList from '../../../component/DropDownList';
import { getAllActiveCompanyList } from '../../../redux/slices/commonApi';

const OilAndGasCompanyContactList = ({ navigation, route }) => {
  /* declare props constant variale*/
  const type = route?.params?.type;

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getAdminContactList);

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [userId, setUserId] = useState('');
  const [Id, setId] = useState('');
  const [searchText, setSearchText] = useState('');

  const [allEenergyCompany, setAllEnergyCompany] = useState([]);

  useEffect(() => {
    fetchCompany();
  }, []);

  /* function for fectching all energy company   */
  const fetchCompany = async () => {
    try {
      const result = await dispatch(getAllActiveCompanyList()).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.name,
          value: itm?.energy_company_id,
        }));
        setAllEnergyCompany(rData);
      } else {
        setAllEnergyCompany([]);
      }
    } catch (error) {
      setAllEnergyCompany([]);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', e => {
      dispatch(
        getOilAndGasContacts({
          id: Id,
          user_id: '',
          search: searchText,
          pageSize: pageSize,
          pageNo: pageNo,
        }),
      );
    });
    return unsubscribe;
  }, [type, isFocused, Id]);

  useEffect(() => {
    dispatch(
      getOilAndGasContacts({
        id: Id,
        user_id: '',
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [searchText]);

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity
          // disabled={type !== 'company'}
          disabled={true}
          onPress={() => {
            navigation.navigate('ContactDetailScreen', {
              id: item?.id,
            });
          }}>
          <CustomeCard
            allData={item}
            data={[
              {
                key: 'Sr. No.',
                value: index + 1 ?? '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'User Name',
                value: item?.username ?? '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'Mobile Number',
                value: item?.mobile || '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'Email',
                value: item?.email || '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'Coutry',
                value: item?.country ?? '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'City',
                value: item?.city ?? '--',
                keyColor: Colors().pureBlack,
              },
              {
                key: 'Pincode',
                value: item?.pin_code ?? '--',
                keyColor: Colors().pureBlack,
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
      getOilAndGasContacts({
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
        id: Id,
        user_id: '',
      }),
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      {/*Seacrh componenet */}
      <CustomeHeader headerTitle={`Oil And Gas Company Contact`} />
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
        }}>
        <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
          <View style={{ marginTop: WINDOW_WIDTH * 0.02, paddingLeft: 8 }}>
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'Energy Company'}
              data={allEenergyCompany || []}
              value={Id}
              onChange={val => {
                setId(val?.value);
              }}
              onCancle={() => {
                setId('');
              }}
            />
          </View>
          <SearchBar setSearchText={setSearchText} />
        </ScrollView>
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

export default OilAndGasCompanyContactList;
