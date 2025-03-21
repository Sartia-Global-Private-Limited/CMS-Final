/*    ----------------Created Date :: 24- June -2024   ----------------- */

import { StyleSheet, View, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import Colors from '../../../constants/Colors';
import { WINDOW_WIDTH, WINDOW_HEIGHT } from '../../../utils/ScreenLayout';
import { useDispatch } from 'react-redux';
import NeumorphicDropDownList from '../../../component/DropDownList';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {
  getAllBillingNumberForPi,
  getAllCompanyForReadyToPi,
  getAllComplaintTypeListInvoice,
  getAllOrderByForBilling,
  getAllOutletForPerforma,
  getAllPoForPi,
  getAllPoForReadyToPi,
  getAllRoForPi,
  getAllRoForReadyToPi,
  getAllSalesAreaforfilter,
} from '../../../redux/slices/billing management/performa invoice/addUpdatePerformaInvoiceSlice';
import { getAllFinacialYearList } from '../../../redux/slices/master-data-management/financial-year/getFinacialYearListSlice';

const PerformaInvoiceFilter = ({
  type,
  statusCode,
  poId,
  setPoId,
  roId,
  setRoId,
  companyId,
  setCompanyId,
  complaintFor,
  setComplaintFor,
  billNumber,
  setBillNumber,
  setPiNumber,
  piNumber,
  setFinancialYearId,
  financialYearId,
  setOutletAreaId,
  outletAreaId,
  setComplaintTypeId,
  complaintTypeId,
  areaManagerId,
  setAreaManagerId,
  orderById,
  setOrderById,
  salesAreaId,
  setSalesAreaId,
}) => {
  const dispatch = useDispatch();

  const [allPo, setAllPo] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allCompany, setAllCompany] = useState([]);
  const [allBillNumber, setAllBillNumber] = useState([]);
  const [allOutletArea, setAllOutletArea] = useState([]);
  const [allComplaintType, setComplaintType] = useState([]);
  const [allPiNumber, setAllPiNumber] = useState([]);
  const [allFinancialYear, setAllFinancialYear] = useState([]);
  const [allOrderby, setAllOrderBy] = useState([]);
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [allAreaManager, setAllAreaManager] = useState([]);

  useEffect(() => {
    fetchAllPO();
    fetchAllSalesArea();
    fetchAllOrderBy();
    fetchAllSalesManager();
    fetchAllPINumber();
    fetchAllFinancialYear();
    fetchAllComplaintType();
    fetchOutletArea();
  }, [type]);

  /* function for fetching Po number   */
  const fetchAllPO = async () => {
    try {
      const result =
        type == 'readytopi'
          ? await dispatch(getAllPoForReadyToPi(statusCode)).unwrap()
          : await dispatch(getAllPoForPi(statusCode)).unwrap();
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
  const fetchAllRegionalOffice = async poNumberId => {
    try {
      const result =
        type == 'readytopi'
          ? await dispatch(
              getAllRoForReadyToPi({
                statusCode: statusCode,
                poId: poNumberId,
              }),
            ).unwrap()
          : await dispatch(
              getAllRoForPi({ statusCode: statusCode, poId: poNumberId }),
            ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.regional_office_name,
          value: itm?.ro_id,
        }));
        setAllRo(rData);
      }
    } catch (error) {
      setAllRo([]);
    }
  };
  /* function for fetching Billing from */
  const fetchAllCompany = async regionalId => {
    try {
      const result = await dispatch(
        getAllCompanyForReadyToPi({
          statusCode: statusCode,
          poId: poId.value,
          roId: regionalId,
        }),
      ).unwrap();
      console.log('result', result);
      if (result?.status) {
        const rData = result?.data?.map(itm => ({
          label: itm?.company_name,
          value: itm?.company_id,
          complaintFor: itm?.complaint_for,
        }));
        setAllCompany(rData);
      } else {
        setAllCompany([]);
      }
    } catch (error) {
      setAllCompany([]);
    }
  };

  /* function for fetching All Billing to data  */
  const fetchAllBillNumber = async regionalId => {
    try {
      const result = await dispatch(
        getAllBillingNumberForPi({
          statusCode: statusCode,
          poId: poId.value,
          roId: regionalId,
        }),
      ).unwrap();
      if (result?.status) {
        const rData = result?.data.map(itm => ({
          label: itm?.bill_no,
          value: itm?.bill_no,
        }));
        setAllBillNumber(rData);
      } else {
        setAllBillNumber([]);
      }
    } catch (error) {
      setAllBillNumber([]);
    }
  };

  const fetchOutletArea = async () => {
    const res = await dispatch(
      getAllOutletForPerforma({ statusCode, roId, saId, poId }),
    ).unwrap();
    if (res.status) {
      setAllOutletArea(res.data);
    } else {
      setAllOutletArea([]);
    }
  };

  const fetchAllComplaintType = async () => {
    const res = await dispatch(
      getAllComplaintTypeListInvoice(statusCode),
    ).unwrap();
    if (res.status) {
      setComplaintType(res.data);
    } else {
      setComplaintType([]);
    }
  };

  const fetchAllFinancialYear = async () => {
    const res = await dispatch(getAllFinacialYearList(statusCode)).unwrap();

    if (res.status) {
      setAllFinancialYear(res.data);
    } else {
      setAllFinancialYear([]);
    }
  };

  const fetchAllPINumber = async () => {
    const res = await dispatch(
      getAllBillingNumberForPi({ statusCode, roId, poId }),
    ).unwrap();

    if (res.status) {
      setAllPiNumber(res.data);
    } else {
      setAllPiNumber([]);
    }
  };

  const fetchAllSalesManager = async () => {
    const res = await dispatch(getAllSalesAreaforfilter(statusCode)).unwrap();
    if (res.status) {
      setAllAreaManager(res.data);
    } else {
      setAllAreaManager([]);
    }
  };

  const fetchAllOrderBy = async () => {
    const pi_status = '0';
    const res = await dispatch(
      getAllOrderByForBilling({ statusCode, pi_status }),
    ).unwrap();
    if (res.status) {
      setAllOrderBy(res.data);
    } else {
      setAllOrderBy([]);
    }
  };

  const fetchAllSalesArea = async () => {
    const res = await dispatch(
      getAllSalesAreaforfilter({ statusCode }),
    ).unwrap();
    if (res.status) {
      setAllSalesArea(res.data);
    } else {
      setAllSalesArea([]);
    }
  };

  /*for resetting all filter*/
  const resetFunction = () => {
    setRoId('');
    setAllRo([]);
    setPoId('');
    setComplaintFor('');
    setBillNumber('');
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
          {setCompanyId && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'Company'}
              data={allCompany}
              value={companyId}
              onChange={val => {
                setCompanyId(val);
                setComplaintFor(val?.complaintFor);
              }}
            />
          )}
          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'Po number'}
            data={allPo}
            value={poId}
            onChange={val => {
              setPoId(val);
              fetchAllRegionalOffice(val?.value);
            }}
          />

          <NeumorphicDropDownList
            width={WINDOW_WIDTH * 0.75}
            placeHolderTxt={'Regional office'}
            data={allRo}
            value={roId}
            onChange={val => {
              setRoId(val);
              {
                type == 'readytopi'
                  ? fetchAllCompany(val?.value)
                  : fetchAllBillNumber(val?.value);
              }
            }}
          />

          {setBillNumber && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'Bill number'}
              data={allBillNumber}
              value={billNumber}
              onChange={val => {
                setBillNumber(val);
              }}
            />
          )}
          {setPiNumber && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'PI number'}
              data={allPiNumber}
              value={piNumber}
              onChange={val => {
                setPiNumber(val);
              }}
            />
          )}
          {setOutletAreaId && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'Outlet Area'}
              data={allOutletArea}
              value={outletAreaId}
              onChange={val => {
                setOutletAreaId(val);
              }}
            />
          )}
          {setComplaintTypeId && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'Complaint Type'}
              data={allComplaintType}
              value={complaintTypeId}
              onChange={val => {
                setOutletAreaId(val);
              }}
            />
          )}
          {setFinancialYearId && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'Financial Year'}
              data={allFinancialYear}
              value={financialYearId}
              onChange={val => {
                setFinancialYearId(val);
              }}
            />
          )}
          {setAreaManagerId && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'Area Manager'}
              data={allAreaManager}
              value={areaManagerId}
              onChange={val => {
                setAreaManagerId(val);
              }}
            />
          )}
          {setOrderById && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'Order By'}
              data={allOrderby}
              value={orderById}
              onChange={val => {
                setOrderById(val);
              }}
            />
          )}
          {setSalesAreaId && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.06}
              width={WINDOW_WIDTH * 0.75}
              placeHolderTxt={'Salse Area'}
              data={allSalesArea}
              value={salesAreaId}
              onChange={val => {
                setSalesAreaId(val);
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

export default PerformaInvoiceFilter;

const styles = StyleSheet.create({});
