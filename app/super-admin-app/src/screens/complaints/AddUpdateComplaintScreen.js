import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useState, useEffect} from 'react';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import NeumorphicTextInput from '../../component/NeumorphicTextInput';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import NeumorphicDropDownList from '../../component/DropDownList';
import {CheckBox} from '@rneui/themed';
import ScreensLabel from '../../constants/ScreensLabel';
import {useFormik} from 'formik';
import {
  addComplaintType,
  getAdminAllTypesComplaint,
  getAdminDistrictOnSaId,
  getAdminEnergyCompanyassignZone,
  getAllEneryComnies,
  getAllOrderVia,
  getOfficersListOnRo,
  getRoOnZoneId,
  getSalesOnRoId,
  updateComplaintType,
  getOtherEneryCompanies,
  getAllZonesForDropdown,
} from '../../services/authApi';
import {getOutletByDistrictId} from '../../services/adminApi';
import NeumorphicButton from '../../component/NeumorphicButton';
import {
  addComplaintTypeSchema,
  addComplaintTypeForOtherSchema,
} from '../../utils/FormSchema';
import {getComlaintDetailById} from '../../redux/slices/complaint/getComplaintDetailSlice';
import {useDispatch} from 'react-redux';
import {getCompanyDetailById} from '../../redux/slices/company/companyDetailSlice';
import Toast from 'react-native-toast-message';
import {getSalesCompanyList} from '../../redux/slices/company/getCompanyListSlice';
import {getAllSalesCompanyList} from '../../redux/slices/commonApi';

const AddUpdateComplaintScreen = ({navigation, route}) => {
  const id = route?.params?.complaint_id;
  const label = ScreensLabel();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [allEnergy, setAllEnergy] = useState([]);
  const [allSales, setAllSales] = useState([]);
  const [allZones, setAllZones] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allOrderBy, setAllOrderBy] = useState([]);
  const [allSa, setAllSa] = useState([]);
  const [allDistrict, setAllDistrict] = useState([]);
  const [allOutlet, setOutlet] = useState([]);
  const [complaintType, setComplaintType] = useState([]);
  const [single, setSingle] = useState({});
  const [allOrderVia, setAllOrderVia] = useState([]);
  const [complaintFor, setComplaintFor] = useState('1');
  const [companyData, setCompanyData] = useState('');

  const fetchCompanyData = async val => {
    try {
      const res = await dispatch(
        getAllSalesCompanyList((isDropdown = true)),
      ).unwrap();

      if (res.status) {
        const data = res?.data?.filter(company => company?.company_id == val);
        setCompanyData(data[0]);
      } else {
        setCompanyData({});
        // toast.error(res.message);
      }
    } catch (error) {}
  };

  const fetchSingleData = async () => {
    const res = await dispatch(getComlaintDetailById(id)).unwrap();

    if (res.status) {
      setSingle(res?.data);
      setComplaintFor(res?.data?.complaint_for);
      if (res?.data?.complaint_for === '2') {
        fetchotherCompanyData();
        fetchActiveZoneData();
        handleZoneChange(res.data.zones[0].zone_id);
        handleRoChange(res.data.regionalOffices[0].id);
        handleSaChange(res.data.saleAreas[0].id);
        handleDistrictChange(res.data.districts[0].id);
      } else {
        handleEneryChange(res.data.energy_company_id);
        handleZoneChange(res.data.zones[0].zone_id);
        handleRoChange(res.data.regionalOffices[0].id);
        handleSaChange(res.data.saleAreas[0].id);
        handleDistrictChange(res.data.districts[0].id);
      }
    } else {
      setSingle({});
    }
  };

  // get Energy Company Data
  const fetchEnergyData = async () => {
    const res = await getAllEneryComnies();
    if (res.status) {
      const rData = res.data.map(itm => {
        return {
          value: itm.energy_company_id,
          label: itm.name,
        };
      });
      setAllEnergy(rData);
    } else {
      setAllEnergy([]);
    }
  };

  const fetchSalesCompany = async () => {
    const res = await dispatch(
      getAllSalesCompanyList((isDropdown = true)),
    ).unwrap();
    if (res.status) {
      const rData = res.data.map(itm => {
        return {
          value: itm.company_id,
          label: itm.company_name,
        };
      });
      setAllSales(rData);
    } else {
      setAllSales([]);
    }
  };

  // get all active zone for other Company Data
  const fetchActiveZoneData = async () => {
    const res = await getAllZonesForDropdown();
    if (res.status) {
      const rData = res.data.map(itm => {
        return {
          value: itm.zone_id,
          label: itm.zone_name,
        };
      });
      setAllZones(rData);
    } else {
      setAllZones([]);
    }
  };
  // get other Company Data
  const fetchotherCompanyData = async () => {
    const res = await getOtherEneryCompanies();
    if (res.status) {
      const rData = res.data.map(itm => {
        return {
          value: itm.company_id,
          label: itm.company_name,
        };
      });
      setAllEnergy(rData);
    } else {
      setAllEnergy([]);
    }
  };

  //   fetch Order Via Data
  const fetchOrderViaData = async () => {
    const res = await getAllOrderVia();
    if (res.status) {
      const rData = res.data.map(itm => {
        return {
          value: itm.id,
          label: itm.order_via,
        };
      });
      setAllOrderVia(rData);
    } else {
      setAllOrderVia([]);
    }
  };

  //   fetch Complain Type Data
  const fetchComplainTypeData = async () => {
    const res = await getAdminAllTypesComplaint();
    if (res.status) {
      const rData = res.data.map(itm => {
        return {
          value: itm.id,
          label: itm.complaint_type_name,
        };
      });
      setComplaintType(rData);
    } else {
      setComplaintType([]);
    }
  };

  // get Zone name data on Change
  const handleEneryChange = async (value, setvalue) => {
    if (setvalue) {
      // setvalue('energy_company_id', value);
      setvalue('zone_id', '');
      setvalue('ro_id', '');
      setvalue('order_by_id', '');
      setvalue('sale_area_id', '');
      setvalue('district_id', '');
      setvalue('outlet_id', '');
    }
    // setAllZones([])
    setAllRo([]);
    setAllOrderBy([]);
    setAllSa([]);
    setAllDistrict([]);
    setOutlet([]);
    if (!value) return setAllZones([]);
    const res = await getAdminEnergyCompanyassignZone(value);
    if (res.status) {
      const rData = res.data.map(itm => {
        return {
          value: itm.zone_id,
          label: itm.zone_name,
        };
      });

      setAllZones(rData);
    } else {
      setAllZones([]);
      setvalue('energy_company_id', '');

      Toast.show({
        type: 'info',
        text1: res.message,
        position: 'bottom',
        swipeable: 'true',
      });
    }
  };

  // get Regional Office name data
  const handleZoneChange = async (value, setvalue) => {
    if (setvalue) {
      // setvalue('zone_id', value);
      setvalue('ro_id', '');
      setvalue('order_by_id', '');
      setvalue('sale_area_id', '');
      setvalue('district_id', '');
      setvalue('outlet_id', '');
    }
    if (!value) return;
    setAllRo([]);
    setAllOrderBy([]);
    setAllSa([]);
    setAllDistrict([]);
    setOutlet([]);
    const res = await getRoOnZoneId(value);

    if (res.status) {
      const rData = res.data.map(itm => {
        return {
          value: itm.ro_id,
          label: itm.regional_office_name,
        };
      });

      setAllRo(rData);
    } else {
      setAllRo([]);
      setvalue('zone_id', '');

      Toast.show({
        type: 'info',
        text1: res.message,

        position: 'bottom',
        swipeable: 'true',
      });
    }
  };

  //   get Sales area name data
  const handleRoChange = async (value, setvalue) => {
    if (setvalue) {
      // setvalue('ro_id', value);
      setvalue('order_by_id', '');
      setvalue('sale_area_id', '');
      setvalue('district_id', '');
      setvalue('outlet_id', '');
    }
    if (!value) return;
    setAllSa([]);
    setAllOrderBy([]);

    setAllDistrict([]);
    setOutlet([]);

    const res = await getSalesOnRoId(value);
    const res2 = await getOfficersListOnRo(value);

    if (res.status) {
      const rData = res?.data?.map(itm => {
        return {
          value: itm.id,
          label: itm.sales_area_name,
        };
      });

      setAllSa(rData);
      if (res2.status) {
        const rData2 = res2?.data?.map(itm => {
          return {
            value: itm.id,
            label: itm.name,
          };
        });
        setAllOrderBy(rData2);
      } else {
        Toast.show({
          type: 'info',
          text1: res2.message,

          position: 'bottom',
          swipeable: 'true',
        });
        setAllOrderBy([]);
      }
    } else {
      setAllSa([]);
      setvalue('ro_id', '');
      setvalue('order_by_id', '');

      Toast.show({
        type: 'info',
        text1: res.message,

        position: 'bottom',
        swipeable: 'true',
      });
    }
  };

  //   get District Name Data
  const handleSaChange = async (value, setvalue) => {
    if (setvalue) {
      // setvalue('sale_area_id', value);
      setvalue('district_id', '');
      setvalue('outlet_id', '');
    }
    if (!value) return;
    setAllDistrict([]);
    setOutlet([]);
    const res = await getAdminDistrictOnSaId(value);
    const res2 = await getOutletByDistrictId(0, value);

    if (res.status) {
      const rData = res.data.map(itm => {
        return {
          value: itm.district_id,
          label: itm.district_name,
        };
      });

      setAllDistrict(rData);
    } else {
      setAllDistrict([]);
      setvalue('sale_area_id', '');

      Toast.show({
        type: 'info',
        text1: res.message,

        position: 'bottom',
        swipeable: 'true',
      });
    }

    if (res2.status) {
      const rData = res2.data.map(itm => {
        return {
          value: itm.id,
          label: itm.outlet_name,
        };
      });
      setOutlet(rData);
    } else {
      setOutlet([]);
      setvalue('district_id', '');

      Toast.show({
        type: 'info',
        text1: res2.message,

        position: 'bottom',
        swipeable: 'true',
      });
    }
  };

  //   get Outlet Name Data
  const handleDistrictChange = async (value, setvalue) => {
    if (setvalue) {
      // setvalue('district_id', value);
      setvalue('outlet_id', '');
    }
    if (!value) return setOutlet([]);
    const res = await getOutletByDistrictId(value, 0);

    if (res.status) {
      const rData = res.data.map(itm => {
        return {
          value: itm.id,
          label: itm.outlet_name,
        };
      });
      setOutlet(rData);
    } else {
      setOutlet([]);
      setvalue('district_id', '');
      Toast.show({
        type: 'info',
        text1: res.message,
        // text2: res2.message,
        position: 'bottom',
        swipeable: 'true',
      });
    }
  };

  const handleSubmit = async (values, resetForm) => {
    setLoading(true);
    const sData = {
      energy_company_id: values.energy_company_id.value,
      zone_id: Array.of(values.zone_id.value),
      ro_id: Array.of(values.ro_id.value),
      order_by_id: values.order_by_id.value,
      order_by: values.order_by,
      order_via_id: values.order_via_id.value,
      sale_area_id: Array.of(values.sale_area_id.value),
      district_id: Array.of(values.district_id.value),
      outlet_id: Array.of(values.outlet_id.value),
      complaint_type: JSON.stringify(values.complaint_type.value),
      work_permit: values.work_permit,
      complaint_for: values.complaint_for,
      description: values.description,
    };

    if (single.id) {
      sData['id'] = single.id;
    }

    const res = single.id
      ? await updateComplaintType(sData)
      : await addComplaintType(sData);
    if (res.status) {
      Toast.show({
        type: 'success',
        text1: res.message,
        position: 'bottom',
        swipeable: 'true',
      });
      setLoading(false);
      resetForm();

      navigation.navigate('RequestComplaintScreen');
    } else {
      Toast.show({
        type: 'error',
        text1: res.message,

        position: 'bottom',
        swipeable: 'true',
      });
    }

    setLoading(false);
  };

  const COMPANY_TYPE = [
    {label: 'ENERGY COMPANY', value: '1'},
    {label: 'OTHER COMPANY', value: '2'},
  ];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      energy_company_id: single?.energy_company_id
        ? {
            label: single?.energy_company_name,
            value: single?.energy_company_id,
          }
        : '',
      zone_id: single?.zones
        ? {
            label: single?.zones[0]?.zone_name,
            value: single?.zones[0]?.zone_id,
          }
        : '',
      ro_id: single?.regionalOffices
        ? {
            label: single?.regionalOffices[0]?.regional_office_name,
            value: single?.regionalOffices[0]?.id,
          }
        : '',
      order_by_id: single?.order_by_id
        ? {
            label: single?.order_by_details,
            value: single?.order_by_id,
          }
        : '',
      order_by: single?.order_by_details || '',
      order_via_id: single?.order_via_id
        ? {
            label: single?.getOrderViaDetails,
            value: single?.order_via_id,
          }
        : '',
      sale_area_id: single?.saleAreas
        ? {
            label: single?.saleAreas[0]?.sales_area_name,
            value: single?.saleAreas[0]?.id,
          }
        : '',
      district_id: single?.districts
        ? {
            label: single?.districts[0]?.district_name,
            value: single?.districts[0]?.district_id,
          }
        : '',
      outlet_id: single?.outlets
        ? {
            label: single?.outlets[0]?.outlet_name,
            value: single?.outlets[0]?.id,
          }
        : '',
      complaint_type: single?.complaint_type
        ? {
            label: single?.complaint_type,
            value: single?.complaint_type_id,
          }
        : '',
      description: single?.description || '',
      work_permit: single?.work_permit || '',
      complaint_for: single?.complaint_for || '1',
    },
    // validationSchema:
    //   complaintFor == '1'
    //     ? addComplaintTypeSchema
    //     : addComplaintTypeForOtherSchema,

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  useEffect(() => {
    fetchSalesCompany();
    fetchEnergyData();
    fetchOrderViaData();
    fetchComplainTypeData();
    if (id) {
      fetchSingleData();
    }
  }, [id]);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors().screenBackground}}>
      <CustomeHeader
        headerTitle={id ? label.UPDATE_COMPLAINT : label.ADD_COMPLAINT}
      />
      <Text
        style={[
          styles.input,
          {marginLeft: 10, marginTop: 5, color: Colors().pureBlack},
        ]}>
        Complaint for :--
      </Text>
      <View
        style={{
          flexDirection: 'row',
        }}>
        {COMPANY_TYPE.map((radioButton, index) => (
          <>
            <CheckBox
              key={index}
              textStyle={{
                fontFamily: Colors().fontFamilyBookMan,
                color: Colors().pureBlack,
                fontWeight: '500',
              }}
              containerStyle={{
                backgroundColor: Colors().screenBackground,
                padding: 0,
              }}
              checkedIcon="dot-circle-o"
              uncheckedIcon="circle-o"
              title={radioButton.label}
              disabled={id ? true : false}
              checked={formik?.values?.complaint_for === radioButton.value}
              // checked={formik?.values?.complaint_for == radioButton.value}
              // onPress={() => handleRadioButtonPress(radioButton.value)}
              onPress={() => {
                formik.resetForm();
                if (radioButton.value == 2) {
                  fetchotherCompanyData();
                  fetchActiveZoneData();
                  setAllRo([]);
                  setAllOrderBy([]);
                  setAllSa([]);
                  setAllDistrict([]);
                  setOutlet([]);
                } else {
                  fetchEnergyData();
                  setAllZones([]);
                  setAllRo([]);
                  setAllOrderBy([]);
                  setAllSa([]);
                  setAllDistrict([]);
                  setOutlet([]);
                  setCompanyData('');
                }

                setComplaintFor(radioButton.value);
                formik.setFieldValue('complaint_for', radioButton.value);
              }}
              checkedColor={Colors().aprroved}
            />
          </>
        ))}
      </View>
      <ScrollView>
        <View style={styles.inpuntContainer}>
          <NeumorphicDropDownList
            title={'Company name'}
            required={true}
            data={formik?.values?.complaint_for == 1 ? allEnergy : allSales}
            value={formik?.values?.energy_company_id}
            onChange={val => {
              if (formik?.values?.complaint_for == '1') {
                formik.setFieldValue('energy_company_id', val);
                handleEneryChange(val.value, formik.setFieldValue);
              }
              if (formik?.values?.complaint_for == '2') {
                fetchCompanyData(val.value);
              }

              formik.setFieldValue('energy_company_id', val);
            }}
            errorMessage={formik?.errors?.energy_company_id}
          />

          {companyData && (
            <>
              <NeumorphicTextInput
                title={'COMPANY CONTACT PERSON NAME'}
                multiline={true}
                numberOfLines={3}
                value={companyData?.company_contact_person}
                editable={false}
              />

              <NeumorphicTextInput
                title={'COMPANY EMAIL'}
                numberOfLines={2}
                value={companyData?.company_email}
                editable={false}
                onChangeText={formik.handleChange('work_permit')}
              />

              <NeumorphicTextInput
                title={'company contact'}
                multiline={true}
                numberOfLines={3}
                value={companyData?.company_contact}
                editable={false}
                onChangeText={formik.handleChange('work_permit')}
              />
            </>
          )}

          {formik?.values?.complaint_for === '1' && (
            <NeumorphicDropDownList
              title={'Zone name'}
              required={true}
              data={allZones}
              value={formik?.values?.zone_id}
              onChange={val => {
                handleZoneChange(val.value, formik.setFieldValue);
                // formik.setFieldValue('gst_treatment_type', val.label);
                formik.setFieldValue('zone_id', val);
              }}
              errorMessage={formik?.errors?.zone_id}
            />
          )}
          {formik?.values?.complaint_for === '1' && (
            <NeumorphicDropDownList
              title={'Regional office'}
              required={true}
              data={allRo}
              value={formik?.values?.ro_id}
              onChange={val => {
                handleRoChange(val.value, formik.setFieldValue);
                formik.setFieldValue('ro_id', val);
              }}
              errorMessage={formik?.errors?.ro_id}
            />
          )}

          {formik?.values?.complaint_for === '1' ? (
            <NeumorphicDropDownList
              title={'Order by'}
              required={true}
              data={allOrderBy}
              value={formik?.values?.order_by_id}
              onChange={val => {
                formik.setFieldValue('order_by_id', val);
              }}
              errorMessage={formik?.errors?.order_by_id}
            />
          ) : (
            <NeumorphicTextInput
              title={'Order by'}
              required={true}
              onChangeText={formik.handleChange('order_by_id')}
              errorMessage={formik?.errors?.order_by_id}
            />
          )}

          <NeumorphicDropDownList
            title={'order via'}
            required={true}
            data={allOrderVia}
            value={formik?.values?.order_via_id}
            onChange={val => {
              formik.setFieldValue('order_via_id', val);
            }}
            errorMessage={formik?.errors?.order_via_id}
          />

          {formik?.values?.complaint_for === '1' && (
            <NeumorphicDropDownList
              title={'sales area'}
              required={true}
              data={allSa}
              value={formik?.values?.sale_area_id}
              onChange={val => {
                handleSaChange(val.value, formik.setFieldValue);
                formik.setFieldValue('sale_area_id', val);
              }}
              errorMessage={formik?.errors?.sale_area_id}
            />
          )}
          {formik?.values?.complaint_for === '1' && (
            <NeumorphicDropDownList
              title={'District name'}
              data={allDistrict}
              value={formik?.values?.district_id}
              onChange={val => {
                handleDistrictChange(val.value, formik.setFieldValue);
                formik.setFieldValue('district_id', val);
              }}
            />
          )}

          {formik?.values?.complaint_for === '1' && (
            <NeumorphicDropDownList
              height={WINDOW_HEIGHT * 0.05}
              width={WINDOW_WIDTH * 0.9}
              title={'outlet name'}
              required={true}
              data={allOutlet}
              value={formik?.values?.outlet_id}
              onChange={val => formik.setFieldValue('outlet_id', val)}
              errorMessage={formik?.errors?.outlet_id}
            />
          )}

          <NeumorphicDropDownList
            title={'complaint type'}
            required={true}
            data={complaintType}
            value={formik?.values?.complaint_type}
            onChange={val => {
              formik.setFieldValue('complaint_type', val);
            }}
            errorMessage={formik?.errors?.complaint_type}
          />

          <NeumorphicTextInput
            title={'work permit'}
            multiline={true}
            numberOfLines={2}
            value={formik?.values?.work_permit}
            onChangeText={formik.handleChange('work_permit')}
          />

          <NeumorphicTextInput
            height={WINDOW_HEIGHT * 0.09}
            width={WINDOW_WIDTH * 0.9}
            title={'description'}
            required={true}
            multiline={true}
            numberOfLines={3}
            value={formik?.values?.description}
            onChangeText={formik.handleChange('description')}
            errorMessage={formik?.errors?.description}
          />
        </View>
        <View
          style={{
            alignSelf: 'center',
            marginTop: WINDOW_HEIGHT * 0.03,
            marginBottom: WINDOW_HEIGHT * 0.03,
          }}>
          <NeumorphicButton
            title={id ? label.UPDATE : label.ADD}
            titleColor={Colors().purple}
            btnHeight={WINDOW_HEIGHT * 0.05}
            onPress={formik.handleSubmit}
            btnRadius={2}
            loading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpdateComplaintScreen;

const styles = StyleSheet.create({
  inpuntContainer: {
    rowGap: 10,
    margin: WINDOW_WIDTH * 0.05,
  },
  input: {
    fontSize: 18,
    fontWeight: '400',
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
  },
});
