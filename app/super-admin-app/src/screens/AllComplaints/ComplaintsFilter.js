import React, {useEffect, useState} from 'react';
import {allComplaintList} from '../../redux/slices/complaint/getAllComplaintListSlice';
import {requestComplaintList} from '../../redux/slices/complaint/getRequestComplaintListSlice';
import {unAssignComplaintList} from '../../redux/slices/complaint/getUnAssignComplaintListSlice';
import {approvedComplaintList} from '../../redux/slices/complaint/getAllApprovedComplaintListSlice';
import {rejectedComplaintList} from '../../redux/slices/complaint/getRejectedComplaintListSlice';
import {resolvedComplaintList} from '../../redux/slices/complaint/getResolvedComplaintListSlice';
import NeumorphicDropDownList from '../../component/DropDownList';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import {ScrollView, View} from 'react-native';
import {useDispatch} from 'react-redux';
import {getAdminZone} from '../../services/authApi';
import {getAllRegionalOfficeByZoneId} from '../../redux/slices/commonApi';

export const ComplaintFilter = ({
  setSalesAreaId,
  salesAreaId,
  setCompanyId,
  companyId,
  setComplaintFor,
  setOutletId,
  outletId,
  setRegionalOfficeId,
  regionalOfficeId,
  setOrderById,
  orderById,
  status,
  statusFilter = false,
  setStatusValue,
  statusValue,
  component,
  setZoneId,
  zoneId,
}) => {
  const dispatch = useDispatch();
  const [allCompaniesData, setAllCompaniesData] = useState([]);
  const [allSalesArea, setAllSalesArea] = useState([]);
  const [allOutletArea, setAllOutletArea] = useState([]);
  const [allRoOffice, setAllRoOffice] = useState([]);
  const [allOrderBy, setAllOrderBy] = useState([]);
  const [allZones, setAllZones] = useState([]);

  const allStatus = [
    {label: 'resolved', value: 0},
    {label: 'hardCopy', value: 1},
    {label: 'draft', value: 3},
    {label: 'final', value: 4},
    {label: 'readyToPI', value: 5},
  ];
  useEffect(() => {
    getZones();
    getROBYZONE();
  }, []);

  const getZones = async () => {
    try {
      const res = await getAdminZone();
      setAllZones(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    getROBYZONE();
  }, [zoneId]);

  const getROBYZONE = async () => {
    try {
      const res = await dispatch(getAllRegionalOfficeByZoneId(zoneId)).unwrap();
      setAllRoOffice(res.data);
    } catch (error) {}
  };

  const fetchAllComplaints = async () => {
    let res;

    switch (status) {
      case 0:
        res = await dispatch(allComplaintList({isDropdown: true})).unwrap();
        break;
      case 1:
        res = await dispatch(requestComplaintList({isDropdown: true})).unwrap();
        break;
      case 2:
        res = await dispatch(
          unAssignComplaintList({isDropdown: true}),
        ).unwrap();
        break;
      case 3:
        res = await dispatch(
          approvedComplaintList({isDropdown: true}),
        ).unwrap();
        break;
      case 4:
        res = await dispatch(
          rejectedComplaintList({isDropdown: true}),
        ).unwrap();
        break;
      case 5:
        res = await dispatch(
          resolvedComplaintList({isDropdown: true}),
        ).unwrap();
        break;
      case 'resolved-complaint-in-billing':
        res = await dispatch(
          getAllComplaintsForMeasurement({isDropdown: true}),
        ).unwrap();
        break;
      default:
        return '';
    }

    if (res.status) {
      const uniqueCompanies = res.data?.filter(
        (complaint, index, self) =>
          index ===
          self?.findIndex(
            c => c.company_unique_id === complaint.company_unique_id,
          ),
      );
      setAllCompaniesData(uniqueCompanies);

      const uniqueOutlets = res.data?.filter(
        (complaint, index, self) =>
          index ===
          self?.findIndex(c => c.outlet[0]?.id === complaint.outlet[0]?.id),
      );
      setAllOutletArea(uniqueOutlets);

      // const uniqueRo = res.data?.filter(
      //   (complaint, index, self) =>
      //     index ===
      //     self?.findIndex(
      //       c => c.regionalOffice[0]?.id === complaint.regionalOffice[0]?.id,
      //     ),
      // );
      // setAllRoOffice(uniqueRo);

      const uniqueSalesArea = res.data?.filter(
        (complaint, index, self) =>
          index ===
          self?.findIndex(
            c => c.saleAreaDetails[0]?.id === complaint.saleAreaDetails[0]?.id,
          ),
      );
      setAllSalesArea(uniqueSalesArea);

      const uniqueOrderBy = res.data?.filter(
        (complaint, index, self) =>
          index ===
          self?.findIndex(c => c.order_by_id === complaint.order_by_id),
      );
      setAllOrderBy(uniqueOrderBy);
    } else {
      setAllCompaniesData([]);
    }
  };

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  return (
    <View>
      <ScrollView
        horizontal={true}
        style={{gap: 15}}
        showsHorizontalScrollIndicator={false}>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            gap: 10,
            marginHorizontal: 10,
          }}>
          {setZoneId && (
            <NeumorphicDropDownList
              placeHolderTxt={'Zone Name'}
              value={zoneId}
              width={WINDOW_WIDTH * 0.8}
              data={allZones?.map(itm => ({
                label: itm?.zone_name,
                value: itm?.zone_id,
              }))}
              onCancle={() => {
                setZoneId('');
              }}
              onChange={e => {
                setZoneId(e ? e.value : '');
              }}
            />
          )}
          {setCompanyId && (
            <NeumorphicDropDownList
              placeHolderTxt={'Company Name'}
              value={companyId}
              width={WINDOW_WIDTH * 0.8}
              data={allCompaniesData?.map(itm => ({
                label: `${itm?.energy_company_name} (${
                  itm?.complaint_for == 1 ? 'Ec' : 'Oc'
                })`,
                // value: itm?.company_unique_id,
                complaint_for: itm?.complaint_for,
                value: itm?.energy_company_id,
              }))}
              onCancle={() => {
                setCompanyId('');
                setComplaintFor('');
              }}
              onChange={e => {
                setCompanyId(e ? e.value : '');
                setComplaintFor(e ? e.complaint_for : '');
              }}
            />
          )}
          {setOutletId && (
            <NeumorphicDropDownList
              placeHolderTxt={'outlet area'}
              value={outletId}
              width={WINDOW_WIDTH * 0.8}
              data={
                allOutletArea
                  ? allOutletArea?.map(user => ({
                      label: user?.outlet[0]?.outlet_name,
                      value: user?.outlet[0]?.id,
                    }))
                  : []
              }
              onCancle={() => setOutletId('')}
              onChange={e => {
                setOutletId(e ? e.value : '');
              }}
            />
          )}
          {setRegionalOfficeId && (
            <NeumorphicDropDownList
              placeHolderTxt={'regional office'}
              value={regionalOfficeId}
              width={WINDOW_WIDTH * 0.8}
              data={
                allRoOffice
                  ? allRoOffice?.map(item => ({
                      label: item?.regional_office_name,
                      value: item?.ro_id,
                    }))
                  : []
              }
              onCancle={() => setRegionalOfficeId('')}
              onChange={e => {
                setRegionalOfficeId(e ? e.value : '');
              }}
            />
          )}
          {setSalesAreaId && (
            <NeumorphicDropDownList
              placeHolderTxt={'Sales Area'}
              value={salesAreaId}
              width={WINDOW_WIDTH * 0.8}
              data={
                allSalesArea
                  ? allSalesArea?.map(user => ({
                      label: user?.saleAreaDetails[0]?.sales_area_name,
                      value: user?.saleAreaDetails[0]?.id,
                    }))
                  : []
              }
              onCancle={() => setSalesAreaId('')}
              onChange={e => {
                setSalesAreaId(e ? e.value : '');
              }}
            />
          )}
          {setOrderById && (
            <NeumorphicDropDownList
              placeHolderTxt={'ORDER BY'}
              value={orderById}
              width={WINDOW_WIDTH * 0.8}
              data={
                allOrderBy?.map(user => ({
                  label: user.order_by_details,
                  value: user.order_by_id,
                })) || []
              }
              onCancle={() => setOrderById('')}
              onChange={e => {
                setOrderById(e ? e.value : '');
              }}
            />
          )}
          {statusFilter && (
            <NeumorphicDropDownList
              placeHolderTxt={'ORDER BY'}
              value={statusValue}
              width={WINDOW_WIDTH * 0.8}
              data={allStatus || []}
              onCancle={() => setStatusValue('')}
              onChange={e => {
                setStatusValue(e ? e.value : '');
              }}
            />
          )}
          {component && component}
        </View>
      </ScrollView>
    </View>
  );
};
