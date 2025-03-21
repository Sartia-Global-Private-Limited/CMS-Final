import {StyleSheet, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_WIDTH, WINDOW_HEIGHT} from '../../../utils/ScreenLayout';
import {useDispatch} from 'react-redux';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {getAllPvNumberWithStatusCode} from '../../../redux/slices/commonApi';

const PaymentFilter = ({type, statusCode, pvNo, setPvNo}) => {
  const dispatch = useDispatch();

  const [allPvNo, setAllPvNo] = useState([]);

  useEffect(() => {
    fetchAllPvNo();
  }, [type, statusCode]);

  /* function for fetching Pv number   */
  const fetchAllPvNo = async () => {
    try {
      const result = await dispatch(
        getAllPvNumberWithStatusCode(statusCode),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.pv_number,
          value: itm?.pv_number,
        }));
        setAllPvNo(rData);
      } else {
        setAllPvNo([]);
      }
    } catch (error) {
      setAllPvNo([]);
    }
  };

  /*for resetting all filter*/
  const resetFunction = () => {
    setPvNo('');
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
            placeHolderTxt={'PV number'}
            data={allPvNo}
            value={pvNo}
            onChange={val => {
              setPvNo(val.value);
            }}
          />

          <View style={{paddingTop: 5}}>
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

export default PaymentFilter;

const styles = StyleSheet.create({});
