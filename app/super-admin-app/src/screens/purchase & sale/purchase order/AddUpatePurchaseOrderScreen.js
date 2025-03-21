/*    ----------------Created Date :: 11- March -2024   ----------------- */
import {StyleSheet, Text, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import {WINDOW_HEIGHT, WINDOW_WIDTH} from '../../../utils/ScreenLayout';
import NeumorphicButton from '../../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import {CheckBox} from '@rneui/themed';
import {selectUser} from '../../../redux/slices/authSlice';
import RNFS from 'react-native-fs';
import ScreensLabel from '../../../constants/ScreensLabel';
import POItem from './POItem';
import CreatePoForm from './CreatePoForm';
import moment from 'moment';
import {
  addPurchaseOrder,
  updatePurchaseOrder,
} from '../../../redux/slices/purchase & sale/purchase-order/addUpdatePurchaseOrderSlice';
import {Menu, MenuItem} from 'react-native-material-menu';
import Fileupploader from '../../../component/Fileupploader';
import RBSheet from 'react-native-raw-bottom-sheet';
import Papa from 'papaparse';
import {getPurchaseOrderDetailById} from '../../../redux/slices/purchase & sale/purchase-order/getPurchaseOrderDetailSlice';

const AddUpatePurchaseOrderScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();
  const refRBSheet = useRef(RBSheet);

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState({});
  const [csvUpload, setCsvUpload] = useState(null);
  const [crUpload, setCrUpload] = useState(null);
  const [sdUpload, setSdUpload] = useState(null);

  const menuData = ['Upload cr copy', 'Upload sd letter', 'Upload Csv file'];

  /*fucntion for menu button action*/
  const hideMenu = val => {
    const valueToSend = val?.split(' ').join('');

    setVisible(false);

    switch (valueToSend) {
      case 'Uploadcrcopy':
        setCrUpload(true);
        setCsvUpload(false);
        setSdUpload(false);
        refRBSheet.current.open();
        break;
      case 'Uploadsdletter':
        setCrUpload(false);
        setCsvUpload(false);
        setSdUpload(true);
        refRBSheet.current.open();
        break;
      case 'UploadCsvfile':
        setCrUpload(false);
        setSdUpload(false);
        setCsvUpload(true);
        refRBSheet.current.open();
        break;

      default:
        break;
    }
  };

  /* function  which covert number to string */
  const converToString = value => {
    if (typeof value == 'number') {
      return String(value);
    } else {
      return value;
    }
  };

  const COMPANY_TYPE = [
    {label: 'WITH QUANTITY', value: '1'},
    {label: 'WITHOUT QUANTITY', value: '2'},
  ];

  useEffect(() => {
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      po_date: edit?.po_date ? moment(edit?.po_date).format('YYYY-MM-DD') : '',

      ro_office: edit?.ro_office_id || '',
      state: edit?.state || '',
      po_tax: edit?.po_tax || '',
      from_company: edit?.fromCompanyDetails?.unique_id || '',
      to_company: edit?.toCompanyDetails?.company_id || '',
      cr_copy_title: edit?.cr_copy_title || '',
      sd_letter_title: edit?.sd_letter_title || '',

      po_amount: edit?.po_amount || '',
      po_number: edit?.po_number || '',
      limit: converToString(edit?.limit) || '',
      security_deposit_date: edit?.security_deposit_date || '',
      security_deposit_amount:
        converToString(edit?.security_deposit_amount) || '',
      tender_date: edit?.tender_date || '',
      tender_number: edit?.tender_number || '',
      dd_bg_number: edit?.dd_bg_number || '',
      cr_date: edit?.cr_date || '',
      cr_number: edit?.cr_number || '',
      cr_code: edit?.cr_code || '',
      cr_copy: edit?.cr_copy || null,
      sd_letter: edit?.sd_letter || null,
      work: edit.work || '',
      bank: parseInt(edit?.bank) || '',
      gst_id: edit?.gst_id || '',
      gst_percent: edit?.gst_percent || '',
      total_gst: edit?.total_gst || '',
      po_items: edit?.purchase_order_item?.data || [
        {
          order_line_number: '',
          hsn_code: '',
          description: '',
          name: '',
          unit: '',
          change_gst_type: '2',
          gst_id: '',
          gst_percent: '',
          rate: '',
          qty: '',
          total_gst_amount: 0,
          amount: 0,
        },
      ],
      po_for: edit?.po_for || '1',
    },
    // validationSchema: addPoSchema,

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const formData = new FormData();
    formData.append('po_for', values?.po_for.toString());
    formData.append('from_company', values?.from_company);
    formData.append('to_company', values?.to_company);
    formData.append('ro_office', values?.ro_office);
    formData.append('state', values?.state);

    formData.append('po_date', moment(values.po_date).format('YYYY-MM-DD'));
    formData.append('po_number', values.po_number);
    formData.append(
      'limit',
      values.po_for == '1'
        ? getTotal(values.po_items, 'amount')
        : parseFloat(values?.limit).toFixed(2),
    );

    formData.append(
      'security_deposit_date',
      moment(values?.security_deposit_date).format('YYYY-MM-DD'),
    );
    formData.append('security_deposit_amount', values?.security_deposit_amount);
    formData.append('bank', values?.bank);

    formData.append(
      'tender_date',
      moment(values?.tender_date).format('YYYY-MM-DD'),
    );
    formData.append('tender_number', values?.tender_number);
    formData.append('dd_bg_number', values?.dd_bg_number);

    formData.append('cr_date', moment(values?.cr_date).format('YYYY-MM-DD'));
    formData.append('cr_number', values?.cr_number);
    formData.append('cr_code', values?.cr_code);

    formData.append('work', values?.work);
    if (values?.gst_percent) {
      formData.append('gst_id', values?.gst_id?.toString());
      formData.append('gst_percent', values?.gst_percent);
    }

    formData.append('cr_copy', values?.cr_copy);
    formData.append('cr_copy_title', values?.cr_copy_title);
    formData.append('sd_letter', values?.sd_letter);
    formData.append('sd_letter_title', values?.sd_letter_title);

    formData.append(
      'amount',
      values.po_for == '1'
        ? getTotal(values?.po_items, 'amount')
        : values?.po_amount,
    );

    formData.append('po_items', JSON.stringify(values?.po_items));

    if (edit.id) {
      formData.append('id', edit_id);
    }

    // return console.log('formData', formData);

    try {
      setLoading(true);

      const res = edit_id
        ? await dispatch(updatePurchaseOrder(formData)).unwrap()
        : await dispatch(addPurchaseOrder(formData)).unwrap();

      console.log('res', res);

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
        resetForm();
        navigation.navigate('PurchaseOrderTopTab');
      } else {
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
      setLoading(false);

      setUpdateModalVisible(false);
    }
  };

  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(
      getPurchaseOrderDetailById({
        poId: edit_id,
      }),
    ).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult.data);
    } else {
      setEdit([]);
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

  /*fucntion fot converting csv data to json*/
  const csvConversion = async fileUri => {
    const fileContent = await RNFS.readFile(fileUri, 'utf8');
    Papa.parse(fileContent, {
      header: true,
      complete: result => {
        const data = result.data.map((item, index) => {
          if (item.Name)
            return {
              order_line_number: item?.OrderLineNumber,
              hsn_code: item?.HsnCode,
              name: item?.Name,
              unit: item?.Unit,
              rate: item?.Rate,
              change_gst_type: '2',
              qty: formik?.values.po_for == '1' ? item?.Qty : 0,
              description: item?.Description,
              amount: formik?.values.po_for == '1' ? item?.Amount : 0,
            };
        });

        formik.setFieldValue(
          'po_items',
          data.filter(item => item),
        );
      },
    });
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={
          edit_id
            ? ` ${label.PURCHASE} ${label.ORDER} ${label.UPDATE}`
            : `${label.PURCHASE} ${label.ORDER} ${label.ADD}`
        }
        lefIconName={'chevron-back'}
        lefIconType={IconType.Ionicons}
        rightIconName={'dots-three-vertical'}
        rightIcontype={IconType.Entypo}
        rightIconPress={() => setVisible(!visible)}
      />
      <View style={{}}>
        <View style={{alignSelf: 'flex-end'}}>
          <Menu
            visible={visible}
            onRequestClose={() => setVisible(false)}
            style={{}}>
            {menuData.map(itm => (
              <MenuItem
                style={{
                  backgroundColor: Colors().cardBackground,
                }}
                textStyle={
                  [styles.cardtext, {color: Colors().pureBlack}] // Otherwise, use the default text style
                }
                onPress={() => {
                  hideMenu(itm);
                }}>
                {itm}
              </MenuItem>
            ))}
          </Menu>
        </View>
      </View>
      <Text
        style={[
          styles.title,
          {marginLeft: 10, marginTop: 5, color: Colors().pureBlack},
        ]}>
        purchase order :--
      </Text>
      <View
        style={{
          flexDirection: 'row',
          // backgroundColor: Colors().darkShadow,

          flexWrap: 'wrap',
          justifyContent: 'space-between',
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
              disabled={edit_id ? true : false}
              checked={formik?.values?.po_for === radioButton.value}
              onPress={() => {
                formik.resetForm();
                formik.setFieldValue('po_for', radioButton.value);
              }}
              checkedColor={Colors().aprroved}
            />
          </>
        ))}
      </View>

      {formik?.values?.po_for == '1' && (
        <Text
          style={[
            styles.title,
            {
              marginLeft: 10,
              color: Colors().pending,
              height: 30,
            },
          ]}>
          PO AMOUNT ₹ {getTotal(formik?.values.po_items, 'amount')}
        </Text>
      )}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <CreatePoForm
            formik={formik}
            type={type}
            edit_id={edit_id}
            edit={edit}
          />
          {/* component for item list */}
          <POItem formik={formik} type={type} edit_id={edit_id} edit={edit} />

          {/* File uploader component */}
          <Fileupploader
            btnRef={refRBSheet}
            {...(!csvUpload
              ? {
                  cameraOption: {
                    base64: false,
                    multiselet: false,
                  },
                }
              : {})}
            cameraResponse={item => {
              if (!item) return; // Check if item has a value
              const imageFormData = {
                uri: item?.uri,
                name: item?.name,
                type: item?.type,
              };
              {
                crUpload && formik.setFieldValue(`cr_copy`, imageFormData);
              }
              {
                sdUpload && formik.setFieldValue(`sd_letter`, imageFormData);
              }
              refRBSheet.current.close();
            }}
            {...(!csvUpload
              ? {galleryOption: {base64: false, multiselet: false}}
              : {})}
            galleryResponse={item => {
              if (!item) return; // Check if item has a value
              const imageFormData = {
                uri: item?.uri,
                name: item?.name,
                type: item?.type,
              };
              {
                crUpload && formik.setFieldValue(`cr_copy`, imageFormData);
              }
              {
                sdUpload && formik.setFieldValue(`sd_letter`, imageFormData);
              }
              refRBSheet.current.close();
            }}
            documentOption={{
              base64: false,
              multiselet: false,
              fileType: csvUpload ? ['csv'] : ['pdf', 'doc', 'docx'],
            }}
            documentResponse={item => {
              if (!item) return; // Check if item has a value
              const imageFormData = {
                uri: item?.uri,
                name: item?.name,
                type: item?.type,
              };

              {
                crUpload && formik.setFieldValue(`cr_copy`, imageFormData);
              }
              {
                sdUpload && formik.setFieldValue(`sd_letter`, imageFormData);
              }

              {
                csvUpload && csvConversion(item?.uri);
              }
              refRBSheet.current.close();
            }}
          />

          {/* modal view for delete*/}
          {updateModalVisible && (
            <AlertModal
              visible={updateModalVisible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
              ConfirmBtnPress={() => formik.handleSubmit()}
            />
          )}

          <View style={{alignSelf: 'center', marginVertical: 20}}>
            <NeumorphicButton
              title={edit_id ? `${label.UPDATE}` : `${label.ADD}`}
              titleColor={Colors().purple}
              disabled={type == 'approve' ? !approveBtnStatus : false}
              onPress={() => {
                edit_id ? setUpdateModalVisible(true) : formik.handleSubmit();
              }}
              loading={loading}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddUpatePurchaseOrderScreen;

const styles = StyleSheet.create({
  Image: {
    height: WINDOW_HEIGHT * 0.07,
    width: WINDOW_WIDTH * 0.2,
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: Colors().gray,
  },
  title: {
    fontSize: 15,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
  cardtext: {
    fontSize: 12,
    fontWeight: '300',
    lineHeight: 21,
    textTransform: 'uppercase',
    fontFamily: Colors().fontFamilyBookMan,
    flexShrink: 1,
  },
});
