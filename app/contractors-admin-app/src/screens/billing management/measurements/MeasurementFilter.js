/*    ----------------Created Date :: 22- May -2024   ----------------- */

import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../../utils/ScreenLayout';
import { useDispatch } from 'react-redux';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {
  getAllBillingOrderByWithStatus,
  getAllBillingOutletWithStatus,
  getAllBillingRegionalOfficeWithStatus,
  getAllBillingSalesAreaWithStatus,
  getAllCompanyForBilling,
  getAllCompanyForPTM,
  getAllOrderByWithStatus,
  getAllOutletWithStatus,
  getAllPTMOrderByWithStatus,
  getAllPTMOutletWithStatus,
  getAllPTMRegionalOfficeWithStatus,
  getAllPTMSalesAreaWithStatus,
  getAllRegionalOfficeWithStatus,
  getAllSalesAreaWithStatus,
} from '../../../redux/slices/commonApi';

const MeasurementFilter = ({
  type,
  roId,
  setRoId,
  saId,
  setSaId,
  outletId,
  setOutletId,
  orderById,
  setOrderById,
  statusId,
  setStatusId,
  setCompanyId,
  companyId,
}) => {
  const dispatch = useDispatch();

  const [allRo, setAllRo] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [allOutlet, setAllOutlet] = useState([]);
  const [allOrderBy, setAllOrderBy] = useState([]);
  const [allCompany, setAllCompany] = useState([]);

  const allStatus = [
    { label: 'pending', value: 0 },
    { label: 'hardcopy', value: 1 },
    { label: 'discard', value: 2 },
    { label: 'draft', value: 3 },
    { label: 'final', value: 4 },
    { label: 'ready to pi', value: 5 },
  ];

  // function for getting outlet detail with status code wise//
  const getOutletCodeWise = status => {
    switch (status) {
      case 'allcomplaint':
        return dispatch(getAllOutletWithStatus(5)).unwrap();
      case 'ptm':
        return dispatch(getAllPTMOutletWithStatus(5)).unwrap();
      case 'discard':
        return dispatch(getAllBillingOutletWithStatus(2)).unwrap();
      case 'draft':
        return dispatch(getAllBillingOutletWithStatus(3)).unwrap();
      case 'final':
        return dispatch(getAllBillingOutletWithStatus(4)).unwrap();
      case 'readytopi':
        return dispatch(getAllBillingOutletWithStatus(5)).unwrap();

      default:
        break;
    }
  };

  // function for getting regional office detail with status code wise//
  const getROCodeWise = status => {
    switch (status) {
      case 'allcomplaint':
        return dispatch(getAllRegionalOfficeWithStatus(5)).unwrap();
      case 'ptm':
        return dispatch(getAllPTMRegionalOfficeWithStatus(5)).unwrap();
      case 'discard':
        return dispatch(getAllBillingRegionalOfficeWithStatus(2)).unwrap();
      case 'draft':
        return dispatch(getAllBillingRegionalOfficeWithStatus(3)).unwrap();
      case 'final':
        return dispatch(getAllBillingRegionalOfficeWithStatus(4)).unwrap();
      case 'readytopi':
        return dispatch(getAllBillingRegionalOfficeWithStatus(5)).unwrap();

      default:
        break;
    }
  };

  // function for getting sales area detail with status code wise//
  const getSACodeWise = status => {
    switch (status) {
      case 'allcomplaint':
        return dispatch(getAllSalesAreaWithStatus(5)).unwrap();
      case 'ptm':
        return dispatch(getAllPTMSalesAreaWithStatus(5)).unwrap();
      case 'discard':
        return dispatch(getAllBillingSalesAreaWithStatus(2)).unwrap();
      case 'draft':
        return dispatch(getAllBillingSalesAreaWithStatus(3)).unwrap();
      case 'final':
        return dispatch(getAllBillingSalesAreaWithStatus(4)).unwrap();
      case 'readytopi':
        return dispatch(getAllBillingSalesAreaWithStatus(5)).unwrap();

      default:
        break;
    }
  };

  // function for getting order by detail with status code wise//
  const getOrderByCodeWise = status => {
    switch (status) {
      case 'allcomplaint':
        return dispatch(getAllOrderByWithStatus(5)).unwrap();
      case 'ptm':
        return dispatch(getAllPTMOrderByWithStatus(5)).unwrap();
      case 'discard':
        return dispatch(getAllBillingOrderByWithStatus(2)).unwrap();
      case 'draft':
        return dispatch(getAllBillingOrderByWithStatus(3)).unwrap();
      case 'final':
        return dispatch(getAllBillingOrderByWithStatus(4)).unwrap();
      case 'readytopi':
        return dispatch(getAllBillingOrderByWithStatus(5)).unwrap();

      default:
        break;
    }
  };

  useEffect(() => {
    fetchAllOutlet();
    fetchAllRegionalOffice();
    fetchAllSalesArea();
    fetchAllOrderBy();
    fetchAllCompany();
  }, [type]);

  /* function for fetching outlet   */
  const fetchAllOutlet = async () => {
    try {
      const result = await getOutletCodeWise(type);
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

  /* function for fetching regional office */
  const fetchAllRegionalOffice = async () => {
    try {
      const result = await getROCodeWise(type);
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
      const result = await getSACodeWise(type);
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

  /* function for fetching order by   */
  const fetchAllOrderBy = async () => {
    try {
      const result = await getOrderByCodeWise(type);
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.name,
          value: itm?.id,
        }));
        setAllOrderBy(rData);
      } else {
        setAllOrderBy([]);
      }
    } catch (error) {
      setAllOrderBy([]);
    }
  };

  const fetchAllCompany = async () => {
    try {
      const res =
        type == 'ptm'
          ? await dispatch(getAllCompanyForPTM(5)).unwrap()
          : await dispatch(getAllCompanyForBilling(3)).unwrap();
      if (res?.status) {
        const rData = res?.data.map(itm => ({
          label: itm?.company_name,
          value: itm?.id,
        }));
        setAllCompany(rData);
      } else {
        setAllCompany([]);
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  /*for resetting all filter*/
  const resetFunction = () => {
    setRoId('');
    setSaId('');
    setOutletId('');
    setOrderById('');
    setStatusId('');
    setCompanyId('');
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
            placeHolderTxt={'All Company'}
            data={allCompany}
            value={companyId}
            onChange={val => {
              setCompanyId(val.value);
            }}
            onCancle={() => {
              setCompanyId('');
            }}
          />
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'outlet area'}
            data={allOutlet}
            value={outletId}
            onChange={val => {
              setOutletId(val.value);
            }}
            onCancle={() => {
              setOutletId('');
            }}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'Regional office'}
            data={allRo}
            value={roId}
            onChange={val => {
              setRoId(val.value);
            }}
            onCancle={() => {
              setRoId('');
            }}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'Salses area'}
            data={allSa}
            value={saId}
            onChange={val => {
              setSaId(val?.value);
            }}
            onCancle={() => {
              setSaId('');
            }}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'order by'}
            data={allOrderBy}
            value={orderById}
            onChange={val => {
              setOrderById(val?.value);
            }}
            onCancle={() => {
              setOrderById('');
            }}
          />

          {type == 'allcomplaint' && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'status'}
              data={allStatus}
              value={statusId}
              onChange={val => {
                setStatusId(val?.value);
              }}
              onCancle={() => {
                setStatusId('');
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

export default MeasurementFilter;

const styles = StyleSheet.create({});
