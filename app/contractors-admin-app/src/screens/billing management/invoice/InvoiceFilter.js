/*    ----------------Created Date :: 3- July -2024   ----------------- */

import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../../utils/ScreenLayout';
import { useDispatch } from 'react-redux';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicButton from '../../../component/NeumorphicButton';
import DropDownItem from '../../../component/DropDownItem';

import {
  getAllBillingFromForInvoiceFilter,
  getAllBillingToForInvoiceFilter,
  getAllPoForInvoiceFilter,
  getAllRoForInvoiceFilter,
} from '../../../redux/slices/billing management/inovice/addUpdateInvoiceSlice';

const InvoiceFilter = ({
  type,
  statuCode,
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
  }, [type]);

  /* function for fetching Po number   */
  const fetchAllPO = async () => {
    try {
      const result = await dispatch(getAllPoForInvoiceFilter()).unwrap();
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
        getAllRoForInvoiceFilter({ status: statuCode, poId: poId }),
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
        getAllBillingFromForInvoiceFilter({ poId: poId, roId: roId }),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.company_name,
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
        getAllBillingToForInvoiceFilter({
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
    <View style={{ marginHorizontal: WINDOW_WIDTH * 0.01, marginVertical: 5 }}>
      <>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            columnGap: 10,
            alignItems: 'center',
          }}>
          <NeumorphicDropDownList
            placeHolderTxt={'pO NUMBER'}
            width={WINDOW_WIDTH * 0.75}
            data={allPo}
            value={poId}
            onChange={val => {
              setPoId(val.value);
              fetchAllRegionalOffice(val?.value);
            }}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'regional office'}
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
            placeHolderTxt={'billing to'}
            data={allBillingTo}
            value={billingToId}
            onChange={val => {
              setBillingToId(val?.value);
            }}
          />

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
      </>
    </View>
  );
};

export default InvoiceFilter;

const styles = StyleSheet.create({});
