import {StyleSheet, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../constants/Colors';
import {WINDOW_WIDTH, WINDOW_HEIGHT} from '../../utils/ScreenLayout';
import {useDispatch} from 'react-redux';
import NeumorphicDropDownList from '../../component/DropDownList';
import NeumorphicButton from '../../component/NeumorphicButton';
import {getAllActiveCompanyList} from '../../redux/slices/commonApi';
import SearchBar from '../../component/SearchBar';

const EnergyTeamFilter = ({companyId, setCompanyId, setSearchText}) => {
  const dispatch = useDispatch();
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

  /*for resetting all filter*/
  const resetFunction = () => {
    setCompanyId('');
  };

  return (
    <View style={{marginHorizontal: WINDOW_WIDTH * 0.01, marginVertical: 5}}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          columnGap: 10,
          alignItems: 'center',
        }}>
        <NeumorphicDropDownList
          height={WINDOW_HEIGHT * 0.05}
          width={WINDOW_WIDTH * 0.75}
          placeHolderTxt={'Company'}
          data={allEenergyCompany}
          value={companyId}
          onChange={val => {
            setCompanyId(val.value);
          }}
          onCancle={() => {
            setCompanyId('');
          }}
        />
        <SearchBar
          setSearchText={setSearchText}
          searchWidth={WINDOW_WIDTH * 0.8}
        />

        <View style={{alignSelf: 'center'}}>
          <NeumorphicButton
            title={'reset'}
            fontSize={WINDOW_HEIGHT * 0.015}
            btnHeight={WINDOW_HEIGHT * 0.045}
            btnWidth={WINDOW_WIDTH * 0.16}
            btnBgColor={Colors().purple}
            titleColor={Colors().lightShadow}
            btnRadius={8}
            onPress={() => resetFunction()}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default EnergyTeamFilter;

const styles = StyleSheet.create({});
