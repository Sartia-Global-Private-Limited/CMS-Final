/*    ----------------Created Date :: 12- March -2024   ----------------- */
import { StyleSheet, View, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import Colors from '../../constants/Colors';
import CustomeHeader from '../../component/CustomeHeader';
import IconType from '../../constants/IconType';
import NeumorphicButton from '../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import AlertModal from '../../component/AlertModal';
import ScreensLabel from '../../constants/ScreensLabel';
import moment from 'moment';
import AssestForm from './AssestForm';
import { addAssestsSchema } from '../../utils/FormSchema';
import {
  addAssest,
  updateAssest,
} from '../../redux/slices/assest mangement/addUpdateAssestSlice';
import { getAssestDetailById } from '../../redux/slices/assest mangement/getAssestDetailSlice';

const AddUpdateAssestScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([]);
  const [buttonPressed, setButtonPressed] = useState('');

  useEffect(() => {
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  /*function will return status code to send */
  const getStatus = () => {
    switch (buttonPressed) {
      case 'add':
        return '3';

      case 'update':
        return '3';
      case 'finalsubmit':
        return '4';
      case 'readytopi':
        return '5';

      default:
        break;
    }
  };

  const modifiedItemsData = data => {
    const rData = data.map(item => {
      const totalqty = parseFloat(item?.total_qty);
      const amount = item?.rate * totalqty;
      return {
        ...item,
        amount: amount,
      };
    });

    return rData;
  };

  const formik = useFormik({
    enableReinitialize: 'true',

    initialValues: {
      asset_name: edit?.asset_name || '',
      asset_model_number: edit?.asset_model_number || '',
      asset_uin_number: edit?.asset_uin_number || '',
      asset_price: edit?.asset_price?.toString() || '',
      asset_purchase_date: edit?.asset_purchase_date || '',
      asset_warranty_guarantee_start_date:
        edit?.asset_warranty_guarantee_start_date || '',
      asset_warranty_guarantee_end_date:
        edit?.asset_warranty_guarantee_end_date || '',
      asset_warranty_guarantee_value: edit?.asset_warranty_guarantee_value || 1,
      asset_supplier_id: edit?.asset_supplier_id || '',
      asset_status: edit?.asset_status || 1,
      asset_image: edit?.asset_image || '',
    },
    validationSchema: addAssestsSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const formData = new FormData();

    formData.append('asset_name', values?.asset_name);
    formData.append('asset_model_number', values?.asset_model_number);
    formData.append('asset_uin_number', values?.asset_uin_number);
    formData.append('asset_price', values?.asset_price);
    formData.append(
      'asset_purchase_date',
      moment(values?.asset_purchase_date).format('YYYY-MM-DD'),
    );
    formData.append(
      'asset_warranty_guarantee_start_date',
      moment(values?.asset_warranty_guarantee_start_date).format('YYYY-MM-DD'),
    );
    formData.append(
      'asset_warranty_guarantee_end_date',
      moment(values?.asset_warranty_guarantee_end_date).format('YYYY-MM-DD'),
    );
    formData.append(
      'asset_warranty_guarantee_value',
      values?.asset_warranty_guarantee_value,
    );
    formData.append('asset_supplier_id', values?.asset_supplier_id);
    formData.append('asset_status', values?.asset_status);
    formData.append('asset_image', values?.asset_image);

    if (edit_id) {
      formData.append('id', edit_id);
    }
    try {
      setLoading(true);

      const res = edit_id
        ? await dispatch(updateAssest(formData)).unwrap()
        : await dispatch(addAssest(formData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
        resetForm();
        navigation.navigate('AssetsListScreen', { type: 'requested' });
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
  /*fucntion for fetching detail of measurement*/
  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(getAssestDetailById(edit_id)).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult?.data);
    } else {
      setEdit([]);
    }
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
            ? `${label.ASSEST} ${label.UPDATE}`
            : `${label.ASSEST} ${label.ADD}`
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <AssestForm
            formik={formik}
            type={type}
            edit_id={edit_id}
            edit={edit}
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

          <View
            style={{
              justifyContent: 'center',
              marginVertical: 20,
              gap: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            <NeumorphicButton
              title={edit_id ? `${label.UPDATE}` : `${label.ADD}`}
              titleColor={Colors().purple}
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

export default AddUpdateAssestScreen;

const styles = StyleSheet.create({
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
