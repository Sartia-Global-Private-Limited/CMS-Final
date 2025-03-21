/*    ----------------Created Date :: 18- May -2024   ----------------- */

import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../../utils/ScreenLayout';
import { useDispatch } from 'react-redux';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {
  getAllOutletSiteStockInspection,
  getAllRoSiteStockInspection,
  getAllSaSiteStockInspection,
} from '../../../redux/slices/commonApi';
import SearchBar from '../../../component/SearchBar';

const SiteStockInspectionFilter = ({
  type,
  roId,
  setRoId,
  saId,
  setSaId,
  outletId,
  setOutletId,
  setSearchText,
}) => {
  const dispatch = useDispatch();

  const [allRo, setAllRo] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [allOutlet, setAllOutlet] = useState([]);

  const getStatus = type => {
    switch (type) {
      case 'pending':
        return 0;
      case 'partial':
        return 1;
      case 'approved':
        return 2;

      default:
        break;
    }
  };

  useEffect(() => {
    fetchAllRegionalOffice();
    fetchAllSalesArea();
    fetchAllOutlet();
  }, [type]);

  /* function for fetching regional office */
  const fetchAllRegionalOffice = async () => {
    try {
      const result = await dispatch(
        getAllRoSiteStockInspection({ statusCode: getStatus(type) }),
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
  /* function for fetching sales area */
  const fetchAllSalesArea = async () => {
    try {
      const result = await dispatch(
        getAllSaSiteStockInspection({ statusCode: getStatus(type) }),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.sales_area_name,
          value: itm?.id,
        }));
        setAllSa(rData);
      } else {
        setAllSa([]);
      }
    } catch (error) {
      setAllSa([]);
    }
  };

  /* function for fetching outlet   */
  const fetchAllOutlet = async () => {
    try {
      const result = await dispatch(
        getAllOutletSiteStockInspection({ statusCode: getStatus(type) }),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.outlet_name,
          value: itm?.id,
        }));
        setAllOutlet(rData);
      } else {
        setAllOutlet([]);
      }
    } catch (error) {
      setAllOutlet([]);
    }
  };

  /*for resetting all filter*/
  const resetFunction = () => {
    setRoId('');
    setSaId('');
    setOutletId('');
  };

  return (
    <View style={{ margin: WINDOW_WIDTH * 0.02 }}>
      <>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            columnGap: 10,
          }}>
          <SearchBar setSearchText={setSearchText} />
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'regional office'}
            data={allRo}
            value={roId}
            onChange={val => {
              setRoId(val.value);
            }}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'sales area'}
            data={allSa}
            value={saId}
            onChange={val => {
              setSaId(val.value);
            }}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'outlet name'}
            data={allOutlet}
            value={outletId}
            onChange={val => {
              setOutletId(val?.value);
            }}
          />

          <View style={{ paddingTop: 5 }}>
            <NeumorphicButton
              title={'reset'}
              fontSize={WINDOW_HEIGHT * 0.015}
              btnHeight={WINDOW_HEIGHT * 0.05}
              btnWidth={WINDOW_WIDTH * 0.16}
              btnBgColor={Colors().purple}
              titleColor={Colors().lightShadow}
              btnRadius={8}
              onPress={() => resetFunction()}
            />
          </View>
        </ScrollView>
      </>
    </View>
  );
};

export default SiteStockInspectionFilter;

const styles = StyleSheet.create({});
