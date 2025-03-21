import {SafeAreaView, StyleSheet, View, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import Colors from '../../../constants/Colors';
import {useFormik} from 'formik';
import NeumorphicButton from '../../../component/NeumorphicButton';
import {useDispatch} from 'react-redux';
import AlertModal from '../../../component/AlertModal';
import Toast from 'react-native-toast-message';
import ScreensLabel from '../../../constants/ScreensLabel';
import OutletForm from './OutletForm';
import {useNavigation} from '@react-navigation/native';
import {
  createOutlets,
  getOutletsDetailById,
  updateOutletsById,
} from '../../../redux/slices/energyCompany/outlets/getAllOutletListSlice';

const AddUpdateOutletScreen = ({route}) => {
  const navigation = useNavigation();
  const edit_id = route?.params?.edit_id;
  const [edit, setEdit] = useState({});
  const [loading, setLoading] = useState(false);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);

  const dispatch = useDispatch();
  const label = ScreensLabel();

  useEffect(() => {
    if (edit_id) {
      fetchSingleData(edit_id);
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      energy_company_id: edit?.energy_company_id || '',
      zone_id: +edit?.zone_id || '',
      regional_id: +edit?.regional_office_id || '',
      sales_area_id: +edit?.sales_area_id || '',
      district_id: +edit?.district_id || '',
      outlet_name: edit?.outlet_name || '',
      outlet_unique_id: edit?.outlet_unique_id || '',

      outlet_contact_number: edit?.outlet_contact_number || '',
      outlet_contact_person_name: edit?.outlet_contact_person_name || '',
      primary_number: edit?.primary_number || '',
      secondary_number: edit?.secondary_number || '',
      primary_email: edit?.primary_email || '',
      secondary_email: edit?.secondary_email || '',

      customer_code: edit?.customer_code || '',
      outlet_category: edit?.outlet_category || '',
      outlet_ccnoms: edit?.outlet_ccnoms || '',
      outlet_ccnohsd: edit?.outlet_ccnohsd || '',
      outlet_resv: edit?.outlet_resv || '',

      location: edit?.location || '',
      address: edit?.address || '',
      outlet_longitude: edit?.outlet_longitude || '',
      outlet_lattitude: edit?.outlet_lattitude || '',

      image: edit?.outlet_image || '',
      email: edit?.email || '',
      password: edit?.password || '',
      status: edit?.status || 1,
    },
    // validationSchema: addOutletsSchema(edit_id),

    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const formData = new FormData();
    formData.append(`energy_company_id`, values?.energy_company_id);
    formData.append(`zone_id`, +values?.zone_id);
    formData.append(`regional_id`, +values?.regional_id);
    formData.append(`sales_area_id`, +values?.sales_area_id);
    formData.append(`district_id`, +values?.district_id);
    formData.append(`outlet_name`, values?.outlet_name);
    formData.append(`outlet_unique_id`, values?.outlet_unique_id);

    formData.append(
      `outlet_contact_person_name`,
      values?.outlet_contact_person_name,
    );
    formData.append(`outlet_contact_number`, values?.outlet_contact_number);
    formData.append(`primary_number`, values?.primary_number);
    formData.append(`secondary_number`, values?.secondary_number);
    formData.append(`primary_email`, values?.primary_email);
    formData.append(`secondary_email`, values?.secondary_email);

    formData.append(`location`, values?.location);
    formData.append(`address`, values?.address);
    formData.append(`outlet_longitude`, values?.outlet_lattitude);
    formData.append(`outlet_lattitude`, values?.outlet_lattitude);

    formData.append(`customer_code`, values?.customer_code);
    formData.append(`outlet_category`, values?.outlet_category);
    formData.append(`outlet_ccnoms`, values?.outlet_ccnoms);
    formData.append(`outlet_ccnohsd`, values?.outlet_ccnohsd);
    formData.append(`outlet_resv`, values?.outlet_resv);
    formData.append(`image`, values?.image);

    formData.append(`email`, values?.email);
    formData.append(`password`, values?.password);
    formData.append(`status`, +values?.status);

    if (edit_id) {
      formData.append('id', edit_id);
    }

    // return console.log('formData', formData);
    try {
      setLoading(true);
      const res = edit_id
        ? await dispatch(updateOutletsById(formData)).unwrap()
        : await dispatch(createOutlets(formData)).unwrap();

      if (res.status) {
        setLoading(false);
        navigation.goBack();
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        resetForm();
      } else {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: res?.message,
          position: 'bottom',
        });
      }
    } catch (error) {
      console.log('error', error);
      setLoading(false);
    }
  };

  /*function for fetching single detail of employees*/
  const fetchSingleData = async () => {
    try {
      const result = await dispatch(getOutletsDetailById(edit_id)).unwrap();

      if (result.status) {
        setEdit(result?.data);
      } else {
        Toast.show({
          type: 'error',
          text1: result?.message,
          position: 'bottom',
        });
        setEdit([]);
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: error,
        position: 'bottom',
      });
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
            ? `${label.OUTLET} ${label.UPDATE}`
            : `${label.OUTLET} ${label.ADD}`
        }
      />
      <ScrollView>
        <View style={{}}>
          <OutletForm formik={formik} edit_id={edit_id} edit={edit} />
          {/*view for modal of upate */}
          {updateModalVisible && (
            <AlertModal
              visible={updateModalVisible}
              iconName={'clock-edit-outline'}
              icontype={IconType.MaterialCommunityIcons}
              iconColor={Colors().aprroved}
              textToShow={'ARE YOU SURE YOU WANT TO UPDATE THIS!!'}
              cancelBtnPress={() => setUpdateModalVisible(!updateModalVisible)}
              ConfirmBtnPress={() => {
                formik.handleSubmit(), setUpdateModalVisible(false);
              }}
            />
          )}
          <View style={{alignSelf: 'center', marginVertical: 10}}>
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

export default AddUpdateOutletScreen;

const styles = StyleSheet.create({});
