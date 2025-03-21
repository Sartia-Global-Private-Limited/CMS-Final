/*    ----------------Created Date :: 5- August -2024   ----------------- */

import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../../constants/Colors';
import { useDispatch } from 'react-redux';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicButton from '../../../component/NeumorphicButton';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import {
  getAllRoForSoSecurityFilter,
  getAllSecurityForSoSecurityFilter,
  getAllSoForSoSecurityFilter,
} from '../../../redux/slices/purchase & sale/sale-order/addUpdateSaleSecuritySlice';
import SearchBar from '../../../component/SearchBar';

const SalesSecurityFilter = ({
  type,
  statusCode,
  so,
  setSo,
  ro,
  setRo,
  securityId,
  setSecurityId,
  setSearchText,
}) => {
  const dispatch = useDispatch();

  const [allRo, setAllRo] = useState([]);
  const [allSo, setAllSo] = useState([]);
  const [allSecurity, setAllSecurity] = useState([]);

  useEffect(() => {
    fetchAllRo();
    fetchAllSecurity();
  }, [type, statusCode, setSo, setRo, setSecurityId]);

  /* function for fetching So number   */
  const fetchAllSo = async roId => {
    try {
      const result = await dispatch(
        getAllSoForSoSecurityFilter({ status: statusCode, ro: roId }),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.so_number,
          value: itm?.so_number,
        }));
        setAllSo(rData);
      } else {
        setAllSo([]);
      }
    } catch (error) {
      setAllSo([]);
    }
  };

  /* function for fetching Ro number   */
  const fetchAllRo = async () => {
    try {
      const result = await dispatch(
        getAllRoForSoSecurityFilter(statusCode),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.regional_office_name,
          value: itm?.id,
        }));
        setAllRo(rData);
      } else {
        setAllRo([]);
      }
    } catch (error) {
      setAllRo([]);
    }
  };

  /* function for fetching securityId number   */
  const fetchAllSecurity = async soId => {
    try {
      const result = await dispatch(
        getAllSecurityForSoSecurityFilter({ status: statusCode, so: soId }),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.security_unique_id,
          value: itm?.security_unique_id,
        }));
        setAllSecurity(rData);
      } else {
        setAllSecurity([]);
      }
    } catch (error) {
      setAllSecurity([]);
    }
  };

  /*for resetting all filter*/
  const resetFunction = () => {
    setSo('');
    setRo('');
    setSecurityId('');
  };

  return (
    <View style={{ marginHorizontal: WINDOW_WIDTH * 0.01, marginVertical: 5 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          columnGap: 8,
          alignItems: 'center',
        }}>
        <SearchBar
          searchWidth={WINDOW_WIDTH * 0.8}
          setSearchText={setSearchText}
        />
        <NeumorphicDropDownList
          height={WINDOW_HEIGHT * 0.05}
          width={WINDOW_WIDTH * 0.75}
          placeHolderTxt={'Ro number'}
          data={allRo}
          value={ro}
          onChange={val => {
            setRo(val.value);
            fetchAllSo(val?.value);
          }}
        />
        <NeumorphicDropDownList
          height={WINDOW_HEIGHT * 0.05}
          width={WINDOW_WIDTH * 0.75}
          placeHolderTxt={'so number'}
          data={allSo}
          value={so}
          onChange={val => {
            setSo(val?.value);

            fetchAllSecurity(val?.value);
          }}
        />
        {statusCode != 1 && (
          <NeumorphicDropDownList
            height={WINDOW_HEIGHT * 0.05}
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'Security'}
            data={allSecurity}
            value={securityId}
            onChange={val => {
              setSecurityId(val.value);
            }}
          />
        )}

        <View style={{}}>
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

export default SalesSecurityFilter;

const styles = StyleSheet.create({});
