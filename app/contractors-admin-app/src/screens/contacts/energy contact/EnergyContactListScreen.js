/*    ----------------Created Date :: 19- Sep -2024   ----------------- */

import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import React, { useState, useEffect } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import { useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import CustomeCard from '../../../component/CustomeCard';
import SearchBar from '../../../component/SearchBar';
import ScreensLabel from '../../../constants/ScreensLabel';
import CustomeHeader from '../../../component/CustomeHeader';
import { getAllEnergyTeamList } from '../../../redux/slices/energy team/getEnergyTeamListSlice';
import EnergyTeamFilter from '../../energy team/EnergyTeamFilter';
import NeumorphicCheckbox from '../../../component/NeumorphicCheckbox';
import NeumorphicButton from '../../../component/NeumorphicButton';
import List from '../../../component/List/List';

const EnergyContactListScreen = ({ navigation }) => {
  /* declare props constant variale*/

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const ListData = useSelector(state => state.getEnergyTeamList);
  const label = ScreensLabel();

  /*declare useState variable here */
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [searchText, setSearchText] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [checkData, setCheckData] = useState([{}]);
  const [filterChekcBox, setFilterChekcBox] = useState([]);
  const [loading, setLoading] = useState(false);

  /*for updating the checkbox*/
  const updateCheckDataAtIndex = (index, value) => {
    setCheckData(prevState => {
      const newState = [...prevState];
      newState[index] = value;
      return newState;
    });
  };

  useEffect(() => {
    const filteredData = checkData.filter(itm => itm?.chekedValue === true);
    setFilterChekcBox(filteredData);
  }, [checkData]);

  useEffect(() => {
    dispatch(
      getAllEnergyTeamList({
        id: companyId,
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  }, [searchText, isFocused, companyId]);

  function areAllIdsPresent(listedData, allData) {
    // Check if listedData is empty
    if (listedData.length === 0) {
      return false;
    }

    const listedIds = listedData.map(item => item.id);

    const allIds = allData.map(item => item.user_id);

    return allIds.every(id => listedIds.includes(id));
  }

  /* flatlist render ui */
  const renderItem = ({ item, index }) => {
    return (
      <View key={index}>
        <CustomeCard
          allData={item}
          data={[
            {
              component: (
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      alignSelf: 'flex-end',
                      position: 'absolute',
                    }}>
                    <NeumorphicCheckbox
                      isChecked={checkData[index]?.chekedValue}
                      onChange={val => {
                        updateCheckDataAtIndex(
                          index,
                          (val = {
                            chekedValue: val,
                            id: item?.user_id,
                            value: Array.isArray(item.email)
                              ? item?.email?.[0]?.email
                              : item?.email,
                          }),
                        );
                      }}
                    />
                  </View>
                </View>
              ),
            },
            {
              key: 'user name',
              value: item?.username ?? '--',
              keyColor: Colors().skyBule,
            },
            {
              key: 'mobile',
              value: item?.mobile ?? '--',
            },
            {
              key: 'email',
              value: item?.email ?? '--',
            },
            {
              key: 'country',
              value: item?.country ?? '--',
            },
            {
              key: 'city',
              value: item?.city ?? '--',
            },
            {
              key: 'pincode',
              value: item?.pin_code ?? '--',
            },
          ]}
        />
      </View>
    );
  };

  /*pagination button click funtion*/
  const handlePageClick = () => {
    dispatch(
      getAllEnergyTeamList({
        id: companyId,
        search: searchText,
        pageSize: pageSize,
        pageNo: pageNo,
      }),
    );
  };

  /*for send message*/
  const sendMessages = async () => {
    const reqBody = {
      data: filterChekcBox.map(itm => itm),
    };

    setLoading(true);
    setLoading(false);
    setFilterChekcBox([]);
    setCheckData([{}]);
    navigation.navigate('CreateUpdateBulkMessageScreen', {
      reqBody: reqBody?.data,
    });
  };

  /* Button ui for create pi*/
  const ListFooterComponent = () => (
    <View style={{ alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.02 }}>
      {filterChekcBox?.length >= 1 ? (
        <NeumorphicButton
          title={'send messages'}
          loading={loading}
          btnBgColor={Colors().purple}
          titleColor={Colors().inputLightShadow}
          onPress={() => sendMessages()}
        />
      ) : null}
    </View>
  );

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: Colors().screenBackground }}>
      <CustomeHeader headerTitle={label.ENERGY_TEAM} />
      {/*Seacrh componenet */}
      <SearchBar setSearchText={setSearchText} />

      <EnergyTeamFilter companyId={companyId} setCompanyId={setCompanyId} />

      {!ListData?.isLoading && !ListData?.isError && ListData?.data?.status ? (
        <View
          style={{
            alignSelf: 'flex-end',
            flexDirection: 'row',
            marginRight: 15,
            alignItems: 'center',
            marginTop: 5,
          }}>
          <Text
            style={[
              styles.cardHeadingTxt,
              { color: Colors().purple, fontSize: 15, marginRight: 10 },
            ]}>
            Select All
          </Text>
          <NeumorphicCheckbox
            isChecked={areAllIdsPresent(filterChekcBox, ListData?.data?.data)}
            onChange={e => {
              ListData?.data?.data?.map((itm, idx) => {
                const body = {
                  chekedValue: e,

                  id: itm?.user_id,
                  value: Array.isArray(itm.email)
                    ? itm?.email?.[0]?.email
                    : itm?.email,
                };

                updateCheckDataAtIndex(idx, (val = body));
              });
            }}
          />
        </View>
      ) : (
        ''
      )}

      <View style={{ height: WINDOW_HEIGHT * 0.82, width: WINDOW_WIDTH }}>
        <List
          data={ListData}
          permissions={{ view: true }}
          renderItem={renderItem}
          setPageNo={setPageNo}
          pageNo={pageNo}
          apiFunctions={handlePageClick}
          addAction={''}
          ListFooterComponent={ListFooterComponent}
        />
      </View>
    </SafeAreaView>
  );
};

export default EnergyContactListScreen;

const styles = StyleSheet.create({
  cardHeadingTxt: {
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 20,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
