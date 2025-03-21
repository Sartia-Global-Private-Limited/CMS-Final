/*    ----------------Created Date :: 26- July -2024   ----------------- */
import {StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import CustomeCard from '../../component/CustomeCard';
import Colors from '../../constants/Colors';
import {useDispatch} from 'react-redux';
import {
  getAdminEnergyCompanyassignZone,
  getAllActiveCompanyList,
  getAllDistrictBySaId,
  getAllRegionalOfficeByZoneId,
  getSalesRAOnRoId,
} from '../../redux/slices/commonApi';
import CardDropDown from '../../component/CardDropDown';
import CardTextInput from '../../component/CardTextInput';
import RBSheet from 'react-native-raw-bottom-sheet';
import Fileupploader from '../../component/Fileupploader';

const OutletForm = ({formik, edit_id, edit}) => {
  const dispatch = useDispatch();

  const refRBSheet = useRef(RBSheet);
  const [allEnergyCompany, setAllEnergyCompany] = useState([]);
  const [allZone, setAllZone] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [allDistrict, setAllDistrict] = useState([]);

  useEffect(() => {
    if (edit) {
      fetchAllZones(edit?.energy_company_id);
      fetchAllRo(edit?.zone_id);
      fetchallSalesArea(edit?.regional_office_id);
      fetchAllDistrict(edit?.sales_area_id);
    }
  }, [edit]);
  
  useEffect(() => {
    fetchAllActiveEnergyCompany();
  }, []);

  /*fucnction for fetching all active company*/
  const fetchAllActiveEnergyCompany = async () => {
    setAllZone([]);
    formik.setFieldValue(`zone_id`, '');
    setAllRo([]);
    formik.setFieldValue(`regional_id`, '');
    setAllSa([]);
    formik.setFieldValue(`sales_area_id`, '');
    setAllDistrict([]);
    formik.setFieldValue(`district_id`, '');

    const result = await dispatch(getAllActiveCompanyList()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.name,
          value: itm?.energy_company_id,
        };
      });
      setAllEnergyCompany(rData);
    } else {
      setAllEnergyCompany([]);
    }
  };

  /*fucnction for fetching all zones by company id*/
  const fetchAllZones = async companyId => {
    setAllRo([]);
    formik.setFieldValue(`regional_id`, '');
    setAllSa([]);
    formik.setFieldValue(`sales_area_id`, '');
    setAllDistrict([]);
    formik.setFieldValue(`district_id`, '');
    const result = await dispatch(
      getAdminEnergyCompanyassignZone(companyId),
    ).unwrap();

    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.zone_name,
          value: itm?.zone_id,
        };
      });
      setAllZone(rData);
    } else {
      setAllZone([]);
    }
  };

  /*fucnction for fetching all regional office*/
  const fetchAllRo = async zoneId => {
    setAllSa([]);
    formik.setFieldValue(`sales_area_id`, '');
    setAllDistrict([]);
    formik.setFieldValue(`district_id`, '');
    const result = await dispatch(
      getAllRegionalOfficeByZoneId(zoneId),
    ).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.regional_office_name,
          value: itm?.ro_id,
        };
      });
      setAllRo(rData);
    } else {
      setAllRo([]);
    }
  };

  /*fucnction for fetching all sales area  by regional id*/
  const fetchallSalesArea = async regionalId => {
    setAllDistrict([]);
    formik.setFieldValue(`district_id`, '');
    const result = await dispatch(getSalesRAOnRoId(regionalId)).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.sales_area_name,
          value: itm?.id,
        };
      });
      setAllSa(rData);
    } else {
      // Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
      setAllSa([]);
    }
  };

  /*fucnction for fetching all district by sales area  id*/
  const fetchAllDistrict = async saId => {
    const result = await dispatch(getAllDistrictBySaId(saId)).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.district_name,
          value: itm?.district_id,
        };
      });
      setAllDistrict(rData);
    } else {
      // Toast.show({type: 'error', text1: result?.message, position: 'bottom'});
      setAllDistrict([]);
    }
  };

  /*fucntion for handling the action button */
  const handleAction = actionButton => {
    switch (actionButton.typeOfButton) {
      case 'image':
        refRBSheet.current.open();
        break;

      default:
        break;
    }
  };
  return (
    <View>
      {/* card for complaint detail */}
      <CustomeCard
        headerName={'Basic detail'}
        data={[
          {
            key: 'Energy company',
            component: (
              <CardDropDown
                data={allEnergyCompany}
                value={formik.values?.energy_company_id}
                onChange={val => {
                  formik.setFieldValue(`energy_company_id`, val?.value);
                  fetchAllZones(val?.value);
                }}
                required={formik.values?.energy_company_id}
              />
            ),
          },
          {
            key: 'Zone',
            component: (
              <CardDropDown
                data={allZone}
                value={formik.values?.zone_id}
                onChange={val => {
                  formik.setFieldValue(`zone_id`, val?.value);
                  fetchAllRo(val?.value);
                }}
                required={formik.values?.zone_id}
              />
            ),
          },
          {
            key: 'Regional office',
            component: (
              <CardDropDown
                data={allRo}
                value={formik.values?.regional_id}
                onChange={val => {
                  formik.setFieldValue(`regional_id`, val?.value);
                  fetchallSalesArea(val?.value);
                }}
                required={formik.values?.regional_id}
              />
            ),
          },
          {
            key: 'sales area',
            component: (
              <CardDropDown
                data={allSa}
                value={formik.values?.sales_area_id}
                onChange={val => {
                  formik.setFieldValue(`sales_area_id`, val?.value);
                  fetchAllDistrict(val?.value);
                }}
                required={formik.values?.sales_area_id}
              />
            ),
          },
          {
            key: 'District',
            component: (
              <CardDropDown
                data={allDistrict}
                value={formik.values?.district_id}
                onChange={val => {
                  formik.setFieldValue(`district_id`, val?.value);
                }}
                required={formik.values?.district_id}
              />
            ),
          },
          {
            key: 'outlet name',
            component: (
              <CardTextInput
                value={formik?.values.outlet_name}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`outlet_name`, val);
                }}
              />
            ),
          },
          {
            key: 'OUTLET UNIQUE ID',
            component: (
              <CardTextInput
                value={formik?.values.outlet_unique_id}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`outlet_unique_id`, val);
                }}
              />
            ),
          },
        ]}
      />
      {/* card for contact detail*/}
      <CustomeCard
        headerName={'Contact detail'}
        data={[
          {
            key: 'Contact person',
            component: (
              <CardTextInput
                value={formik?.values.outlet_contact_person_name}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`outlet_contact_person_name`, val);
                }}
              />
            ),
          },
          {
            key: 'Contact number',
            component: (
              <CardTextInput
                keyboardType="numeric"
                maxLength={10}
                value={formik?.values.outlet_contact_number}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`outlet_contact_number`, val);
                }}
              />
            ),
          },
          {
            key: 'Primary mnumber',
            component: (
              <CardTextInput
                value={formik?.values.primary_number}
                keyboardType="numeric"
                maxLength={10}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`primary_number`, val);
                }}
              />
            ),
          },
          {
            key: 'secondary number',
            component: (
              <CardTextInput
                value={formik?.values.secondary_number}
                keyboardType="numeric"
                maxLength={10}
                onChange={val => {
                  formik.setFieldValue(`secondary_number`, val);
                }}
              />
            ),
          },
          {
            key: 'Primary mail',
            component: (
              <CardTextInput
                value={formik?.values.primary_email}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`primary_email`, val);
                }}
              />
            ),
          },
          {
            key: 'Secondary email',
            component: (
              <CardTextInput
                value={formik?.values.secondary_email}
                onChange={val => {
                  formik.setFieldValue(`secondary_email`, val);
                }}
              />
            ),
          },
        ]}
      />
      {/* card for Address detail*/}
      <CustomeCard
        headerName={'Address detail'}
        data={[
          {
            key: 'Location',
            component: (
              <CardTextInput
                value={formik?.values.location}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`location`, val);
                }}
              />
            ),
          },
          {
            key: 'ADDRESS ',
            component: (
              <CardTextInput
                value={formik?.values.address}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`address`, val);
                }}
              />
            ),
          },
          {
            key: 'Latitude',
            component: (
              <CardTextInput
                value={formik?.values?.outlet_lattitude}
                keyboardType="numeric"
                onChange={val => {
                  formik.setFieldValue(`outlet_lattitude`, val);
                }}
              />
            ),
          },
          {
            key: 'Longitude',
            component: (
              <CardTextInput
                value={formik?.values?.outlet_longitude}
                keyboardType="numeric"
                onChange={val => {
                  formik.setFieldValue(`outlet_longitude`, val);
                }}
              />
            ),
          },
        ]}
      />
      {/* card for other detail*/}
      <CustomeCard
        avatarImage={
          edit_id && typeof formik?.values?.image == 'string'
            ? formik?.values?.image
            : formik?.values?.image?.uri
        }
        headerName={'other detail'}
        data={[
          {
            key: 'Customer code',
            component: (
              <CardTextInput
                value={formik?.values.customer_code}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`customer_code`, val);
                }}
              />
            ),
          },
          {
            key: 'outlet category',
            component: (
              <CardTextInput
                value={formik?.values.outlet_category}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`outlet_category`, val);
                }}
              />
            ),
          },
          {
            key: 'CCNOMS',
            component: (
              <CardTextInput
                value={formik?.values?.outlet_ccnoms}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`outlet_ccnoms`, val);
                }}
              />
            ),
          },
          {
            key: 'CCNOHSD',
            component: (
              <CardTextInput
                value={formik?.values?.outlet_ccnohsd}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`outlet_ccnohsd`, val);
                }}
              />
            ),
          },
          {
            key: 'RESV',
            component: (
              <CardTextInput
                value={formik?.values?.outlet_resv}
                onChange={val => {
                  formik.setFieldValue(`outlet_resv`, val);
                }}
              />
            ),
          },
        ]}
        status={[
          {key: 'action', value: 'select  image', color: Colors().pending},
        ]}
        action={handleAction}
        imageButton={true}
      />
      {/* card for Login detail*/}
      <CustomeCard
        headerName={'Login detail'}
        data={[
          {
            key: 'email',
            component: (
              <CardTextInput
                value={formik?.values.email}
                required={true}
                onChange={val => {
                  formik.setFieldValue(`email`, val);
                }}
              />
            ),
          },
          {
            key: 'password',
            component: (
              <CardTextInput
                value={formik?.values.password}
                secureTextEntry
                required={edit_id ? false : true}
                onChange={val => {
                  formik.setFieldValue(`password`, val);
                }}
              />
            ),
          },
        ]}
      />
      <Fileupploader
        btnRef={refRBSheet}
        cameraOption={{
          base64: false,
          multiselet: false,
        }}
        cameraResponse={item => {
          if (!item) return; // Check if item has a value
          const imageFormData = {
            uri: item?.uri,
            name: item?.name,
            type: item?.type,
          };
          formik.setFieldValue(`image`, imageFormData);
          refRBSheet.current.close();
        }}
        galleryOption={{base64: false, multiselet: false}}
        galleryResponse={item => {
          if (!item) return; // Check if item has a value
          const imageFormData = {
            uri: item?.uri,
            name: item?.name,
            type: item?.type,
          };
          formik.setFieldValue(`image`, imageFormData);
          refRBSheet.current.close();
        }}
      />
    </View>
  );
};

export default OutletForm;

const styles = StyleSheet.create({});
