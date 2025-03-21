/*    ----------------Created Date :: 10- August -2024   ----------------- */

import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../constants/Colors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../utils/ScreenLayout';
import { useDispatch } from 'react-redux';
import NeumorphicDropDownList from '../../component/DropDownList';
import NeumorphicButton from '../../component/NeumorphicButton';

import {
  getAllAreaManagerForPaymentPaidFilter,
  getAllPoForPaymentPaidFilter,
  getAllRoForPaymentPaidFilter,
} from '../../redux/slices/paid invoice/addUpadatePaymentPaidSlice';

const RegionalOfficeFilter = ({
  type,
  statusCode,
  roId,
  setRoId,
  poId,
  setPoId,
}) => {
  const dispatch = useDispatch();

  const [allRo, setAllRo] = useState([]);
  const [allPo, setAllPo] = useState([]);

  useEffect(() => {
    fetchAllRo();
    fetchAllAreamanger();
  }, [type, statusCode]);

  /* function for fetching Ro number   */
  const fetchAllRo = async () => {
    try {
      const result = await dispatch(getAllRoForPaymentPaidFilter()).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.ro_name,
          value: itm?.ro_id,
        }));
        setAllRo(rData);
      } else {
        setAllRo([]);
      }
    } catch (error) {
      setAllRo([]);
    }
  };

  /* function for fetching retention number   */
  const fetchAllAreamanger = async () => {
    try {
      const result = await dispatch(getAllPoForPaymentPaidFilter()).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.ro_name,
          value: itm?.ro_name,
        }));
        setAllPo(rData);
      } else {
        setAllPo([]);
      }
    } catch (error) {
      setAllPo([]);
    }
  };

  /*for resetting all filter*/
  const resetFunction = () => {
    setPoId(''), setRoId('');
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
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'Ro number'}
            required={true}
            data={allRo}
            value={roId}
            onChange={val => {
              setRoId(val?.value);
            }}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'po'}
            required={true}
            data={allPo}
            value={poId}
            onChange={val => {
              setPoId(val?.value);
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

export default RegionalOfficeFilter;

const styles = StyleSheet.create({});
