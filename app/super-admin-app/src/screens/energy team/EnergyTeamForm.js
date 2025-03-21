import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeCard from '../../component/CustomeCard';
import {useDispatch} from 'react-redux';
import {getAllActiveCompanyList} from '../../redux/slices/commonApi';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../utils/ScreenLayout';
import moment from 'moment';
import CardDropDown from '../../component/CardDropDown';
import CardTextInput from '../../component/CardTextInput';
import CardDatepicker from '../../component/CardDatepicker';
import {getEnergyAreaDataById} from '../../redux/slices/energy team/addUpdateEnergyTeamSlice';

const EnergyTeamForm = ({formik, type, edit_id, edit}) => {
  const dispatch = useDispatch();

  const warrantyGurantyType = [
    {label: 'active', value: 1},
    {label: 'inactive', value: 0},
  ];

  const allAreaType = [
    {
      label: 'Zone',
      value: 1,
    },
    {
      label: 'Regional',
      value: 2,
    },
    {
      label: 'Sales Area',
      value: 3,
    },
    {
      label: 'District',
      value: 4,
    },
    {
      label: 'Outlets',
      value: 5,
    },
  ];
  const [allCompany, setAllCompany] = useState([]);
  const [allAreaName, setAllAreaName] = useState([]);

  useEffect(() => {
    fetchAllEnergyCompany();
    if (edit_id) {
      fetchAllAreaName(formik?.values?.area_name);
    }
  }, [formik?.values?.area_name]);

  /*fucnction for fetching all company*/
  const fetchAllEnergyCompany = async () => {
    const result = await dispatch(getAllActiveCompanyList()).unwrap();

    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.name,
          value: itm?.energy_company_id,
        };
      });
      setAllCompany(rData);
    } else {
      setAllCompany([]);
    }
  };
  /* fucnction for fetching all area name */
  const fetchAllAreaName = async type => {
    const result = await dispatch(
      getEnergyAreaDataById({
        companyId: formik?.values?.energy_company_id,
        type: type,
      }),
    ).unwrap();

    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.area_name,
          value: itm?.id,
        };
      });
      setAllAreaName(rData);
    } else {
      setAllAreaName([]);
    }
  };

  const getSelectedAreaTitle = type => {
    const category = allAreaType.find(item => item.value === type);
    return category ? category.label : '';
  };

  return (
    <View>
      {/* card for complaint detail */}
      <CustomeCard
        headerName={'Basic detail'}
        avatarImage={
          edit_id && typeof formik?.values?.asset_image == 'string'
            ? formik?.values?.asset_image
            : formik?.values?.asset_image?.uri
        }
        data={[
          {
            key: 'energy company',
            component: (
              <CardDropDown
                required={true}
                data={allCompany}
                value={formik?.values?.energy_company_id}
                onChange={val =>
                  formik.setFieldValue(`energy_company_id`, val?.value)
                }
              />
            ),
          },
          {
            key: 'username',
            component: (
              <CardTextInput
                required={true}
                value={formik?.values?.username}
                onChange={text => formik.setFieldValue(`username`, text)}
              />
            ),
          },
          {
            key: 'mobile no .',
            component: (
              <CardTextInput
                required={true}
                value={formik?.values?.contact_no}
                onChange={text => formik.setFieldValue(`contact_no`, text)}
                keyboardType="numeric"
                maxLength={10}
              />
            ),
          },
          {
            key: 'alt. mobile no.',
            component: (
              <CardTextInput
                keyboardType="numeric"
                maxLength={10}
                value={formik?.values?.alt_number}
                onChange={text => formik.setFieldValue(`alt_number`, text)}
              />
            ),
          },
          {
            key: 'status',
            component: (
              <CardDropDown
                data={warrantyGurantyType}
                value={formik?.values?.status}
                onChange={val => formik.setFieldValue(`status`, val?.value)}
              />
            ),
          },
          {
            key: 'country',
            component: (
              <CardTextInput
                value={formik?.values?.country}
                onChange={text => formik.setFieldValue(`country`, text)}
              />
            ),
          },
          {
            key: 'city',
            component: (
              <CardTextInput
                value={formik?.values?.city}
                onChange={text => formik.setFieldValue(`city`, text)}
              />
            ),
          },
          {
            key: 'pincode',
            component: (
              <CardTextInput
                value={formik?.values?.pin_code}
                onChange={text => formik.setFieldValue(`pin_code`, text)}
                keyboardType="numeric"
                maxLength={6}
              />
            ),
          },
          {
            key: 'joining date',
            component: (
              <CardDatepicker
                width={
                  formik?.values?.joining_date
                    ? WINDOW_WIDTH * 0.6
                    : WINDOW_WIDTH * 0.58
                }
                height={WINDOW_HEIGHT * 0.04}
                valueOfDate={
                  formik?.values?.joining_date
                    ? moment(formik?.values?.joining_date).format('DD-MM-YYYY')
                    : ''
                }
                mode="date"
                required={true}
                onChange={date => formik.setFieldValue(`joining_date`, date)}
              />
            ),
          },
          ...(formik?.values?.energy_company_id
            ? [
                {
                  key: 'area name',
                  component: (
                    <CardDropDown
                      required={true}
                      data={allAreaType}
                      value={formik?.values?.area_name}
                      onChange={val => {
                        formik.setFieldValue(`area_name`, val?.value);
                        fetchAllAreaName(val?.value);
                      }}
                    />
                  ),
                },
              ]
            : []),

          ...(formik?.values?.area_name
            ? [
                {
                  key: getSelectedAreaTitle(formik?.values.area_name),
                  component: (
                    <CardDropDown
                      required={true}
                      data={allAreaName}
                      value={formik?.values?.area_selected}
                      onChange={val => {
                        formik.setFieldValue(`area_selected`, val?.value);
                      }}
                    />
                  ),
                },
              ]
            : []),
          {
            key: 'address',
            component: (
              <CardTextInput
                value={formik?.values?.address}
                onChange={text => formik.setFieldValue(`address`, text)}
              />
            ),
          },
          {
            key: 'description',
            component: (
              <CardTextInput
                value={formik?.values?.description}
                onChange={text => formik.setFieldValue(`description`, text)}
              />
            ),
          },
        ]}
      />

      {/* card for complaint detail */}
      <CustomeCard
        headerName={'login detail'}
        data={[
          {
            key: 'email',
            component: (
              <CardTextInput
                required={true}
                value={formik?.values?.email}
                onChange={text => formik.setFieldValue(`email`, text)}
              />
            ),
          },
          {
            key: 'password',
            component: (
              <CardTextInput
                required={true}
                secureTextEntry
                value={formik?.values?.password}
                onChange={text => formik.setFieldValue(`password`, text)}
              />
            ),
          },
        ]}
      />
    </View>
  );
};

export default EnergyTeamForm;

const styles = StyleSheet.create({});
