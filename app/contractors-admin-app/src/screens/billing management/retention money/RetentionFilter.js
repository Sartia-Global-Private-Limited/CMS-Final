/*    ----------------Created Date :: 22- June -2024   ----------------- */

import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../../utils/ScreenLayout';
import { useDispatch } from 'react-redux';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {
  getAllPoForRetentionFilter,
  getAllRetentionForRetentionFilter,
  getAllRoForRetentionFilter,
} from '../../../redux/slices/billing management/retention money/addUpdateRetentionSlice';

const RetentionFilter = ({
  type,
  statusCode,
  po,
  setPo,
  ro,
  setRo,
  retention,
  setRetention,
}) => {
  const dispatch = useDispatch();

  const [allRo, setAllRo] = useState([]);
  const [allPo, setAllPo] = useState([]);
  const [allRetention, setAllRetention] = useState([]);

  useEffect(() => {
    fetchAllPo();

    fetchAllRetention();
  }, [type, statusCode]);

  /* function for fetching Po number   */
  const fetchAllPo = async () => {
    try {
      const result = await dispatch(
        getAllPoForRetentionFilter(statusCode),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.po_number,
          value: itm?.id,
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
  const fetchAllRo = async poId => {
    try {
      const result = await dispatch(
        getAllRoForRetentionFilter({ status: statusCode, po: poId }),
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

  /* function for fetching retention number   */
  const fetchAllRetention = async roId => {
    try {
      const result = await dispatch(
        getAllRetentionForRetentionFilter({ status: statusCode, ro: roId }),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.retention_unique_id,
          value: itm?.retention_unique_id,
        }));
        setAllRetention(rData);
      } else {
        setAllRetention([]);
      }
    } catch (error) {
      setAllRetention([]);
    }
  };

  /*for resetting all filter*/
  const resetFunction = () => {
    setPo('');
    setRo('');
    setRetention('');
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
            placeHolderTxt={'Po number'}
            data={allPo}
            value={po}
            onChange={val => {
              setPo(val?.value);
              fetchAllRo(val?.value);
            }}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'Ro number'}
            data={allRo}
            value={ro}
            onChange={val => {
              setRo(val.value);
              fetchAllRetention(val?.value);
            }}
          />
          {statusCode != 1 && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'Retention'}
              data={allRetention}
              value={retention}
              onChange={val => {
                setRetention(val.value);
              }}
            />
          )}

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

export default RetentionFilter;

const styles = StyleSheet.create({});
