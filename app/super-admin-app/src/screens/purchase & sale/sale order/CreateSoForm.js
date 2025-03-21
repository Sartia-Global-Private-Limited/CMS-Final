/*    ----------------Created Date :: 5- August -2024   ----------------- */
import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeCard from '../../../component/CustomeCard';
import Colors from '../../../constants/Colors';

import {useDispatch} from 'react-redux';

import {
  getAllBank,
  getAllGstType,
  getAllMyCompanyList,
  getAllRegionalOffice,
  getAllSalesCompanyList,
  getAllStateList,
} from '../../../redux/slices/commonApi';
import {Icon} from '@rneui/themed';
import IconType from '../../../constants/IconType';

import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import moment from 'moment';
import {TextInput} from 'react-native';
import GetFileExtension from '../../../utils/FileExtensionFinder';
import {apiBaseUrl} from '../../../../config';
import CardDropDown from '../../../component/CardDropDown';
import CardDatepicker from '../../../component/CardDatepicker';
import CardTextInput from '../../../component/CardTextInput';
import {
  useGetFromCompanyQuery,
  useGetToCompanyQuery,
} from '../../../services/generalApi';

const CreateSoForm = ({formik, type, edit_id, edit}) => {
  const dispatch = useDispatch();
  const {data: fromCompanies} = useGetFromCompanyQuery();
  const {data: toCompanies} = useGetToCompanyQuery({isDropdown: true});

  const [allMyCompany, setAllMyCompany] = useState([]);
  const [allSalesCompany, setAllSalesCompany] = useState([]);
  const [allState, setAllState] = useState([]);
  const [allRo, setAllRo] = useState([]);
  const [allBank, setAllBank] = useState([]);
  const [allGst, setAllGst] = useState([]);

  useEffect(() => {
    fetchAllMyCompany();
    fetchAllSalesCompany();
    fetchAllState();
    fetchAllRo();
    fetchAllBank();
    fetchAllGst();
  }, []);

  /*fucnction for fetching my company*/
  const fetchAllMyCompany = async () => {
    const result = await dispatch(getAllMyCompanyList()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.company_name,
          value: itm?.company_id,
        };
      });
      setAllMyCompany(rData);
    } else {
      setAllMyCompany([]);
    }
  };

  /*fucnction for fetching sales company*/
  const fetchAllSalesCompany = async () => {
    const result = await dispatch(getAllSalesCompanyList()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.company_name,
          value: itm?.company_id,
        };
      });
      setAllSalesCompany(rData);
    } else {
      setAllSalesCompany([]);
    }
  };
  /*fucnction for fetching state */
  const fetchAllState = async () => {
    const result = await dispatch(getAllStateList()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.name,
          value: itm?.id,
        };
      });
      setAllState(rData);
    } else {
      setAllState([]);
    }
  };
  /*fucnction for fetching all ro  */
  const fetchAllRo = async () => {
    const result = await dispatch(getAllRegionalOffice()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.regional_office_name,
          value: itm?.id,
        };
      });
      setAllRo(rData);
    } else {
      setAllRo([]);
    }
  };

  /*fucnction for fetching all bank  */
  const fetchAllBank = async () => {
    const result = await dispatch(getAllBank()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.bank_name,
          value: itm?.id,
          image: itm?.logo,
        };
      });
      setAllBank(rData);
    } else {
      setAllBank([]);
    }
  };

  /*fucnction for fetching all gst  */
  const fetchAllGst = async () => {
    const result = await dispatch(getAllGstType()).unwrap();
    if (result?.status) {
      const rData = result?.data.map(itm => ({
        label: itm?.title,
        value: itm?.id,
        percentage: itm?.percentage,
      }));
      setAllGst(rData);
    } else {
      setAllGst([]);
    }
  };

  /*function  for getting total of approve qty and amount of approved item*/
  const getTotal = (data, key) => {
    let total = 0;
    data.forEach(element => {
      total += parseFloat(element[key]) || 0;
    });

    return total;
  };

  /*fucntion  for showing pdf */
  const showPdf = file => {
    if (typeof file == 'string') {
      if (['pdf'].includes(GetFileExtension(file))) {
        return true;
      } else {
        return false;
      }
    } else if (typeof file == 'object') {
      if (file?.type == 'application/pdf') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  /*fucntion  for showing image */
  const showImage = file => {
    if (typeof file == 'string') {
      if (['jpg', 'jpeg', 'png'].includes(GetFileExtension(file))) {
        return true;
      } else {
        return false;
      }
    } else if (typeof file == 'object') {
      if (file?.type == 'image/jpeg' || file?.type == 'image/png') {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  /*fucntion  for showing docx */
  const showDocs = file => {
    if (typeof file == 'string') {
      if (['doc', 'docx'].includes(GetFileExtension(file))) {
        return true;
      } else {
        return false;
      }
    } else if (typeof file == 'object') {
      if (
        file?.type == 'application/msword' ||
        file?.type ==
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };

  const crAndSdUi = (type, formik) => (
    <View style={{flexDirection: 'row'}}>
      <View style={{marginRight: 10}}>
        <Text
          style={[
            styles.title,
            {color: Colors().pureBlack, alignSelf: 'center'},
          ]}>
          {type == 'cr' ? 'cr copy' : 'sd letter'}
        </Text>

        <View style={styles.crossIcon}>
          <Icon
            name="close"
            color={Colors().lightShadow}
            type={IconType.AntDesign}
            size={15}
            onPress={() => {
              if (type == 'cr') {
                formik.setFieldValue(`cr_copy`, ''),
                  formik.setFieldValue(`cr_copy_title`, '');
              }
              if (type == 'sd') {
                formik.setFieldValue(`sd_letter`, ''),
                  formik.setFieldValue(`sd_letter_title`, '');
              }
            }}
          />
        </View>

        {showDocs(
          type == 'cr' ? formik.values?.cr_copy : formik?.values?.sd_letter,
        ) && (
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              // setImageModalVisible(true);
              // setImageUri(
              //   edit_id &&
              //     (type == 'cr'
              //       ? typeof formik.values?.cr_copy == 'string'
              //       : typeof formik.values?.sd_letter == 'string')
              //     ? `${apiBaseUrl}${
              //         type == 'cr'
              //           ? formik.values?.cr_copy
              //           : formik.values?.sd_letter
              //       }`
              //     : `${
              //         type == 'cr'
              //           ? formik.values?.cr_copy?.uri
              //           : formik.values?.sd_letter?.uri
              //       }`,
              // );
            }}>
            <View
              style={[styles.Image, {marginTop: 10, justifyContent: 'center'}]}>
              <Icon
                name="document-text-outline"
                type={IconType.Ionicons}
                size={50}
                color={Colors().skyBule}
              />
            </View>
          </TouchableOpacity>
        )}

        {showPdf(
          type == 'cr' ? formik.values?.cr_copy : formik.values?.sd_letter,
        ) && (
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              // setImageModalVisible(true);
              // setImageUri(
              //   edit_id &&
              //     (type == 'cr'
              //       ? typeof formik.values?.cr_copy == 'string'
              //       : typeof formik.values?.sd_letter == 'string')
              //     ? `${apiBaseUrl}${
              //         type == 'cr'
              //           ? formik.values?.cr_copy
              //           : formik.values?.sd_letter
              //       }`
              //     : `${
              //         type == 'cr'
              //           ? formik.values?.cr_copy?.uri
              //           : formik.values?.sd_letter?.uri
              //       }`,
              // );
            }}>
            <View
              style={[styles.Image, {marginTop: 10, justifyContent: 'center'}]}>
              <Icon
                name="file-pdf-o"
                type={IconType.FontAwesome}
                size={45}
                color={Colors().red}
              />
            </View>
          </TouchableOpacity>
        )}

        {showImage(
          type == 'cr' ? formik.values?.cr_copy : formik.values?.sd_letter,
        ) && (
          <TouchableOpacity
            style={{alignSelf: 'center'}}
            onPress={() => {
              // setImageModalVisible(true);
              // setImageUri(
              //   edit_id &&
              //     (type == 'cr'
              //       ? typeof formik.values?.cr_copy == 'string'
              //       : typeof formik.values?.sd_letter == 'string')
              //     ? `${apiBaseUrl}${
              //         type == 'cr'
              //           ? formik.values?.cr_copy
              //           : formik.values?.sd_letter
              //       }`
              //     : `${
              //         type == 'cr'
              //           ? formik.values?.cr_copy?.uri
              //           : formik.values?.sd_letter?.uri
              //       }`,
              // );
            }}>
            <Image
              source={{
                uri:
                  edit_id &&
                  (type == 'cr'
                    ? typeof formik.values?.cr_copy == 'string'
                    : typeof formik.values?.sd_letter == 'string')
                    ? `${apiBaseUrl}${
                        type == 'cr'
                          ? formik.values?.cr_copy
                          : formik.values?.sd_letter
                      }`
                    : `${
                        type == 'cr'
                          ? formik.values?.cr_copy?.uri
                          : formik.values?.sd_letter?.uri
                      }`,
              }}
              style={[styles.Image, {marginTop: 10}]}
            />
          </TouchableOpacity>
        )}
        <TextInput
          placeholder="TYPE TITLE"
          numberOfLines={2}
          rows={2}
          multiline
          defaultValue={
            type == 'cr'
              ? formik.values?.cr_copy_title
              : formik?.values?.sd_letter_title
          }
          autoCapitalize="characters"
          placeholderTextColor={Colors().pureBlack}
          style={[
            styles.title,
            {
              color: Colors().pureBlack,
              alignSelf: 'center',
              maxWidth: WINDOW_WIDTH * 0.2,
              textAlign: 'center',
              width: '100%',
            },
          ]}
          onChangeText={text => {
            type == 'cr'
              ? formik.setFieldValue(`cr_copy_title`, text)
              : formik.setFieldValue(`sd_letter_title`, text);
          }}
        />
      </View>
    </View>
  );
  return (
    <View>
      {/* card for so company detail*/}
      <CustomeCard
        headerName={'so Company detail'}
        data={[
          {
            key: 'from',
            component: (
              <CardDropDown
                data={
                  toCompanies?.map(itm => ({
                    label: itm.company_name,
                    value: itm.company_id,
                  })) || []
                }
                value={formik.values?.from_company}
                onChange={val => {
                  formik.setFieldValue(`from_company`, val?.value);
                }}
                required={true}
              />
            ),
          },
          {
            key: 'to',
            component: (
              <CardDropDown
                data={
                  fromCompanies?.map(itm => ({
                    label: itm.company_name,
                    value: itm.unique_id,
                  })) || []
                }
                value={formik.values?.to_company}
                onChange={val => {
                  formik.setFieldValue(`to_company`, val?.value);
                }}
                required={true}
              />
            ),
          },
          {
            key: 'Regional office',
            component: (
              <CardDropDown
                data={allRo}
                value={formik.values?.ro_office}
                onChange={val => {
                  formik.setFieldValue(`ro_office`, val?.value);
                }}
                required={true}
              />
            ),
          },
          {
            key: 'state',
            component: (
              <CardDropDown
                data={allState}
                value={formik.values?.state}
                onChange={val => {
                  formik.setFieldValue(`state`, val?.value);
                }}
                required={true}
              />
            ),
          },
        ]}
      />
      {/* card for so detail*/}
      <CustomeCard
        headerName={'so detail'}
        data={[
          {
            key: 'so date',
            component: (
              <CardDatepicker
                width={WINDOW_WIDTH * 0.5}
                height={WINDOW_HEIGHT * 0.04}
                valueOfDate={
                  formik?.values?.so_date
                    ? moment(formik?.values?.so_date).format('DD-MM-YYYY')
                    : ''
                }
                mode="date"
                required={true}
                onChange={date => formik.setFieldValue(`so_date`, date)}
              />
            ),
          },
          {
            key: 'so No',
            component: (
              <CardTextInput
                required={true}
                value={formik?.values?.so_number}
                onChange={val => {
                  formik.setFieldValue(`so_number`, val);
                }}
              />
            ),
          },
          {
            key: 'limit',
            component: (
              <CardTextInput
                required={true}
                value={
                  formik?.values?.so_for == '1'
                    ? getTotal(formik.values?.so_items, 'amount').toString()
                    : formik?.values?.limit
                }
                onChange={val => {
                  formik.setFieldValue(`limit`, val);
                }}
                keyboardType="numeric"
                editable={formik?.values?.so_for == '1' ? false : true}
              />
            ),
          },
        ]}
      />

      {/* card for Security deposit detail*/}
      <CustomeCard
        headerName={'security deposit detail'}
        data={[
          {
            key: 'deposit date',
            component: (
              <CardDatepicker
                width={WINDOW_WIDTH * 0.5}
                height={WINDOW_HEIGHT * 0.04}
                valueOfDate={
                  formik?.values?.security_deposit_date
                    ? moment(formik?.values?.security_deposit_date).format(
                        'DD/MM/YYYY',
                      )
                    : ''
                }
                mode="date"
                required={true}
                onChange={date =>
                  formik.setFieldValue(`security_deposit_date`, date)
                }
              />
            ),
          },
          {
            key: 'deposit amount',
            component: (
              <CardTextInput
                required={true}
                value={formik?.values?.security_deposit_amount}
                onChange={val =>
                  formik?.setFieldValue(`security_deposit_amount`, val)
                }
                keyboardType="numeric"
              />
            ),
          },
          {
            key: 'bank',
            component: (
              <CardDropDown
                data={allBank}
                required={true}
                value={formik.values?.bank}
                onChange={val => {
                  formik.setFieldValue(`bank`, val?.value);
                }}
              />
            ),
          },
        ]}
      />

      {/* card for Tender detail*/}
      <CustomeCard
        headerName={'Tender detail'}
        data={[
          {
            key: 'tender date',
            component: (
              <CardDatepicker
                width={WINDOW_WIDTH * 0.5}
                height={WINDOW_HEIGHT * 0.04}
                valueOfDate={
                  formik?.values?.tender_date
                    ? moment(formik?.values?.tender_date).format('DD/MM/YYYY')
                    : ''
                }
                mode="date"
                required={true}
                onChange={date => formik.setFieldValue(`tender_date`, date)}
              />
            ),
          },

          {
            key: 'tender number',
            component: (
              <CardTextInput
                required={true}
                value={formik?.values?.tender_number}
                onChange={val => formik?.setFieldValue(`tender_number`, val)}
              />
            ),
          },
          {
            key: 'DD/BG NO',
            component: (
              <CardTextInput
                required={true}
                value={formik?.values?.dd_bg_number}
                onChange={val => formik?.setFieldValue(`dd_bg_number`, val)}
              />
            ),
          },
        ]}
      />

      {/* card for Cr detail*/}
      <CustomeCard
        headerName={'Cr detail'}
        data={[
          {
            key: 'cr date',
            component: (
              <CardDatepicker
                width={WINDOW_WIDTH * 0.5}
                height={WINDOW_HEIGHT * 0.04}
                valueOfDate={
                  formik?.values?.cr_date
                    ? moment(formik?.values?.cr_date).format('DD/MM/YYYY')
                    : ''
                }
                mode="date"
                required={true}
                onChange={date => formik.setFieldValue(`cr_date`, date)}
              />
            ),
          },
          {
            key: 'CR Numbers',
            component: (
              <CardTextInput
                required={true}
                value={formik?.values?.cr_number}
                onChange={val => formik?.setFieldValue(`cr_number`, val)}
              />
            ),
          },
          {
            key: 'cr code',
            component: (
              <CardTextInput
                required={true}
                value={formik?.values?.cr_code}
                onChange={val => formik?.setFieldValue(`cr_code`, val)}
              />
            ),
          },
        ]}
      />

      {/* card for Cr detail*/}
      <CustomeCard
        headerName={'Work detail'}
        data={[
          {
            key: 'Work',
            component: (
              <CardTextInput
                required={true}
                value={formik?.values?.work}
                onChange={val => formik?.setFieldValue(`work`, val)}
              />
            ),
          },
          {
            key: 'gst type',
            component: (
              <CardDropDown
                data={allGst}
                required={true}
                value={formik.values?.gst_id}
                onChange={val => {
                  formik.setFieldValue(`gst_id`, val.value);
                  formik.setFieldValue('gst_percent', val?.percentage);
                  if (formik.values.po_for == '2') {
                    formik.setFieldValue(
                      'po_tax',
                      (formik.values.po_amount * val?.percentage) / 100,
                    );
                  }
                }}
              />
            ),
          },

          {key: 'gst %', value: formik?.values?.gst_percent},
        ]}
      />
      {/* veiw for Cr copy and sd letter*/}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
        }}>
        <>
          {formik?.values?.cr_copy && crAndSdUi('cr', formik)}
          {formik?.values?.sd_letter && crAndSdUi('sd', formik)}
        </>
      </View>
    </View>
  );
};

export default CreateSoForm;

const styles = StyleSheet.create({
  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  crossIcon: {
    backgroundColor: Colors().red,
    borderRadius: 50,
    padding: '1%',
    position: 'absolute',
    right: -7,
    top: 20,
    zIndex: 1,
    justifyContent: 'center',
  },

  title: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
