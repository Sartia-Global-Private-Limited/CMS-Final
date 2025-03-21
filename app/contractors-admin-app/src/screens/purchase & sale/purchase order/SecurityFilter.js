/*    ----------------Created Date :: 30- July -2024   ----------------- */

import { StyleSheet, View, ScrollView, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../../constants/Colors';
import { useDispatch } from 'react-redux';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicButton from '../../../component/NeumorphicButton';
import { WINDOW_HEIGHT, WINDOW_WIDTH } from '../../../utils/ScreenLayout';
import {
  getAllPoForSecurityFilter,
  getAllRoForSecurityFilter,
  getAllSecurityForSecurityFilter,
} from '../../../redux/slices/purchase & sale/purchase-order/addUpdateSecuritySlice';

const SecurityFilter = ({
  type,
  statusCode,
  po,
  setPo,
  ro,
  setRo,
  securityId,
  setSecurityId,
}) => {
  const dispatch = useDispatch();

  const [allRo, setAllRo] = useState([]);
  const [allPo, setAllPo] = useState([]);
  const [allSecurity, setAllSecurity] = useState([]);

  useEffect(() => {
    fetchAllRo();
    fetchAllSecurity();
  }, [type, statusCode, setPo, setRo, setSecurityId]);

  /* function for fetching Po number   */
  const fetchAllPo = async roId => {
    try {
      const result = await dispatch(
        getAllPoForSecurityFilter({ status: statusCode, ro: roId }),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.po_number,
          value: itm?.po_number,
        }));
        setAllPo(rData);
      } else {
        setAllPo([]);
      }
    } catch (error) {
      setAllPo([]);
    }
  };

  /* function for fetching Ro number   */
  const fetchAllRo = async () => {
    try {
      const result = await dispatch(
        getAllRoForSecurityFilter(statusCode),
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
  const fetchAllSecurity = async poId => {
    try {
      const result = await dispatch(
        getAllSecurityForSecurityFilter({ status: statusCode, po: poId }),
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
    setPo('');
    setRo('');
    setSecurityId('');
  };

  return (
    <View style={{ marginHorizontal: WINDOW_WIDTH * 0.03 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          columnGap: 10,
        }}>
        <NeumorphicDropDownList
          height={WINDOW_HEIGHT * 0.06}
          width={WINDOW_WIDTH * 0.75}
          title={'Ro number'}
          data={allRo}
          value={ro}
          onChange={val => {
            setRo(val.value);
            fetchAllPo(val?.value);
          }}
        />
        <NeumorphicDropDownList
          height={WINDOW_HEIGHT * 0.06}
          width={WINDOW_WIDTH * 0.75}
          title={'Po number'}
          data={allPo}
          value={po}
          onChange={val => {
            setPo(val?.value);

            fetchAllSecurity(val?.value);
          }}
        />
        {statusCode != 1 && (
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            title={'Security'}
            data={allSecurity}
            value={securityId}
            onChange={val => {
              setSecurityId(val.value);
            }}
          />
        )}

        <View style={{ alignSelf: 'center', marginTop: WINDOW_HEIGHT * 0.025 }}>
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
    </View>
  );
};

export default SecurityFilter;

const styles = StyleSheet.create({});
