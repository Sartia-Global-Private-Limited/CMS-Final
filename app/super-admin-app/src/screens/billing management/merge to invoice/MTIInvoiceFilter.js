import {StyleSheet, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import Colors from '../../../constants/Colors';
import {WINDOW_WIDTH, WINDOW_HEIGHT} from '../../../utils/ScreenLayout';
import {useDispatch} from 'react-redux';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {
  getAllBillingFromForMTIFilter,
  getAllBillingToForMTIFilter,
  getAllPoForMTIFilter,
  getAllRoForMTIFilter,
} from '../../../redux/slices/billing management/merge to invoice/addUpdateMTISlice';

const MTIInvoiceFilter = ({
  type,
  statusCode,
  poId,
  setPoId,
  roId,
  setRoId,
  billingFromId,
  setBillingFromId,
  billingToId,
  setBillingToId,
}) => {
  const dispatch = useDispatch();

  const [allPo, setAllPo] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allBillingFrom, setAllBillingFrom] = useState([]);
  const [allBillingTo, setAllBillingTo] = useState([]);

  useEffect(() => {
    fetchAllPO();
  }, [type, statusCode]);

  /* function for fetching Po number   */
  const fetchAllPO = async () => {
    try {
      const result = await dispatch(
        getAllPoForMTIFilter({status: statusCode}),
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
  /* function for fetching regional office */
  const fetchAllRegionalOffice = async poId => {
    try {
      const result = await dispatch(
        getAllRoForMTIFilter({status: statusCode, poId: poId}),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.regional_office_name,
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
  /* function for fetching Billing from */
  const fetchAllBillingFrom = async roId => {
    try {
      const result = await dispatch(
        getAllBillingFromForMTIFilter({
          status: statusCode,
          poId: poId,
          roId: roId,
        }),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllBillingFrom(rData);
      } else {
        setAllBillingFrom([]);
      }
    } catch (error) {
      setAllBillingFrom([]);
    }
  };

  /* function for fetching All Billing to data  */
  const fetchAllBillingTo = async billingFromId => {
    try {
      const result = await dispatch(
        getAllBillingToForMTIFilter({
          status: statusCode,
          poId: poId,
          roId: roId,
          billingFromId: billingFromId,
        }),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllBillingTo(rData);
      } else {
        setAllBillingTo([]);
      }
    } catch (error) {
      setAllBillingTo([]);
    }
  };

  /*for resetting all filter*/
  const resetFunction = () => {
    setPoId('');
    setRoId('');
    setAllRo([]);

    setBillingFromId('');
    setAllBillingFrom([]);

    setBillingToId('');
    setAllBillingTo([]);
  };

  return (
    <View style={{margin: WINDOW_WIDTH * 0.02}}>
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
            value={poId}
            onChange={val => {
              setPoId(val.value);
              fetchAllRegionalOffice(val?.value);
            }}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'Regional office'}
            data={allRo}
            value={roId}
            onChange={val => {
              setRoId(val?.value);
              fetchAllBillingFrom(val?.value);
            }}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'Billing from'}
            data={allBillingFrom}
            value={billingFromId}
            onChange={val => {
              setBillingFromId(val?.value);
              fetchAllBillingTo(val?.value);
            }}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'Billing to'}
            data={allBillingTo}
            value={billingToId}
            onChange={val => {
              setBillingToId(val?.value);
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

export default MTIInvoiceFilter;

const styles = StyleSheet.create({});
