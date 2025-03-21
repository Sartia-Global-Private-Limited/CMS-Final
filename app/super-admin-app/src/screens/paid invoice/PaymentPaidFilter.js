/*    ----------------Created Date :: 3- August -2024   ----------------- */

import {StyleSheet, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../constants/Colors';
import {WINDOW_WIDTH, WINDOW_HEIGHT} from '../../utils/ScreenLayout';
import {useDispatch} from 'react-redux';
import NeumorphicDropDownList from '../../component/DropDownList';
import NeumorphicButton from '../../component/NeumorphicButton';

import {
  getAllAreaManagerForPaymentPaidFilter,
  getAllRoForPaymentPaidFilter,
} from '../../redux/slices/paid invoice/addUpadatePaymentPaidSlice';

const PaymentPaidFilter = ({
  type,
  statusCode,
  roId,
  setRoId,
  areaManagerId,
  setAreaManagerId,
}) => {
  const dispatch = useDispatch();

  const [allRo, setAllRo] = useState([]);
  const [allAreaManager, setAllAreamanager] = useState([]);

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
      const result = await dispatch(
        getAllAreaManagerForPaymentPaidFilter(),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.area_manager_name,
          value: itm?.area_manager_id,
        }));
        setAllAreamanager(rData);
      } else {
        setAllAreamanager([]);
      }
    } catch (error) {
      setAllAreamanager([]);
    }
  };

  /*for resetting all filter*/
  const resetFunction = () => {
    setAreaManagerId(''), setRoId('');
  };

  return (
    <View style={{margin: WINDOW_WIDTH * 0.03}}>
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
            placeHolderTxt={'Area manger'}
            required={true}
            data={allAreaManager}
            value={areaManagerId}
            onChange={val => {
              setAreaManagerId(val?.value);
            }}
          />

          <View style={{alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.025}}>
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

export default PaymentPaidFilter;

const styles = StyleSheet.create({});
