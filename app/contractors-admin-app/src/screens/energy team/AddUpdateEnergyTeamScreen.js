import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
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
import EnergyTeamForm from './EnergyTeamForm';
import { addEnergyTeamSchema } from '../../utils/FormSchema';
import {
  createEnergyTeam,
  updateEnergyTeam,
} from '../../redux/slices/energy team/addUpdateEnergyTeamSlice';
import { getEnergyTeamDetailById } from '../../redux/slices/energy team/getEnergyTeamDetailSlice';

const AddUpdateEnergyTeamScreen = ({ navigation, route }) => {
  /* declare props constant variale*/
  const edit_id = route?.params?.edit_id;
  const userId = route?.params?.user_id;
  const type = route?.params?.type;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([]);

  useEffect(() => {
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: 'true',

    initialValues: {
      energy_company_id: edit?.energy_company_id || '',
      username: edit?.username || '',
      contact_no: edit?.mobile || '',
      alt_number: edit?.alt_number || '',
      status: edit?.status || 1,
      country: edit?.country || '',
      city: edit?.city || '',
      pin_code: edit?.pin_code || '',
      joining_date: edit?.joining_date || '',
      area_name: edit?.area_name_id || '',
      area_selected: edit?.area_selected_id || '',
      address: edit?.address || '',
      description: edit?.description || '',
      email: edit?.email || '',
      password: edit?.password || '',
    },
    validationSchema: addEnergyTeamSchema,
    onSubmit: (values, { resetForm }) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    const sData = {
      energy_company_id: values?.energy_company_id,
      username: values?.username,
      contact_no: values?.contact_no,
      alt_number: values?.alt_number,
      status: values?.status,
      country: values?.country,
      city: values?.city,
      pin_code: values?.pin_code,
      joining_date: moment(values?.joining_date).format('YYYY-MM-DD'),
      area_name: values?.area_name,
      area_selected: values?.area_selected,
      address: values?.address,
      description: values?.description,
      email: values?.email,
      password: values?.password,
    };

    if (edit_id) {
      sData['id'] = userId;
    }

    try {
      setLoading(true);

      const res = edit_id
        ? await dispatch(updateEnergyTeam(sData)).unwrap()
        : await dispatch(createEnergyTeam(sData)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);
        setUpdateModalVisible(false);

        resetForm();
        navigation.navigate('EnergyTeamListScreen');
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
  /*fucntion for fetching detail energy company team*/
  const fetchSingleDetails = async () => {
    const fetchResult = await dispatch(
      getEnergyTeamDetailById({ id: edit_id, userId: userId }),
    ).unwrap();

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
            ? `${label.ENERGY_TEAM} ${label.UPDATE}`
            : `${label.ENERGY_TEAM} ${label.ADD}`
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <EnergyTeamForm
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

export default AddUpdateEnergyTeamScreen;

const styles = StyleSheet.create({});
