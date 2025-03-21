/*    ----------------Created Date :: 20- July -2024   ----------------- */
import {StyleSheet, View, SafeAreaView, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import Colors from '../../../constants/Colors';
import CustomeHeader from '../../../component/CustomeHeader';
import IconType from '../../../constants/IconType';
import NeumorphicButton from '../../../component/NeumorphicButton';
import Toast from 'react-native-toast-message';
import AlertModal from '../../../component/AlertModal';
import ScreensLabel from '../../../constants/ScreensLabel';
import {addPromotionalManagerSchema} from '../../../utils/FormSchema';
import CustomeCard from '../../../component/CustomeCard';
import converToString from '../../../utils/NumberToString';
import CardDropDown from '../../../component/CardDropDown';
import {getAllMangerListForPromotional} from '../../../redux/slices/commonApi';
import CardTextInput from '../../../component/CardTextInput';
import {
  addAreaManagerRatioOverview,
  updateAreaManagerRatioOverview,
} from '../../../redux/slices/settings/area manager ratio overview/addUpdateAreaManagerRatioOverviewSlice';
import {getAreaManagerRatioOverviewDetailById} from '../../../redux/slices/settings/area manager ratio overview/getAreaManagerRatioOverviewDetailSlice';

const AddUpdateAreaManagerOverviewScreen = ({navigation, route}) => {
  /* declare props constant variale*/
  const {id} = route?.params?.reqBody || {};

  const edit_id = route?.params?.edit_id;
  const type = route?.params?.type;
  const label = ScreensLabel();

  /*declare hooks variable here */
  const dispatch = useDispatch();

  /*declare useState variable here */
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [edit, setEdit] = useState([]);
  const [allManager, setAllManager] = useState([]);

  useEffect(() => {
    fetchAllManager();
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: 'true',

    initialValues: {
      manager_id: edit?.manager_id || '',
      manager_ratio: edit?.manager_ratio || '',
      company_ratio: edit?.company_ratio || '',
    },
    validationSchema: addPromotionalManagerSchema,
    onSubmit: (values, {resetForm}) => {
      handleSubmit(values, resetForm);
    },
  });

  const handleSubmit = async (values, resetForm) => {
    if (edit_id) {
      values['id'] = edit_id;
    }

    try {
      setLoading(true);

      const res = edit_id
        ? await dispatch(updateAreaManagerRatioOverview(values)).unwrap()
        : await dispatch(addAreaManagerRatioOverview(values)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
        resetForm();

        navigation.navigate('AreaManagerOverviewListScreen');
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
    const fetchResult = await dispatch(
      getAreaManagerRatioOverviewDetailById(edit_id),
    ).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult?.data);
    } else {
      setEdit([]);
    }
  };
  /*fucnction for fetching all regional office*/
  const fetchAllManager = async () => {
    const result = await dispatch(getAllMangerListForPromotional()).unwrap();
    if (result?.status) {
      const rData = result?.data?.map(itm => {
        return {
          label: itm?.name,
          value: itm?.id,
          image: itm?.image,
        };
      });
      setAllManager(rData);
    } else {
      setAllManager([]);
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
            ? `${label.AREA_MANAGER_RATIO_OVERVIEW} ${label.UPDATE}`
            : `${label.AREA_MANAGER_RATIO_OVERVIEW} ${label.ADD}`
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <CustomeCard
            headerName={'Promotional ratio'}
            data={[
              {
                key: 'Area manager',
                component: (
                  <CardDropDown
                    data={allManager}
                    required={true}
                    value={formik?.values?.manager_id}
                    onChange={val =>
                      formik.setFieldValue(`manager_id`, val?.value)
                    }
                  />
                ),
              },
              {
                key: 'Manager ratio',
                component: (
                  <CardTextInput
                    value={converToString(formik?.values?.manager_ratio)}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`manager_ratio`, val);
                      formik.setFieldValue(`company_ratio`, 100 - val);
                    }}
                    keyboardType="numeric"
                  />
                ),
              },
              {
                key: 'Company Ratio',
                component: (
                  <CardTextInput
                    value={converToString(formik?.values?.company_ratio)}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`company_ratio`, val);
                    }}
                    keyboardType="numeric"
                    editable={false}
                  />
                ),
              },
            ]}
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

export default AddUpdateAreaManagerOverviewScreen;

const styles = StyleSheet.create({});
