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
import {addPromotionOverviewSchema} from '../../../utils/FormSchema';
import CustomeCard from '../../../component/CustomeCard';
import converToString from '../../../utils/NumberToString';
import CardDropDown from '../../../component/CardDropDown';
import {getAllRegionalOffice} from '../../../redux/slices/commonApi';
import CardTextInput from '../../../component/CardTextInput';
import {
  addPromotionOverview,
  updatePromotionOverview,
} from '../../../redux/slices/settings/promotion overview/addUpdatePromotionOverViewSlice';
import {getPromotionOverViewDetailById} from '../../../redux/slices/settings/promotion overview/getPromotionOverviewDetailSlice';

const AddUpdatePromotionOverviewScreen = ({navigation, route}) => {
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
  const [allRo, setAllRo] = useState([]);

  useEffect(() => {
    fetchAllRo();
    if (edit_id) {
      fetchSingleDetails();
    }
  }, [edit_id]);

  const formik = useFormik({
    enableReinitialize: 'true',

    initialValues: {
      ro_id: edit?.ro_id || '',
      gst: edit?.gst || '',
      tds: edit?.tds || '',
      tds_with_gst: edit?.tds_with_gst || '',
      retention_money: edit?.retention_money || '',
      promotion_expense: edit?.promotion_expense || '',
      man_power: 0,
      site_expense: 0,
      site_stock: 0,
    },
    validationSchema: addPromotionOverviewSchema,
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
        ? await dispatch(updatePromotionOverview(values)).unwrap()
        : await dispatch(addPromotionOverview(values)).unwrap();

      if (res?.status) {
        Toast.show({
          type: 'success',
          text1: res?.message,
          position: 'bottom',
        });
        setLoading(false);

        setUpdateModalVisible(false);
        resetForm();

        navigation.navigate('PromotionOverviewListScreen');
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
      getPromotionOverViewDetailById(edit_id),
    ).unwrap();

    if (fetchResult?.status) {
      setEdit(fetchResult?.data);
    } else {
      setEdit([]);
    }
  };
  /*fucnction for fetching all regional office*/
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: Colors().screenBackground,
      }}>
      <CustomeHeader
        headerTitle={
          edit_id
            ? `${label.PROMOTION_OVERVIEW} ${label.UPDATE}`
            : `${label.PROMOTION_OVERVIEW} ${label.ADD}`
        }
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{}}>
          {/* form ui section wise  */}
          <CustomeCard
            headerName={'Promotion detail'}
            data={[
              {
                key: 'regional office',
                component: (
                  <CardDropDown
                    data={allRo}
                    required={true}
                    value={formik?.values?.ro_id}
                    onChange={val => formik.setFieldValue(`ro_id`, val?.value)}
                  />
                ),
              },
              {
                key: 'gst % ',
                component: (
                  <CardTextInput
                    value={converToString(formik?.values?.gst)}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`gst`, val);
                    }}
                    keyboardType="numeric"
                  />
                ),
              },
              {
                key: 'tds % ',
                component: (
                  <CardTextInput
                    value={converToString(formik?.values?.tds)}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`tds`, val);
                    }}
                    keyboardType="numeric"
                  />
                ),
              },
              {
                key: 'tds with gst % ',
                component: (
                  <CardTextInput
                    value={converToString(formik?.values?.tds_with_gst)}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`tds_with_gst`, val);
                    }}
                    keyboardType="numeric"
                  />
                ),
              },
              {
                key: 'retention % ',
                component: (
                  <CardTextInput
                    value={converToString(formik?.values?.retention_money)}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`retention_money`, val);
                    }}
                    keyboardType="numeric"
                  />
                ),
              },
              {
                key: 'Promotion exp. % ',
                component: (
                  <CardTextInput
                    value={converToString(formik?.values?.promotion_expense)}
                    required={true}
                    onChange={val => {
                      formik.setFieldValue(`promotion_expense`, val);
                    }}
                    keyboardType="numeric"
                  />
                ),
              },
              {
                key: 'site expense',
                value: `₹ ${formik?.values.site_expense}`,
                keyColor: Colors().aprroved,
              },
              {
                key: 'site stock',
                value: formik?.values?.site_stock,
                keyColor: Colors().red,
              },
              {
                key: 'man power',
                value: formik?.values?.man_power,
                keyColor: Colors().rejected,
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

export default AddUpdatePromotionOverviewScreen;

const styles = StyleSheet.create({});
